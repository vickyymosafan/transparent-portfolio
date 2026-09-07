"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { countStars } from "@/lib/scene-state";
import { REDUCED } from "./shared-refs";

const uniforms = {
  uTime: { value: 0 },
  uSize: { value: 1.6 },
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
attribute float aSeed;
varying float vFade;
varying float vSeed;
void main() {
  vSeed = aSeed;
  vec3 p = position;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.4 + aSeed) * (30.0 / -mv.z);
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.5 + aSeed * 1.5) + aSeed * 40.0);
  vFade = smoothstep(-24.0, -8.0, mv.z) * twinkle * (0.4 + aSeed * 0.6);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
varying float vFade;
varying float vSeed;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.05, d) * vFade;
  vec3 col = mix(vec3(0.78, 0.83, 0.82), vec3(0.85, 0.72, 0.62), step(0.8, vSeed));
  gl_FragColor = vec4(col, alpha);
}
`;

export function Stars() {
  const count = useMemo(() => countStars(), []);
  const { positions, seeds } = useMemo(() => {
    /* eslint-disable react-hooks/purity -- one-time procedural buffer init */
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = 2.5 + Math.random() * 7.5;
      positions[i * 3 + 2] = -8 - Math.random() * 12;
      seeds[i] = Math.random();
    }
    /* eslint-enable react-hooks/purity */
    return { positions, seeds };
  }, [count]);

  useFrame((_, delta) => {
    uniforms.uTime.value += REDUCED ? delta * 0.05 : delta;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
