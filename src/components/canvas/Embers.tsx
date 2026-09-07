"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { countEmbers } from "@/lib/scene-state";
import { emberState, REDUCED } from "./shared-refs";

const uniforms = {
  uTime: { value: 0 },
  uEnergy: { value: 0 },
  uSize: { value: 2.6 },
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform float uSize;
attribute float aSeed;
varying float vFade;
void main() {
  vec3 p = position;
  float t = uTime * (0.10 + aSeed * 0.14) * (1.0 + uEnergy * 1.6);
  p.y = mod(p.y + uTime * (0.12 + aSeed * 0.2) * (1.0 + uEnergy * 2.0), 8.0) - 1.0;
  p.x += sin(t + aSeed * 6.2831) * 0.7;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.4 + aSeed) * (30.0 / -mv.z);
  float tw = 0.6 + 0.4 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 30.0);
  vFade = smoothstep(-16.0, -4.0, mv.z) * tw * (0.35 + aSeed * 0.65);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uEnergy;
varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.05, d) * vFade;
  vec3 col = mix(vec3(1.6, 0.78, 0.42), vec3(0.85, 0.86, 0.95), uEnergy * 0.7);
  gl_FragColor = vec4(col, alpha);
}
`;

export function Embers() {
  const count = useMemo(() => countEmbers(), []);
  const { positions, seeds } = useMemo(() => {
    /* eslint-disable react-hooks/purity -- one-time procedural buffer init */
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = -2 - Math.random() * 10;
      seeds[i] = Math.random();
    }
    /* eslint-enable react-hooks/purity */
    return { positions, seeds };
  }, [count]);

  useFrame((_, delta) => {
    uniforms.uTime.value += REDUCED ? delta * 0.05 : delta;
    uniforms.uEnergy.value = emberState.energy;
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
