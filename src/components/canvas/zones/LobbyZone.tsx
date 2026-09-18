"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  getTravertineMat,
  getEuropeanOakMat,
  getDarkWalnutMat,
  getNeroMarquinaMat,
  matteBlackMetalMat,
  architecturalGlassMat,
  warmCoveLedMat,
  brushedBrassMat,
} from "@/lib/architectural-materials";

// Dedicated accessories materials
const ceramicVaseMat = new THREE.MeshStandardMaterial({
  color: "#22201d",
  roughness: 0.65,
  metalness: 0.12,
});

const planterPotMat = new THREE.MeshStandardMaterial({
  color: "#24272c",
  roughness: 0.75,
  metalness: 0.1,
});

const leafMat = new THREE.MeshStandardMaterial({
  color: "#1e3a20",
  roughness: 0.55,
  metalness: 0.04,
});

const branchMat = new THREE.MeshStandardMaterial({
  color: "#3a2d22",
  roughness: 0.85,
  metalness: 0.04,
});

const ceilingMat = new THREE.MeshStandardMaterial({
  color: "#f5f0e6",
  roughness: 0.88,
  metalness: 0.02,
});

export function LobbyZone() {
  const roomW = 9.2;
  const roomH = 4.8;
  const roomD = 14.5;
  const floorY = 0.0;
  const zCenter = -7.25;

  const oakFloorMat = useMemo(() => getEuropeanOakMat(), []);
  const travertineWallMat = useMemo(() => getTravertineMat(), []);
  const walnutSlatMat = useMemo(() => getDarkWalnutMat(), []);
  const marbleConsoleMat = useMemo(() => getNeroMarquinaMat(), []);

  // Floating staircase open treads (cantilevered from travertine wall on left)
  const stairTreads = useMemo(() => {
    const list: { y: number; z: number }[] = [];
    const count = 13;
    for (let i = 0; i < count; i++) {
      list.push({
        y: 0.22 + i * 0.25,
        z: 5.5 - i * 0.82,
      });
    }
    return list;
  }, []);

  const slatGeo = useMemo(() => new THREE.BoxGeometry(0.06, roomH, 0.08), [roomH]);
  const treadGeo = useMemo(() => new THREE.BoxGeometry(1.6, 0.07, 0.42), []);

  // Vertical fluted oak slats for right accent wall (Reference 2)
  const wallSlats = useMemo(() => {
    const list: number[] = [];
    for (let z = -6.8; z <= 6.8; z += 0.22) {
      list.push(z);
    }
    return list;
  }, []);

  return (
    <group position={[0, floorY, zCenter]}>
      {/* ═══ 1. WIDE-PLANK EUROPEAN OAK HARDWOOD FLOOR (Reference 2) ═══ */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={oakFloorMat}>
        <planeGeometry args={[roomW, roomD]} />
      </mesh>

      {/* ═══ 2. CEILING WITH RECESSED 2700K COVE TROFFER WASH (Reference 2) ═══ */}
      <mesh position={[0, roomH, 0]} material={ceilingMat}>
        <boxGeometry args={[roomW, 0.2, roomD]} />
      </mesh>
      {/* Center recessed cove ceiling troffer tray */}
      <mesh position={[0, roomH - 0.06, 0]} material={ceilingMat}>
        <boxGeometry args={[2.4, 0.06, roomD - 1.2]} />
      </mesh>
      {/* Hidden Linear Warm LED Strips inside cove casting 2700K ambient wash */}
      {[-1.2, 1.2].map((cx, idx) => (
        <group key={`cove-edge-${idx}`} position={[cx, roomH - 0.05, 0]}>
          <mesh material={warmCoveLedMat}>
            <boxGeometry args={[0.06, 0.025, roomD - 1.6]} />
          </mesh>
          <pointLight position={[0, -0.2, 0]} color="#ffe0a3" intensity={2.6} distance={7.5} decay={2} />
        </group>
      ))}

      {/* Recessed black linear downlight slits along ceiling */}
      {[-4.5, -1.5, 1.5, 4.5].map((lz, idx) => (
        <group key={`foyer-dl-${idx}`} position={[0, roomH - 0.03, lz]}>
          <mesh material={matteBlackMetalMat}>
            <boxGeometry args={[0.12, 0.02, 0.4]} />
          </mesh>
          <pointLight position={[0, -0.25, 0]} color="#fff2db" intensity={2.2} distance={7.0} decay={2} />
        </group>
      ))}

      {/* ═══ 3. LEFT WALL: VEIN-CUT TRAVERTINE & FLOATING OAK STAIRCASE ═══ */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} castShadow receiveShadow material={travertineWallMat}>
        <boxGeometry args={[0.4, roomH, roomD]} />
      </mesh>

      {/* Cantilevered Floating Staircase Treads */}
      {stairTreads.map((t, idx) => (
        <group key={`stair-${idx}`} position={[-roomW / 2 + 1.05, t.y, t.z]}>
          <mesh castShadow receiveShadow material={oakFloorMat} geometry={treadGeo} />
          <pointLight position={[0, -0.05, 0]} color="#ffe0a3" intensity={0.4} distance={2.2} decay={2} />
          <mesh position={[0.85, 0, 0]} material={brushedBrassMat}>
            <boxGeometry args={[0.05, 0.07, 0.12]} />
          </mesh>
        </group>
      ))}

      {/* Tempered Glass Balustrade on stairs */}
      <mesh position={[-roomW / 2 + 1.92, 1.85, 0.6]} rotation={[0.29, 0, 0]} material={architecturalGlassMat}>
        <boxGeometry args={[0.03, 1.1, 10.8]} />
      </mesh>
      {/* Slender Bronze Handrail along the glass balustrade */}
      <mesh position={[-roomW / 2 + 1.92, 2.45, 0.6]} rotation={[0.29, 0, 0]} material={brushedBrassMat}>
        <boxGeometry args={[0.05, 0.05, 10.8]} />
      </mesh>

      {/* Exterior Lightwell Glass Window */}
      <group position={[-roomW / 2 + 0.15, roomH / 2, 5.8]}>
        <mesh material={architecturalGlassMat}>
          <boxGeometry args={[0.04, roomH - 0.2, 2.8]} />
        </mesh>
        <mesh position={[-0.8, 0, 0]} material={travertineWallMat}>
          <boxGeometry args={[0.2, roomH, 3.2]} />
        </mesh>
        <pointLight position={[-0.4, 2.0, 0]} color="#d6e8ff" intensity={1.8} distance={5.0} decay={2} />
      </group>

      {/* Tall Architectural Fiddle Leaf Fig Tree */}
      <group position={[-roomW / 2 + 1.1, 0, 5.8]}>
        <mesh position={[0, 0.52, 0]} castShadow material={planterPotMat}>
          <cylinderGeometry args={[0.42, 0.34, 1.04, 18]} />
        </mesh>
        <mesh position={[0, 1.65, 0]} castShadow material={branchMat}>
          <cylinderGeometry args={[0.04, 0.065, 1.35, 8]} />
        </mesh>
        {[
          [0, 2.35, 0, 0.58],
          [0.26, 2.05, 0.16, 0.46],
          [-0.24, 1.85, -0.15, 0.44],
          [0.16, 2.68, -0.1, 0.52],
        ].map(([lx, ly, lz, lr], lidx) => (
          <mesh key={`leaf-${lidx}`} position={[lx, ly, lz]} castShadow material={leafMat}>
            <sphereGeometry args={[lr, 12, 10]} />
          </mesh>
        ))}
      </group>

      {/* ═══ 4. RIGHT WALL: FLUTED VERTICAL SLATS & MARBLE CONSOLE ═══ */}
      <mesh position={[roomW / 2, roomH / 2, 0]} castShadow receiveShadow material={travertineWallMat}>
        <boxGeometry args={[0.4, roomH, roomD]} />
      </mesh>
      {wallSlats.map((sz, idx) => (
        <mesh key={`wslat-${idx}`} position={[roomW / 2 - 0.18, roomH / 2, sz]} castShadow material={walnutSlatMat} geometry={slatGeo} />
      ))}

      {/* Floating Nero Marquina Black Marble Console Table */}
      <group position={[roomW / 2 - 0.48, 0.85, 0]}>
        <mesh castShadow receiveShadow material={marbleConsoleMat}>
          <boxGeometry args={[0.56, 0.08, 4.2]} />
        </mesh>
        <mesh position={[0, -0.42, 2.05]} castShadow material={marbleConsoleMat}>
          <boxGeometry args={[0.56, 0.8, 0.08]} />
        </mesh>

        {/* Minimalist Ceramic Wabi-Sabi Vase with Branch */}
        <group position={[0, 0.28, 0.8]}>
          <mesh castShadow material={ceramicVaseMat}>
            <cylinderGeometry args={[0.13, 0.19, 0.48, 18]} />
          </mesh>
          <mesh position={[0, 0.48, 0]} rotation={[0, 0, 0.22]} material={branchMat}>
            <cylinderGeometry args={[0.015, 0.025, 0.65, 6]} />
          </mesh>
          <mesh position={[0.14, 0.68, 0]} rotation={[0, 0, -0.32]} material={branchMat}>
            <cylinderGeometry args={[0.01, 0.015, 0.4, 6]} />
          </mesh>
          <pointLight position={[0, 1.8, 0]} color="#ffe4c0" intensity={2.2} distance={5.0} decay={2} />
        </group>
      </group>

      {/* ═══ 5. NORTH TRANSITION PORTAL (Toward Garden Corridor) ═══ */}
      <group position={[0, 0, -roomD / 2 + 0.1]}>
        <mesh position={[-roomW / 2 + 1.2, roomH / 2, 0]} material={travertineWallMat}>
          <boxGeometry args={[2.4, roomH, 0.3]} />
        </mesh>
        <mesh position={[roomW / 2 - 1.2, roomH / 2, 0]} material={travertineWallMat}>
          <boxGeometry args={[2.4, roomH, 0.3]} />
        </mesh>
        <mesh position={[0, roomH - 0.4, 0]} material={matteBlackMetalMat}>
          <boxGeometry args={[roomW - 4.8, 0.8, 0.2]} />
        </mesh>
        {[-2.2, 2.2].map((jx, idx) => (
          <mesh key={`jamb-${idx}`} position={[jx, roomH / 2, 0]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.08, roomH, 0.22]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
