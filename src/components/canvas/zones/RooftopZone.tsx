"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  getTeakDeckMat,
  getPebblesMat,
  getBoardFormedConcreteMat,
  architecturalGlassMat,
  matteBlackMetalMat,
  warmCoveLedMat,
  pineTrunkMat,
  cloudPineFoliageMat,
  interiorWarmFillMat,
} from "@/lib/architectural-materials";

const sofaFabricMat = new THREE.MeshStandardMaterial({
  color: "#cfc6b6",
  roughness: 0.85,
  metalness: 0.02,
});

const pillowFabricMat = new THREE.MeshStandardMaterial({
  color: "#8a7d6e",
  roughness: 0.88,
  metalness: 0.02,
});

const fireTableMat = new THREE.MeshStandardMaterial({
  color: "#16171a",
  roughness: 0.22,
  metalness: 0.82,
});

const flameGlowMat = new THREE.MeshStandardMaterial({
  color: "#ff9025",
  emissive: new THREE.Color("#ffb844"),
  emissiveIntensity: 6.2,
  toneMapped: false,
});

export function RooftopZone() {
  const fireLightRef = useRef<THREE.PointLight>(null);
  const flameMeshRef = useRef<THREE.Mesh>(null);

  const deckW = 20.0;
  const deckD = 16.0;
  const floorY = 0.0;
  const zCenter = -57.5; // Spans from z = -51.0 to z = -64.0

  const teakDeckMat = useMemo(() => getTeakDeckMat(), []);
  const lavaBedMat = useMemo(() => getPebblesMat(), []);
  const concreteMat = useMemo(() => getBoardFormedConcreteMat(), []);

  // Distant twinkling city skyline lights (Reference 1 evening backdrop)
  const cityLightPositions = useMemo(() => {
    const pts = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      const pseudoX = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const fracX = pseudoX - Math.floor(pseudoX);
      const pseudoY = Math.sin(i * 39.346 + 11.135) * 23421.631;
      const fracY = pseudoY - Math.floor(pseudoY);
      const pseudoZ = Math.sin(i * 71.182 + 93.411) * 31254.819;
      const fracZ = pseudoZ - Math.floor(pseudoZ);

      pts[i * 3] = -18 + fracX * 36;
      pts[i * 3 + 1] = 0.4 + fracY * 2.8;
      pts[i * 3 + 2] = -deckD / 2 - 4.5 - fracZ * 8.0;
    }
    return pts;
  }, [deckD]);

  // Subtle natural flame flicker
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fireLightRef.current) {
      const flicker =
        Math.sin(t * 12) * 0.25 +
        Math.sin(t * 24.3) * 0.18 +
        Math.sin(t * 7.5) * 0.3;
      fireLightRef.current.intensity = 4.2 + flicker;
    }
    if (flameMeshRef.current) {
      flameMeshRef.current.scale.y = 1 + Math.sin(t * 15) * 0.12;
      flameMeshRef.current.scale.x = 1 + Math.cos(t * 11) * 0.08;
    }
  });

  return (
    <group position={[0, floorY, zCenter]}>
      {/* ═══ 1. NATURAL WARM TEAK PLANK ROOFTOP DECKING (Reference 1) ═══ */}
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={teakDeckMat}>
        <planeGeometry args={[deckW, deckD]} />
      </mesh>

      {/* ═══ 2. SUNKEN ARCHITECTURAL LOUNGE PIT (Reference 1) ═══ */}
      <group position={[0.6, 0, 0.4]}>
        {/* Sunken Pit Base Floor */}
        <mesh receiveShadow position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} material={teakDeckMat}>
          <planeGeometry args={[6.6, 5.4]} />
        </mesh>

        {/* Stepped Wood Perimeter Rim Edging */}
        <mesh position={[0, -0.21, 2.75]} material={teakDeckMat}>
          <boxGeometry args={[7.0, 0.42, 0.24]} />
        </mesh>
        <mesh position={[0, -0.21, -2.75]} material={teakDeckMat}>
          <boxGeometry args={[7.0, 0.42, 0.24]} />
        </mesh>
        <mesh position={[-3.4, -0.21, 0]} material={teakDeckMat}>
          <boxGeometry args={[0.24, 0.42, 5.4]} />
        </mesh>
        <mesh position={[3.4, -0.21, 0]} material={teakDeckMat}>
          <boxGeometry args={[0.24, 0.42, 5.4]} />
        </mesh>

        {/* ── Modular Sectional Sofa (U-Shaped Oatmeal Linen) ── */}
        {/* North Bench Cushion (Back) */}
        <group position={[0, -0.26, -1.85]}>
          <mesh castShadow receiveShadow material={sofaFabricMat}>
            <boxGeometry args={[5.4, 0.3, 0.9]} />
          </mesh>
          <mesh position={[0, 0.3, -0.34]} castShadow material={sofaFabricMat}>
            <boxGeometry args={[5.4, 0.38, 0.25]} />
          </mesh>
          {[-1.6, 0, 1.6].map((px, idx) => (
            <mesh key={`npillow-${idx}`} position={[px, 0.22, -0.24]} rotation={[0.15, 0, 0]} material={pillowFabricMat}>
              <boxGeometry args={[0.48, 0.32, 0.12]} />
            </mesh>
          ))}
        </group>

        {/* South Bench Cushion (Front) */}
        <group position={[0, -0.26, 1.85]}>
          <mesh castShadow receiveShadow material={sofaFabricMat}>
            <boxGeometry args={[5.4, 0.3, 0.9]} />
          </mesh>
          <mesh position={[0, 0.3, 0.34]} castShadow material={sofaFabricMat}>
            <boxGeometry args={[5.4, 0.38, 0.25]} />
          </mesh>
          {[-1.6, 1.6].map((px, idx) => (
            <mesh key={`spillow-${idx}`} position={[px, 0.22, 0.24]} rotation={[-0.15, 0, 0]} material={pillowFabricMat}>
              <boxGeometry args={[0.48, 0.32, 0.12]} />
            </mesh>
          ))}
        </group>

        {/* West Bench Cushion (Left connecting piece) */}
        <group position={[-2.2, -0.26, 0]}>
          <mesh castShadow receiveShadow material={sofaFabricMat}>
            <boxGeometry args={[0.9, 0.3, 2.8]} />
          </mesh>
          <mesh position={[-0.34, 0.3, 0]} castShadow material={sofaFabricMat}>
            <boxGeometry args={[0.25, 0.38, 2.8]} />
          </mesh>
          <mesh position={[-0.24, 0.22, 0]} rotation={[0, 0, 0.15]} material={pillowFabricMat}>
            <boxGeometry args={[0.12, 0.32, 0.48]} />
          </mesh>
        </group>

        {/* ── Monolithic Black Basalt Linear Fire Table ── */}
        <group position={[0, -0.21, 0]}>
          <mesh castShadow receiveShadow material={fireTableMat}>
            <boxGeometry args={[2.5, 0.42, 0.88]} />
          </mesh>
          {/* Recessed lava rock bed */}
          <mesh position={[0, 0.19, 0]} material={lavaBedMat}>
            <boxGeometry args={[2.2, 0.05, 0.58]} />
          </mesh>
          {/* Glowing flame ribbon */}
          <mesh ref={flameMeshRef} position={[0, 0.32, 0]} material={flameGlowMat}>
            <boxGeometry args={[1.9, 0.22, 0.12]} />
          </mesh>
          {/* Flickering warm firelight */}
          <pointLight
            ref={fireLightRef}
            position={[0, 0.5, 0]}
            color="#ff9b36"
            intensity={4.5}
            distance={7.5}
            decay={2}
          />
        </group>

        {/* Warm linear LED runner under perimeter rim */}
        {[-2.65, 2.65].map((rz, idx) => (
          <group key={`rim-glow-${idx}`} position={[0, -0.04, rz]}>
            <mesh material={warmCoveLedMat}>
              <boxGeometry args={[6.6, 0.03, 0.03]} />
            </mesh>
            <pointLight position={[0, -0.15, 0]} color="#ffe0a3" intensity={2.0} distance={4.5} decay={2} />
          </group>
        ))}
      </group>

      {/* ═══ 3. ARCHITECTURAL JAPANESE CLOUD PINE PLANTERS (Reference 1) ═══ */}
      {[
        { x: -5.8, z: -4.8, ry: 0.3 },
        { x: 6.8, z: 4.2, ry: -0.6 },
      ].map((p, pidx) => (
        <group key={`roof-planter-${pidx}`} position={[p.x, 0, p.z]} rotation={[0, p.ry, 0]}>
          {/* Dark Charcoal Concrete Planter Box */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow material={concreteMat}>
            <boxGeometry args={[2.2, 1.0, 2.2]} />
          </mesh>
          {/* Soil / River Pebble surface */}
          <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={lavaBedMat}>
            <planeGeometry args={[2.1, 2.1]} />
          </mesh>
          {/* Sculpted Niwaki Trunk */}
          <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0.2]} castShadow material={pineTrunkMat}>
            <cylinderGeometry args={[0.07, 0.16, 1.6, 8]} />
          </mesh>
          <mesh position={[0.3, 2.5, 0.2]} rotation={[0.4, 0, -0.35]} castShadow material={pineTrunkMat}>
            <cylinderGeometry args={[0.05, 0.09, 1.1, 8]} />
          </mesh>
          <mesh position={[-0.3, 2.3, -0.2]} rotation={[-0.3, 0, 0.4]} castShadow material={pineTrunkMat}>
            <cylinderGeometry args={[0.04, 0.07, 1.0, 8]} />
          </mesh>
          {/* Cloud Foliage Pads */}
          <mesh position={[0.65, 2.9, 0.25]} scale={[1.4, 0.38, 1.1]} castShadow material={cloudPineFoliageMat}>
            <sphereGeometry args={[0.5, 12, 8]} />
          </mesh>
          <mesh position={[-0.5, 2.7, -0.15]} scale={[1.2, 0.35, 1.0]} castShadow material={cloudPineFoliageMat}>
            <sphereGeometry args={[0.45, 12, 8]} />
          </mesh>
          <mesh position={[0.05, 3.3, 0.1]} scale={[1.1, 0.32, 0.9]} castShadow material={cloudPineFoliageMat}>
            <sphereGeometry args={[0.4, 12, 8]} />
          </mesh>
          {/* Warm ground uplight */}
          <pointLight position={[0.4, 1.1, 0.4]} color="#ffe0a3" intensity={2.2} distance={4.5} decay={2} />
        </group>
      ))}

      {/* ═══ 4. FRAMELESS GLASS BALUSTRADE & WARM PERIMETER COVE RUNNER (Reference 1) ═══ */}
      {/* North Edge Balustrade */}
      <group position={[0, 0.65, -deckD / 2 + 0.1]}>
        <mesh material={architecturalGlassMat}>
          <boxGeometry args={[deckW - 0.4, 1.3, 0.03]} />
        </mesh>
        <mesh position={[0, 0.66, 0]} material={matteBlackMetalMat}>
          <boxGeometry args={[deckW - 0.4, 0.04, 0.06]} />
        </mesh>
        {/* Warm linear perimeter baseboard light */}
        <mesh position={[0, -0.62, 0.06]} material={warmCoveLedMat}>
          <boxGeometry args={[deckW - 0.6, 0.03, 0.03]} />
        </mesh>
        {[-6, 0, 6].map((bx, idx) => (
          <pointLight key={`b-glow-${idx}`} position={[bx, -0.5, 0.3]} color="#ffb866" intensity={2.4} distance={4.0} decay={2} />
        ))}
      </group>

      {/* South Edge Balustrade */}
      <group position={[0, 0.65, deckD / 2 - 0.1]}>
        <mesh material={architecturalGlassMat}>
          <boxGeometry args={[deckW - 0.4, 1.3, 0.03]} />
        </mesh>
        <mesh position={[0, 0.66, 0]} material={matteBlackMetalMat}>
          <boxGeometry args={[deckW - 0.4, 0.04, 0.06]} />
        </mesh>
      </group>

      {/* East Edge Balustrade */}
      <group position={[deckW / 2 - 0.1, 0.65, 0]}>
        <mesh material={architecturalGlassMat}>
          <boxGeometry args={[0.03, 1.3, deckD - 0.4]} />
        </mesh>
        <mesh position={[0, 0.66, 0]} material={matteBlackMetalMat}>
          <boxGeometry args={[0.06, 0.04, deckD - 0.4]} />
        </mesh>
      </group>

      {/* ═══ 5. INDOOR PAVILION VOLUME & FLOOR-TO-CEILING GLASS (WEST SIDE) ═══ */}
      <group position={[-deckW / 2 + 2.4, 0, 0]}>
        <mesh position={[-0.8, 2.5, 0]} material={concreteMat}>
          <boxGeometry args={[1.6, 5.0, deckD]} />
        </mesh>
        <mesh position={[0.2, 2.5, 0]} material={interiorWarmFillMat}>
          <boxGeometry args={[0.2, 4.8, deckD - 0.8]} />
        </mesh>
        <mesh position={[0.3, 2.5, 0]} material={architecturalGlassMat}>
          <boxGeometry args={[0.04, 4.8, deckD - 0.8]} />
        </mesh>
        {/* Mullions */}
        {[-5, -2.5, 0, 2.5, 5].map((mz, idx) => (
          <mesh key={`pav-mul-${idx}`} position={[0.32, 2.5, mz]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.06, 4.8, 0.08]} />
          </mesh>
        ))}
        {/* Warm interior light spill */}
        <pointLight position={[1.2, 2.8, 0]} color="#ffe0a3" intensity={3.5} distance={9.0} decay={2} />
      </group>

      {/* ═══ 6. DISTANT PANORAMIC TWINKLING CITY SKYLINE (Reference 1) ═══ */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cityLightPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.16} color="#ffdca0" transparent opacity={0.85} depthWrite={false} />
      </points>
    </group>
  );
}
