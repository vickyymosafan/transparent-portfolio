"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";

/**
 * Procedural stylized architectural humanoid avatar.
 * Minimalist, elegant proportions (height ~ 1.75m), smooth procedural walk oscillation,
 * and zero runtime object allocations.
 */

// Shared reusable materials
const avatarBodyMat = new THREE.MeshStandardMaterial({
  color: "#181a1e",
  roughness: 0.65,
  metalness: 0.25,
});

const avatarAccentMat = new THREE.MeshStandardMaterial({
  color: "#cca872", // Warm architectural brass accent
  roughness: 0.45,
  metalness: 0.5,
});

const avatarLimbMat = new THREE.MeshStandardMaterial({
  color: "#24272c",
  roughness: 0.75,
  metalness: 0.15,
});

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const prevPos = useRef(new THREE.Vector3());
  const walkCycle = useRef(0);
  const speedRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const { playerPosition, playerRotation, mode } = useWalkStore.getState();

    // In intro mode, hide avatar
    if (mode === "intro") {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // Smoothly update world position and rotation
    groupRef.current.position.set(playerPosition[0], playerPosition[1], playerPosition[2]);
    groupRef.current.rotation.y = playerRotation;

    // Calculate current horizontal velocity
    const dx = playerPosition[0] - prevPos.current.x;
    const dz = playerPosition[2] - prevPos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    prevPos.current.set(playerPosition[0], playerPosition[1], playerPosition[2]);

    const targetSpeed = Math.min(dist / Math.max(delta, 0.001), 6.0);
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 10 * delta);

    const isMoving = speedRef.current > 0.1;

    if (isMoving) {
      walkCycle.current += speedRef.current * delta * 5.5;
    } else {
      walkCycle.current += delta * 1.5; // Gentle breathing idle
    }

    const t = walkCycle.current;

    // Procedural arm swing & leg stride
    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = isMoving ? Math.sin(t) * 0.45 : Math.sin(t * 0.8) * 0.04;
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
    }

    if (leftLegRef.current && rightLegRef.current) {
      const legStride = isMoving ? Math.sin(t) * 0.55 : 0;
      leftLegRef.current.rotation.x = -legStride;
      rightLegRef.current.rotation.x = legStride;
    }

    if (torsoRef.current) {
      // Subtle vertical bob and torso tilt
      const bob = isMoving ? Math.abs(Math.sin(t)) * 0.04 : Math.sin(t) * 0.015;
      torsoRef.current.position.y = 0.95 + bob;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Torso & Head assembly */}
      <group ref={torsoRef} position={[0, 0.95, 0]}>
        {/* Head */}
        <mesh position={[0, 0.58, 0]} castShadow material={avatarBodyMat}>
          <boxGeometry args={[0.22, 0.26, 0.24]} />
        </mesh>

        {/* Minimalist brass visor */}
        <mesh position={[0, 0.59, 0.12]} material={avatarAccentMat}>
          <boxGeometry args={[0.18, 0.04, 0.02]} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.42, 0]} material={avatarLimbMat}>
          <cylinderGeometry args={[0.06, 0.07, 0.08, 12]} />
        </mesh>

        {/* Upper Torso */}
        <mesh position={[0, 0.22, 0]} castShadow material={avatarBodyMat}>
          <boxGeometry args={[0.42, 0.34, 0.22]} />
        </mesh>

        {/* Lower Torso / Pelvis */}
        <mesh position={[0, 0.0, 0]} castShadow material={avatarLimbMat}>
          <boxGeometry args={[0.34, 0.18, 0.2]} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.26, 0.32, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow material={avatarLimbMat}>
            <capsuleGeometry args={[0.05, 0.36, 6, 12]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.26, 0.32, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow material={avatarLimbMat}>
            <capsuleGeometry args={[0.05, 0.36, 6, 12]} />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.85, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow material={avatarBodyMat}>
          <capsuleGeometry args={[0.065, 0.62, 6, 12]} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.78, 0.04]} castShadow material={avatarAccentMat}>
          <boxGeometry args={[0.12, 0.08, 0.22]} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.85, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow material={avatarBodyMat}>
          <capsuleGeometry args={[0.065, 0.62, 6, 12]} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.78, 0.04]} castShadow material={avatarAccentMat}>
          <boxGeometry args={[0.12, 0.08, 0.22]} />
        </mesh>
      </group>
    </group>
  );
}
