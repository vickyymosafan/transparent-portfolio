"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  getBoardFormedConcreteMat,
  getDarkConcreteMat,
  getTravertineMat,
  getHonedBasaltMat,
  getDarkWalnutMat,
  getPoolWaterMat,
  getPebblesMat,
  matteBlackMetalMat,
  architecturalGlassMat,
  warmCoveLedMat,
  warmDownlightMat,
  interiorWarmFillMat,
  pineTrunkMat,
  cloudPineFoliageMat,
} from "@/lib/architectural-materials";

/**
 * Zone 0: Courtyard Entry (Reference Image 5)
 * Low-slung modern concrete architectural pavilion, reflection pool,
 * floating basalt steps with under-edge warm LED strips, Niwaki cloud pine,
 * dark walnut vertical slats, and grand pivot door.
 */
export function CourtyardZone() {
  const concreteMat = useMemo(() => getBoardFormedConcreteMat(), []);
  const darkConcreteMat = useMemo(() => getDarkConcreteMat(), []);
  const travertineMat = useMemo(() => getTravertineMat(), []);
  const basaltMat = useMemo(() => getHonedBasaltMat(), []);
  const walnutMat = useMemo(() => getDarkWalnutMat(), []);
  const waterMat = useMemo(() => getPoolWaterMat(), []);
  const gravelMat = useMemo(() => getPebblesMat(), []);

  const paverGeo = useMemo(() => new THREE.BoxGeometry(3.4, 0.08, 1.8), []);
  const poolStepGeo = useMemo(() => new THREE.BoxGeometry(2.2, 0.12, 1.2), []);
  const courtyardSlatGeo = useMemo(() => new THREE.BoxGeometry(0.06, 4.0, 0.12), []);

  // Main central walkway stepping stone slabs (z: 21 down to 0.8)
  const walkwaySlabs = useMemo(() => {
    const list: number[] = [];
    for (let z = 21.0; z >= 0.8; z -= 2.2) {
      list.push(z);
    }
    return list;
  }, []);

  // Stepping stones floating across the reflection pool (left side)
  const poolSteps = useMemo(() => {
    const list: { x: number; z: number }[] = [];
    for (let z = 14.5; z >= 3.0; z -= 1.9) {
      list.push({ x: -4.6, z });
    }
    return list;
  }, []);

  // Architectural walnut slats for left wing facade
  const slats = useMemo(() => {
    const list: number[] = [];
    for (let x = -9.6; x <= -2.4; x += 0.22) {
      list.push(x);
    }
    return list;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ═══ 1. GROUND FOUNDATION: CRUSHED GRANITE GRAVEL BED ═══ */}
      <mesh receiveShadow position={[0, -0.15, 10.0]} rotation={[-Math.PI / 2, 0, 0]} material={gravelMat}>
        <planeGeometry args={[42.0, 30.0]} />
      </mesh>

      {/* ═══ 2. MAIN CENTRAL WALKWAY (WIDE BASALT PAVERS) ═══ */}
      {walkwaySlabs.map((sz, idx) => (
        <mesh
          key={`wslab-${idx}`}
          position={[0, 0.03, sz]}
          castShadow
          receiveShadow
          material={basaltMat}
          geometry={paverGeo}
        />
      ))}

      {/* ═══ 3. ARCHITECTURAL WATER REFLECTION POOL (LEFT SIDE) ═══ */}
      <group position={[-6.2, 0, 8.5]}>
        {/* Pool Water Surface with twilight sky reflections */}
        <mesh receiveShadow position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} material={waterMat}>
          <planeGeometry args={[6.8, 13.5]} />
        </mesh>

        {/* Concrete Pool Curbs */}
        <mesh position={[0, 0.06, -6.8]} castShadow receiveShadow material={darkConcreteMat}>
          <boxGeometry args={[7.2, 0.22, 0.25]} />
        </mesh>
        <mesh position={[0, 0.06, 6.8]} castShadow receiveShadow material={darkConcreteMat}>
          <boxGeometry args={[7.2, 0.22, 0.25]} />
        </mesh>
        <mesh position={[-3.4, 0.06, 0]} castShadow receiveShadow material={darkConcreteMat}>
          <boxGeometry args={[0.25, 0.22, 13.6]} />
        </mesh>
        <mesh position={[3.4, 0.06, 0]} castShadow receiveShadow material={darkConcreteMat}>
          <boxGeometry args={[0.25, 0.22, 13.6]} />
        </mesh>
      </group>

      {/* ═══ 4. FLOATING STEPPING STONES WITH UNDER-EDGE WARM LED GLOW ═══ */}
      {poolSteps.map((ps, idx) => (
        <group key={`pstep-${idx}`} position={[ps.x, 0.05, ps.z]}>
          {/* Basalt Step Slab */}
          <mesh castShadow receiveShadow material={basaltMat} geometry={poolStepGeo} />
          {/* Under-edge warm LED strip runner */}
          <mesh position={[0, -0.06, 0]} material={warmCoveLedMat}>
            <boxGeometry args={[2.14, 0.02, 1.14]} />
          </mesh>
          {/* Warm localized reflection on water surface */}
          <pointLight position={[0, -0.08, 0]} color="#ffe0a3" intensity={1.5} distance={3.2} decay={2} />
        </group>
      ))}

      {/* ═══ 5. NIWAKI CLOUD PINE BONSAI & LOW CONCRETE PLANTER (LEFT) ═══ */}
      <group position={[-9.8, 0, 11.5]}>
        {/* Concrete planter enclosure */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow material={concreteMat}>
          <boxGeometry args={[2.8, 0.7, 2.8]} />
        </mesh>
        {/* Organic Bonsai Trunk */}
        <mesh position={[0, 1.45, 0]} rotation={[0, 0, 0.22]} castShadow material={pineTrunkMat}>
          <cylinderGeometry args={[0.08, 0.18, 1.6, 8]} />
        </mesh>
        <mesh position={[0.38, 2.15, 0.2]} rotation={[0.35, 0, -0.38]} castShadow material={pineTrunkMat}>
          <cylinderGeometry args={[0.06, 0.1, 1.1, 8]} />
        </mesh>
        <mesh position={[-0.32, 1.95, -0.2]} rotation={[-0.28, 0, 0.45]} castShadow material={pineTrunkMat}>
          <cylinderGeometry args={[0.05, 0.08, 1.0, 8]} />
        </mesh>
        {/* Horizontal Cloud Foliage Pads */}
        <mesh position={[0.78, 2.65, 0.28]} scale={[1.6, 0.42, 1.3]} castShadow material={cloudPineFoliageMat}>
          <sphereGeometry args={[0.58, 12, 8]} />
        </mesh>
        <mesh position={[-0.58, 2.45, -0.18]} scale={[1.4, 0.38, 1.2]} castShadow material={cloudPineFoliageMat}>
          <sphereGeometry args={[0.5, 12, 8]} />
        </mesh>
        <mesh position={[0.1, 3.05, 0.1]} scale={[1.3, 0.35, 1.1]} castShadow material={cloudPineFoliageMat}>
          <sphereGeometry args={[0.46, 12, 8]} />
        </mesh>
        {/* Warm ground uplight on tree */}
        <pointLight position={[0.8, 0.7, 1.2]} color="#ffe2b0" intensity={2.2} distance={5.5} decay={2} />
      </group>

      {/* ═══ 6. LOW CONCRETE RETAINING WALLS & STEP LIGHTS (RIGHT) ═══ */}
      <group position={[4.8, 0, 9.0]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={concreteMat}>
          <boxGeometry args={[0.3, 0.8, 12.0]} />
        </mesh>
        {[-4.0, 0.0, 4.0].map((lz, idx) => (
          <group key={`cwall-lt-${idx}`} position={[-0.16, 0.3, lz]}>
            <mesh material={warmDownlightMat}>
              <boxGeometry args={[0.04, 0.06, 0.16]} />
            </mesh>
            <pointLight position={[-0.2, 0, 0]} color="#ffe0a3" intensity={1.2} distance={3.2} decay={2} />
          </group>
        ))}
      </group>

      {/* ═══ 7. RESIDENCE PAVILION ARCHITECTURE (AT Z = -0.5) ═══ */}
      <group position={[0, 0, -0.5]}>
        {/* Cantilevered Roof Canopy */}
        <mesh position={[0, 4.45, 0.4]} castShadow receiveShadow material={concreteMat}>
          <boxGeometry args={[21.0, 0.5, 4.8]} />
        </mesh>
        <mesh position={[0, 4.85, 0.1]} material={darkConcreteMat}>
          <boxGeometry args={[20.6, 0.35, 4.2]} />
        </mesh>

        {/* Underside Recessed Soffit Downlights */}
        {[-6.2, -3.8, -1.2, 1.2, 3.8, 6.2].map((lx, idx) => (
          <group key={`soffit-${idx}`} position={[lx, 4.18, 0.8]}>
            <mesh material={warmDownlightMat}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            </mesh>
            <pointLight color="#ffe0a3" intensity={1.5} distance={5.5} decay={2} />
          </group>
        ))}

        {/* ── LEFT WING: Dark Walnut Vertical Slats & Glowing Glass ── */}
        <mesh position={[-6.0, 2.0, -1.8]} material={interiorWarmFillMat}>
          <boxGeometry args={[7.4, 4.0, 0.2]} />
        </mesh>
        <pointLight position={[-5.8, 2.4, -0.8]} color="#ffddaa" intensity={2.6} distance={8.0} decay={2} />
        <mesh position={[-6.0, 2.0, 0.1]} material={architecturalGlassMat}>
          <boxGeometry args={[7.0, 4.0, 0.06]} />
        </mesh>
        {/* Metal Mullions */}
        {[-9.5, -6.0, -2.5].map((mx, idx) => (
          <mesh key={`mul-${idx}`} position={[mx, 2.0, 0.12]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.08, 4.0, 0.1]} />
          </mesh>
        ))}
        <mesh position={[-6.0, 3.95, 0.12]} material={matteBlackMetalMat}>
          <boxGeometry args={[7.0, 0.08, 0.1]} />
        </mesh>
        <mesh position={[-6.0, 0.05, 0.12]} material={matteBlackMetalMat}>
          <boxGeometry args={[7.0, 0.08, 0.1]} />
        </mesh>
        {/* Vertical Wood Slats */}
        {slats.map((sx, idx) => (
          <mesh key={`slat-${idx}`} position={[sx, 2.0, 0.35]} castShadow material={walnutMat} geometry={courtyardSlatGeo} />
        ))}

        {/* ── RIGHT WING: Travertine Stone Wall with Dual Sconces ── */}
        <mesh position={[6.0, 2.0, 0]} castShadow receiveShadow material={travertineMat}>
          <boxGeometry args={[7.0, 4.0, 0.6]} />
        </mesh>
        {[3.4, 6.0, 8.2].map((sx, idx) => (
          <group key={`sconce-${idx}`} position={[sx, 2.2, 0.35]}>
            <mesh material={matteBlackMetalMat}>
              <boxGeometry args={[0.12, 0.38, 0.1]} />
            </mesh>
            {/* Up light */}
            <mesh position={[0, 0.18, 0.02]} material={warmDownlightMat}>
              <boxGeometry args={[0.08, 0.04, 0.06]} />
            </mesh>
            <pointLight position={[0, 0.4, 0.1]} color="#ffe0a3" intensity={1.2} distance={4.0} decay={2} />
            {/* Down light */}
            <mesh position={[0, -0.18, 0.02]} material={warmDownlightMat}>
              <boxGeometry args={[0.08, 0.04, 0.06]} />
            </mesh>
            <pointLight position={[0, -0.4, 0.1]} color="#ffe0a3" intensity={1.2} distance={4.0} decay={2} />
          </group>
        ))}

        {/* ── CENTER GRAND ENTRANCE PORTAL & DARK WALNUT PIVOT DOOR ── */}
        <mesh position={[-2.1, 2.0, 0]} castShadow receiveShadow material={travertineMat}>
          <boxGeometry args={[0.6, 4.0, 0.7]} />
        </mesh>
        <mesh position={[2.1, 2.0, 0]} castShadow receiveShadow material={travertineMat}>
          <boxGeometry args={[0.6, 4.0, 0.7]} />
        </mesh>
        <mesh position={[0, 3.65, 0]} castShadow receiveShadow material={concreteMat}>
          <boxGeometry args={[3.8, 0.7, 0.7]} />
        </mesh>
        {/* Plinth */}
        <mesh position={[0, 0.04, 0]} receiveShadow material={darkConcreteMat}>
          <boxGeometry args={[3.6, 0.08, 1.2]} />
        </mesh>
        {/* Pivot Door */}
        <group position={[1.4, 0, 0]} rotation={[0, -0.32, 0]}>
          <mesh position={[-1.2, 1.65, 0]} castShadow receiveShadow material={walnutMat}>
            <boxGeometry args={[2.4, 3.3, 0.12]} />
          </mesh>
          <mesh position={[-2.2, 1.65, 0.1]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.04, 2.2, 0.06]} />
          </mesh>
          <mesh position={[-2.2, 1.65, -0.1]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.04, 2.2, 0.06]} />
          </mesh>
        </group>
        {/* Interior inviting warm glow */}
        <pointLight position={[0, 2.4, -2.0]} color="#ffe0a3" intensity={2.8} distance={8.0} decay={2} />
      </group>
    </group>
  );
}
