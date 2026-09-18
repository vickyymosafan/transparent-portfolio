"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import {
  getHonedBasaltMat,
  getEuropeanOakMat,
  getBoardFormedConcreteMat,
  getPebblesMat,
  architecturalGlassMat,
  matteBlackMetalMat,
  warmCoveLedMat,
  bambooStalkMat,
  brushedBrassMat,
} from "@/lib/architectural-materials";

useGLTF.preload("/models/garden_corridor_master.glb");

const bambooNodeMat = new THREE.MeshStandardMaterial({
  color: "#283c1e",
  roughness: 0.65,
  metalness: 0.04,
});

const bambooFoliageMat = new THREE.MeshStandardMaterial({
  color: "#285620",
  roughness: 0.42,
  metalness: 0.02,
  side: THREE.DoubleSide,
});

const walnutBenchMat = new THREE.MeshStandardMaterial({
  color: "#2e1e15",
  roughness: 0.48,
  metalness: 0.03,
});

const zenMossMat = new THREE.MeshStandardMaterial({
  color: "#28441c",
  roughness: 0.88,
  metalness: 0.02,
});

export function SkybridgeZone() {
  const gltf = useGLTF("/models/garden_corridor_master.glb");

  const darkRiverPebbleMat = useMemo(() => {
    const mat = getPebblesMat().clone();
    mat.color = new THREE.Color("#22252a");
    mat.roughness = 0.65;
    mat.metalness = 0.12;
    return mat;
  }, []);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    const toRemove: THREE.Object3D[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Light).isLight) {
        toRemove.push(child);
        return;
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const originalMat = mesh.material;
        const matName = Array.isArray(originalMat)
          ? originalMat[0]?.name
          : originalMat?.name;

        switch (matName) {
          case "Mat_Dark_Cleft_Slate":
            mesh.material = getHonedBasaltMat();
            break;
          case "Mat_Interior_Oak":
            mesh.material = getEuropeanOakMat();
            break;
          case "Mat_Dark_Walnut_PBR":
            mesh.material = walnutBenchMat;
            break;
          case "Mat_Board_Formed_Concrete":
            mesh.material = getBoardFormedConcreteMat();
            break;
          case "Mat_Black_Metal":
            mesh.material = matteBlackMetalMat;
            break;
          case "Mat_Clear_Glass":
            mesh.material = architecturalGlassMat;
            break;
          case "Mat_LED_Amber_Gold":
            mesh.material = warmCoveLedMat;
            break;
          case "Mat_Pea_Gravel_Dark":
            mesh.material = darkRiverPebbleMat;
            break;
          case "Mat_Brushed_Brass":
            mesh.material = brushedBrassMat;
            break;
          case "Mat_Bamboo_Stalk":
            mesh.material = bambooStalkMat;
            break;
          case "Mat_Bamboo_Node":
            mesh.material = bambooNodeMat;
            break;
          case "Mat_Bamboo_Leaf":
            mesh.material = bambooFoliageMat;
            break;
          case "Mat_Zen_Moss":
            mesh.material = zenMossMat;
            break;
          default:
            if (
              mesh.material &&
              (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial
            ) {
              const stdMat = mesh.material as THREE.MeshStandardMaterial;
              stdMat.envMapIntensity = 0.8;
            }
            break;
        }
      }
    });

    toRemove.forEach((l) => l.parent?.remove(l));
    return clone;
  }, [gltf, darkRiverPebbleMat]);

  return (
    <group position={[-1.75, 0, 3.56]}>
      <primitive object={scene} />

      {/* ═══ CALIBRATED ARCHITECTURAL LIGHTING (RESTFUL & DIFFUSE) ═══ */}
      {/* 1. Left Baseboard Indirect LED Wash (Tucked in trough, no specular hot-spots) */}
      {[20.5, 24.5, 28.5].map((ly, idx) => (
        <pointLight
          key={`led-strip-l-${idx}`}
          position={[0.38, 0.14, -ly]}
          color="#ffba6e"
          intensity={0.45}
          distance={3.8}
          decay={2.0}
        />
      ))}

      {/* 2. Right Baseboard Indirect LED Wash */}
      {[20.5, 24.5, 28.5].map((ly, idx) => (
        <pointLight
          key={`led-strip-r-${idx}`}
          position={[3.12, 0.14, -ly]}
          color="#ffba6e"
          intensity={0.45}
          distance={3.8}
          decay={2.0}
        />
      ))}

      {/* 3. Ceiling Center Magnetic Track Downlights (Warm ivory accents) */}
      {[19.5, 22.5, 25.5, 28.5].map((ty, idx) => (
        <pointLight
          key={`track-spot-${idx}`}
          position={[1.75, 3.84, -ty]}
          color="#fff2de"
          intensity={0.42}
          distance={5.0}
          decay={1.8}
        />
      ))}

      {/* 4. Left Courtyard Dusk Skylight Filtered Through Bamboo */}
      <pointLight
        position={[-1.6, 4.4, -24.2]}
        color="#8aa8cc"
        intensity={1.2}
        distance={9.0}
        decay={1.8}
      />

      {/* 5. Left Courtyard Garden Uplights (Brass well lights on bamboo/rocks) */}
      {[20.2, 24.2, 28.2].map((uy, idx) => (
        <pointLight
          key={`uplight-l-${idx}`}
          position={[-0.85, 0.30, -uy]}
          color="#ffd699"
          intensity={0.65}
          distance={4.0}
          decay={1.8}
        />
      ))}

      {/* 6. Right Courtyard Garden Skylight & Uplights */}
      <pointLight
        position={[4.8, 4.4, -24.2]}
        color="#8aa8cc"
        intensity={1.1}
        distance={9.0}
        decay={1.8}
      />
      {[21.5, 27.0].map((uy, idx) => (
        <pointLight
          key={`uplight-r-${idx}`}
          position={[3.8, 0.30, -uy]}
          color="#ffd699"
          intensity={0.6}
          distance={4.0}
          decay={1.8}
        />
      ))}

      {/* 7. North Exit Portal / Developer Studio Workspace Warm Glow */}
      <pointLight
        position={[1.75, 2.2, -32.5]}
        color="#ffe2b8"
        intensity={1.1}
        distance={6.5}
        decay={1.8}
      />
    </group>
  );
}
