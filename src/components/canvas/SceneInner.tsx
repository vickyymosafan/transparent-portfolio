"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { SkyDome } from "./SkyDome";
import { Stars } from "./Stars";
import { HouseShell } from "../world/HouseShell";
import { Player } from "../player/Player";
import { PlayerController } from "../player/PlayerController";
import { ThirdPersonCamera } from "../player/ThirdPersonCamera";
import { InteractionSystem } from "../player/InteractionSystem";
import { useWalkStore } from "@/lib/walk-store";

interface SceneInnerProps {
  onReady?: () => void;
  onContextLost?: () => void;
}

export default function SceneInner({ onReady, onContextLost }: SceneInnerProps) {
  const quality = useWalkStore((s) => s.quality);

  return (
    <Canvas
      shadows={quality.shadows}
      camera={{ fov: 50, position: [0, 2.2, 16.5] }}
      dpr={quality.dpr}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.18,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0c1017");
        if (quality.shadows) {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          document.documentElement.classList.add("no-webgl");
          onContextLost?.();
        });
        requestAnimationFrame(() => onReady?.());
      }}
    >
      {quality.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.95}
            luminanceSmoothing={0.25}
            intensity={0.35}
          />
        </EffectComposer>
      )}

      <fogExp2 attach="fog" args={["#141c2b", 0.003]} />
      <SkyDome />
      <Stars />

      <Suspense fallback={null}>
        <HouseShell />
      </Suspense>

      {/* Playable Character, Controls & Interaction System */}
      <Player />
      <PlayerController />
      <ThirdPersonCamera />
      <InteractionSystem />
    </Canvas>
  );
}
