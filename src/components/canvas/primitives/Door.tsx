"use client";

import * as THREE from "three";

export type DoorVariant = "walnutPivot" | "glassPivot" | "bronzeElevator";

const walnutMaterial = new THREE.MeshStandardMaterial({
  color: "#382419",
  roughness: 0.62,
  metalness: 0.05,
});

const frameMaterial = new THREE.MeshStandardMaterial({
  color: "#16181b",
  roughness: 0.35,
  metalness: 0.85,
});

const bronzeMaterial = new THREE.MeshStandardMaterial({
  color: "#7a6245",
  roughness: 0.3,
  metalness: 0.85,
});

const glassMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: 0.35,
  roughness: 0.04,
  metalness: 0.9,
  side: THREE.DoubleSide,
});

interface DoorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  variant?: DoorVariant;
  pivotAngle?: number;
}

export function Door({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.4,
  height = 3.4,
  variant = "walnutPivot",
  pivotAngle = -0.3,
}: DoorProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer Door Frame Jambs */}
      <mesh position={[-width / 2 - 0.04, height / 2, 0]} material={frameMaterial}>
        <boxGeometry args={[0.08, height, 0.2]} />
      </mesh>
      <mesh position={[width / 2 + 0.04, height / 2, 0]} material={frameMaterial}>
        <boxGeometry args={[0.08, height, 0.2]} />
      </mesh>
      <mesh position={[0, height + 0.04, 0]} material={frameMaterial}>
        <boxGeometry args={[width + 0.16, 0.08, 0.2]} />
      </mesh>

      {/* Pivoting Door Leaf */}
      <group position={[width / 2 - 0.2, 0, 0]} rotation={[0, pivotAngle, 0]}>
        <mesh
          position={[-width / 2 + 0.2, height / 2, 0]}
          castShadow
          receiveShadow
          material={
            variant === "walnutPivot"
              ? walnutMaterial
              : variant === "glassPivot"
              ? glassMaterial
              : bronzeMaterial
          }
        >
          <boxGeometry args={[width, height, 0.1]} />
        </mesh>

        {/* Minimalist Full-Height Vertical Bronze Pull Handle */}
        <mesh position={[-width + 0.45, height / 2, 0.08]} material={bronzeMaterial}>
          <boxGeometry args={[0.035, height * 0.65, 0.05]} />
        </mesh>
        <mesh position={[-width + 0.45, height / 2, -0.08]} material={bronzeMaterial}>
          <boxGeometry args={[0.035, height * 0.65, 0.05]} />
        </mesh>
      </group>
    </group>
  );
}
