"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getChapterProgress } from "@/hooks/useChapterProgress";
import { useWalkStore } from "@/lib/walk-store";

const TRANSITION_TYPES: Record<number, string> = {
  0: "doorway",
  1: "corridor",
  2: "data-frame",
  3: "gallery-frame",
  4: "balcony",
};

function transitionAlpha(t: number): number {
  if (t < 0.2) return 0;
  if (t < 0.4) return (t - 0.2) / 0.2;
  if (t < 0.7) return 1;
  if (t < 0.9) return 1 - (t - 0.7) / 0.2;
  return 0;
}

interface TransitionArchProps {
  source?: "scroll" | "walk";
}

export function TransitionArch({ source = "scroll" }: TransitionArchProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    let chapterIndex: number;
    let localProgress: number;

    if (source === "walk") {
      const p = useWalkStore.getState().progress * 6;
      chapterIndex = Math.min(Math.floor(p), 5);
      localProgress = p - chapterIndex;
    } else {
      const cp = getChapterProgress();
      chapterIndex = cp.chapterIndex;
      localProgress = cp.localProgress;
    }

    const type = TRANSITION_TYPES[chapterIndex];
    if (!type || !groupRef.current) return;

    const alpha = transitionAlpha(localProgress);
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshBasicMaterial;
        mat.opacity = alpha;
        mat.transparent = alpha < 0.99;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-1.2, 1.2, 3.5]}>
        <boxGeometry args={[0.12, 2.4, 0.12]} />
        <meshBasicMaterial color="#0a0e12" transparent opacity={0} />
      </mesh>
      <mesh position={[1.2, 1.2, 3.5]}>
        <boxGeometry args={[0.12, 2.4, 0.12]} />
        <meshBasicMaterial color="#0a0e12" transparent opacity={0} />
      </mesh>
      <mesh position={[0, 2.5, 3.5]}>
        <boxGeometry args={[2.52, 0.08, 0.12]} />
        <meshBasicMaterial color="#0a0e12" transparent opacity={0} />
      </mesh>
    </group>
  );
}
