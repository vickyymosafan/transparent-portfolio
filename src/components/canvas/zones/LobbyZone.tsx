"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { buildTileFloorTexture } from "@/lib/build-tower-texture";

// ─── Shared materials ───
const wallMat = new THREE.MeshStandardMaterial({ color: "#1a2030", metalness: 0.3, roughness: 0.6 });
const wallInnerMat = new THREE.MeshStandardMaterial({ color: "#1e2535", metalness: 0.25, roughness: 0.65 });
const ceilingMat = new THREE.MeshStandardMaterial({ color: "#151a22", metalness: 0.5, roughness: 0.5 });
const columnMat = new THREE.MeshStandardMaterial({ color: "#2a3545", metalness: 0.85, roughness: 0.2 });
const columnCapMat = new THREE.MeshStandardMaterial({ color: "#253040", metalness: 0.8, roughness: 0.3 });
const cableMat = new THREE.MeshStandardMaterial({ color: "#253040", metalness: 0.7, roughness: 0.4 });
const pillarMat = new THREE.MeshStandardMaterial({ color: "#1a2230", metalness: 0.6, roughness: 0.4 });
const deskMat = new THREE.MeshStandardMaterial({ color: "#1a2030", metalness: 0.7, roughness: 0.3 });
const elevDoorMat = new THREE.MeshStandardMaterial({ color: "#141c28", metalness: 0.9, roughness: 0.15 });
const elevSlitMat = new THREE.MeshStandardMaterial({ color: "#0a1018", roughness: 0.9 });

const neonPinkMat = new THREE.MeshStandardMaterial({
  color: "#ff547b", emissive: new THREE.Color("#ff547b"),
  emissiveIntensity: 4, toneMapped: false,
});
const neonPinkBrightMat = new THREE.MeshStandardMaterial({
  color: "#ff547b", emissive: new THREE.Color("#ff547b"),
  emissiveIntensity: 5, toneMapped: false,
});
const neonBlueMat = new THREE.MeshStandardMaterial({
  color: "#51baff", emissive: new THREE.Color("#51baff"),
  emissiveIntensity: 4, toneMapped: false,
});
const ceilLightMat = new THREE.MeshStandardMaterial({
  color: "#ffe8c0", emissive: new THREE.Color("#ffe8c0"),
  emissiveIntensity: 3, toneMapped: false,
});
const elevIndicatorMat = new THREE.MeshStandardMaterial({
  color: "#00ff88", emissive: new THREE.Color("#00ff88"),
  emissiveIntensity: 3, toneMapped: false,
});
const holoMat = new THREE.MeshStandardMaterial({
  color: "#51baff", emissive: new THREE.Color("#51baff"),
  emissiveIntensity: 2.5, transparent: true, opacity: 0.5, toneMapped: false,
});

// ─── Shared geometries ───
const columnGeo = new THREE.CylinderGeometry(0.3, 0.3, 5.5, 6);
const neonRingGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 6);
const columnCapGeo = new THREE.CylinderGeometry(0.36, 0.3, 0.25, 6);
const neonStripGeo = new THREE.BoxGeometry(0.04, 4.5, 0.06);

/**
 * Zone 1: Cyberpunk Building Lobby
 * Camera path: z ≈ 7.5→-5, y ≈ 1.6, x ≈ -0.5→1.2
 * Room positioned so camera walks through center of lobby.
 */
export function LobbyZone() {
  const floorTex = useMemo(() => {
    const t = buildTileFloorTexture();
    t.repeat.set(4, 6);
    return t;
  }, []);

  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: floorTex, roughness: 0.08, metalness: 0.5, color: "#1a1e24",
  }), [floorTex]);

  const roomW = 10;    // Wider lobby
  const roomH = 5.5;   // Ceiling height
  const roomD = 16;    // Longer depth to cover full camera path
  const floorY = -0.5; // Slightly below camera y=1.6 walking height

  // Center so camera path (z: 7.5 → -5) passes through middle
  const zCenter = 1;

  return (
    <group position={[0, floorY, zCenter]}>
      {/* ═══ FLOOR ═══ */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={floorMat}>
        <planeGeometry args={[roomW, roomD]} />
      </mesh>

      {/* ═══ CEILING ═══ */}
      <mesh position={[0, roomH, 0]} material={ceilingMat}>
        <boxGeometry args={[roomW, 0.3, roomD]} />
      </mesh>

      {/* ═══ CEILING LIGHTS (more, brighter) ═══ */}
      {[-5, -2.5, 0, 2.5, 5].map((z) => (
        <group key={`cl-${z}`}>
          <mesh position={[0, roomH - 0.08, z]} material={ceilLightMat}>
            <boxGeometry args={[2.5, 0.06, 0.8]} />
          </mesh>
          <pointLight position={[0, roomH - 0.5, z]} color="#ffe2b0" intensity={2.5} distance={8} decay={2} />
          {/* Side fill lights */}
          <pointLight position={[-3, roomH - 0.5, z]} color="#ffe2b0" intensity={1.2} distance={5} decay={2} />
          <pointLight position={[3, roomH - 0.5, z]} color="#ffe2b0" intensity={1.2} distance={5} decay={2} />
        </group>
      ))}

      {/* ═══ WALLS (thick, opaque, no city bleed-through) ═══ */}
      {/* Left wall */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} castShadow material={wallMat}>
        <boxGeometry args={[0.5, roomH, roomD]} />
      </mesh>
      {/* Left wall inner panel */}
      <mesh position={[-roomW / 2 + 0.3, roomH / 2, 0]} material={wallInnerMat}>
        <boxGeometry args={[0.08, roomH - 0.5, roomD - 0.2]} />
      </mesh>
      {/* Right wall */}
      <mesh position={[roomW / 2, roomH / 2, 0]} castShadow material={wallMat}>
        <boxGeometry args={[0.5, roomH, roomD]} />
      </mesh>
      {/* Right wall inner panel */}
      <mesh position={[roomW / 2 - 0.3, roomH / 2, 0]} material={wallInnerMat}>
        <boxGeometry args={[0.08, roomH - 0.5, roomD - 0.2]} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, roomH / 2, -roomD / 2]} material={wallMat}>
        <boxGeometry args={[roomW, roomH, 0.5]} />
      </mesh>

      {/* ═══ NEON LED STRIPS on walls ═══ */}
      {[-1, 1].map((side) =>
        [-5, -2, 1, 4].map((z) => (
          <group key={`n-${side}-${z}`}>
            <mesh position={[side * (roomW / 2 - 0.55), roomH * 0.45, z]}
              geometry={neonStripGeo} material={neonPinkMat} />
            {/* Neon glow light */}
            <pointLight
              position={[side * (roomW / 2 - 1), roomH * 0.45, z]}
              color="#ff547b" intensity={0.8} distance={3} decay={2}
            />
          </group>
        ))
      )}

      {/* ═══ HEXAGONAL COLUMNS ═══ */}
      {[
        [-3, -4], [-3, 0], [-3, 4],
        [3, -4], [3, 0], [3, 4],
      ].map(([x, z], i) => (
        <group key={`col-${i}`} position={[x, 0, z]}>
          <mesh position={[0, roomH / 2, 0]} castShadow geometry={columnGeo} material={columnMat} />
          <mesh position={[0, 0.15, 0]} geometry={neonRingGeo} material={neonBlueMat} />
          <mesh position={[0, roomH - 0.15, 0]} geometry={columnCapGeo} material={columnCapMat} />
          {/* Column base glow */}
          <pointLight position={[0, 0.3, 0]} color="#51baff" intensity={0.6} distance={2.5} decay={2} />
        </group>
      ))}

      {/* ═══ ELEVATOR DOORS ═══ */}
      {[-1.5, 1.5].map((x) => (
        <group key={`el-${x}`} position={[x, 0, -roomD / 2 + 0.3]}>
          <mesh position={[0, 1.5, 0]} material={elevDoorMat}>
            <boxGeometry args={[1.6, 3, 0.08]} />
          </mesh>
          <mesh position={[0, 1.5, 0.05]} material={elevSlitMat}>
            <boxGeometry args={[0.03, 2.8, 0.03]} />
          </mesh>
          <mesh position={[0, 3.3, 0.05]} material={elevIndicatorMat}>
            <boxGeometry args={[0.5, 0.18, 0.04]} />
          </mesh>
        </group>
      ))}

      {/* ═══ RECEPTION DESK & HOLOGRAM ═══ */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0.5, 0]} castShadow material={deskMat}>
          <boxGeometry args={[3, 1, 0.9]} />
        </mesh>
        <mesh position={[0, 1.6, 0]} material={holoMat}>
          <boxGeometry args={[2.2, 1, 0.03]} />
        </mesh>
        {/* Hologram glow */}
        <pointLight position={[0, 1.6, 0.5]} color="#51baff" intensity={1.5} distance={4} decay={2} />
      </group>

      {/* ═══ CABLE TRAYS ═══ */}
      {[-2.5, 0, 2.5].map((x) => (
        <mesh key={`cab-${x}`} position={[x, roomH - 0.5, 0]} material={cableMat}>
          <boxGeometry args={[0.35, 0.1, roomD * 0.85]} />
        </mesh>
      ))}

      {/* ═══ ENTRANCE ARCH (front) ═══ */}
      <group position={[0, 0, roomD / 2]}>
        <mesh position={[-1.5, roomH * 0.4, 0]} castShadow material={pillarMat}>
          <boxGeometry args={[0.3, roomH * 0.8, 0.5]} />
        </mesh>
        <mesh position={[1.5, roomH * 0.4, 0]} castShadow material={pillarMat}>
          <boxGeometry args={[0.3, roomH * 0.8, 0.5]} />
        </mesh>
        <mesh position={[0, roomH * 0.82, 0]} material={pillarMat}>
          <boxGeometry args={[3.3, 0.15, 0.5]} />
        </mesh>
        <mesh position={[0, roomH * 0.88, 0.28]} material={neonPinkBrightMat}>
          <boxGeometry args={[1.8, 0.1, 0.03]} />
        </mesh>
      </group>

      {/* ═══ FLOOR HIGHLIGHT LIGHTS (walking path) ═══ */}
      {[-5, -2, 1, 4].map((z) => (
        <pointLight key={`floor-${z}`} position={[0, 0.2, z]} color="#ffe8c0" intensity={0.4} distance={3} decay={2} />
      ))}
    </group>
  );
}
