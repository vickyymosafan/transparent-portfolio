"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const vert = /* glsl */ `
varying vec3 vWorld;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = /* glsl */ `
varying vec3 vWorld;
uniform vec3 uZenith;
uniform vec3 uMid;
uniform vec3 uHorizon;
uniform float uTime;

void main() {
  // Normalized elevation angle from horizon
  float h = clamp((vWorld.y + 2.0) / 36.0, 0.0, 1.0);
  
  // Rich 3-point evening twilight color ramp
  vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.35, h));
  col = mix(col, uZenith, smoothstep(0.35, 1.0, h));
  
  // Soft, distant atmospheric evening cloud wisps
  float cloud = sin(vWorld.x * 0.08 + uTime * 0.015) * sin((vWorld.y + vWorld.z * 0.4) * 0.12 + uTime * 0.01);
  col += vec3(0.012, 0.018, 0.026) * smoothstep(0.3, 0.95, cloud);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

const uniforms = {
  uTime: { value: 0 },
  uZenith: { value: new THREE.Color("#070d1a") },  // Deep night indigo
  uMid: { value: new THREE.Color("#132238") },     // Twilight slate blue
  uHorizon: { value: new THREE.Color("#252830") }, // Subtle warm dusk horizon glow
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
