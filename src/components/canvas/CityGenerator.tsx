"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildTowerTexture } from "@/lib/build-tower-texture";
import { REDUCED } from "./shared-refs";

const DISTRICT_COLORS = ["#ff4060", "#40a0ff", "#40ff80", "#ffa040", "#c060ff", "#40ffd0"];

const glowVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const glowFrag = /* glsl */ `
uniform float uTime;
uniform vec3 uTint;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  float pulse = 0.85 + 0.15 * sin(uTime * 0.7) * sin(uTime * 0.41 + 2.1);
  gl_FragColor = vec4(uTint * pulse, a * 0.35 * pulse);
}
`;

interface Building {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  district: number;
}

function buildBuildings(): Building[] {
  const buildings: Building[] = [];
  const zCenters = [-12.5, -7.5, -2.5, 2.5, 7.5, 12.5];
  for (let d = 0; d < 6; d++) {
    const z = zCenters[d];
    for (let side = 0; side < 2; side++) {
      const xSign = side === 0 ? -1 : 1;
      const w = 1.5 + Math.random() * 2.5;
      const h = 2 + Math.random() * 6;
      const dep = 0.8 + Math.random() * 0.6;
      const x = xSign * (1.5 + w / 2 + Math.random() * 1.5);
      buildings.push({ x, z, w, h, d: dep, district: d });
    }
  }
  return buildings;
}

export function CityGenerator() {
  const glowMats = useRef<Array<THREE.ShaderMaterial | null>>([]);

  const tex = useMemo(() => buildTowerTexture(), []);

  const buildings = useMemo(() => buildBuildings(), []);

  useFrame((_, delta) => {
    const d = REDUCED ? delta * 0.05 : delta;
    glowMats.current.forEach((m) => {
      if (m) m.uniforms.uTime.value += d;
    });
  });

  return (
    <group>
      {buildings.map((b, i) => {
        const color = new THREE.Color(DISTRICT_COLORS[b.district]);
        return (
          <group key={i} position={[b.x, 0, b.z]}>
            <mesh position={[0, b.h / 2 - 0.8, 0]}>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshBasicMaterial map={tex} color={new THREE.Color(2.2, 1.8, 1.5)} toneMapped={false} fog />
            </mesh>
            <mesh position={[0, b.h * 0.35, b.d / 2 + 0.02]} renderOrder={20}>
              <planeGeometry args={[b.w * 0.6, b.h * 0.5]} />
              <shaderMaterial
                ref={(m) => {
                  glowMats.current[i] = m;
                }}
                uniforms={{ uTime: { value: i * 1.7 }, uTint: { value: color } }}
                vertexShader={glowVert}
                fragmentShader={glowFrag}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
