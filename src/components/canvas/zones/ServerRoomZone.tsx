"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildServerRackTexture, buildMetalGridFloorTexture } from "@/lib/build-tower-texture";

// ─── Shared materials ───
const darkWallMat = new THREE.MeshStandardMaterial({ color: "#10141c", metalness: 0.3, roughness: 0.7 });
const ceilingMat = new THREE.MeshStandardMaterial({ color: "#0e1218", metalness: 0.5, roughness: 0.6 });
const rackBodyMat = new THREE.MeshStandardMaterial({ color: "#0c1018", metalness: 0.6, roughness: 0.4 });
const cableTrayMat = new THREE.MeshStandardMaterial({ color: "#141c28", metalness: 0.7, roughness: 0.3 });
const ledBlueMat = new THREE.MeshStandardMaterial({
  color: "#0066ff", emissive: new THREE.Color("#0055dd"),
  emissiveIntensity: 5, toneMapped: false,
});
const holoMat = new THREE.MeshStandardMaterial({
  color: "#00aaff", emissive: new THREE.Color("#0088dd"),
  emissiveIntensity: 2.5, transparent: true, opacity: 0.4,
  toneMapped: false, side: THREE.DoubleSide,
});
const holoBarMat = new THREE.MeshStandardMaterial({
  color: "#00ddff", emissive: new THREE.Color("#00bbff"),
  emissiveIntensity: 4, toneMapped: false,
});

const LED_COLORS = ["#00ff55", "#00ccff", "#ff4400", "#00ff55"];
const ledMats = LED_COLORS.map(
  (c) => new THREE.MeshStandardMaterial({
    color: c, emissive: new THREE.Color(c),
    emissiveIntensity: 3, toneMapped: false,
  })
);

// ─── Shared geometries ───
const rackGeo = new THREE.BoxGeometry(0.9, 3.2, 0.7);
const ledGeo = new THREE.SphereGeometry(0.035, 6, 6);

/**
 * Zone 3: Server / Data Room
 * Camera path: z ≈ -19→-28.5, y ≈ 1.6-1.8
 */
export function ServerRoomZone() {
  const rackTex = useMemo(() => buildServerRackTexture(), []);
  const floorTex = useMemo(() => {
    const t = buildMetalGridFloorTexture();
    t.repeat.set(6, 10);
    return t;
  }, []);

  const rackPanelMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: rackTex, emissive: new THREE.Color("#ffffff"),
    emissiveMap: rackTex, emissiveIntensity: 0.8,
  }), [rackTex]);

  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: floorTex, roughness: 0.4, metalness: 0.7, color: "#18202a",
  }), [floorTex]);

  const ledRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const t = clock.getElapsedTime();
    ledRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = Math.sin(t * 2 + i * 1.7) > 0.3 ? 3 : 0.2;
      }
    });
  });

  const roomW = 8, roomH = 4.5, roomD = 14;
  const floorY = -0.3;
  // Camera path center z ≈ -23, spans -19 to -28.5
  const zCenter = -23.5;

  const rackPositions: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const z = -roomD / 2 + 1.5 + i * 2;
    rackPositions.push([-2.5, z], [2.5, z]);
  }

  return (
    <group position={[0, floorY, zCenter]}>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={floorMat}>
        <planeGeometry args={[roomW, roomD]} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, roomH, 0]} material={ceilingMat}>
        <boxGeometry args={[roomW, 0.25, roomD]} />
      </mesh>

      {/* Walls (thick) */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} material={darkWallMat}>
        <boxGeometry args={[0.4, roomH, roomD]} />
      </mesh>
      <mesh position={[roomW / 2, roomH / 2, 0]} material={darkWallMat}>
        <boxGeometry args={[0.4, roomH, roomD]} />
      </mesh>
      <mesh position={[0, roomH / 2, -roomD / 2]} material={darkWallMat}>
        <boxGeometry args={[roomW, roomH, 0.4]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`fw-${side}`} position={[side * 2.8, roomH / 2, roomD / 2]} material={darkWallMat}>
          <boxGeometry args={[roomW / 2 - 1.2, roomH, 0.4]} />
        </mesh>
      ))}

      {/* Server Racks */}
      {rackPositions.map(([x, z], i) => (
        <group key={`rack-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 1.6, 0]} castShadow geometry={rackGeo} material={rackBodyMat} />
          <mesh position={[x > 0 ? -0.46 : 0.46, 1.6, 0]} material={rackPanelMat}>
            <planeGeometry args={[0.7, 3.2]} />
          </mesh>
        </group>
      ))}

      {/* Blinking LEDs */}
      <group ref={ledRef}>
        {rackPositions.map(([x, z], i) => (
          <mesh key={`led-${i}`}
            position={[x > 0 ? x - 0.47 : x + 0.47, 2.5, z]}
            geometry={ledGeo} material={ledMats[i % 4]}
          />
        ))}
      </group>

      {/* Floor-level blue LED strips */}
      {[-1, 1].map((side) => (
        <mesh key={`strip-${side}`} position={[side * 1.3, 0.06, 0]} material={ledBlueMat}>
          <boxGeometry args={[0.05, 0.04, roomD * 0.9]} />
        </mesh>
      ))}
      {/* LED strip glow lights */}
      {[-1, 1].map((side) =>
        [-5, -2, 1, 4].map((z) => (
          <pointLight key={`fl-${side}-${z}`} position={[side * 1.3, 0.3, z]}
            color="#0055ff" intensity={1} distance={4} decay={2} />
        ))
      )}

      {/* Cable trays */}
      {[-1.5, 0, 1.5].map((x) => (
        <mesh key={`ct-${x}`} position={[x, roomH - 0.3, 0]} material={cableTrayMat}>
          <boxGeometry args={[0.4, 0.12, roomD * 0.85]} />
        </mesh>
      ))}

      {/* Holographic data displays */}
      {[-3.5, 0, 3.5].map((z) => (
        <group key={`holo-${z}`} position={[0, 2.5, z]}>
          <mesh material={holoMat}>
            <boxGeometry args={[1.4, 1, 0.01]} />
          </mesh>
          {Array.from({ length: 6 }, (_, j) => {
            const bh = 0.15 + Math.sin(z * 3 + j * 1.2) * 0.15 + 0.25;
            return (
              <mesh key={j} position={[-0.45 + j * 0.18, -0.3 + bh / 2, 0.015]} material={holoBarMat}>
                <boxGeometry args={[0.1, bh, 0.006]} />
              </mesh>
            );
          })}
          {/* Hologram glow */}
          <pointLight position={[0, 0, 0.5]} color="#0088dd" intensity={1} distance={3} decay={2} />
        </group>
      ))}

      {/* Ceiling dim blue lights */}
      {[-4, -1, 2, 5].map((z) => (
        <pointLight key={`ceil-${z}`} position={[0, roomH - 0.5, z]}
          color="#1a3060" intensity={0.8} distance={5} decay={2} />
      ))}
    </group>
  );
}
