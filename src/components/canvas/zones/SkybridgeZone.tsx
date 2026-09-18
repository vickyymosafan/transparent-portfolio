"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  getHonedBasaltMat,
  getTeakDeckMat,
  getPebblesMat,
  architecturalGlassMat,
  matteBlackMetalMat,
  warmCoveLedMat,
  bambooStalkMat,
  bambooLeafMat,
  brushedBrassMat,
} from "@/lib/architectural-materials";

const bambooNodeMat = new THREE.MeshStandardMaterial({
  color: "#384e2a",
  roughness: 0.7,
  metalness: 0.04,
});

const graniteRockMat = new THREE.MeshStandardMaterial({
  color: "#30343a",
  roughness: 0.85,
  metalness: 0.14,
});

const walnutBenchMat = new THREE.MeshStandardMaterial({
  color: "#38251b",
  roughness: 0.52,
  metalness: 0.04,
});

export function SkybridgeZone() {
  const corridorW = 4.4;
  const corridorH = 4.5;
  const corridorD = 12.5;
  const floorY = 0.0;
  const zCenter = -20.75; // Spans from z = -14.5 to z = -27.0

  const basaltFloorMat = useMemo(() => getHonedBasaltMat(), []);
  const teakCeilingMat = useMemo(() => getTeakDeckMat(), []);
  const riverPebbleBedMat = useMemo(() => getPebblesMat(), []);

  const leafGeo = useMemo(() => new THREE.BoxGeometry(0.5, 0.02, 0.15), []);
  const rockGeo = useMemo(() => new THREE.DodecahedronGeometry(0.65, 1), []);

  // Dense Japanese bamboo groves on both exterior garden beds (Reference 4)
  const bambooGroves = useMemo(() => {
    const list: { x: number; z: number; h: number; r: number; rot: number }[] = [];
    // Left garden (x = -2.8 to -5.2)
    for (let z = -5.8; z <= 5.8; z += 0.95) {
      for (let x = -2.8; x >= -5.2; x -= 0.95) {
        const jitterX = Math.sin(z * 3.8 + x * 2.1) * 0.22;
        const jitterZ = Math.cos(x * 4.5 - z * 1.8) * 0.22;
        list.push({
          x: x + jitterX,
          z: z + jitterZ,
          h: 4.2 + Math.sin(x * 2 + z * 3) * 0.8,
          r: 0.034 + Math.abs(Math.sin(x * z)) * 0.015,
          rot: (x + z) * 0.4,
        });
      }
    }
    // Right garden (x = 2.8 to 5.2)
    for (let z = -5.8; z <= 5.8; z += 0.95) {
      for (let x = 2.8; x <= 5.2; x += 0.95) {
        const jitterX = Math.sin(z * 3.8 + x * 2.1) * 0.22;
        const jitterZ = Math.cos(x * 4.5 - z * 1.8) * 0.22;
        list.push({
          x: x + jitterX,
          z: z + jitterZ,
          h: 4.2 + Math.sin(x * 2 + z * 3) * 0.8,
          r: 0.034 + Math.abs(Math.sin(x * z)) * 0.015,
          rot: (x + z) * 0.4,
        });
      }
    }
    return list;
  }, []);

  // Granite boulders in the pebble beds
  const rocks = useMemo(
    () => [
      { x: -3.8, z: 2.5, s: [1.1, 0.85, 1.3], r: 0.4 },
      { x: -4.4, z: -2.2, s: [1.4, 0.95, 1.2], r: 1.2 },
      { x: 3.8, z: 1.8, s: [1.2, 0.88, 1.0], r: -0.6 },
      { x: 4.2, z: -3.0, s: [1.5, 1.15, 1.4], r: 0.8 },
    ],
    []
  );

  return (
    <group position={[0, floorY, zCenter]}>
      {/* ═══ 1. HONED BASALT STONE WALKWAY (Center Breezeway Floor) ═══ */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={basaltFloorMat}>
        <planeGeometry args={[corridorW, corridorD]} />
      </mesh>

      {/* ═══ 2. WARM TEAK SLATTED CEILING WITH RECESSED BLACK TRACK FIXTURE ═══ */}
      <mesh position={[0, corridorH, 0]} material={teakCeilingMat}>
        <boxGeometry args={[corridorW + 0.4, 0.15, corridorD]} />
      </mesh>
      {/* Center Black Recessed Track Rail */}
      <mesh position={[0, corridorH - 0.035, 0]} material={matteBlackMetalMat}>
        <boxGeometry args={[0.08, 0.03, corridorD]} />
      </mesh>
      {/* Downlight fixtures along the track */}
      {[-4, -2, 0, 2, 4].map((dz, idx) => (
        <group key={`track-dl-${idx}`} position={[0, corridorH - 0.05, dz]}>
          <pointLight position={[0, -0.2, 0]} color="#fff2db" intensity={2.0} distance={7.0} decay={2} />
        </group>
      ))}

      {/* ═══ 3. CONTINUOUS LINEAR WARM LED BASEBOARD WASH (BOTH SIDES - Reference 4) ═══ */}
      {/* Left Baseboard Runner */}
      <group position={[-corridorW / 2 + 0.03, 0.03, 0]}>
        <mesh material={warmCoveLedMat}>
          <boxGeometry args={[0.05, 0.04, corridorD - 0.2]} />
        </mesh>
        {[-5.0, -2.5, 0.0, 2.5, 5.0].map((wz, idx) => (
          <pointLight
            key={`lw-${idx}`}
            position={[0.25, 0.12, wz]}
            color="#ffb866"
            intensity={3.4}
            distance={4.8}
            decay={2}
          />
        ))}
      </group>

      {/* Right Baseboard Runner */}
      <group position={[corridorW / 2 - 0.03, 0.03, 0]}>
        <mesh material={warmCoveLedMat}>
          <boxGeometry args={[0.05, 0.04, corridorD - 0.2]} />
        </mesh>
        {[-5.0, -2.5, 0.0, 2.5, 5.0].map((wz, idx) => (
          <pointLight
            key={`rw-${idx}`}
            position={[-0.25, 0.12, wz]}
            color="#ffb866"
            intensity={3.4}
            distance={4.8}
            decay={2}
          />
        ))}
      </group>

      {/* ═══ 4. FLOOR-TO-CEILING MINIMALIST GLASS CURTAIN WALLS & BLACK MULLIONS ═══ */}
      {/* Left Glass Wall */}
      <mesh position={[-corridorW / 2, corridorH / 2, 0]} material={architecturalGlassMat}>
        <boxGeometry args={[0.03, corridorH, corridorD]} />
      </mesh>
      {/* Right Glass Wall */}
      <mesh position={[corridorW / 2, corridorH / 2, 0]} material={architecturalGlassMat}>
        <boxGeometry args={[0.03, corridorH, corridorD]} />
      </mesh>

      {/* Vertical Mullion Posts on Left & Right Glass */}
      {[-5.8, -3.9, -1.9, 0, 1.9, 3.9, 5.8].map((mz, idx) => (
        <group key={`mullion-${idx}`}>
          <mesh position={[-corridorW / 2, corridorH / 2, mz]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.07, corridorH, 0.07]} />
          </mesh>
          <mesh position={[corridorW / 2, corridorH / 2, mz]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.07, corridorH, 0.07]} />
          </mesh>
        </group>
      ))}

      {/* ═══ 5. OUTDOOR JAPANESE COURTYARDS BEYOND THE GLASS (Reference 4) ═══ */}
      {/* Left Outdoor Garden Bed (River pebbles) */}
      <mesh receiveShadow position={[-4.2, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} material={riverPebbleBedMat}>
        <planeGeometry args={[4.0, corridorD + 2.0]} />
      </mesh>
      {/* Right Outdoor Garden Bed (River pebbles) */}
      <mesh receiveShadow position={[4.2, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} material={riverPebbleBedMat}>
        <planeGeometry args={[4.0, corridorD + 2.0]} />
      </mesh>

      {/* Exterior Bamboo Stalks & Leaves */}
      {bambooGroves.map((b, idx) => (
        <group key={`bamboo-${idx}`} position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]}>
          {/* Main Bamboo Stem */}
          <mesh position={[0, b.h / 2, 0]} castShadow material={bambooStalkMat}>
            <cylinderGeometry args={[b.r, b.r * 1.15, b.h, 7]} />
          </mesh>
          {/* Horizontal Nodal Rings */}
          {[0.8, 1.6, 2.4, 3.2, 4.0].filter((ny) => ny < b.h).map((ny, nidx) => (
            <mesh key={`node-${nidx}`} position={[0, ny, 0]} material={bambooNodeMat}>
              <cylinderGeometry args={[b.r * 1.25, b.r * 1.25, 0.03, 7]} />
            </mesh>
          ))}
          {/* Delicate Foliage Sprays at Upper Nodes */}
          {b.h > 3.0 && (
            <mesh position={[0.08, b.h * 0.85, 0]} rotation={[0.4, 0.2, 0.3]} castShadow material={bambooLeafMat} geometry={leafGeo} />
          )}
          {b.h > 3.5 && (
            <mesh position={[-0.08, b.h * 0.92, 0.05]} rotation={[-0.3, -0.4, -0.2]} castShadow material={bambooLeafMat} geometry={leafGeo} />
          )}
        </group>
      ))}

      {/* Sculptural Granite Boulders in Pebble Beds */}
      {rocks.map((r, idx) => (
        <mesh
          key={`rock-${idx}`}
          position={[r.x, 0.35, r.z]}
          scale={r.s as [number, number, number]}
          rotation={[0.2, r.r, 0]}
          castShadow
          receiveShadow
          material={graniteRockMat}
          geometry={rockGeo}
        />
      ))}

      {/* Exterior Garden Brass Uplights illuminating bamboo and exterior walls */}
      {[
        [-3.6, -3.5], [-3.6, 2.5],
        [3.6, -2.5], [3.6, 3.5],
      ].map(([ux, uz], idx) => (
        <group key={`uplight-${idx}`} position={[ux, 0.06, uz]}>
          <mesh material={brushedBrassMat}>
            <cylinderGeometry args={[0.1, 0.12, 0.1, 12]} />
          </mesh>
          <pointLight position={[0, 0.4, 0]} color="#ffe0a3" intensity={2.8} distance={6.5} decay={2} />
        </group>
      ))}

      {/* ═══ 6. MINIMALIST SOLID WALNUT BENCH ═══ */}
      <group position={[-corridorW / 2 + 0.85, 0, 0]}>
        {/* Solid Walnut Top Slab */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow material={walnutBenchMat}>
          <boxGeometry args={[0.55, 0.08, 2.4]} />
        </mesh>
        {/* Two Solid Block Legs */}
        {[-0.95, 0.95].map((lz, idx) => (
          <mesh key={`leg-${idx}`} position={[0, 0.2, lz]} castShadow receiveShadow material={walnutBenchMat}>
            <boxGeometry args={[0.45, 0.4, 0.1]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
