"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { moonState } from "./shared-refs";

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float core = smoothstep(0.36, 0.0, d);
  float halo = smoothstep(1.0, 0.1, d) * 0.5;
  float pulse = 0.82 + 0.18 * sin(uTime * 0.83) * sin(uTime * 0.47 + 1.7);
  vec3 col = mix(vec3(1.0, 0.35, 0.24), vec3(0.88, 0.14, 0.11), smoothstep(0.0, 0.34, d));
  gl_FragColor = vec4(col * (core + halo * 0.5) * pulse * uIntensity, (core + halo * 0.6) * uIntensity);
}
`;

const uniforms = {
  uTime: { value: 0 },
  uIntensity: { value: 1 },
};

export function EmberMoon() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.copy(moonState.pos);
      mesh.current.scale.setScalar(moonState.scale);
    }
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
      mat.current.uniforms.uIntensity.value = moonState.intensity;
    }
  });

  return (
    <mesh position={[3.4, 3.6, -14]}>
      <planeGeometry args={[9, 9]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
