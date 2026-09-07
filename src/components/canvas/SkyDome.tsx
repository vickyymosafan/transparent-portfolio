"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { REDUCED } from "./shared-refs";

const vert = /* glsl */ `
varying vec3 vWorld;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = /* glsl */ `
varying vec3 vWorld;
uniform vec3 uTop;
uniform vec3 uBottom;
uniform float uTime;
void main() {
  float h = clamp((vWorld.y + 4.0) / 16.0, 0.0, 1.0);
  vec3 col = mix(uBottom, uTop, pow(h, 0.8));
  float cloud = sin(vWorld.x * 0.35 + uTime * 0.05) * sin(vWorld.y * 0.5 + uTime * 0.03);
  col += vec3(0.010, 0.014, 0.018) * smoothstep(0.2, 1.0, cloud);
  gl_FragColor = vec4(col, 1.0);
}
`;

const uniforms = {
  uTime: { value: 0 },
  uTop: { value: new THREE.Color("#05070a") },
  uBottom: { value: new THREE.Color("#0a0f16") },
};

export function SkyDome() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, delta) => {
    if (mat.current) mat.current.uniforms.uTime.value += REDUCED ? delta * 0.05 : delta;
  });
  return (
    <mesh renderOrder={-10}>
      <sphereGeometry args={[60, 24, 16]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
