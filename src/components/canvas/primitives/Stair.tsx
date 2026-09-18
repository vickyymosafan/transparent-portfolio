"use client";

import { useMemo } from "react";
import * as THREE from "three";

export type StairMaterial = "oak" | "concrete" | "travertine" | "basalt";

const stairMaterials: Record<StairMaterial, THREE.MeshStandardMaterial> = {
  oak: new THREE.MeshStandardMaterial({
    color: "#b08253",
    roughness: 0.55,
    metalness: 0.05,
  }),
  concrete: new THREE.MeshStandardMaterial({
    color: "#7e858f",
    roughness: 0.85,
    metalness: 0.08,
  }),
  travertine: new THREE.MeshStandardMaterial({
    color: "#d1c5b4",
    roughness: 0.78,
    metalness: 0.04,
  }),
  basalt: new THREE.MeshStandardMaterial({
    color: "#22252a",
    roughness: 0.7,
    metalness: 0.12,
  }),
};

const steelStringerMat = new THREE.MeshStandardMaterial({
  color: "#181a1c",
  roughness: 0.35,
  metalness: 0.85,
});

const glassBalustradeMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: 0.35,
  roughness: 0.05,
  metalness: 0.9,
  side: THREE.DoubleSide,
});

const bronzeRailMat = new THREE.MeshStandardMaterial({
  color: "#4a3c2e",
  roughness: 0.3,
  metalness: 0.8,
});

interface StairProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  stepCount?: number;
  stepWidth?: number;
  stepDepth?: number;
  stepRise?: number;
  treadThickness?: number;
  variant?: StairMaterial;
  hasBalustrade?: boolean;
  hasHandrail?: boolean;
  isOpenTread?: boolean;
}

export function Stair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  stepCount = 10,
  stepWidth = 1.3,
  stepDepth = 0.32,
  stepRise = 0.18,
  treadThickness = 0.07,
  variant = "oak",
  hasBalustrade = true,
  hasHandrail = true,
  isOpenTread = true,
}: StairProps) {
  const treadMat = stairMaterials[variant];

  const totalLength = stepCount * stepDepth;
  const totalHeight = stepCount * stepRise;

  const steps = useMemo(() => {
    return Array.from({ length: stepCount }, (_, i) => ({
      index: i,
      y: (i + 0.5) * stepRise,
      z: -i * stepDepth,
    }));
  }, [stepCount, stepDepth, stepRise]);

  return (
    <group position={position} rotation={rotation}>
      {/* Structural Central / Wall Stringer for Floating Treads */}
      <mesh
        position={[0, totalHeight / 2, -totalLength / 2 + stepDepth / 2]}
        rotation={[Math.atan2(totalHeight, totalLength), 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.08, 0.14, Math.hypot(totalLength, totalHeight)]} />
        <primitive object={steelStringerMat} attach="material" />
      </mesh>

      {/* Individual Step Treads */}
      {steps.map((s) => (
        <group key={s.index} position={[0, s.y, s.z]}>
          {/* Tread */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[stepWidth, treadThickness, stepDepth]} />
            <primitive object={treadMat} attach="material" />
          </mesh>

          {/* Optional Closed Riser */}
          {!isOpenTread && (
            <mesh
              position={[0, -stepRise / 2, -stepDepth / 2 + 0.02]}
              castShadow
            >
              <boxGeometry args={[stepWidth, stepRise, 0.03]} />
              <primitive object={steelStringerMat} attach="material" />
            </mesh>
          )}
        </group>
      ))}

      {/* Glass Balustrade on Outer Edge */}
      {hasBalustrade && (
        <group position={[stepWidth / 2 + 0.02, totalHeight / 2 + 0.45, -totalLength / 2 + stepDepth / 2]}>
          <mesh rotation={[Math.atan2(totalHeight, totalLength), 0, 0]}>
            <boxGeometry args={[0.02, 0.9, Math.hypot(totalLength, totalHeight)]} />
            <primitive object={glassBalustradeMat} attach="material" />
          </mesh>

          {/* Handrail on top of glass */}
          {hasHandrail && (
            <mesh
              position={[0, 0.46, 0]}
              rotation={[Math.atan2(totalHeight, totalLength), 0, 0]}
              castShadow
            >
              <boxGeometry args={[0.05, 0.05, Math.hypot(totalLength, totalHeight) + 0.2]} />
              <primitive object={bronzeRailMat} attach="material" />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}
