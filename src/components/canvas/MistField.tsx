"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { countParticles } from "@/lib/scene-state";
import { mistState } from "./shared-refs";

const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const mistUniforms = {
  uTime: { value: 0 },
  uStream: { value: 0 },
  uDrift: { value: 1 },
  uSize: { value: 2.2 },
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uStream;
uniform float uDrift;
uniform float uSize;
attribute float aSeed;
varying float vFade;
varying float vSeed;
void main() {
  vSeed = aSeed;
  vec3 p = position;
  float t = uTime * (0.05 + aSeed * 0.08) * uDrift;
  p.x += sin(t + aSeed * 6.2831) * 0.9;
  p.z += cos(t * 0.8 + aSeed * 4.0) * 0.5;
  float fall = mod(position.y - uTime * (0.5 + aSeed * 0.6), 9.0) - 4.0;
  p.y = mix(p.y, fall, uStream);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.5 + aSeed) * (30.0 / -mv.z);
  vFade = smoothstep(-20.0, -6.0, mv.z) * (0.3 + aSeed * 0.6);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uStream;
varying float vFade;
varying float vSeed;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.05, d) * vFade;
  vec3 col = mix(vec3(0.72, 0.78, 0.75), vec3(0.55, 0.72, 0.80), uStream);
  col = mix(col, vec3(1.0, 0.35, 0.24), step(0.94, vSeed) * 0.8);
  gl_FragColor = vec4(col, alpha);
}
`;

export function MistField() {
  const count = useMemo(() => countParticles(), []);

  const { positions, seeds } = useMemo(() => {
    /* eslint-disable react-hooks/purity -- one-time procedural buffer init; not render-derived state */
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = -1 - Math.random() * 14;
      seeds[i] = Math.random();
    }
    /* eslint-enable react-hooks/purity */
    return { positions, seeds };
  }, [count]);

  useFrame((_, delta) => {
    mistUniforms.uTime.value += REDUCED ? delta * 0.05 : delta;
    mistUniforms.uStream.value = mistState.stream;
    mistUniforms.uDrift.value = mistState.drift;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={mistUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
