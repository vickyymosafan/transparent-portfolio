"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getWalkPathState } from "@/lib/walk-path";
import { getChapterProgress } from "@/hooks/useChapterProgress";

const DAMP = 3.0;

export function WalkPathController() {
  const { camera } = useThree();
  const state = useRef({ position: new THREE.Vector3(), fov: 50 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const cp = getChapterProgress();
    const target = getWalkPathState(cp.chapterIndex / 5 + cp.localProgress / 5);

    // Damped camera position
    state.current.position.lerp(target.position, 1 - Math.exp(-DAMP * dt));
    camera.position.copy(state.current.position);

    // Damped FOV
    state.current.fov = THREE.MathUtils.damp(state.current.fov, target.fov, DAMP, dt);
    ;(camera as THREE.PerspectiveCamera).fov = state.current.fov;
    camera.updateProjectionMatrix();

    // LookAt — direct for responsiveness
    camera.lookAt(target.lookAt);
  });

  return null;
}