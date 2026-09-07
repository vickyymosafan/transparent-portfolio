"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { REDUCED } from "./shared-refs";

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uAlpha;
uniform float uSeed;
uniform vec3 uTint;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = vUv * vec2(3.0, 1.4) + vec2(uTime * uSpeed + uSeed, uSeed);
  float n = fbm(uv);
  float band = smoothstep(0.15, 0.75, n) * smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
  gl_FragColor = vec4(uTint, band * uAlpha);
}
`;

const BANKS = [
  { z: -5, y: 0.4, alpha: 0.1, speed: 0.015, seed: 3.1, tint: "#16232c" },
  { z: -8, y: 0.8, alpha: 0.08, speed: 0.008, seed: 7.7, tint: "#131c26" },
  { z: -11, y: 0.6, alpha: 0.06, speed: 0.02, seed: 11.3, tint: "#1c1512" },
  { z: -14, y: 1.0, alpha: 0.05, speed: 0.012, seed: 17.9, tint: "#101820" },
];

export function FogBanks() {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<Array<THREE.ShaderMaterial | null>>([]);

  useFrame((_, delta) => {
    const d = REDUCED ? delta * 0.05 : delta;
    mats.current.forEach((m) => {
      if (m) m.uniforms.uTime.value += d;
    });
  });

  return (
    <group ref={group}>
      {BANKS.map((b, i) => (
        <FogBank key={i} bank={b} index={i} mats={mats} />
      ))}
    </group>
  );
}

function FogBank({
  bank,
  index,
  mats,
}: {
  bank: (typeof BANKS)[number];
  index: number;
  mats: React.MutableRefObject<Array<THREE.ShaderMaterial | null>>;
}) {
  const uniforms = {
    uTime: { value: bank.seed * 10 },
    uSpeed: { value: bank.speed },
    uAlpha: { value: bank.alpha },
    uSeed: { value: bank.seed },
    uTint: { value: new THREE.Color(bank.tint) },
  };
  return (
    <mesh position={[0, bank.y, bank.z]} renderOrder={10 + index}>
      <planeGeometry args={[26, 7]} />
      <shaderMaterial
        ref={(m) => {
          /* eslint-disable-next-line react-hooks/immutability -- R3F ref callback: collecting material refs for uTime updates is intentional */
          mats.current[index] = m;
        }}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
