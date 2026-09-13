"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getWalkPathState } from "@/lib/walk-path";
import { getChapterProgress } from "@/hooks/useChapterProgress";
import { useWalkStore } from "@/lib/walk-store";
import { pointerState } from "@/lib/pointer-state";

/*
 * Camera controller tuned for cinematic smoothness:
 * - Tight position follow (DAMP=5) so camera responds quickly
 * - Smooth lookAt damping (LOOK_DAMP=3.5) prevents jarring head snaps
 * - Subtle head-bob simulates walking motion
 * - Mouse parallax adds life and depth perception
 */
const DAMP = 5.0;
const LOOK_DAMP = 3.5;
const FOV_DAMP = 4.0;

// Head-bob parameters (subtle walking motion)
const BOB_SPEED = 2.8;         // Cycles per second
const BOB_AMPLITUDE_Y = 0.03;  // Vertical bob
const BOB_AMPLITUDE_X = 0.015; // Lateral sway

// Mouse parallax
const MOUSE_PARALLAX_X = 0.3;
const MOUSE_PARALLAX_Y = 0.15;
const MOUSE_LOOK_X = 0.4;
const MOUSE_LOOK_Y = 0.25;

interface WalkPathControllerProps {
  /** "scroll" reads page scroll progress (default page); "walk" reads walk-store (night route). */
  source?: "scroll" | "walk";
}

export function WalkPathController({ source = "scroll" }: WalkPathControllerProps) {
  const { camera } = useThree();
  const state = useRef({
    position: new THREE.Vector3(0, 8, 25),
    lookAt: new THREE.Vector3(0, 2, 0),
    fov: 38,
    prevT: 0,
  });

  /* eslint-disable react-hooks/immutability -- R3F: per-frame damped mutation of camera is intentional */
  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = clock.getElapsedTime();

    let t: number;
    if (source === "walk") {
      t = useWalkStore.getState().progress;
    } else {
      const cp = getChapterProgress();
      t = cp.chapterIndex / 5 + cp.localProgress / 5;
    }

    const target = getWalkPathState(t);

    // Compute movement speed for head-bob intensity
    const speed = Math.abs(t - state.current.prevT) / Math.max(dt, 0.001);
    state.current.prevT = t;
    const bobIntensity = Math.min(1, speed * 30); // Scale bob with movement

    // Head-bob offset (only when moving)
    const bobY = Math.sin(time * BOB_SPEED * Math.PI * 2) * BOB_AMPLITUDE_Y * bobIntensity;
    const bobX = Math.cos(time * BOB_SPEED * Math.PI) * BOB_AMPLITUDE_X * bobIntensity;

    // Mouse parallax offset
    const mx = pointerState.x * MOUSE_PARALLAX_X;
    const my = pointerState.y * MOUSE_PARALLAX_Y;

    // Smooth position follow with head-bob and parallax
    const targetPos = target.position;
    state.current.position.x = THREE.MathUtils.damp(
      state.current.position.x,
      targetPos.x + bobX + mx,
      DAMP, dt
    );
    state.current.position.y = THREE.MathUtils.damp(
      state.current.position.y,
      targetPos.y + bobY + my * 0.5,
      DAMP, dt
    );
    state.current.position.z = THREE.MathUtils.damp(
      state.current.position.z,
      targetPos.z,
      DAMP, dt
    );
    camera.position.copy(state.current.position);

    // Smooth lookAt damping (prevents jarring head snaps at path nodes)
    const targetLook = target.lookAt;
    state.current.lookAt.x = THREE.MathUtils.damp(
      state.current.lookAt.x,
      targetLook.x + mx * MOUSE_LOOK_X,
      LOOK_DAMP, dt
    );
    state.current.lookAt.y = THREE.MathUtils.damp(
      state.current.lookAt.y,
      targetLook.y + my * MOUSE_LOOK_Y,
      LOOK_DAMP, dt
    );
    state.current.lookAt.z = THREE.MathUtils.damp(
      state.current.lookAt.z,
      targetLook.z,
      LOOK_DAMP, dt
    );
    camera.lookAt(state.current.lookAt);

    // Smooth FOV transition
    state.current.fov = THREE.MathUtils.damp(state.current.fov, target.fov, FOV_DAMP, dt);
    (camera as THREE.PerspectiveCamera).fov = state.current.fov;
    camera.updateProjectionMatrix();
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}
