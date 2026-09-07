"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { REDUCED } from "./shared-refs";

const COUNT = 18;

const HERO_TOWERS = [
  { pos: [2.6, 0, -8] as [number, number, number], w: 0.9, h: 6.2, glow: 3.4 },
  { pos: [-3.4, 0, -10] as [number, number, number], w: 1.1, h: 7.4, glow: 3.0 },
  { pos: [4.2, 0, -12] as [number, number, number], w: 0.8, h: 5.4, glow: 2.8 },
];

function buildTowerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);
  g.fillStyle = "#05080c";
  g.fillRect(0, 0, 128, 256);
  g.strokeStyle = "rgba(10, 16, 22, 0.9)";
  for (let x = 0; x <= 128; x += 32) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 256);
    g.stroke();
  }
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 3; col++) {
      const wx = 12 + col * 36;
      const wy = 14 + row * 22;
      const roll = Math.random();
      if (roll < 0.34) {
        g.fillStyle = roll < 0.1 ? "#ffd7b0" : "#f2ede4";
      } else {
        g.fillStyle = "#0a0f16";
      }
      g.fillRect(wx, wy, 20, 12);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

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

export function MonolithCity() {
  const instanced = useRef<THREE.InstancedMesh>(null);
  const glowMats = useRef<Array<THREE.ShaderMaterial | null>>([]);

  const tex = useMemo(() => buildTowerTexture(), []);

  useEffect(() => {
    const m = instanced.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      const x = -11 + (i / (COUNT - 1)) * 22 + (Math.random() - 0.5) * 1.4;
      const h = 1.8 + Math.random() * 5.6;
      dummy.position.set(x, h / 2 - 0.8, -6.5 - Math.random() * 9);
      dummy.scale.set(0.5 + Math.random() * 0.7, h, 0.45);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    const d = REDUCED ? delta * 0.05 : delta;
    glowMats.current.forEach((m) => {
      if (m) m.uniforms.uTime.value += d;
    });
  });

  return (
    <group>
      <instancedMesh ref={instanced} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          map={tex}
          color={new THREE.Color(2.4, 2.0, 1.7)}
          toneMapped={false}
          fog
        />
      </instancedMesh>

      {HERO_TOWERS.map((t, i) => (
        <group key={i} position={[t.pos[0], t.pos[1], t.pos[2]]}>
          <mesh position={[0, t.h / 2 - 0.8, 0]}>
            <boxGeometry args={[t.w, t.h, 0.5]} />
            <meshBasicMaterial
              map={tex}
              color={new THREE.Color(t.glow, t.glow * 0.85, t.glow * 0.7)}
              toneMapped={false}
              fog
            />
          </mesh>
          <mesh position={[0, t.h * 0.35, 0.4]} renderOrder={20}>
            <planeGeometry args={[t.w * 6, t.h * 0.9]} />
            <shaderMaterial
              ref={(m) => {
                glowMats.current[i] = m;
              }}
              uniforms={{ uTime: { value: i * 2.3 }, uTint: { value: new THREE.Color("#ff9a4d") } }}
              vertexShader={glowVert}
              fragmentShader={glowFrag}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
