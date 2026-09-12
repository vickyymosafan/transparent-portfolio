"use client";

import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/free_sci-fi_city_-_public_domain_cc0.glb";

const GROUND_Y = -0.8;
const TARGET_WIDTH = 90;
const TARGET_HEIGHT = 42;
const BACKDROP_Z = 50;
const NIGHT_TINT = "#7c8db0";

/* GLTFLoader always produces MeshStandardMaterial (or MeshBasicMaterial for the
   unlit extension), so only those two need map/vertexColors forwarding. */
function backdropMaterial(source: THREE.Material): THREE.MeshBasicMaterial {
  const basic = new THREE.MeshBasicMaterial({ color: NIGHT_TINT, fog: false });

  if (source instanceof THREE.MeshStandardMaterial || source instanceof THREE.MeshBasicMaterial) {
    basic.map = source.map ?? null;
    basic.vertexColors = source.vertexColors;
  }

  return basic;
}

function BackdropCity() {
  const { scene: source } = useGLTF(MODEL_URL);

  const backdrop = useMemo(() => {
    const prepared = source.clone(true);

    prepared.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = Array.isArray(child.material)
          ? child.material.map(backdropMaterial)
          : backdropMaterial(child.material);
      }
    });

    /* Fit the model into the far end of the walk corridor: fog is disabled on
       its materials, so it reads as a distant skyline beyond the fog wall. */
    const box = new THREE.Box3().setFromObject(source);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = Math.min(
      TARGET_WIDTH / Math.max(size.x, 0.001),
      TARGET_HEIGHT / Math.max(size.y, 0.001)
    );

    prepared.scale.setScalar(scale);
    prepared.position.set(
      -center.x * scale,
      GROUND_Y - box.min.y * scale,
      BACKDROP_Z - center.z * scale
    );

    return prepared;
  }, [source]);

  return <primitive object={backdrop} />;
}

export function CityModel() {
  /* Preload only when the night scene mounts, never on the home page. */
  useEffect(() => {
    useGLTF.preload(MODEL_URL);
  }, []);

  return (
    <Suspense fallback={null}>
      <BackdropCity />
    </Suspense>
  );
}
