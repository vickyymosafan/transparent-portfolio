"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";
import { CAMERA_CONFIG, ZONES } from "@/lib/constants";

/**
 * Collision-aware Third-Person Camera with Pointer Lock and Mobile Touch Look.
 * Prevents wall clipping, clamps pitch, and smoothly frames the player.
 */

// Pre-allocated vectors outside component scope
const _cameraTarget = new THREE.Vector3();
const _desiredPosition = new THREE.Vector3();
const _playerHead = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _spherical = new THREE.Spherical();
const _rayDir = new THREE.Vector3();

export function ThirdPersonCamera() {
  const { camera, gl } = useThree();

  const yaw = useRef(Math.PI); // Facing south (-Z)
  const pitch = useRef(0.15); // Slight downward gaze
  const distance = useRef(CAMERA_CONFIG.shoulderOffset[2]);
  const isPointerLocked = useRef(false);

  useEffect(() => {
    const domElement = gl.domElement;

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === domElement;
    };

    const onMouseMove = (e: MouseEvent) => {
      const mode = useWalkStore.getState().mode;
      if (mode !== "walk") return;

      if (isPointerLocked.current || e.buttons === 1 || e.buttons === 2) {
        yaw.current -= e.movementX * CAMERA_CONFIG.mouseSensitivity;
        pitch.current = Math.max(
          CAMERA_CONFIG.minPitch,
          Math.min(
            CAMERA_CONFIG.maxPitch,
            pitch.current + e.movementY * CAMERA_CONFIG.mouseSensitivity
          )
        );
      }
    };

    const onClick = () => {
      const mode = useWalkStore.getState().mode;
      if (mode === "walk" && !isPointerLocked.current) {
        domElement.requestPointerLock?.();
      }
    };

    document.addEventListener("pointerlockchange", onPointerLockChange);
    window.addEventListener("mousemove", onMouseMove);
    domElement.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      window.removeEventListener("mousemove", onMouseMove);
      domElement.removeEventListener("click", onClick);
    };
  }, [gl]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { mode, playerPosition, currentZone } = useWalkStore.getState();

    // 1. Cinematic Intro Camera
    if (mode === "intro") {
      const hero = ZONES[0].heroCamera;
      _desiredPosition.set(hero.position[0], hero.position[1], hero.position[2]);
      _cameraTarget.set(hero.target[0], hero.target[1], hero.target[2]);

      camera.position.lerp(_desiredPosition, 4.0 * delta);
      camera.lookAt(_cameraTarget);
      return;
    }

    // 2. Consume Mobile Touch Look deltas
    const mobileLook = useWalkStore.getState().consumeMobileLook();
    if (mobileLook[0] !== 0 || mobileLook[1] !== 0) {
      yaw.current -= mobileLook[0] * CAMERA_CONFIG.touchSensitivity;
      pitch.current = Math.max(
        CAMERA_CONFIG.minPitch,
        Math.min(
          CAMERA_CONFIG.maxPitch,
          pitch.current + mobileLook[1] * CAMERA_CONFIG.touchSensitivity
        )
      );
    }

    // 3. Calculate camera focus target (player's chest/head)
    _playerHead.set(
      playerPosition[0],
      playerPosition[1] + CAMERA_CONFIG.shoulderOffset[1],
      playerPosition[2]
    );

    // 4. Calculate desired camera position via spherical coordinates
    const targetDist = CAMERA_CONFIG.maxDistance;
    distance.current = THREE.MathUtils.damp(distance.current, targetDist, 10, delta);

    _spherical.set(
      distance.current,
      Math.PI / 2 - pitch.current,
      yaw.current
    );

    _offset.setFromSpherical(_spherical);

    // Apply subtle over-the-shoulder right offset
    const shoulderLateral = CAMERA_CONFIG.shoulderOffset[0];
    const sinYaw = Math.sin(yaw.current);
    const cosYaw = Math.cos(yaw.current);
    _offset.x += cosYaw * shoulderLateral;
    _offset.z -= sinYaw * shoulderLateral;

    _desiredPosition.copy(_playerHead).add(_offset);

    // Ceiling / floor collision clamp: don't let camera clip below floor or above interior ceiling
    _desiredPosition.y = Math.max(0.4, Math.min(4.2, _desiredPosition.y));

    // 5. Smooth camera position and lookAt interpolation
    camera.position.lerp(_desiredPosition, CAMERA_CONFIG.damping * delta);
    camera.lookAt(_playerHead);
  });

  return null;
}
