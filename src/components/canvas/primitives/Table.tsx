"use client";

import * as THREE from "three";

export type TableVariant = "executiveDesk" | "fireTable" | "marbleConsole" | "coffeeTable";

const walnutMat = new THREE.MeshStandardMaterial({
  color: "#452d1e",
  roughness: 0.55,
  metalness: 0.05,
});

const blackGraniteMat = new THREE.MeshStandardMaterial({
  color: "#18191c",
  roughness: 0.3,
  metalness: 0.7,
});

const neroMarquinaMat = new THREE.MeshStandardMaterial({
  color: "#141517",
  roughness: 0.22,
  metalness: 0.4,
});

const oakMat = new THREE.MeshStandardMaterial({
  color: "#b08558",
  roughness: 0.6,
  metalness: 0.05,
});

const matteBlackMat = new THREE.MeshStandardMaterial({
  color: "#16181b",
  roughness: 0.35,
  metalness: 0.85,
});

const flameGlowMat = new THREE.MeshStandardMaterial({
  color: "#ff8c2b",
  emissive: new THREE.Color("#ffaa44"),
  emissiveIntensity: 4.5,
  toneMapped: false,
});

const flameBedMat = new THREE.MeshStandardMaterial({
  color: "#2a2722",
  roughness: 0.95,
  metalness: 0.1,
});

interface TableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  variant?: TableVariant;
  width?: number;
  height?: number;
  depth?: number;
}

export function Table({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  variant = "executiveDesk",
  width,
  height,
  depth,
}: TableProps) {
  if (variant === "executiveDesk") {
    const w = width ?? 3.2;
    const h = height ?? 0.76;
    const d = depth ?? 1.25;
    const topThick = 0.08;

    return (
      <group position={position} rotation={rotation}>
        {/* Desktop Top */}
        <mesh position={[0, h - topThick / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, topThick, d]} />
          <primitive object={walnutMat} attach="material" />
        </mesh>

        {/* Left Waterfall Leg */}
        <mesh position={[-w / 2 + topThick / 2, (h - topThick) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[topThick, h - topThick, d]} />
          <primitive object={walnutMat} attach="material" />
        </mesh>

        {/* Right Waterfall Leg */}
        <mesh position={[w / 2 - topThick / 2, (h - topThick) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[topThick, h - topThick, d]} />
          <primitive object={walnutMat} attach="material" />
        </mesh>

        {/* Recessed Modesty Panel (Matte Black Metal) */}
        <mesh position={[0, h * 0.48, -d * 0.36]} castShadow>
          <boxGeometry args={[w - topThick * 2, h * 0.65, 0.03]} />
          <primitive object={matteBlackMat} attach="material" />
        </mesh>
      </group>
    );
  }

  if (variant === "fireTable") {
    const w = width ?? 2.4;
    const h = height ?? 0.46;
    const d = depth ?? 1.0;

    return (
      <group position={position} rotation={rotation}>
        {/* Granite Body */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <primitive object={blackGraniteMat} attach="material" />
        </mesh>

        {/* Recessed Lava Rock Burner Bed */}
        <mesh position={[0, h - 0.04, 0]}>
          <boxGeometry args={[w * 0.75, 0.04, d * 0.4]} />
          <primitive object={flameBedMat} attach="material" />
        </mesh>

        {/* Linear Flame Mesh */}
        <mesh position={[0, h + 0.08, 0]}>
          <boxGeometry args={[w * 0.68, 0.12, 0.12]} />
          <primitive object={flameGlowMat} attach="material" />
        </mesh>

        {/* Warm Point Light Casting Dynamic Glow */}
        <pointLight
          position={[0, h + 0.25, 0]}
          color="#ffaa44"
          intensity={3.5}
          distance={5.5}
          decay={2}
        />
      </group>
    );
  }

  if (variant === "marbleConsole") {
    const w = width ?? 2.8;
    const h = height ?? 0.85;
    const d = depth ?? 0.48;
    const slabThick = 0.09;

    return (
      <group position={position} rotation={rotation}>
        {/* Console Top Slab */}
        <mesh position={[0, h - slabThick / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, slabThick, d]} />
          <primitive object={neroMarquinaMat} attach="material" />
        </mesh>

        {/* Solid Monolithic Plinth Leg */}
        <mesh position={[-w * 0.35, (h - slabThick) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.26, h - slabThick, d]} />
          <primitive object={neroMarquinaMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // coffeeTable
  const w = width ?? 1.6;
  const h = height ?? 0.38;
  const d = depth ?? 0.9;
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, h - 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.06, d]} />
        <primitive object={oakMat} attach="material" />
      </mesh>
      <mesh position={[-w * 0.36, (h - 0.06) / 2, 0]} castShadow>
        <boxGeometry args={[0.04, h - 0.06, d * 0.85]} />
        <primitive object={matteBlackMat} attach="material" />
      </mesh>
      <mesh position={[w * 0.36, (h - 0.06) / 2, 0]} castShadow>
        <boxGeometry args={[0.04, h - 0.06, d * 0.85]} />
        <primitive object={matteBlackMat} attach="material" />
      </mesh>
    </group>
  );
}
