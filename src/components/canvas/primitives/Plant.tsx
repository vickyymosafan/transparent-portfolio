"use client";

import * as THREE from "three";

export type PlantType = "cloudPine" | "bambooCluster" | "fiddleLeafFig" | "ikebanaVase";

const planterPotMat = new THREE.MeshStandardMaterial({
  color: "#24272c",
  roughness: 0.78,
  metalness: 0.1,
});

const trunkMat = new THREE.MeshStandardMaterial({
  color: "#38291e",
  roughness: 0.88,
  metalness: 0.05,
});

const foliageMat = new THREE.MeshStandardMaterial({
  color: "#1e3820",
  roughness: 0.82,
  metalness: 0.04,
});

const bambooStalkMat = new THREE.MeshStandardMaterial({
  color: "#4a6838",
  roughness: 0.68,
  metalness: 0.05,
});

const bambooLeafMat = new THREE.MeshStandardMaterial({
  color: "#2c4a22",
  roughness: 0.8,
  metalness: 0.04,
});

const ceramicVaseMat = new THREE.MeshStandardMaterial({
  color: "#1c1a18",
  roughness: 0.5,
  metalness: 0.15,
});

const soilMat = new THREE.MeshStandardMaterial({
  color: "#141312",
  roughness: 0.95,
  metalness: 0.02,
});

interface PlantProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  type?: PlantType;
  scale?: number;
}

export function Plant({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  type = "cloudPine",
  scale = 1,
}: PlantProps) {
  if (type === "cloudPine") {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Charcoal Concrete Planter Pot */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.9, 1.2]} />
          <primitive object={planterPotMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[1.14, 0.04, 1.14]} />
          <primitive object={soilMat} attach="material" />
        </mesh>

        {/* Sculptural Twisted Trunk */}
        <mesh position={[0, 1.4, 0]} rotation={[0, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.07, 0.12, 1.1, 8]} />
          <primitive object={trunkMat} attach="material" />
        </mesh>
        <mesh position={[0.2, 1.9, 0.1]} rotation={[0.3, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.9, 8]} />
          <primitive object={trunkMat} attach="material" />
        </mesh>
        <mesh position={[-0.2, 1.8, -0.1]} rotation={[-0.2, 0, 0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.07, 0.8, 8]} />
          <primitive object={trunkMat} attach="material" />
        </mesh>

        {/* Cloud Pads (Flattened Sculpted Spheres) */}
        <mesh position={[0.45, 2.2, 0.2]} scale={[1.4, 0.5, 1.2]} castShadow>
          <sphereGeometry args={[0.42, 10, 8]} />
          <primitive object={foliageMat} attach="material" />
        </mesh>
        <mesh position={[-0.4, 2.1, -0.15]} scale={[1.3, 0.45, 1.1]} castShadow>
          <sphereGeometry args={[0.36, 10, 8]} />
          <primitive object={foliageMat} attach="material" />
        </mesh>
        <mesh position={[0.1, 2.55, 0.05]} scale={[1.2, 0.4, 1.0]} castShadow>
          <sphereGeometry args={[0.32, 10, 8]} />
          <primitive object={foliageMat} attach="material" />
        </mesh>
      </group>
    );
  }

  if (type === "bambooCluster") {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Stalks */}
        {[-0.22, 0, 0.22].map((x, i) => (
          <group key={i} position={[x, 0, (i % 2 === 0 ? 0.08 : -0.08)]}>
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.035, 3.6, 6]} />
              <primitive object={bambooStalkMat} attach="material" />
            </mesh>
            {/* Foliage sprays */}
            <mesh position={[0.08, 2.8 + i * 0.2, 0]} scale={[1.2, 0.5, 0.8]} castShadow>
              <sphereGeometry args={[0.26, 8, 6]} />
              <primitive object={bambooLeafMat} attach="material" />
            </mesh>
            <mesh position={[-0.08, 3.3, 0]} scale={[1.1, 0.45, 0.7]} castShadow>
              <sphereGeometry args={[0.22, 8, 6]} />
              <primitive object={bambooLeafMat} attach="material" />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (type === "fiddleLeafFig") {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Tall Minimalist Ceramic Pot */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.24, 0.96, 16]} />
          <primitive object={planterPotMat} attach="material" />
        </mesh>

        {/* Central Stem */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 1.4, 8]} />
          <primitive object={trunkMat} attach="material" />
        </mesh>

        {/* Sculptural Broad Leaves */}
        {[
          { y: 1.2, rotY: 0, rotZ: 0.4 },
          { y: 1.5, rotY: 1.8, rotZ: 0.35 },
          { y: 1.8, rotY: 3.5, rotZ: 0.4 },
          { y: 2.1, rotY: 5.0, rotZ: 0.3 },
          { y: 2.3, rotY: 0.8, rotZ: 0.2 },
        ].map((leaf, idx) => (
          <mesh
            key={idx}
            position={[0, leaf.y, 0]}
            rotation={[0, leaf.rotY, leaf.rotZ]}
            scale={[1.2, 0.1, 0.7]}
            castShadow
          >
            <boxGeometry args={[0.42, 0.02, 0.28]} />
            <primitive object={foliageMat} attach="material" />
          </mesh>
        ))}
      </group>
    );
  }

  // Ikebana Vase with dried botanical branch
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Matte Black Stoneware Vase */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.18, 16, 12]} />
        <primitive object={ceramicVaseMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.16, 16]} />
        <primitive object={ceramicVaseMat} attach="material" />
      </mesh>

      {/* Asymmetrical Dried Twig Branch */}
      <mesh position={[0.08, 0.65, 0]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.008, 0.015, 0.6, 6]} />
        <primitive object={trunkMat} attach="material" />
      </mesh>
      <mesh position={[0.22, 0.9, 0]} rotation={[0, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.005, 0.008, 0.4, 6]} />
        <primitive object={trunkMat} attach="material" />
      </mesh>
    </group>
  );
}
