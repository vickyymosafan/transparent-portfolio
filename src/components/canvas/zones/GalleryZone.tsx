"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { buildGalleryWallTexture } from "@/lib/build-tower-texture";

// ─── Shared materials ───
const floorMat = new THREE.MeshStandardMaterial({ color: "#3a3d42", roughness: 0.1, metalness: 0.4 });
const ceilingMat = new THREE.MeshStandardMaterial({ color: "#f0ece6", roughness: 0.8, metalness: 0.05 });
const frameMat = new THREE.MeshStandardMaterial({ color: "#2a2d32", metalness: 0.8, roughness: 0.2 });
const benchSeatMat = new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.3, roughness: 0.6 });
const benchLegMat = new THREE.MeshStandardMaterial({ color: "#2a2a2a", metalness: 0.7, roughness: 0.3 });
const spotHousingMat = new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.9, roughness: 0.1 });
const doorFrameMat = new THREE.MeshStandardMaterial({ color: "#2a2d32", metalness: 0.5, roughness: 0.4 });
const exitSignMat = new THREE.MeshStandardMaterial({
  color: "#ff2233", emissive: new THREE.Color("#ff2233"),
  emissiveIntensity: 4, toneMapped: false,
});

const spotGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.12, 8);

const DISPLAY_COLORS = ["#ff547b", "#51baff", "#6affb0", "#ffb65c", "#b68aff", "#49eadb"];
const displayMats = DISPLAY_COLORS.map((c) => new THREE.MeshStandardMaterial({
  color: c, emissive: new THREE.Color(c), emissiveIntensity: 1.5, toneMapped: false,
}));

/**
 * Zone 4: Exhibition Gallery
 * Camera path: z ≈ -30→-39.5, y ≈ 1.6-1.8
 */
export function GalleryZone() {
  const wallTex = useMemo(() => {
    const t = buildGalleryWallTexture();
    t.repeat.set(2, 1);
    return t;
  }, []);
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: wallTex, roughness: 0.85, metalness: 0.02, color: "#f0ece6",
  }), [wallTex]);

  const roomW = 10, roomH = 5.5, roomD = 14;
  const floorY = -0.3;
  const zCenter = -34.5;

  const displays: [number, number, number, number][] = [
    [-roomW / 2 + 0.3, 2.2, -3, Math.PI / 2],
    [-roomW / 2 + 0.3, 2.2, 1, Math.PI / 2],
    [-roomW / 2 + 0.3, 2.2, 5, Math.PI / 2],
    [roomW / 2 - 0.3, 2.2, -2, -Math.PI / 2],
    [roomW / 2 - 0.3, 2.2, 2, -Math.PI / 2],
    [roomW / 2 - 0.3, 2.2, -5, -Math.PI / 2],
  ];

  return (
    <group position={[0, floorY, zCenter]}>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={floorMat}>
        <planeGeometry args={[roomW, roomD]} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, roomH, 0]} material={ceilingMat}>
        <boxGeometry args={[roomW, 0.2, roomD]} />
      </mesh>

      {/* Walls (thick, gallery white) */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} material={wallMat}>
        <boxGeometry args={[0.5, roomH, roomD]} />
      </mesh>
      <mesh position={[roomW / 2, roomH / 2, 0]} material={wallMat}>
        <boxGeometry args={[0.5, roomH, roomD]} />
      </mesh>
      <mesh position={[0, roomH / 2, -roomD / 2]} material={wallMat}>
        <boxGeometry args={[roomW, roomH, 0.5]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`fw-${side}`} position={[side * 3.2, roomH / 2, roomD / 2]} material={wallMat}>
          <boxGeometry args={[roomW / 2 - 1.5, roomH, 0.5]} />
        </mesh>
      ))}

      {/* Display frames + spot lights */}
      {displays.map(([x, y, z, rotY], i) => (
        <group key={`d-${i}`} position={[x, y, z]} rotation={[0, rotY, 0]}>
          <mesh material={frameMat}>
            <boxGeometry args={[0.08, 1.6, 2.2]} />
          </mesh>
          <mesh position={[0.05, 0, 0]} material={displayMats[i]}>
            <boxGeometry args={[0.02, 1.3, 1.9]} />
          </mesh>
        </group>
      ))}

      {displays.map(([x, , z], i) => (
        <group key={`sp-${i}`}>
          <mesh position={[x * 0.5, roomH - 0.3, z]} geometry={spotGeo} material={spotHousingMat} />
          <pointLight position={[x * 0.5, roomH - 0.6, z]}
            color="#fff5e6" intensity={2.5} distance={6} decay={2} />
        </group>
      ))}

      {/* Gallery bench */}
      <mesh position={[0, 0.5, 0]} castShadow material={benchSeatMat}>
        <boxGeometry args={[2.5, 0.08, 0.6]} />
      </mesh>
      {[-1, 1].map((lx) =>
        [-0.22, 0.22].map((lz) => (
          <mesh key={`lg-${lx}-${lz}`} position={[lx, 0.25, lz]} material={benchLegMat}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
          </mesh>
        ))
      )}

      {/* Bright ambient lighting — this is a gallery! */}
      <pointLight position={[0, roomH - 0.5, 0]} color="#fff8f0" intensity={4} distance={12} decay={2} />
      <pointLight position={[-3, roomH - 0.5, -3]} color="#fff8f0" intensity={2.5} distance={8} decay={2} />
      <pointLight position={[3, roomH - 0.5, 3]} color="#fff8f0" intensity={2.5} distance={8} decay={2} />
      <pointLight position={[0, roomH - 0.5, -5]} color="#fff8f0" intensity={2} distance={8} decay={2} />
      <pointLight position={[0, roomH - 0.5, 5]} color="#fff8f0" intensity={2} distance={8} decay={2} />

      {/* Exit door frame */}
      <group position={[0, 0, -roomD / 2 - 0.3]}>
        {[-1, 1].map((side) => (
          <mesh key={`ef-${side}`} position={[side * 1.2, roomH * 0.4, 0]} material={doorFrameMat}>
            <boxGeometry args={[0.2, roomH * 0.8, 0.35]} />
          </mesh>
        ))}
        <mesh position={[0, roomH * 0.82, 0]} material={doorFrameMat}>
          <boxGeometry args={[2.6, 0.12, 0.35]} />
        </mesh>
        <mesh position={[0, roomH * 0.88, 0.2]} material={exitSignMat}>
          <boxGeometry args={[0.7, 0.14, 0.03]} />
        </mesh>
      </group>
    </group>
  );
}
