"use client";

import * as THREE from "three";

export type BenchMaterial = "travertine" | "walnut" | "concrete" | "neroMarquina";

const benchMaterials: Record<BenchMaterial, THREE.MeshStandardMaterial> = {
  travertine: new THREE.MeshStandardMaterial({
    color: "#c8beaf",
    roughness: 0.75,
    metalness: 0.05,
  }),
  walnut: new THREE.MeshStandardMaterial({
    color: "#38251b",
    roughness: 0.55,
    metalness: 0.05,
  }),
  concrete: new THREE.MeshStandardMaterial({
    color: "#7e858f",
    roughness: 0.85,
    metalness: 0.08,
  }),
  neroMarquina: new THREE.MeshStandardMaterial({
    color: "#18191c",
    roughness: 0.25,
    metalness: 0.35,
  }),
};

const matteBlackMetalMat = new THREE.MeshStandardMaterial({
  color: "#16181b",
  roughness: 0.35,
  metalness: 0.85,
});

const underGlowMat = new THREE.MeshStandardMaterial({
  color: "#fff8ec",
  emissive: new THREE.Color("#ffdca0"),
  emissiveIntensity: 3.2,
  toneMapped: false,
});

interface BenchProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  slabThickness?: number;
  variant?: BenchMaterial;
  legStyle?: "monolithic" | "metalLegs" | "waterfall";
  hasUnderGlow?: boolean;
}

export function Bench({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.4,
  height = 0.44,
  depth = 0.58,
  slabThickness = 0.12,
  variant = "travertine",
  legStyle = "monolithic",
  hasUnderGlow = false,
}: BenchProps) {
  const mat = benchMaterials[variant];

  return (
    <group position={position} rotation={rotation}>
      {/* Top Slab */}
      <mesh
        position={[0, height - slabThickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, slabThickness, depth]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Under-glow recessed runner */}
      {hasUnderGlow && (
        <mesh position={[0, height - slabThickness - 0.01, 0]}>
          <boxGeometry args={[width * 0.9, 0.02, depth * 0.7]} />
          <primitive object={underGlowMat} attach="material" />
        </mesh>
      )}

      {/* Support Legs */}
      {legStyle === "monolithic" && (
        <>
          {/* Solid stone/wood support blocks inset from ends */}
          <mesh
            position={[-width * 0.34, (height - slabThickness) / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.22, height - slabThickness, depth * 0.85]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh
            position={[width * 0.34, (height - slabThickness) / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.22, height - slabThickness, depth * 0.85]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </>
      )}

      {legStyle === "waterfall" && (
        <>
          {/* Waterfall edges folding directly to the floor */}
          <mesh
            position={[-width / 2 + slabThickness / 2, (height - slabThickness) / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[slabThickness, height - slabThickness, depth]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh
            position={[width / 2 - slabThickness / 2, (height - slabThickness) / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[slabThickness, height - slabThickness, depth]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </>
      )}

      {legStyle === "metalLegs" && (
        <>
          {/* Slender architectural matte black metal sled frames */}
          <mesh
            position={[-width * 0.36, (height - slabThickness) / 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, height - slabThickness, depth * 0.9]} />
            <primitive object={matteBlackMetalMat} attach="material" />
          </mesh>
          <mesh
            position={[width * 0.36, (height - slabThickness) / 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, height - slabThickness, depth * 0.9]} />
            <primitive object={matteBlackMetalMat} attach="material" />
          </mesh>
        </>
      )}
    </group>
  );
}
