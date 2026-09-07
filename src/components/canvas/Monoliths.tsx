"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 16;

export function Monoliths() {
  const mesh = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const x = -10 + (i / (COUNT - 1)) * 20 + (Math.random() - 0.5) * 1.2;
      const h = 1.4 + Math.random() * 5.2;
      dummy.position.set(x, h / 2 - 0.6, -6 - Math.random() * 8);
      dummy.scale.set(0.35 + Math.random() * 0.55, h, 0.35);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, color.setHSL(0.5 + Math.random() * 0.1, 0.15, 0.045 + Math.random() * 0.03));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#0b1014" fog />
    </instancedMesh>
  );
}
