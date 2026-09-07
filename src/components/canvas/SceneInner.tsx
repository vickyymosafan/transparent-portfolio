"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useChapterStore } from "@/lib/chapter-store";
import { CHAPTER_SCENES, SCENE_DAMP } from "@/lib/scene-state";
import { getLiveViews } from "./live-registry";
import { EmberMoon } from "./EmberMoon";
import { MistField } from "./MistField";
import { Monoliths } from "./Monoliths";
import { cardCam, mistState, moonState, tmpColor } from "./shared-refs";

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
    mistState.stream = THREE.MathUtils.damp(mistState.stream, s.stream, SCENE_DAMP.uniforms, dt);
    mistState.drift = THREE.MathUtils.damp(mistState.drift, s.drift, SCENE_DAMP.uniforms, dt);
    moonState.intensity = 1 - 0.45 * mistState.stream;

    const fog = scene.fog;
    if (fog instanceof THREE.FogExp2) {
      fog.color.lerp(tmpColor.set(s.fogColor), 1 - Math.exp(-SCENE_DAMP.uniforms * dt));
      fog.density = THREE.MathUtils.damp(fog.density, s.fogDensity, SCENE_DAMP.uniforms, dt);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, s.camera[0], SCENE_DAMP.camera, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, s.camera[1], SCENE_DAMP.camera, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, s.camera[2], SCENE_DAMP.camera, dt);
    lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, s.lookAt[0], SCENE_DAMP.camera, dt);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, s.lookAt[1], SCENE_DAMP.camera, dt);
    lookAt.current.z = THREE.MathUtils.damp(lookAt.current.z, s.lookAt[2], SCENE_DAMP.camera, dt);
    camera.lookAt(lookAt.current);

    gl.setScissorTest(false);
    gl.setViewport(0, 0, gl.domElement.width, gl.domElement.height);
    gl.render(scene, camera);

    const views = getLiveViews();
    if (views.length > 0) {
      const dpr = gl.getPixelRatio();
      cardCam.copy(camera as THREE.PerspectiveCamera);
      gl.setScissorTest(true);
      // NOTE: window.innerHeight is valid here only because #scene-canvas is fixed inset-0.
      for (const v of views) {
        const r = v.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) continue;
        const x = Math.floor(r.left * dpr);
        const y = Math.floor((window.innerHeight - r.bottom) * dpr);
        const w = Math.floor(r.width * dpr);
        const h = Math.floor(r.height * dpr);
        cardCam.aspect = r.width / r.height;
        cardCam.updateProjectionMatrix();
        cardCam.position.x += v.camOffsetX;
        gl.setViewport(x, y, w, h);
        gl.setScissor(x, y, w, h);
        gl.render(scene, cardCam);
        cardCam.position.x -= v.camOffsetX;
      }
      gl.setScissorTest(false);
    }
  }, 1);
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
      <SceneRig />
      <EmberMoon />
      <MistField />
      <Monoliths />
    </Canvas>
  );
}
