"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";
import { cityPath } from "@/lib/city-path";

export function WalkCam() {
  const damped = useRef(0);

  useFrame(({ camera }, delta) => {
    const { progress } = useWalkStore.getState();
    damped.current = THREE.MathUtils.damp(damped.current, progress, 2.5, delta);

    const pos = new THREE.Vector3();
    cityPath.getPointAt(damped.current, pos);
    camera.position.copy(pos);

    const lookPos = new THREE.Vector3();
    cityPath.getPointAt(Math.min(damped.current + 0.015, 1), lookPos);
    camera.lookAt(lookPos);
  });

  return null;
}
