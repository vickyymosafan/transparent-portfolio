"use client";

import { useMemo } from "react";
import * as THREE from "three";

export type WoodSlatVariant = "walnut" | "oak";

const woodMaterials: Record<WoodSlatVariant, THREE.MeshStandardMaterial> = {
  walnut: new THREE.MeshStandardMaterial({
    color: "#462e1e",
    roughness: 0.58,
    metalness: 0.05,
  }),
  oak: new THREE.MeshStandardMaterial({
    color: "#a47348",
    roughness: 0.6,
    metalness: 0.05,
  }),
};

const backingMaterial = new THREE.MeshStandardMaterial({
  color: "#18191c",
  roughness: 0.9,
  metalness: 0.05,
});

interface WoodSlatWallProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
  slatWidth?: number;
  slatDepth?: number;
  slatSpacing?: number;
  variant?: WoodSlatVariant;
  axis?: "x" | "z";
}

export function WoodSlatWall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width,
  height,
  slatWidth = 0.06,
  slatDepth = 0.08,
  slatSpacing = 0.18,
  variant = "walnut",
  axis = "x",
}: WoodSlatWallProps) {
  const offsets = useMemo(() => {
    const list: number[] = [];
    const half = width / 2;
    for (let pos = -half + slatSpacing / 2; pos <= half - slatSpacing / 2; pos += slatSpacing) {
      list.push(pos);
    }
    return list;
  }, [width, slatSpacing]);

  return (
    <group position={position} rotation={rotation}>
      {/* Dark Backing Plane */}
      <mesh position={[0, height / 2, -slatDepth / 2]} material={backingMaterial}>
        <boxGeometry args={[axis === "x" ? width : 0.04, height, axis === "z" ? width : 0.04]} />
      </mesh>

      {/* Vertical Slats */}
      {offsets.map((offset, idx) => (
        <mesh
          key={`slat-${idx}`}
          position={[
            axis === "x" ? offset : 0,
            height / 2,
            axis === "z" ? offset : 0,
          ]}
          castShadow
          material={woodMaterials[variant]}
        >
          <boxGeometry
            args={[
              axis === "x" ? slatWidth : slatDepth,
              height,
              axis === "z" ? slatWidth : slatDepth,
            ]}
          />
        </mesh>
      ))}
    </group>
  );
}
