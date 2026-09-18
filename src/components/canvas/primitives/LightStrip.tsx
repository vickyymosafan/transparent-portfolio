"use client";

import * as THREE from "three";

const warmLedMat = new THREE.MeshStandardMaterial({
  color: "#fff8ec",
  emissive: new THREE.Color("#ffdca0"),
  emissiveIntensity: 3.4,
  toneMapped: false,
});

interface LightStripProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  width?: number;
  height?: number;
  axis?: "x" | "z";
  hasLight?: boolean;
  lightIntensity?: number;
  lightDistance?: number;
  lightCount?: number;
}

export function LightStrip({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  length,
  width = 0.05,
  height = 0.03,
  axis = "z",
  hasLight = true,
  lightIntensity = 0.8,
  lightDistance = 4.0,
  lightCount = 3,
}: LightStripProps) {
  const lightOffsets = Array.from({ length: lightCount }, (_, i) => {
    return -length / 2 + (length / (lightCount + 1)) * (i + 1);
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Luminous LED Strip Bar */}
      <mesh material={warmLedMat}>
        <boxGeometry
          args={[
            axis === "x" ? length : width,
            height,
            axis === "z" ? length : width,
          ]}
        />
      </mesh>

      {/* Discrete Warm Point Light Fills */}
      {hasLight &&
        lightOffsets.map((offset, idx) => (
          <pointLight
            key={`ls-pt-${idx}`}
            position={[axis === "x" ? offset : 0, 0.15, axis === "z" ? offset : 0]}
            color="#ffe0a3"
            intensity={lightIntensity}
            distance={lightDistance}
            decay={2}
          />
        ))}
    </group>
  );
}
