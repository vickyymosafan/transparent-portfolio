"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PROJECTS, type Project } from "@/lib/projects";
import {
  getTerrazzoFloorMat,
  getTravertineMat,
  getDarkWalnutMat,
  matteBlackMetalMat,
  warmCoveLedMat,
  brushedBrassMat,
} from "@/lib/architectural-materials";
import { getPlasterTexture } from "@/lib/architectural-textures";

function buildGalleryDisplayTexture(project: Project): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Matte charcoal-black display panel face
  ctx.fillStyle = "#16181c";
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle interior inset border line
  ctx.strokeStyle = "#282d36";
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 952, 952);

  // Large Editorial Title
  ctx.fillStyle = "#f5f3ef";
  ctx.font = "600 52px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const titleLines = project.title.split(" ");
  if (titleLines.length > 2) {
    ctx.fillText(titleLines.slice(0, 2).join(" "), 512, 340);
    ctx.fillText(titleLines.slice(2).join(" "), 512, 405);
  } else {
    ctx.fillText(project.title, 512, 360);
  }

  // Tech stack subtitle
  ctx.fillStyle = "#a2abb8";
  ctx.font = "400 30px sans-serif";
  const techSummary = project.technologies.slice(0, 2).join(" + ");
  ctx.fillText(`(${techSummary})`, 512, 470);

  // Category Tag underneath
  ctx.fillStyle = "#c8a572";
  ctx.font = "600 24px sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(project.category.toUpperCase(), 512, 570);

  // Brief impact tagline
  ctx.fillStyle = "#8892a0";
  ctx.font = "400 24px sans-serif";
  ctx.letterSpacing = "0.2px";
  ctx.fillText(project.tagline, 512, 640);

  // Decorative subtle gold dot
  ctx.fillStyle = "#c8a572";
  ctx.beginPath();
  ctx.arc(512, 700, 4, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

export function GalleryZone() {
  const roomW = 9.8;
  const roomH = 5.2;
  const roomD = 13.5;
  const floorY = 0.0;
  const zCenter = -33.0; // Spans from z = -26.5 to z = -39.5

  const terrazzoFloorMat = useMemo(() => getTerrazzoFloorMat(), []);
  const travertineBenchMat = useMemo(() => getTravertineMat(), []);
  const walnutFriezeMat = useMemo(() => getDarkWalnutMat(), []);
  const plasterTex = useMemo(() => getPlasterTexture(), []);

  const plasterWallMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: plasterTex,
      color: "#eae5dc",
      roughness: 0.76,
      metalness: 0.02,
    });
  }, [plasterTex]);

  const textures = useMemo(() => {
    return PROJECTS.map((p) => buildGalleryDisplayTexture(p));
  }, []);

  // Left wall: 5 display slabs presenting all 5 projects from lib/projects.ts
  const displaySlabs = useMemo(
    () => [
      { z: 4.6, project: PROJECTS[0], tex: textures[0] },
      { z: 2.3, project: PROJECTS[1], tex: textures[1] },
      { z: 0.0, project: PROJECTS[2], tex: textures[2] },
      { z: -2.3, project: PROJECTS[3], tex: textures[3] },
      { z: -4.6, project: PROJECTS[4], tex: textures[4] },
    ],
    [textures]
  );

  // Vertical walnut slats for the upper frieze
  const upperSlats = useMemo(() => {
    const list: number[] = [];
    for (let z = -roomD / 2 + 0.3; z <= roomD / 2 - 0.3; z += 0.12) {
      list.push(z);
    }
    return list;
  }, [roomD]);

  return (
    <group position={[0, floorY, zCenter]}>
      {/* ═══ 1. HIGHLY POLISHED DARK TERRAZZO FLOOR (SPECULAR REFLECTIONS) ═══ */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={terrazzoFloorMat}>
        <planeGeometry args={[roomW, roomD]} />
      </mesh>

      {/* ═══ 2. VENETIAN LIMEWASH PLASTER WALLS & CEILING ═══ */}
      <mesh position={[0, roomH, 0]} material={plasterWallMat}>
        <boxGeometry args={[roomW, 0.2, roomD]} />
      </mesh>
      {/* Left Wall (Gallery Display Wall) */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} castShadow receiveShadow material={plasterWallMat}>
        <boxGeometry args={[0.4, roomH, roomD]} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[roomW / 2, roomH / 2, 0]} castShadow receiveShadow material={plasterWallMat}>
        <boxGeometry args={[0.4, roomH, roomD]} />
      </mesh>

      {/* ═══ 3. UPPER WOOD SLAT FRIEZE (Top of Left Wall) ═══ */}
      <mesh position={[-roomW / 2 + 0.22, roomH - 0.45, 0]} material={walnutFriezeMat}>
        <boxGeometry args={[0.04, 0.85, roomD]} />
      </mesh>
      {upperSlats.map((sz, idx) => (
        <mesh key={`frieze-slat-${idx}`} position={[-roomW / 2 + 0.25, roomH - 0.45, sz]} material={walnutFriezeMat}>
          <boxGeometry args={[0.045, 0.82, 0.045]} />
        </mesh>
      ))}

      {/* ═══ 4. FIVE LARGE SQUARE DISPLAY SLABS WITH WARM HALO BACKLIGHTS ═══ */}
      {displaySlabs.map((item, idx) => {
        const mat = new THREE.MeshStandardMaterial({
          map: item.tex,
          roughness: 0.32,
          metalness: 0.15,
        });

        return (
          <group key={`disp-slab-${idx}`} position={[-roomW / 2 + 0.35, 2.3, item.z]}>
            {/* 360-degree warm halo backlight border */}
            <mesh position={[-0.04, 0, 0]} material={warmCoveLedMat}>
              <boxGeometry args={[0.02, 2.12, 2.12]} />
            </mesh>
            {/* Dedicated soft point light casting warm golden bloom against plaster wall */}
            <pointLight position={[-0.2, 0, 0]} color="#ffd49a" intensity={3.4} distance={3.8} decay={2} />

            {/* Display Board Slab Face */}
            <mesh castShadow receiveShadow material={mat} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[2.0, 2.0, 0.06]} />
            </mesh>

            {/* Long Horizontal Bronze Spec Plaque Bar Underneath */}
            <group position={[0, -1.25, 0]}>
              <mesh castShadow receiveShadow material={brushedBrassMat} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[1.8, 0.2, 0.04]} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* ═══ 5. CEILING TRACK LIGHTING WITH CYLINDER SPOTS ═══ */}
      <mesh position={[-roomW / 2 + 2.0, roomH - 0.06, 0]} material={matteBlackMetalMat}>
        <boxGeometry args={[0.06, 0.04, roomD - 1.2]} />
      </mesh>
      {[-4.5, 0, 4.5].map((rz, idx) => (
        <mesh key={`rod-${idx}`} position={[-roomW / 2 + 2.0, roomH - 0.03, rz]} material={matteBlackMetalMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        </mesh>
      ))}
      {displaySlabs.map((item, idx) => (
        <group key={`track-spot-${idx}`} position={[-roomW / 2 + 2.0, roomH - 0.12, item.z]}>
          <mesh rotation={[0, 0, 0.45]} material={matteBlackMetalMat}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
          </mesh>
          <pointLight position={[0, -0.2, 0]} color="#fff4e0" intensity={2.2} distance={6.0} decay={2} />
        </group>
      ))}

      {/* ═══ 6. MINIMALIST HONED TRAVERTINE BENCH (RIGHT SIDE) ═══ */}
      <group position={[roomW / 2 - 1.8, 0, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow material={travertineBenchMat}>
          <boxGeometry args={[1.1, 0.12, 4.2]} />
        </mesh>
        {[-1.6, 1.6].map((bz, idx) => (
          <mesh key={`bench-leg-${idx}`} position={[0, 0.2, bz]} castShadow receiveShadow material={travertineBenchMat}>
            <boxGeometry args={[0.95, 0.4, 0.18]} />
          </mesh>
        ))}
      </group>

      {/* ═══ 7. RIGHT WALL ARCHITECTURAL DISPLAY NICHE ═══ */}
      <group position={[roomW / 2 - 0.2, 2.3, 0]}>
        <mesh material={walnutFriezeMat}>
          <boxGeometry args={[0.06, 1.6, 5.0]} />
        </mesh>
        {/* Soft linear downlight in niche */}
        <mesh position={[-0.04, 0.75, 0]} material={warmCoveLedMat}>
          <boxGeometry args={[0.02, 0.02, 4.8]} />
        </mesh>
        <pointLight position={[-0.2, 0.6, 0]} color="#ffe0a3" intensity={2.0} distance={4.5} decay={2} />
      </group>

      {/* ═══ 8. NORTH PASS-THROUGH PORTAL (Toward Developer Studio) ═══ */}
      <group position={[0, 0, -roomD / 2 + 0.1]}>
        <mesh position={[-roomW / 2 + 1.2, roomH / 2, 0]} material={plasterWallMat}>
          <boxGeometry args={[2.4, roomH, 0.3]} />
        </mesh>
        <mesh position={[roomW / 2 - 1.2, roomH / 2, 0]} material={plasterWallMat}>
          <boxGeometry args={[2.4, roomH, 0.3]} />
        </mesh>
        <mesh position={[0, roomH - 0.4, 0]} material={matteBlackMetalMat}>
          <boxGeometry args={[roomW - 4.8, 0.8, 0.2]} />
        </mesh>
        {[-2.2, 2.2].map((jx, idx) => (
          <mesh key={`gal-jamb-${idx}`} position={[jx, roomH / 2, 0]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.08, roomH, 0.22]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
