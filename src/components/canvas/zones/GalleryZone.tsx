"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { PROJECTS, type Project } from "@/lib/projects";
import {
  getTerrazzoFloorMat,
  getTravertineMat,
  getEuropeanOakMat,
  matteBlackMetalMat,
  architecturalGlassMat,
  warmCoveLedMat,
  brushedBrassMat,
} from "@/lib/architectural-materials";
import { getPlasterTexture } from "@/lib/architectural-textures";

useGLTF.preload("/models/gallery_master.glb");

/**
 * Editorial Canvas Texture for the 4 large-format display slabs
 * Exactly matching zone4_project_gallery_minimalist_1789366824668.jpg
 */
function buildGalleryDisplayTexture(project: Project): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Matte deep charcoal slab face
  ctx.fillStyle = "#121417";
  ctx.fillRect(0, 0, 2048, 2048);

  // 2. Subtle architectural hairline border
  ctx.strokeStyle = "#242830";
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, 1928, 1928);

  // 3. Category Header Tag (Uppercase, gold tracked)
  ctx.fillStyle = "#c8a572";
  ctx.font = "600 46px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "6px";
  ctx.fillText(project.category.toUpperCase(), 1024, 460);

  // 4. Large Editorial Title
  ctx.fillStyle = "#f8f6f0";
  ctx.font = "600 108px serif";
  ctx.letterSpacing = "2px";

  const words = project.title.split(" ");
  if (words.length > 2) {
    ctx.fillText(words.slice(0, 2).join(" "), 1024, 760);
    ctx.fillText(words.slice(2).join(" "), 1024, 900);
  } else {
    ctx.fillText(project.title, 1024, 820);
  }

  // 5. Tech Stack Subtitle in parentheses
  ctx.fillStyle = "#9ba5b5";
  ctx.font = "400 62px sans-serif";
  ctx.letterSpacing = "1px";
  const techText = `(${project.technologies.slice(0, 2).join(" + ")})`;
  ctx.fillText(techText, 1024, 1140);

  // 6. Impact Tagline
  ctx.fillStyle = "#7b8594";
  ctx.font = "400 48px sans-serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText(project.tagline, 1024, 1340);

  // 7. Key Metric highlight
  if (project.metrics && project.metrics.length > 0) {
    ctx.fillStyle = "#c8a572";
    ctx.font = "500 42px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText(project.metrics[0].toUpperCase(), 1024, 1540);
  }

  // 8. Subtle gold accent pip
  ctx.fillStyle = "#c8a572";
  ctx.beginPath();
  ctx.arc(1024, 1680, 7, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 16;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildGalleryPlaqueTexture(project: Project): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Brushed brass metallic background
  ctx.fillStyle = "#7e663a";
  ctx.fillRect(0, 0, 1536, 256);

  // Inset border
  ctx.strokeStyle = "#4d381c";
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, 1504, 224);

  // Engraved typography
  ctx.fillStyle = "#221606";
  ctx.font = "700 32px sans-serif";
  ctx.letterSpacing = "2px";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  ctx.fillText(`ROLE: ${project.role.toUpperCase()}`, 48, 75);
  ctx.font = "600 28px sans-serif";
  ctx.fillText(`STACK: ${project.technologies.slice(0, 4).join(", ").toUpperCase()}`, 48, 135);
  ctx.font = "500 26px sans-serif";
  ctx.fillText(`METRIC: ${project.metrics ? project.metrics[0].toUpperCase() : "PRODUCTION READY"}`, 48, 190);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const brushedSteelMat = new THREE.MeshStandardMaterial({
  color: "#9aa0a6",
  roughness: 0.32,
  metalness: 0.92,
});

export function GalleryZone() {
  const gltf = useGLTF("/models/gallery_master.glb");

  const plasterTex = useMemo(() => getPlasterTexture(), []);
  const plasterWallMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: plasterTex,
      color: "#eae5dd",
      roughness: 0.72,
      metalness: 0.02,
    });
  }, [plasterTex]);

  const projects = useMemo(() => PROJECTS.slice(0, 4), []);
  const displayTextures = useMemo(() => projects.map((p) => buildGalleryDisplayTexture(p)), [projects]);
  const plaqueTextures = useMemo(() => projects.map((p) => buildGalleryPlaqueTexture(p)), [projects]);

  // Display slab materials with multi-face mapping (+X face has the artwork)
  const slabMaterials = useMemo(() => {
    return displayTextures.map((tex) => {
      const artMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.28,
        metalness: 0.12,
      });
      const sideMat = new THREE.MeshStandardMaterial({
        color: "#16181c",
        roughness: 0.38,
        metalness: 0.2,
      });
      // Box materials: [+X (art), -X, +Y, -Y, +Z, -Z]
      return [artMat, sideMat, sideMat, sideMat, sideMat, sideMat];
    });
  }, [displayTextures]);

  const plaqueMaterials = useMemo(() => {
    return plaqueTextures.map((tex) => {
      const faceMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.34,
        metalness: 0.80,
      });
      const sideMat = new THREE.MeshStandardMaterial({
        color: "#6b542e",
        roughness: 0.38,
        metalness: 0.82,
      });
      return [faceMat, sideMat, sideMat, sideMat, sideMat, sideMat];
    });
  }, [plaqueTextures]);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    const toRemove: THREE.Object3D[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Light).isLight) {
        toRemove.push(child);
        return;
      }

      // We will render our own UV-mapped display slabs and plaques with high precision
      if (child.name.startsWith("Gallery_Display_Slab_") || child.name.startsWith("Gallery_Display_Plaque_") || child.name.startsWith("Gallery_Display_Halo_")) {
        toRemove.push(child);
        return;
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const originalMat = mesh.material;
        const matName = Array.isArray(originalMat)
          ? originalMat[0]?.name
          : originalMat?.name;

        switch (matName) {
          case "Mat_Dark_Terrazzo":
            mesh.material = getTerrazzoFloorMat();
            break;
          case "Mat_Ceiling_Plaster":
            mesh.material = plasterWallMat;
            break;
          case "Mat_Limestone_Ashlar":
            mesh.material = getTravertineMat();
            break;
          case "Mat_Interior_Oak":
            mesh.material = getEuropeanOakMat();
            break;
          case "Mat_Black_Metal":
            mesh.material = matteBlackMetalMat;
            break;
          case "Mat_Clear_Glass":
            mesh.material = architecturalGlassMat;
            break;
          case "Mat_LED_Amber_Gold":
            mesh.material = warmCoveLedMat;
            break;
          case "Mat_Brushed_Brass":
            mesh.material = brushedBrassMat;
            break;
          case "Mat_Brushed_Steel":
            mesh.material = brushedSteelMat;
            break;
          default:
            if (
              mesh.material &&
              (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial
            ) {
              const stdMat = mesh.material as THREE.MeshStandardMaterial;
              stdMat.envMapIntensity = 0.8;
            }
            break;
        }
      }
    });

    toRemove.forEach((l) => l.parent?.remove(l));
    return clone;
  }, [gltf, plasterWallMat]);

  // Slabs at Y positions along left wall
  const slabYPositions = useMemo(() => [32.5, 35.0, 37.5, 40.0], []);
  const [hoveredSlab, setHoveredSlab] = useState<number | null>(null);

  return (
    <group position={[-1.75, 0, 3.56]}>
      <primitive object={scene} />

      {/* ═══ 4 LARGE-FORMAT FLOATING DISPLAY MONOLITHS WITH CRISP CANVAS ARTWORK ═══ */}
      {slabYPositions.map((sy, idx) => {
        const isHovered = hoveredSlab === idx;

        return (
          <group key={`disp-group-${idx}`} position={[-1.12, 2.10, -sy]}>
            {/* 1. Continuous 360-degree Warm Halo Backlight */}
            <mesh position={[-0.04, 0, 0]} material={warmCoveLedMat}>
              <boxGeometry args={[0.02, 1.94, 1.94]} />
            </mesh>
            <pointLight
              position={[-0.10, 0, 0]}
              color="#ffcca0"
              intensity={isHovered ? 1.6 : 1.1}
              distance={3.2}
              decay={1.8}
            />

            {/* 2. Main Display Slab with perfect UV-mapped face (+X face has the artwork) */}
            <mesh
              castShadow
              receiveShadow
              material={slabMaterials[idx]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredSlab(idx);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHoveredSlab(null);
                document.body.style.cursor = "auto";
              }}
            >
              <boxGeometry args={[0.06, 1.80, 1.80]} />
            </mesh>

            {/* 3. Horizontal Brushed Bronze / Brass Metadata Plaque Beneath */}
            <mesh
              position={[0.01, -1.12, 0]}
              castShadow
              receiveShadow
              material={plaqueMaterials[idx]}
            >
              <boxGeometry args={[0.03, 0.18, 1.60]} />
            </mesh>

            {/* Dedicated Ceiling Track Spotlight aimed directly at this slab */}
            <pointLight
              position={[1.52, 1.65, 0]}
              color="#fff5e6"
              intensity={0.75}
              distance={5.0}
              decay={1.8}
            />
          </group>
        );
      })}

      {/* ═══ PROMENADE ARCHITECTURAL LIGHTING & GLASS ELEVATOR ILLUMINATION ═══ */}
      {/* 1. Soft Promenade Ambient Fill */}
      <pointLight
        position={[1.35, 3.60, -34.0]}
        color="#f6ede0"
        intensity={0.65}
        distance={7.5}
        decay={1.8}
      />
      <pointLight
        position={[1.35, 3.60, -38.5]}
        color="#f6ede0"
        intensity={0.65}
        distance={7.5}
        decay={1.8}
      />

      {/* 2. Travertine Bench Specular Warm Highlight */}
      <pointLight
        position={[1.30, 2.20, -36.8]}
        color="#ffeed8"
        intensity={0.7}
        distance={4.0}
        decay={1.8}
      />

      {/* 3. Glass Elevator Vestibule Natural Light (Dusk Sky & Cab Downlight) */}
      <pointLight
        position={[1.75, 3.20, -43.6]}
        color="#98b5d8"
        intensity={1.5}
        distance={8.5}
        decay={1.8}
      />
      <pointLight
        position={[1.75, 2.70, -43.6]}
        color="#fff0d4"
        intensity={0.8}
        distance={4.0}
        decay={1.8}
      />
    </group>
  );
}
