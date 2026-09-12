"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { REDUCED } from "./shared-refs";

const COUNT = 2000;

const vertexShader = /* glsl */ `
uniform float uTime;
attribute float aSeed;
attribute float aSpeed;
varying float vFade;
void main() {
  vec3 p = position;
  float t = uTime * (0.6 + aSeed * 0.4);
  p.y = mod(p.y - uTime * aSpeed * 4.0, 12.0) - 2.0;
  p.x += sin(t + aSeed * 6.2831) * 0.15;
  p.z += cos(t * 0.7 + aSeed * 4.0) * 0.1;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.5 + aSeed * 2.0) * (20.0 / -mv.z);
  float fadeIn = smoothstep(12.0, 8.0, -mv.z);
  float fadeOut = smoothstep(-4.0, 0.0, mv.z);
  vFade = fadeIn * fadeOut * (0.3 + aSeed * 0.7);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.05, d) * vFade;
  gl_FragColor = vec4(0.6, 0.7, 1.0, alpha * 0.6);
}
`;

export function Rain() {
  const uniforms = useRef({ uTime: { value: 0 } }).current;

  const { positions, seeds, speeds } = useMemo(() => {
    /* eslint-disable react-hooks/purity -- one-time procedural buffer init */
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 12 - 2;
      positions[i * 3 + 2] = -16 + Math.random() * 32;
      seeds[i] = Math.random();
      speeds[i] = 0.6 + Math.random() * 0.8;
    }
    /* eslint-enable react-hooks/purity */
    return { positions, seeds, speeds };
  }, []);

  useFrame((_, delta) => {
    uniforms.uTime.value += REDUCED ? delta * 0.05 : delta;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
