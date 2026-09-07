"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { pointerState } from "@/lib/pointer-state";
import { scrollProgress } from "@/lib/scroll-progress";
import { useChapterStore } from "@/lib/chapter-store";
import { CHAPTER_SCENES, SCENE_DAMP } from "@/lib/scene-state";
import { getLiveViews } from "./live-registry";
import { SkyDome } from "./SkyDome";
import { FogBanks } from "./FogBanks";
import { Ridges } from "./Ridges";
import { EmberMoon } from "./EmberMoon";
import { Stars } from "./Stars";
import { Embers } from "./Embers";
import { MonolithCity } from "./MonolithCity";
import { cardCam, emberState, moonState, tmpColor } from "./shared-refs";

function SceneRig() {
  const { camera, gl, scene } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 1.2, 0));

  /* eslint-disable react-hooks/immutability -- R3F: per-frame damped mutation of the scene graph, fog and camera is intentional */
  useFrame((_, rawDelta) => {
    const s = CHAPTER_SCENES[useChapterStore.getState().active];
    const dt = Math.min(rawDelta, 0.05);

    moonState.pos.x = THREE.MathUtils.damp(moonState.pos.x, s.moonX, SCENE_DAMP.uniforms, dt);
    moonState.pos.y = THREE.MathUtils.damp(moonState.pos.y, s.moonY, SCENE_DAMP.uniforms, dt);
    moonState.scale = THREE.MathUtils.damp(moonState.scale, s.moonScale, SCENE_DAMP.uniforms, dt);
    emberState.energy = THREE.MathUtils.damp(emberState.energy, s.stream, SCENE_DAMP.uniforms, dt);
    moonState.intensity = 1 - 0.45 * emberState.energy;

    const fog = scene.fog;
    if (fog instanceof THREE.FogExp2) {
      fog.color.lerp(tmpColor.set(s.fogColor), 1 - Math.exp(-SCENE_DAMP.uniforms * dt));
      fog.density = THREE.MathUtils.damp(fog.density, s.fogDensity, SCENE_DAMP.uniforms, dt);
    }

    const px = pointerState.x * 0.35;
    const py = pointerState.y * 0.18;
    const drift = scrollProgress.value;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, s.camera[0] + px, SCENE_DAMP.camera, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, s.camera[1] + py - drift * 0.5, SCENE_DAMP.camera, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, s.camera[2], SCENE_DAMP.camera, dt);
    lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, s.lookAt[0] + px * 0.6, SCENE_DAMP.camera, dt);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, s.lookAt[1] + py * 0.5 + drift * 0.8, SCENE_DAMP.camera, dt);
    lookAt.current.z = THREE.MathUtils.damp(lookAt.current.z, s.lookAt[2], SCENE_DAMP.camera, dt);
    camera.lookAt(lookAt.current);

    const views = getLiveViews();
    if (views.length > 0) {
      const dpr = gl.getPixelRatio();
      gl.setScissorTest(false);
      gl.setViewport(0, 0, gl.domElement.width, gl.domElement.height);
      gl.setScissorTest(true);
      // NOTE: window.innerHeight is valid here only because #scene-canvas is fixed inset-0.
      for (const v of views) {
        const r = v.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) continue;
        const x = Math.floor(r.left * dpr);
        const y = Math.floor((window.innerHeight - r.bottom) * dpr);
        const w = Math.floor(r.width * dpr);
        const h = Math.floor(r.height * dpr);
        const push = v.hover ? 0.12 : 0;
        cardCam.position.set(
          v.view.cam[0] + (v.view.look[0] - v.view.cam[0]) * push,
          v.view.cam[1] + (v.view.look[1] - v.view.cam[1]) * push,
          v.view.cam[2] + (v.view.look[2] - v.view.cam[2]) * push
        );
        cardCam.aspect = r.width / r.height;
        cardCam.updateProjectionMatrix();
        cardCam.lookAt(v.view.look[0], v.view.look[1], v.view.look[2]);
        gl.setViewport(x, y, w, h);
        gl.setScissor(x, y, w, h);
        gl.render(scene, cardCam);
      }
      gl.setScissorTest(false);
    }
  }, 2);
  /* eslint-enable react-hooks/immutability */

  return <fogExp2 attach="fog" args={["#05070a", 0.055]} />;
}

export default function SceneInner({ onReady, onContextLost }: { onReady?: () => void; onContextLost?: () => void }) {
  return (
    <Canvas
      camera={{ fov: 50, position: [0, 1, 9] }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#05070a");
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          document.documentElement.classList.add("no-webgl");
          onContextLost?.();
        });
        requestAnimationFrame(() => onReady?.());
      }}
    >
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={1.1} />
      </EffectComposer>
      <SceneRig />
      <SkyDome />
      <FogBanks />
      <Ridges />
      <EmberMoon />
      <Stars />
      <Embers />
      <MonolithCity />
    </Canvas>
  );
}
