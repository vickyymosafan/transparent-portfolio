"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";
import { cityPath } from "@/lib/city-path";

const _vecPool = [new THREE.Vector3(), new THREE.Vector3()];

export function WalkCam() {
  const damped = useRef(0);

  useFrame(({ camera }, delta) => {
    const { progress } = useWalkStore.getState();
    damped.current = THREE.MathUtils.damp(damped.current, progress, 2.5, delta);

    const pos = _vecPool[0];
    cityPath.getPointAt(damped.current, pos);
    camera.position.copy(pos);

    const lookPos = _vecPool[1];
    cityPath.getPointAt(Math.min(damped.current + 0.015, 0.999), lookPos);
    camera.lookAt(lookPos);
  });

  return null;
}
