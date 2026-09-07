"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { moonState, REDUCED } from "./shared-refs";

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
  gl_FragColor = vec4(col * (core * 1.8 + halo * 0.5) * pulse * uIntensity, (core + halo * 0.6) * uIntensity);
}
`;

const shellVert = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const shellFrag = /* glsl */ `
uniform float uIntensity;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.0);
  gl_FragColor = vec4(vec3(1.0, 0.36, 0.22) * fres * 1.6 * uIntensity, fres * 0.5 * uIntensity);
}
`;

const uniforms = {
  uTime: { value: 0 },
  uIntensity: { value: 1 },
};

let moonTime = 0;

export function EmberMoon() {
  const mesh = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (shell.current) {
      shell.current.position.copy(moonState.pos);
      shell.current.scale.setScalar(moonState.scale * 2.6);
    }
    if (mesh.current) {
      mesh.current.position.copy(moonState.pos);
      mesh.current.scale.setScalar(moonState.scale);
    }
    if (mat.current) {
      moonTime += REDUCED ? delta * 0.05 : delta;
      mat.current.uniforms.uTime.value = moonTime;
      mat.current.uniforms.uIntensity.value = moonState.intensity;
    }
  });

  return (
    <>
      <mesh position={[3.4, 3.6, -14]}>
        <planeGeometry args={[9, 9]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vert}
          fragmentShader={frag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={2.6}>
        <sphereGeometry args={[1, 24, 16]} />
        <shaderMaterial
          uniforms={{ uIntensity: { value: 1 } }}
          vertexShader={shellVert}
          fragmentShader={shellFrag}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
