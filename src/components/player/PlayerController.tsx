"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";
import { PLAYER_CONFIG } from "@/lib/constants";
import { resolveMovement } from "./CollisionWorld";

/**
 * High-performance WASD + Mobile Player Physics Controller.
 * Zero GC allocations in useFrame; smooth acceleration, damping, and collision response.
 */

// Pre-allocated vectors outside component scope to prevent GC stutters
const _moveDir = new THREE.Vector3();
const _forwardDir = new THREE.Vector3();
const _rightDir = new THREE.Vector3();
const _targetVelocity = new THREE.Vector3();
const _currentVelocity = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _currentPos = new THREE.Vector3();
const _UP = new THREE.Vector3(0, 1, 0);

export function PlayerController() {
  const { camera } = useThree();
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
  });

  const yawRef = useRef(PLAYER_CONFIG.initialYaw);
  const verticalVelocity = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing inside an input or when modal is open
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        useWalkStore.getState().activeModal !== null
      ) {
        return;
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.w = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.s = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.a = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.d = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.shift = true;
          useWalkStore.getState().setIsSprinting(true);
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.w = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.s = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.a = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.d = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.shift = false;
          useWalkStore.getState().setIsSprinting(false);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, rawDelta) => {
    const state = useWalkStore.getState();
    if (state.mode !== "walk") return;

    const delta = Math.min(rawDelta, 0.05);
    const { playerPosition, mobileMove, doorOpen, hasMoved } = state;

    // 1. Calculate input vector
    _moveDir.set(0, 0, 0);

    // Keyboard inputs
    if (keys.current.w) _moveDir.z -= 1;
    if (keys.current.s) _moveDir.z += 1;
    if (keys.current.a) _moveDir.x -= 1;
    if (keys.current.d) _moveDir.x += 1;

    // Mobile virtual joystick inputs
    if (mobileMove[0] !== 0 || mobileMove[1] !== 0) {
      _moveDir.x += mobileMove[0];
      _moveDir.z += mobileMove[1];
    }

    const hasInput = _moveDir.lengthSq() > 0.001;

    if (hasInput && !hasMoved) {
      useWalkStore.getState().setHasMoved(true);
    }

    if (hasInput) {
      _moveDir.normalize();
    }

    // 2. Camera-relative direction
    camera.getWorldDirection(_forwardDir);
    _forwardDir.y = 0;
    _forwardDir.normalize();
    _rightDir.crossVectors(_forwardDir, _UP).normalize();

    // 3. Compute target horizontal velocity
    const isSprinting = keys.current.shift;
    const maxSpeed = isSprinting ? PLAYER_CONFIG.sprintSpeed : PLAYER_CONFIG.walkSpeed;

    if (hasInput) {
      _targetVelocity.set(0, 0, 0);
      _targetVelocity.addScaledVector(_forwardDir, -_moveDir.z * maxSpeed);
      _targetVelocity.addScaledVector(_rightDir, _moveDir.x * maxSpeed);

      // Smoothly update player rotation towards travel heading
      const targetYaw = Math.atan2(-_targetVelocity.x, -_targetVelocity.z);
      // Shortest angle wrap
      let angleDiff = targetYaw - yawRef.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      yawRef.current += angleDiff * Math.min(1.0, 12.0 * delta);
    } else {
      _targetVelocity.set(0, 0, 0);
    }

    // 4. Smooth acceleration and deceleration
    _currentVelocity.lerp(
      _targetVelocity,
      (hasInput ? PLAYER_CONFIG.acceleration : PLAYER_CONFIG.deceleration) * delta
    );

    // 5. Compute candidate next position
    _currentPos.set(playerPosition[0], playerPosition[1], playerPosition[2]);
    _targetPos.copy(_currentPos);
    _targetPos.x += _currentVelocity.x * delta;
    _targetPos.z += _currentVelocity.z * delta;

    // 6. Resolve collision with architectural obstacles and determine ground elevation
    const { groundY } = resolveMovement(
      _currentPos,
      _targetPos,
      PLAYER_CONFIG.radius,
      doorOpen
    );

    // 7. Ground clamping & gravity
    const targetY = groundY;
    if (_targetPos.y > targetY) {
      verticalVelocity.current -= PLAYER_CONFIG.gravity * delta;
      _targetPos.y += verticalVelocity.current * delta;
      if (_targetPos.y < targetY) {
        _targetPos.y = targetY;
        verticalVelocity.current = 0;
      }
    } else {
      // Smooth stair / ramp step elevation
      _targetPos.y = THREE.MathUtils.damp(_targetPos.y, targetY, 15, delta);
      verticalVelocity.current = 0;
    }

    // 8. Commit position & rotation to store
    state.setPlayerPosition(
      [_targetPos.x, _targetPos.y, _targetPos.z],
      yawRef.current
    );
  });

  return null;
}
