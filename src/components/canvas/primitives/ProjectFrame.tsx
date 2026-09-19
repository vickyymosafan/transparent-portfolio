"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/lib/projects";

const bronzePlaqueMat = new THREE.MeshStandardMaterial({
  color: "#8c7254",
  roughness: 0.35,
  metalness: 0.85,
});

const displayHaloMat = new THREE.MeshStandardMaterial({
  color: "#fff8ec",
  emissive: new THREE.Color("#ffdca0"),
  emissiveIntensity: 3.4,
  toneMapped: false,
});

const frameCasingMat = new THREE.MeshStandardMaterial({
  color: "#16181b",
  roughness: 0.3,
  metalness: 0.85,
});

function createProjectTexture(project: Project): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background: Deep architectural slate
  ctx.fillStyle = "#16191f";
  ctx.fillRect(0, 0, 1024, 1024);

  // Precision perimeter border
  ctx.strokeStyle = "#28303d";
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 952, 952);

  // Gold category tag
  ctx.fillStyle = "#cca872";
  ctx.font = "600 32px sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(project.category.toUpperCase(), 80, 150);

  // Project Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px sans-serif";
  ctx.letterSpacing = "-1px";
  ctx.fillText(project.title, 80, 240);

  // Accent underline
  ctx.fillStyle = "#cca872";
  ctx.fillRect(80, 285, 120, 4);

  // Tagline
  ctx.fillStyle = "#98a2b3";
  ctx.font = "500 36px sans-serif";
  ctx.fillText(project.tagline, 80, 360);

  // Tech badges
  let techX = 80;
  let techY = 440;
  ctx.font = "500 24px sans-serif";
  for (const tech of project.technologies) {
    const textWidth = ctx.measureText(tech).width;
    const badgeW = textWidth + 36;
    if (techX + badgeW > 920) {
      techX = 80;
      techY += 56;
    }
    ctx.fillStyle = "#222732";
    ctx.fillRect(techX, techY - 30, badgeW, 44);
    ctx.strokeStyle = "#384152";
    ctx.lineWidth = 2;
    ctx.strokeRect(techX, techY - 30, badgeW, 44);
    ctx.fillStyle = "#d0d5dd";
    ctx.fillText(tech, techX + 18, techY);
    techX += badgeW + 16;
  }

  // Key Metrics
  ctx.fillStyle = "#cca872";
  ctx.font = "600 24px sans-serif";
  ctx.fillText("KEY HIGHLIGHTS", 80, 680);

  ctx.fillStyle = "#e4e7ec";
  ctx.font = "400 28px sans-serif";
  project.metrics.forEach((metric, idx) => {
    ctx.fillText(`•  ${metric}`, 80, 735 + idx * 45);
  });

  // Footer Year & Role
  ctx.fillStyle = "#667085";
  ctx.font = "500 24px sans-serif";
  ctx.fillText(`${project.year}  |  ${project.role}`, 80, 920);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

interface ProjectFrameProps {
  project: Project;
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  onSelect?: (project: Project) => void;
}

export function ProjectFrame({
  project,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.4,
  height = 2.4,
  onSelect,
}: ProjectFrameProps) {
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    return createProjectTexture(project);
  }, [project]);

  const panelMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.15,
    });
  }, [texture]);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect?.(project)}
    >
      {/* 1. Warm Architectural Halo Glow behind Slab */}
      <mesh position={[0, height / 2, -0.06]}>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.04]} />
        <primitive object={displayHaloMat} attach="material" />
      </mesh>

      {/* 2. Matte Black Metal Casing Box */}
      <mesh position={[0, height / 2, -0.02]} castShadow>
        <boxGeometry args={[width + 0.04, height + 0.04, 0.08]} />
        <primitive object={frameCasingMat} attach="material" />
      </mesh>

      {/* 3. Main Project Display Face */}
      <mesh position={[0, height / 2, 0.025]} castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <primitive object={panelMat} attach="material" />
      </mesh>

      {/* 4. Bronze Spec Plaque Underneath */}
      <mesh position={[0, -0.22, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.75, 0.22, 0.04]} />
        <primitive object={bronzePlaqueMat} attach="material" />
      </mesh>

      {/* Interactive hover indicator highlight */}
      {hovered && (
        <mesh position={[0, height / 2, 0.035]}>
          <planeGeometry args={[width + 0.02, height + 0.02]} />
          <meshBasicMaterial
            color="#cca872"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
