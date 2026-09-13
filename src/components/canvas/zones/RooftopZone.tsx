"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { buildRooftopTexture } from "@/lib/build-tower-texture";

// ─── Shared materials ───
const railMat = new THREE.MeshStandardMaterial({ color: "#3a4555", metalness: 0.85, roughness: 0.25 });
const helipadMat = new THREE.MeshStandardMaterial({ color: "#1c2028", roughness: 0.7, metalness: 0.3 });
const hvacMat = new THREE.MeshStandardMaterial({ color: "#253040", metalness: 0.6, roughness: 0.4 });
const doorHousingMat = new THREE.MeshStandardMaterial({ color: "#1a2030", metalness: 0.4, roughness: 0.6 });
const doorOpeningMat = new THREE.MeshStandardMaterial({ color: "#0a1018", roughness: 0.9 });
const antennaMat = new THREE.MeshStandardMaterial({ color: "#4a5565", metalness: 0.9, roughness: 0.2 });
const hvacFanMat = new THREE.MeshStandardMaterial({ color: "#151e28", metalness: 0.9, roughness: 0.15 });
const hMarkMat = new THREE.MeshStandardMaterial({ color: "#e8e4df", roughness: 0.6 });
const heliRingMat = new THREE.MeshStandardMaterial({
  color: "#ffb65c", emissive: new THREE.Color("#ffb65c"),
  emissiveIntensity: 3, toneMapped: false,
});
const neonTealMat = new THREE.MeshStandardMaterial({
  color: "#49eadb", emissive: new THREE.Color("#49eadb"),
  emissiveIntensity: 4, toneMapped: false,
});
const beaconMat = new THREE.MeshStandardMaterial({
  color: "#ff2233", emissive: new THREE.Color("#ff2233"),
  emissiveIntensity: 5, toneMapped: false,
});

const railPostGeo = new THREE.BoxGeometry(0.08, 1.1, 0.08);
const beaconGeo = new THREE.SphereGeometry(0.08, 8, 8);

/**
 * Zone 5: Rooftop Finale
 * Camera path: z ≈ -41→-47, y ≈ 6→11
 */
export function RooftopZone() {
  const roofTex = useMemo(() => {
    const t = buildRooftopTexture();
    t.repeat.set(3, 3);
    return t;
  }, []);
  const roofFloorMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: roofTex, roughness: 0.85, metalness: 0.15, color: "#222830",
  }), [roofTex]);

  const roofW = 18, roofD = 18;
  // Camera starts at y≈6, rises to y≈11. Roof surface at y=5
  const roofY = 5;
  // Camera z range: -41 to -47, center ≈ -44
  const zCenter = -44;

  return (
    <group position={[0, roofY, zCenter]}>
      {/* Roof surface */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={roofFloorMat}>
        <planeGeometry args={[roofW, roofD]} />
      </mesh>

      {/* Helipad */}
      <group position={[0, 0.03, -1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={helipadMat}>
          <circleGeometry args={[3.5, 32]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} material={heliRingMat}>
          <ringGeometry args={[3.1, 3.5, 32]} />
        </mesh>
        {/* Helipad lights around ring */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <pointLight key={`hp-${i}`}
              position={[Math.cos(angle) * 3.3, 0.2, -1 + Math.sin(angle) * 3.3]}
              color="#ffb65c" intensity={0.4} distance={2} decay={2} />
          );
        })}
        {/* H marking */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={hMarkMat}>
          <planeGeometry args={[0.5, 2.5]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.7, 0.01, 0]} material={hMarkMat}>
          <planeGeometry args={[0.5, 1]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.7, 0.01, 0]} material={hMarkMat}>
          <planeGeometry args={[0.5, 1]} />
        </mesh>
      </group>

      {/* Safety railing posts */}
      {Array.from({ length: 10 }, (_, i) => {
        const pos = -roofW / 2 + 1 + i * (roofW - 2) / 9;
        return (
          <group key={`rp-${i}`}>
            <mesh position={[pos, 0.55, roofD / 2 - 0.15]} castShadow geometry={railPostGeo} material={railMat} />
            <mesh position={[pos, 0.55, -roofD / 2 + 0.15]} castShadow geometry={railPostGeo} material={railMat} />
          </group>
        );
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const pos = -roofD / 2 + 1 + i * (roofD - 2) / 9;
        return (
          <group key={`rs-${i}`}>
            <mesh position={[-roofW / 2 + 0.15, 0.55, pos]} castShadow geometry={railPostGeo} material={railMat} />
            <mesh position={[roofW / 2 - 0.15, 0.55, pos]} castShadow geometry={railPostGeo} material={railMat} />
          </group>
        );
      })}
      {/* Horizontal rails */}
      {[0.55, 1.1].map((h) => (
        <group key={`hr-${h}`}>
          <mesh position={[0, h, roofD / 2 - 0.15]} material={railMat}>
            <boxGeometry args={[roofW - 1, 0.05, 0.05]} />
          </mesh>
          <mesh position={[0, h, -roofD / 2 + 0.15]} material={railMat}>
            <boxGeometry args={[roofW - 1, 0.05, 0.05]} />
          </mesh>
          <mesh position={[-roofW / 2 + 0.15, h, 0]} material={railMat}>
            <boxGeometry args={[0.05, 0.05, roofD - 1]} />
          </mesh>
          <mesh position={[roofW / 2 - 0.15, h, 0]} material={railMat}>
            <boxGeometry args={[0.05, 0.05, roofD - 1]} />
          </mesh>
        </group>
      ))}

      {/* Rooftop access door */}
      <group position={[0, 0, roofD / 2 - 0.8]}>
        <mesh position={[0, 1.6, 0]} castShadow material={doorHousingMat}>
          <boxGeometry args={[3, 3.2, 2.5]} />
        </mesh>
        <mesh position={[0, 1.3, 1.28]} material={doorOpeningMat}>
          <boxGeometry args={[1.4, 2.6, 0.12]} />
        </mesh>
        <mesh position={[0, 2.7, 1.32]} material={neonTealMat}>
          <boxGeometry args={[1.6, 0.06, 0.03]} />
        </mesh>
      </group>

      {/* HVAC equipment */}
      <mesh position={[5, 0.7, -4]} castShadow material={hvacMat}>
        <boxGeometry args={[2, 1.4, 1.8]} />
      </mesh>
      <mesh position={[5, 1.45, -4]} material={hvacFanMat}>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 12]} />
      </mesh>
      <mesh position={[-6, 0.55, -5]} castShadow material={hvacMat}>
        <boxGeometry args={[1.6, 1.1, 1.4]} />
      </mesh>
      <mesh position={[-4, 0.45, 3]} castShadow material={hvacMat}>
        <boxGeometry args={[1.2, 0.9, 1]} />
      </mesh>

      {/* Antenna masts */}
      {[[6, -6], [-7, -7], [7, 5]].map(([x, z], i) => (
        <group key={`ant-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 2.5, 0]} castShadow material={antennaMat}>
            <cylinderGeometry args={[0.04, 0.07, 5, 8]} />
          </mesh>
          <mesh position={[0, 5.1, 0]} geometry={beaconGeo} material={beaconMat} />
          <pointLight position={[0, 5.2, 0]} color="#ff2233" intensity={0.5} distance={3} decay={2} />
        </group>
      ))}

      {/* Rooftop ambient lighting — moonlight / sky */}
      <pointLight position={[0, 2, 0]} color="#8090b0" intensity={1.5} distance={15} decay={2} />
      <pointLight position={[-5, 1, -3]} color="#ffb65c" intensity={0.8} distance={8} decay={2} />
      <pointLight position={[5, 1, 3]} color="#ffb65c" intensity={0.8} distance={8} decay={2} />
    </group>
  );
}
