"use client";

import * as THREE from "three";

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = /* glsl */ `
uniform float uSeed;
uniform float uHeight;
uniform vec3 uColor;
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
  float ridge = fbm(vec2(vUv.x * 6.0 + uSeed, uSeed));
  float top = uHeight * (0.6 + 0.4 * ridge);
  if (vUv.y > top) discard;
  gl_FragColor = vec4(uColor, 1.0);
}
`;

const RIDGES = [
  { z: -9, y: 1.0, w: 30, h: 3.2, height: 0.55, seed: 5.2 },
  { z: -13, y: 1.2, w: 34, h: 4.5, height: 0.7, seed: 12.8 },
];

export function Ridges() {
  return (
    <group>
      {RIDGES.map((r, i) => (
        <mesh key={i} position={[0, r.y, r.z]}>
          <planeGeometry args={[r.w, r.h]} />
          <shaderMaterial
            uniforms={{
              uSeed: { value: r.seed },
              uHeight: { value: r.height },
              uColor: { value: new THREE.Color("#04070b") },
            }}
            vertexShader={vert}
            fragmentShader={frag}
            transparent
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}
