"use client";

import { useMemo, useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useWalkStore } from "@/lib/walk-store";
import {
  getBoardFormedConcreteMat,
  getDarkConcreteMat,
  getTravertineMat,
  getHonedBasaltMat,
  getDarkWalnutMat,
  getEuropeanOakMat,
  getPoolWaterMat,
  getPebblesMat,
  matteBlackMetalMat,
  architecturalGlassMat,
  warmCoveLedMat,
  pineTrunkMat,
  cloudPineFoliageMat,
  desertPlantMat,
  agaveLeafMat,
  mountainSilhouetteMat,
} from "@/lib/architectural-materials";
import { getPebblesTexture } from "@/lib/architectural-textures";

/* ────────────────────────────────────────────────────────────────────
 * Zone 0: Courtyard Entry (Blender Master ArchViz Integration)
 * Maps all Blender architectural geometries to Three.js materials
 * with verified transparency, balanced lighting, and zero bloom blowout.
 * ──────────────────────────────────────────────────────────────────── */

function CourtyardModel() {
  const gltf = useLoader(GLTFLoader, "/models/courtyard_master.glb");

  const sofaMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ded9ce",
        roughness: 0.85,
        metalness: 0.02,
      }),
    []
  );

  const poolTileMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0e131b",
        roughness: 0.2,
        metalness: 0.3,
      }),
    []
  );

  const courtyardGravelMat = useMemo(() => {
    const tex = getPebblesTexture().clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(36, 36);
    tex.needsUpdate = true;
    return new THREE.MeshStandardMaterial({
      map: tex,
      color: "#383c42",
      roughness: 0.92,
      metalness: 0.06,
    });
  }, []);

  const doorObjRef = useRef<THREE.Object3D | null>(null);
  const handleObjRef = useRef<THREE.Object3D | null>(null);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    // Strip any raw 28,000-candela glTF lights and assign calibrated PBR materials
    const toRemove: THREE.Object3D[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Light).isLight) {
        toRemove.push(child);
        return;
      }

        // Door and handle references will be bound in useEffect to the mounted scene

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const originalMat = mesh.material;
        const matName = Array.isArray(originalMat)
          ? originalMat[0]?.name
          : originalMat?.name;

        // Map Blender material names to unified Three.js materials
        switch (matName) {
          case "Mat_Clear_Glass":
            mesh.material = architecturalGlassMat;
            break;
          case "Mat_Deep_Reflecting_Water":
            mesh.material = getPoolWaterMat();
            break;
          case "Mat_Board_Formed_Concrete":
            mesh.material = getBoardFormedConcreteMat();
            break;
          case "Mat_Limestone_Ashlar":
            mesh.material = getTravertineMat();
            break;
          case "Mat_Dark_Walnut_PBR":
            mesh.material = getDarkWalnutMat();
            break;
          case "Mat_Dark_Cleft_Slate":
            mesh.material = getHonedBasaltMat();
            break;
          case "Mat_Pea_Gravel_Dark":
            mesh.material = courtyardGravelMat;
            break;
          case "Mat_LED_Amber_Gold":
            mesh.material = warmCoveLedMat;
            break;
          case "Mat_Niwaki_Pine":
            mesh.material = cloudPineFoliageMat;
            break;
          case "Mat_Bonsai_Bark":
            mesh.material = pineTrunkMat;
            break;
          case "Mat_Agave_Fleshy":
            mesh.material = agaveLeafMat;
            break;
          case "Mat_Desert_Shrub":
            mesh.material = desertPlantMat;
            break;
          case "Mat_Black_Metal":
            mesh.material = matteBlackMetalMat;
            break;
          case "Mat_Interior_Oak":
            mesh.material = getEuropeanOakMat();
            break;
          case "Mat_Linen_Sofa":
            mesh.material = sofaMat;
            break;
          case "Mat_Dark_Pool_Tile":
            mesh.material = poolTileMat;
            break;
          case "Mat_Mountain":
            mesh.material = mountainSilhouetteMat;
            break;
          default:
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mesh.material as THREE.MeshStandardMaterial;
              stdMat.envMapIntensity = 0.8;
            }
            break;
        }
      }
    });

    toRemove.forEach((l) => l.parent?.remove(l));
    return clone;
  }, [gltf, sofaMat, poolTileMat, courtyardGravelMat]);

  // Target refs for spotlights
  const s1UpTarget = useRef<THREE.Object3D>(null!);
  const s1DnTarget = useRef<THREE.Object3D>(null!);
  const s2UpTarget = useRef<THREE.Object3D>(null!);
  const s2DnTarget = useRef<THREE.Object3D>(null!);

  const s1UpLight = useRef<THREE.SpotLight>(null!);
  const s1DnLight = useRef<THREE.SpotLight>(null!);
  const s2UpLight = useRef<THREE.SpotLight>(null!);
  const s2DnLight = useRef<THREE.SpotLight>(null!);

  useEffect(() => {
    if (s1UpLight.current && s1UpTarget.current) s1UpLight.current.target = s1UpTarget.current;
    if (s1DnLight.current && s1DnTarget.current) s1DnLight.current.target = s1DnTarget.current;
    if (s2UpLight.current && s2UpTarget.current) s2UpLight.current.target = s2UpTarget.current;
    if (s2DnLight.current && s2DnTarget.current) s2DnLight.current.target = s2DnTarget.current;

    scene.traverse((child) => {
      if (child.name === "Entrance_Pivot_Door") doorObjRef.current = child;
      if (child.name === "Door_Pull_Handle") handleObjRef.current = child;
    });
  }, [scene]);

  // Smooth architectural pivot door opening as camera approaches entrance
  useFrame(() => {
    if (!doorObjRef.current) {
      scene.traverse((child) => {
        if (child.name === "Entrance_Pivot_Door") doorObjRef.current = child;
        if (child.name === "Door_Pull_Handle") handleObjRef.current = child;
      });
      if (!doorObjRef.current) return;
    }
    const p = useWalkStore.getState().progress;
    // Pivot opens smoothly as visitor approaches entrance (progress 0.06 to 0.16)
    // By progress 0.18, the door is completely open and tucked against the wall
    const factor = THREE.MathUtils.clamp((p - 0.06) / 0.10, 0, 1);
    const ease = factor * factor * (3 - 2 * factor);
    const theta = 1.52 * ease; // 87 degrees, tucked neatly against the left wall

    // Rotate around vertical hinge at (1.15, -3.56) inward into the foyer (-Z)
    doorObjRef.current.rotation.y = theta;
    doorObjRef.current.position.x = 1.15 + 0.60 * Math.cos(theta);
    doorObjRef.current.position.z = -3.56 - 0.60 * Math.sin(theta);

    if (handleObjRef.current) {
      handleObjRef.current.rotation.y = theta;
      handleObjRef.current.position.x = 1.15 + 1.33 * Math.cos(theta) + 0.10 * Math.sin(theta);
      handleObjRef.current.position.z = -3.56 - 1.33 * Math.sin(theta) + 0.10 * Math.cos(theta);
    }
  });

  return (
    <group position={[-1.75, 0, 3.56]}>
      <primitive object={scene} />

      {/* ── Left Limestone Pier Sconce (Soft V-Beam up/down wash) ── */}
      <group position={[0.60, 1.85, -3.10]}>
        <object3D ref={s1UpTarget} position={[0, 1.6, 0.08]} />
        <object3D ref={s1DnTarget} position={[0, -1.6, 0.08]} />
        <spotLight
          ref={s1UpLight}
          position={[0, 0.08, 0.10]}
          color="#ffe4b8"
          intensity={1.2}
          angle={Math.PI / 4.2}
          penumbra={0.75}
          distance={3.2}
          decay={1.5}
        />
        <spotLight
          ref={s1DnLight}
          position={[0, -0.08, 0.10]}
          color="#ffe4b8"
          intensity={1.2}
          angle={Math.PI / 4.2}
          penumbra={0.75}
          distance={2.6}
          decay={1.5}
        />
        {/* Soft sconce fixture glow */}
        <pointLight position={[0, 0, 0.08]} color="#ffe0a3" intensity={0.4} distance={0.9} decay={2} />
      </group>

      {/* ── Right Limestone Pier Sconce (Soft V-Beam up/down wash) ── */}
      <group position={[2.90, 1.85, -3.10]}>
        <object3D ref={s2UpTarget} position={[0, 1.6, 0.08]} />
        <object3D ref={s2DnTarget} position={[0, -1.6, 0.08]} />
        <spotLight
          ref={s2UpLight}
          position={[0, 0.08, 0.10]}
          color="#ffe4b8"
          intensity={1.2}
          angle={Math.PI / 4.2}
          penumbra={0.75}
          distance={3.2}
          decay={1.5}
        />
        <spotLight
          ref={s2DnLight}
          position={[0, -0.08, 0.10]}
          color="#ffe4b8"
          intensity={1.2}
          angle={Math.PI / 4.2}
          penumbra={0.75}
          distance={2.6}
          decay={1.5}
        />
        {/* Soft sconce fixture glow */}
        <pointLight position={[0, 0, 0.08]} color="#ffe0a3" intensity={0.4} distance={0.9} decay={2} />
      </group>

      {/* ── Floating Stepping Stones Golden Underglow Fill ── */}
      {[-3.8, -2.4, -1.0, 0.4].map((sy, i) => (
        <pointLight
          key={`st-glow-${i}`}
          position={[-1.65, 0.08, -sy]}
          color="#ffc864"
          intensity={0.65}
          distance={1.8}
          decay={2}
        />
      ))}

      {/* ── Warm Interior Living Room Ambient Spillage ── */}
      <pointLight position={[-2.2, 2.0, -5.8]} color="#ffdcaa" intensity={1.4} distance={7.0} decay={2} />
      <pointLight position={[1.2, 2.0, -5.0]} color="#ffe0a3" intensity={1.0} distance={6.0} decay={2} />
    </group>
  );
}

/* ── Fallback while GLB loads ── */
function CourtyardFallback() {
  const concreteMat = useMemo(() => getBoardFormedConcreteMat(), []);
  const basaltMat = useMemo(() => getHonedBasaltMat(), []);
  const gravelMat = useMemo(() => getPebblesMat(), []);

  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, -0.1, 8.0]} rotation={[-Math.PI / 2, 0, 0]} material={gravelMat}>
        <planeGeometry args={[40.0, 30.0]} />
      </mesh>
      <mesh position={[0, 0.04, 5.0]} material={basaltMat}>
        <boxGeometry args={[3.2, 0.1, 12.0]} />
      </mesh>
      <mesh position={[0, 4.0, 0]} material={concreteMat}>
        <boxGeometry args={[18.0, 0.4, 6.0]} />
      </mesh>
    </group>
  );
}

/* ── Main Courtyard Zone Component ── */
export function CourtyardZone() {
  return <CourtyardModel />;
}
