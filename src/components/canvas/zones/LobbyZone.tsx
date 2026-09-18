"use client";

import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  getTravertineMat,
  getEuropeanOakMat,
  getDarkWalnutMat,
  getNeroMarquinaMat,
  matteBlackMetalMat,
  architecturalGlassMat,
  warmCoveLedMat,
  pineTrunkMat,
} from "@/lib/architectural-materials";

/* ────────────────────────────────────────────────────────────────────
 * Zone 01 / Zone 2: The Foyer (Blender Master ArchViz Integration)
 *
 * Implements reference image 3:
 * - Floating cantilevered European oak stairs with frameless glass balustrade
 * - Vein-cut Roman travertine feature wall with perimeter cove wash
 * - Continuous fluted oak vertical slats and architectural pilasters
 * - Floating Nero Marquina marble waterfall console table
 * - Handcrafted ceramic wabi-sabi vase with natural ikebana branch
 * - Potted Ficus Lyrata fiddle-leaf fig tree in architectural planter
 * - Recessed ceiling cove troffer with warm 2700K ambient illumination
 * - North double glass portal opening into the Zen Garden breezeway
 *
 * Guaranteed 1:1 coordinate continuity with Zone 00 Courtyard:
 * Docks at position [-1.75, 0, 3.56] to meet the Courtyard pivot door.
 * ──────────────────────────────────────────────────────────────────── */

function FoyerModel() {
  const gltf = useLoader(GLTFLoader, "/models/foyer_master.glb");

  // Refined architectural materials for foyer accessories
  const ceilingPlasterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f5f0e8",
        roughness: 0.88,
        metalness: 0.02,
      }),
    []
  );

  const ficusLeafMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#18381c",
        roughness: 0.42,
        metalness: 0.04,
      }),
    []
  );

  const planterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#202328",
        roughness: 0.74,
        metalness: 0.1,
      }),
    []
  );

  const ceramicVaseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#282522",
        roughness: 0.62,
        metalness: 0.1,
      }),
    []
  );

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
          case "Mat_Interior_Oak":
            mesh.material = getEuropeanOakMat();
            break;
          case "Mat_Limestone_Ashlar":
            mesh.material = getTravertineMat();
            break;
          case "Mat_Nero_Marquina":
            mesh.material = getNeroMarquinaMat();
            break;
          case "Mat_Ceiling_Plaster":
            mesh.material = ceilingPlasterMat;
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
          case "Mat_Ficus_Leaf":
            mesh.material = ficusLeafMat;
            break;
          case "Mat_Planter_Charcoal":
            mesh.material = planterMat;
            break;
          case "Mat_Ceramic_Vase":
            mesh.material = ceramicVaseMat;
            break;
          case "Mat_Bonsai_Bark":
            mesh.material = pineTrunkMat;
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
  }, [
    gltf,
    ceilingPlasterMat,
    ficusLeafMat,
    planterMat,
    ceramicVaseMat,
  ]);

  return (
    <group position={[-1.75, 0, 3.56]}>
      <primitive object={scene} />

      {/* ═══ CALIBRATED ARCHITECTURAL INTERIOR LIGHTING ═══ */}
      {/* 1. Recessed Ceiling Cove Wash (Indirect ambient fill at 2700K) */}
      <pointLight
        position={[1.75, 3.85, -6.5]}
        color="#ffe2b8"
        intensity={1.1}
        distance={9.0}
        decay={1.8}
      />
      <pointLight
        position={[1.75, 3.85, -12.0]}
        color="#ffe2b8"
        intensity={1.0}
        distance={9.0}
        decay={1.8}
      />

      {/* 2. Downlight Accents along central corridor axis */}
      {[-4.5, -8.0, -11.5, -14.8].map((lz, idx) => (
        <pointLight
          key={`foyer-spot-${idx}`}
          position={[1.75, 3.92, lz]}
          color="#fff4e2"
          intensity={0.65}
          distance={6.0}
          decay={1.8}
        />
      ))}

      {/* 3. Nero Marquina Marble Console Accent Wash */}
      <pointLight
        position={[3.6, 2.6, -10.8]}
        color="#ffeed6"
        intensity={0.85}
        distance={4.5}
        decay={1.8}
      />

      {/* 4. Ficus Tree Soft Architectural Uplight in alcove */}
      <pointLight
        position={[0.2, 0.45, -5.2]}
        color="#ffdca0"
        intensity={0.5}
        distance={3.2}
        decay={1.8}
      />

      {/* 5. Stair Tread Subtle Ground Glow (Soft low-level safety illumination) */}
      {[-3.5, -6.5, -9.5].map((sz, idx) => (
        <pointLight
          key={`stair-glow-${idx}`}
          position={[0.3, 0.4 + idx * 0.7, sz]}
          color="#ffdca0"
          intensity={0.3}
          distance={2.5}
          decay={1.8}
        />
      ))}
    </group>
  );
}

export function LobbyZone() {
  return <FoyerModel />;
}

