"use client";

import * as THREE from "three";

// ─── Shared materials ───
const steelMat = new THREE.MeshStandardMaterial({ color: "#2a3545", metalness: 0.88, roughness: 0.25 });
const steelDarkMat = new THREE.MeshStandardMaterial({ color: "#1a2535", metalness: 0.85, roughness: 0.3 });
const ceilingMat = new THREE.MeshStandardMaterial({ color: "#1e2838", metalness: 0.7, roughness: 0.4 });
const wallStubMat = new THREE.MeshStandardMaterial({ color: "#1a2030", metalness: 0.4, roughness: 0.6 });
const topBeamMat = new THREE.MeshStandardMaterial({ color: "#151e2a", metalness: 0.4, roughness: 0.6 });

const glassMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  metalness: 0.1,
  roughness: 0.02,
  transparent: true,
  opacity: 0.08,
  side: THREE.DoubleSide,
});
const lightMat = new THREE.MeshStandardMaterial({
  color: "#d6e8ff", emissive: new THREE.Color("#d6e8ff"),
  emissiveIntensity: 3, toneMapped: false,
});
const floorStripMat = new THREE.MeshStandardMaterial({
  color: "#00aaff", emissive: new THREE.Color("#0088dd"),
  emissiveIntensity: 3, toneMapped: false,
});

// ─── Shared geometries ───
const stanchionGeo = new THREE.BoxGeometry(0.1, 3.5, 0.1);
const floorGridGeo = new THREE.BoxGeometry(3.3, 0.06, 0.08);
const braceGeo = new THREE.BoxGeometry(0.06, 0.06, 5.15);

/**
 * Zone 2: Glass Skybridge
 * Camera path: z ≈ -7→-17.5, y ≈ 4→5.5, x ≈ -0.5→0.3
 * Elevated glass corridor between two building towers.
 */
export function SkybridgeZone() {
  const bridgeW = 4;      // Wider for comfort
  const bridgeH = 4;      // Taller
  const bridgeD = 16;     // Long enough for camera path
  const baseY = 2.5;      // Floor elevation — camera at y≈4-5.5
  const zCenter = -12;    // Center aligned with camera z path

  return (
    <group position={[0, baseY, zCenter]}>
      {/* ═══ STEEL FRAME ═══ */}
      {/* Bottom frame rails */}
      {[-1, 1].map((s) => (
        <mesh key={`br-${s}`} position={[s * bridgeW / 2, 0, 0]} material={steelMat}>
          <boxGeometry args={[0.15, 0.15, bridgeD]} />
        </mesh>
      ))}
      {/* Top frame rails */}
      {[-1, 1].map((s) => (
        <mesh key={`tr-${s}`} position={[s * bridgeW / 2, bridgeH, 0]} material={steelMat}>
          <boxGeometry args={[0.15, 0.15, bridgeD]} />
        </mesh>
      ))}

      {/* ═══ SOLID WALKWAY FLOOR ═══ */}
      <mesh position={[0, 0, 0]} material={steelDarkMat}>
        <boxGeometry args={[bridgeW - 0.3, 0.12, bridgeD]} />
      </mesh>

      {/* Floor grid cross-beams (visible from above) */}
      {Array.from({ length: 12 }, (_, i) => {
        const z = -bridgeD / 2 + 0.5 + i * (bridgeD - 1) / 11;
        return (
          <mesh key={`fg-${i}`} position={[0, 0.07, z]} geometry={floorGridGeo} material={steelMat} />
        );
      })}

      {/* ═══ EDGE LED STRIPS (running lights along floor edges) ═══ */}
      {[-1, 1].map((side) => (
        <mesh key={`strip-${side}`} position={[side * (bridgeW / 2 - 0.3), 0.14, 0]} material={floorStripMat}>
          <boxGeometry args={[0.05, 0.04, bridgeD * 0.95]} />
        </mesh>
      ))}
      {[-1, 1].map((side) =>
        [-6, -2, 2, 6].map((z) => (
          <pointLight key={`es-${side}-${z}`}
            position={[side * (bridgeW / 2 - 0.3), 0.3, z]}
            color="#0088dd" intensity={0.6} distance={3} decay={2} />
        ))
      )}

      {/* Top ceiling panel */}
      <mesh position={[0, bridgeH, 0]} material={ceilingMat}>
        <boxGeometry args={[bridgeW, 0.12, bridgeD]} />
      </mesh>

      {/* ═══ VERTICAL STANCHIONS ═══ */}
      {Array.from({ length: 9 }, (_, i) => {
        const z = -bridgeD / 2 + 1 + i * (bridgeD - 2) / 8;
        return [-1, 1].map((s) => (
          <mesh key={`st-${s}-${i}`} position={[s * bridgeW / 2, bridgeH / 2, z]}
            geometry={stanchionGeo} material={steelMat} />
        ));
      })}

      {/* ═══ GLASS WALLS (very subtle, not opaque) ═══ */}
      <mesh position={[-bridgeW / 2 + 0.02, bridgeH / 2, 0]}
        rotation={[0, Math.PI / 2, 0]} material={glassMat}>
        <planeGeometry args={[bridgeD, bridgeH]} />
      </mesh>
      <mesh position={[bridgeW / 2 - 0.02, bridgeH / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]} material={glassMat}>
        <planeGeometry args={[bridgeD, bridgeH]} />
      </mesh>

      {/* ═══ X-BRACE TRUSSES ═══ */}
      {Array.from({ length: 4 }, (_, i) => {
        const segZ = -bridgeD / 2 + bridgeD / 8 + i * bridgeD / 4;
        const angle = Math.atan2(bridgeH, bridgeD / 4);
        return [-1, 1].map((side) => (
          <group key={`xb-${side}-${i}`} position={[side * (bridgeW / 2 - 0.05), bridgeH / 2, segZ]}>
            <mesh rotation={[angle, 0, 0]} geometry={braceGeo} material={steelMat} />
            <mesh rotation={[-angle, 0, 0]} geometry={braceGeo} material={steelMat} />
          </group>
        ));
      })}

      {/* ═══ OVERHEAD LIGHTING (brighter, more of them) ═══ */}
      {[-6, -3, 0, 3, 6].map((z) => (
        <group key={`bl-${z}`}>
          <mesh position={[0, bridgeH - 0.15, z]} material={lightMat}>
            <boxGeometry args={[0.8, 0.06, 0.2]} />
          </mesh>
          <pointLight position={[0, bridgeH - 0.5, z]} color="#c0d8f0" intensity={2} distance={6} decay={2} />
        </group>
      ))}

      {/* ═══ TOWER CONNECTION STUBS ═══ */}
      {[-1, 1].map((end) => (
        <group key={`ts-${end}`} position={[0, 0, end * (bridgeD / 2 + 1.2)]}>
          {[-1, 1].map((side) => (
            <mesh key={`sw-${side}`} position={[side * 2.2, bridgeH / 2, 0]} material={wallStubMat}>
              <boxGeometry args={[0.4, bridgeH + 0.5, 2.5]} />
            </mesh>
          ))}
          <mesh position={[0, bridgeH + 0.15, 0]} material={topBeamMat}>
            <boxGeometry args={[5, 0.3, 2.5]} />
          </mesh>
          {/* Doorway frame */}
          {[-1, 1].map((side) => (
            <mesh key={`df-${side}`} position={[side * 1.2, bridgeH * 0.4, 0]} material={steelMat}>
              <boxGeometry args={[0.15, bridgeH * 0.8, 0.2]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
