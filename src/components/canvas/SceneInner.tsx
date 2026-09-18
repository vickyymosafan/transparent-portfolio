"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { SkyDome } from "./SkyDome";
import { Stars } from "./Stars";
import { CinematicZones } from "./CinematicZones";
import { WalkPathController } from "./WalkPathController";

interface SceneInnerProps {
  onReady?: () => void;
  onContextLost?: () => void;
}

export default function SceneInner({ onReady, onContextLost }: SceneInnerProps) {
  return (
    <Canvas
      shadows
      camera={{ fov: 46, position: [0, 1.6, 9] }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.18,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0c1017");
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          document.documentElement.classList.add("no-webgl");
          onContextLost?.();
        });
        requestAnimationFrame(() => onReady?.());
      }}
    >
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.84} luminanceSmoothing={0.35} intensity={0.75} />
      </EffectComposer>
      <fogExp2 attach="fog" args={["#141c2b", 0.003]} />
      <SkyDome />
      <Stars />
      <CinematicZones />
      <WalkPathController />
    </Canvas>
  );
}

