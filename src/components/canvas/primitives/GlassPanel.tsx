"use client";

import * as THREE from "three";

const glassMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: 0.24,
  roughness: 0.04,
  metalness: 0.9,
  side: THREE.DoubleSide,
});

const frameMaterial = new THREE.MeshStandardMaterial({
  color: "#16181b",
  roughness: 0.35,
  metalness: 0.85,
});

interface GlassPanelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
  thickness?: number;
  hasFrame?: boolean;
}

export function GlassPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width,
  height,
  thickness = 0.04,
  hasFrame = true,
}: GlassPanelProps) {
  const frameThickness = 0.06;

  return (
    <group position={position} rotation={rotation}>
      {/* Clear Glass Pane */}
      <mesh material={glassMaterial}>
        <boxGeometry args={[width, height, thickness]} />
      </mesh>

      {/* Matte Black Perimeter Frame */}
      {hasFrame && (
        <>
          {/* Top Frame */}
          <mesh position={[0, height / 2 - frameThickness / 2, 0]} material={frameMaterial}>
            <boxGeometry args={[width, frameThickness, thickness * 1.5]} />
          </mesh>
          {/* Bottom Frame */}
          <mesh position={[0, -height / 2 + frameThickness / 2, 0]} material={frameMaterial}>
            <boxGeometry args={[width, frameThickness, thickness * 1.5]} />
          </mesh>
          {/* Left Frame */}
          <mesh position={[-width / 2 + frameThickness / 2, 0, 0]} material={frameMaterial}>
            <boxGeometry args={[frameThickness, height, thickness * 1.5]} />
          </mesh>
          {/* Right Frame */}
          <mesh position={[width / 2 - frameThickness / 2, 0, 0]} material={frameMaterial}>
            <boxGeometry args={[frameThickness, height, thickness * 1.5]} />
          </mesh>
        </>
      )}
    </group>
  );
}
