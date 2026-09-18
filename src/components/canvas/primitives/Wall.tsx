"use client";

import * as THREE from "three";

export type WallVariant = "concrete" | "travertine" | "plaster" | "darkSlate" | "drywall";

const wallMaterials: Record<WallVariant, THREE.MeshStandardMaterial> = {
  concrete: new THREE.MeshStandardMaterial({
    color: "#7e858f",
    roughness: 0.88,
    metalness: 0.08,
  }),
  travertine: new THREE.MeshStandardMaterial({
    color: "#d4c8b6",
    roughness: 0.8,
    metalness: 0.04,
  }),
  plaster: new THREE.MeshStandardMaterial({
    color: "#ebe6dd",
    roughness: 0.9,
    metalness: 0.02,
  }),
  darkSlate: new THREE.MeshStandardMaterial({
    color: "#282a30",
    roughness: 0.85,
    metalness: 0.12,
  }),
  drywall: new THREE.MeshStandardMaterial({
    color: "#ded9cd",
    roughness: 0.86,
    metalness: 0.02,
  }),
};

interface WallProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  variant?: WallVariant;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export function Wall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size,
  variant = "concrete",
  castShadow = true,
  receiveShadow = true,
}: WallProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      material={wallMaterials[variant]}
    >
      <boxGeometry args={size} />
    </mesh>
  );
}
