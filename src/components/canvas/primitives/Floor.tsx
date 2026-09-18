"use client";

import * as THREE from "three";

export type FloorVariant =
  | "oak"
  | "basalt"
  | "terrazzo"
  | "gravel"
  | "teak"
  | "lawn"
  | "microcement";

const floorMaterials: Record<FloorVariant, THREE.MeshStandardMaterial> = {
  oak: new THREE.MeshStandardMaterial({
    color: "#c29a6b",
    roughness: 0.55,
    metalness: 0.05,
  }),
  basalt: new THREE.MeshStandardMaterial({
    color: "#202328",
    roughness: 0.65,
    metalness: 0.15,
  }),
  terrazzo: new THREE.MeshStandardMaterial({
    color: "#282a30",
    roughness: 0.28,
    metalness: 0.45,
  }),
  gravel: new THREE.MeshStandardMaterial({
    color: "#545963",
    roughness: 0.96,
    metalness: 0.04,
  }),
  teak: new THREE.MeshStandardMaterial({
    color: "#b08558",
    roughness: 0.62,
    metalness: 0.05,
  }),
  lawn: new THREE.MeshStandardMaterial({
    color: "#222c22",
    roughness: 0.92,
    metalness: 0.04,
  }),
  microcement: new THREE.MeshStandardMaterial({
    color: "#c4baa9",
    roughness: 0.72,
    metalness: 0.06,
  }),
};

interface FloorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  variant?: FloorVariant;
  receiveShadow?: boolean;
}

export function Floor({
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0],
  size,
  variant = "basalt",
  receiveShadow = true,
}: FloorProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      receiveShadow={receiveShadow}
      material={floorMaterials[variant]}
    >
      <planeGeometry args={size} />
    </mesh>
  );
}
