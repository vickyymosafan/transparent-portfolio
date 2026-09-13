"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getWalkPathState } from "@/lib/walk-path";
import { getChapterProgress } from "@/hooks/useChapterProgress";
import { useWalkStore } from "@/lib/walk-store";

const DAMP = 3.0;

interface WalkPathControllerProps {
  /** "scroll" reads page scroll progress (default page); "walk" reads walk-store (night route). */
  source?: "scroll" | "walk";
}

export function WalkPathController({ source = "scroll" }: WalkPathControllerProps) {
  const { camera } = useThree();
  const state = useRef({ position: new THREE.Vector3(), fov: 50 });

  /* eslint-disable react-hooks/immutability -- R3F: per-frame damped mutation of camera is intentional */
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    let t: number;
    if (source === "walk") {
      t = useWalkStore.getState().progress;
    } else {
      const cp = getChapterProgress();
      t = cp.chapterIndex / 5 + cp.localProgress / 5;
    }

    const target = getWalkPathState(t);

    state.current.position.lerp(target.position, 1 - Math.exp(-DAMP * dt));
    camera.position.copy(state.current.position);

    state.current.fov = THREE.MathUtils.damp(state.current.fov, target.fov, DAMP, dt);
    (camera as THREE.PerspectiveCamera).fov = state.current.fov;
    camera.updateProjectionMatrix();

    camera.lookAt(target.lookAt);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}
