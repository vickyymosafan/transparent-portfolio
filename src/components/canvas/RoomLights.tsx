"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useChapterStore } from "@/lib/chapter-store";
import type { ChapterId } from "@/lib/chapter-store";

interface RoomLightConfig {
  ambient: string;
  dirColor: string;
  dirPos: [number, number, number];
  intensity: number;
}

const ROOM_LIGHTS: Record<ChapterId, RoomLightConfig> = {
  hero:       { ambient: "#1a2030", dirColor: "#d6e7ff", dirPos: [9, 18, 7],   intensity: 0.8 },
  about:      { ambient: "#2a1a10", dirColor: "#ffd4a0", dirPos: [5, 12, 5],   intensity: 0.6 },
  experience: { ambient: "#1a1a2a", dirColor: "#b8c8ff", dirPos: [-5, 10, 8],  intensity: 0.7 },
  stats:      { ambient: "#0a1a2a", dirColor: "#4080ff", dirPos: [0, 15, 0],   intensity: 1.0 },
  projects:   { ambient: "#2a2a20", dirColor: "#ffe8c0", dirPos: [8, 10, 5],   intensity: 0.9 },
  finale:     { ambient: "#1a2030", dirColor: "#d6e7ff", dirPos: [9, 18, 7],   intensity: 1.2 },
};

const DAMP = 1.5;
const _ambientColor = new THREE.Color();
const _dirColor = new THREE.Color();

export function RoomLights() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const active = useChapterStore.getState().active;
    const cfg = ROOM_LIGHTS[active];
    if (!cfg || !ambientRef.current || !dirRef.current) return;

    _ambientColor.set(cfg.ambient);
    ambientRef.current.color.lerp(_ambientColor, 1 - Math.exp(-DAMP * dt));

    _dirColor.set(cfg.dirColor);
    dirRef.current.color.lerp(_dirColor, 1 - Math.exp(-DAMP * dt));
    dirRef.current.intensity = THREE.MathUtils.damp(dirRef.current.intensity, cfg.intensity, DAMP, dt);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} color="#1a2030" />
      <directionalLight ref={dirRef} position={[9, 18, 7]} color="#d6e7ff" intensity={0.8} />
    </>
  );
}