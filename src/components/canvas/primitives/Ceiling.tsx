"use client";

import * as THREE from "three";

export type CeilingVariant = "plaster" | "concrete" | "oak";

const ceilingMaterials: Record<CeilingVariant, THREE.MeshStandardMaterial> = {
  plaster: new THREE.MeshStandardMaterial({
    color: "#f5f2ec",
    roughness: 0.9,
    metalness: 0.02,
  }),
  concrete: new THREE.MeshStandardMaterial({
    color: "#848a94",
    roughness: 0.88,
    metalness: 0.06,
  }),
  oak: new THREE.MeshStandardMaterial({
    color: "#ab7c4e",
    roughness: 0.6,
    metalness: 0.05,
  }),
};

interface CeilingProps {
  position?: [number, number, number];
  size: [number, number, number];
  variant?: CeilingVariant;
}

export function Ceiling({
  position = [0, 4.8, 0],
  size,
  variant = "plaster",
}: CeilingProps) {
  return (
    <mesh position={position} material={ceilingMaterials[variant]}>
      <boxGeometry args={size} />
    </mesh>
  );
}
