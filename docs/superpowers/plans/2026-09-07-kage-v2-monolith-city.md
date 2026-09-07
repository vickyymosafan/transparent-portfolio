# Kage v2 — Monolith City, Interludes & Richness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the sparse v1 scene into a dense "Monolith City" (lit-window towers, layered fog, embers, HDR bloom), add per-chapter 100vh scene interludes, self-made foreground silhouette layers, and re-frame project cards onto lit features.

**Architecture:** One fixed R3F canvas keeps its custom render flow but splits priorities: pointer/scroll are module-level listeners (no per-frame React), uniform/atom updates run at priority 0, the postprocessing composer renders the main view at priority 1, and the scissor card rig renders dedicated per-card cameras at priority 2 on top of the post-processed frame. DOM gains foreground SVG silhouettes (chapter-owned) and 100vh interludes above each chapter's content.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · framer-motion v12 · three r185 · @react-three/fiber v9 · @react-three/postprocessing (new) · lenis (existing) · zustand (existing)

**Spec:** `docs/superpowers/specs/2026-09-07-kage-v2-monolith-city-design.md`

## Global Constraints

- Palette tokens unchanged; scene-only warm window color `#ffb37a` allowed; warm glow `rgba(255,142,108,.50)`/`rgba(212,56,38,.24)` for card glows.
- Bloom: `<Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={1.1} />`, `multisampling={0}` — only >1.0 sources bloom; DOM text stays crisp.
- Priorities: uniform updates & glow anims = default (0) → composer = 1 → scissor rig = 2. The rig does NOT do a main render anymore (composer owns it); it resets viewport before card passes.
- DPR `[1, 1.75]`; stars 420 desktop / 180 weak; embers 460 / 220 (reuse cores/memory heuristic pattern from `countParticles`).
- `prefers-reduced-motion`: new fog banks static, embers/stars near-static (×0.05 time), glow/markquee CSS handled by the existing global reduced-motion block; pointer/scroll listeners not initialized.
- no-WebGL: canvas hidden; foreground SVG layers still render (DOM).
- No Kage assets; all silhouettes are procedural code. No new shadow maps, no external models.
- Every task gates on `npx tsc --noEmit && npm run lint` (Tasks 1, 9 also `npm run build`).
- Conventional commits, one commit per task. Do NOT `git add package-lock.json` (gitignored).
- Work from the existing worktree `D:\Project\transparent-portfolio\.worktrees\kage-redesign`, branch `kage-redesign` (v1 + polish already merged into this branch).

---

### Task 1: Render pipeline v2 — composer, priority 2 rig, pointer & scroll drift

**Files:**
- Modify: `package.json` (npm)
- Create: `src/lib/pointer-state.ts`
- Create: `src/lib/scroll-progress.ts`
- Modify: `src/components/canvas/SceneInner.tsx`
- Modify: `src/components/canvas/SceneCanvas.tsx` (init listeners)

**Interfaces:**
- Produces: `pointerState = { x: number; y: number }` (normalized −1..1, y up), `initPointerState(): () => void`; `scrollProgress = { value: number }` (0..1), `initScrollProgress(): () => void` — consumed by Task 4 rig + Task 5 foreground parallax.

- [ ] **Step 1: Install postprocessing**

```bash
npm i @react-three/postprocessing
```

- [ ] **Step 2: Create `src/lib/pointer-state.ts`**

```ts
export const pointerState = { x: 0, y: 0 };

export function initPointerState(): () => void {
  const onMove = (e: PointerEvent) => {
    pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => window.removeEventListener("pointermove", onMove);
}
```

- [ ] **Step 3: Create `src/lib/scroll-progress.ts`**

```ts
export const scrollProgress = { value: 0 };

export function initScrollProgress(): () => void {
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    scrollProgress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    scrollProgress.value = 0;
  };
}
```

- [ ] **Step 4: Rework `src/components/canvas/SceneInner.tsx`**

Rig changes (keep chapter damping, fog, moon/mist damping exactly as-is; only these edits):
1. Remove the main render block (`gl.setScissorTest(false); gl.setViewport(...); gl.render(scene, camera);`) — the composer (priority 1) now owns the main pass.
2. Change the card loop: reset viewport BEFORE re-enabling scissor (composer left its own viewport state), use `2` as the `useFrame` priority.
3. Camera targets gain pointer + scroll drift:

```tsx
  useFrame((_, rawDelta) => {
    const s = CHAPTER_SCENES[useChapterStore.getState().active];
    const dt = Math.min(rawDelta, 0.05);

    // ... existing moon/mist/fog damping unchanged ...

    const px = pointerState.x * 0.35;
    const py = pointerState.y * 0.18;
    const drift = scrollProgress.value;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, s.camera[0] + px, SCENE_DAMP.camera, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, s.camera[1] + py - drift * 0.5, SCENE_DAMP.camera, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, s.camera[2], SCENE_DAMP.camera, dt);
    lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, s.lookAt[0] + px * 0.6, SCENE_DAMP.camera, dt);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, s.lookAt[1] + py * 0.5 + drift * 0.8, SCENE_DAMP.camera, dt);
    lookAt.current.z = THREE.MathUtils.damp(lookAt.current.z, s.lookAt[2], SCENE_DAMP.camera, dt);
    camera.lookAt(lookAt.current);

    const views = getLiveViews();
    if (views.length > 0) {
      const dpr = gl.getPixelRatio();
      gl.setScissorTest(false);
      gl.setViewport(0, 0, gl.domElement.width, gl.domElement.height);
      gl.setScissorTest(true);
      // NOTE: window.innerHeight is valid here only because #scene-canvas is fixed inset-0.
      for (const v of views) {
        const r = v.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) continue;
        const x = Math.floor(r.left * dpr);
        const y = Math.floor((window.innerHeight - r.bottom) * dpr);
        const w = Math.floor(r.width * dpr);
        const h = Math.floor(r.height * dpr);
        cardCam.aspect = r.width / r.height;
        cardCam.updateProjectionMatrix();
        cardCam.position.x += v.camOffsetX;
        gl.setViewport(x, y, w, h);
        gl.setScissor(x, y, w, h);
        gl.render(scene, cardCam);
        cardCam.position.x -= v.camOffsetX;
      }
      gl.setScissorTest(false);
    }
  }, 2);
```

4. Add the composer inside the Canvas children (first child, before the rig):

```tsx
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={1.1} />
      </EffectComposer>
```

   with `import { EffectComposer, Bloom } from "@react-three/postprocessing";` and update imports for `pointerState`/`scrollProgress` from `@/lib/pointer-state`, `@/lib/scroll-progress`.
5. Also import the canvas-texture note: nothing else changes in this task.

- [ ] **Step 5: Init listeners in `src/components/canvas/SceneCanvas.tsx`**

In the existing `useEffect` (after the WebGL probe), add (skip under reduced motion):

```ts
    const cleanups: Array<() => void> = [];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cleanups.push(initPointerState(), initScrollProgress());
    }
    // in the effect's return: cleanups.forEach((fn) => fn());
```

(merge with the existing effect's return so all cleanups run; import both libs.)

- [ ] **Step 6: Verify** — `npx tsc --noEmit && npm run lint && npm run build`; brief `npm run dev` smoke: page renders through bloom (scene may look similar; glow sources unchanged yet).

- [ ] **Step 7: Commit** — `feat: postprocessing pipeline, pointer + scroll drift`

---

### Task 2: Atmosphere planes — sky dome, fog banks, ridges

**Files:**
- Create: `src/components/canvas/SkyDome.tsx`
- Create: `src/components/canvas/FogBanks.tsx`
- Create: `src/components/canvas/Ridges.tsx`
- Modify: `src/components/canvas/SceneInner.tsx` (mount 3 components)

**Interfaces:**
- Consumes: `REDUCED` from `./shared-refs`.
- Produces: `<SkyDome />`, `<FogBanks />`, `<Ridges />` (no props), each self-contained with own module-scope uniforms; they accumulate `uTime` in their own `useFrame` (priority 0).

- [ ] **Step 1: Create `src/components/canvas/SkyDome.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
```

(add `import { REDUCED } from "./shared-refs";`)

- [ ] **Step 2: Create `src/components/canvas/FogBanks.tsx`**

```tsx
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
  { z: -5, y: 0.4, alpha: 0.10, speed: 0.015, seed: 3.1, tint: "#16232c" },
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
```

- [ ] **Step 3: Create `src/components/canvas/Ridges.tsx`**

```tsx
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
```

- [ ] **Step 4: Mount in `SceneInner`** — add `<SkyDome />`, `<FogBanks />`, `<Ridges />` inside the Canvas children (order: SkyDome, then FogBanks, then Ridges, then existing EmberMoon/MistField/Monoliths).

- [ ] **Step 5: Verify** — tsc/lint; build; dev smoke: visibly deeper background (gradient sky, drifting fog bands, black ridge silhouettes).

- [ ] **Step 6: Commit** — `feat: sky dome, scrolling fog banks, ridge silhouettes`

---

### Task 3: Monolith City — lit windows + hero tower glows

**Files:**
- Create: `src/components/canvas/MonolithCity.tsx`
- Delete: `src/components/canvas/Monoliths.tsx`
- Modify: `src/components/canvas/SceneInner.tsx` (swap import)

**Interfaces:**
- Produces: `<MonolithCity />` (no props). Hero tower positions fixed so Task 8's card cameras can frame them: tower A at `(2.6, *, -8)`, tower B at `(-3.4, *, -10)`, tower C at `(4.2, *, -12)`.

- [ ] **Step 1: Create `src/components/canvas/MonolithCity.tsx`**

```tsx
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

function buildTowerTexture(): { tex: THREE.CanvasTexture; lit: boolean } {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const g = canvas.getContext("2d");
  if (!g) return { tex: new THREE.CanvasTexture(canvas), lit: false };
  g.fillStyle = "#05080c";
  g.fillRect(0, 0, 128, 256);
  g.strokeStyle = "rgba(10, 16, 22, 0.9)";
  for (let x = 0; x <= 128; x += 32) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 256);
    g.stroke();
  }
  let litAny = false;
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 3; col++) {
      const wx = 12 + col * 36;
      const wy = 14 + row * 22;
      const roll = Math.random();
      if (roll < 0.34) {
        g.fillStyle = roll < 0.1 ? "#ffd7b0" : "#f2ede4";
        litAny = true;
      } else {
        g.fillStyle = "#0a0f16";
      }
      g.fillRect(wx, wy, 20, 12);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  return { tex, lit: litAny };
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

  const { tex, lit } = useMemo(() => buildTowerTexture(), []);

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
        {/* eslint-disable-next-line react-hooks/purity -- color set once; values >1 feed bloom via map multiply */}
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
            {/* eslint-disable-next-line react-hooks/purity -- same bloom-multiply pattern */}
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
```

Note: `lit` from `buildTowerTexture` is informational — remove the unused variable if lint flags it.

- [ ] **Step 2: Swap in `SceneInner`** — replace `import { Monoliths } from "./Monoliths";` + `<Monoliths />` with `MonolithCity`; delete `src/components/canvas/Monoliths.tsx`.

- [ ] **Step 3: Verify** — tsc/lint/build; dev smoke: towers with warm lit windows, glow halos, bloom catching the windows.

- [ ] **Step 4: Commit** — `feat: monolith city with lit windows and hero tower glows`

---

### Task 4: Moon v2 + Stars + Embers + scene-state v2

**Files:**
- Modify: `src/lib/scene-state.ts` (moon coords per chapter, fog density, `countStars`, `countEmbers`, keep `LIVE_WINDOW_OFFSETS` for now)
- Modify: `src/components/canvas/shared-refs.ts` (`mistState` → `emberState { energy }`, moon init)
- Modify: `src/components/canvas/EmberMoon.tsx` (HDR boost + fresnel halo shell)
- Rename/rework: `src/components/canvas/MistField.tsx` → `src/components/canvas/Stars.tsx`
- Create: `src/components/canvas/Embers.tsx`
- Modify: `src/components/canvas/SceneInner.tsx` (swap MistField→Stars, add Embers, rig damping: mistState→emberState.energy)

**Interfaces:**
- Produces: `emberState = { energy: number }` (0..1, damped toward chapter `stream`); `countStars(): number` (420/180), `countEmbers(): number` (460/220) in scene-state; `<Stars />`, `<Embers />` (no props).
- The rig's `mistState.stream/drift` damping lines become `emberState.energy` damping toward `s.stream`; `moonState.intensity = 1 - 0.45 * emberState.energy;`
- Any other file importing `mistState`/`MistField` must be updated in this task (grep first).

- [ ] **Step 1: scene-state v2** — replace `CHAPTER_SCENES` with (moon now left-top; fog slightly lighter):

```ts
export const CHAPTER_SCENES: Record<ChapterId, ChapterScene> = {
  hero: { camera: [0, 1.0, 9], lookAt: [0, 1.2, 0], fogColor: "#080c11", fogDensity: 0.045, moonX: -3.2, moonY: 3.8, moonScale: 1, stream: 0, drift: 1 },
  about: { camera: [0.6, 1.0, 6.5], lookAt: [0.3, 1.4, 0], fogColor: "#0a0e12", fogDensity: 0.05, moonX: -2.8, moonY: 3.4, moonScale: 1.05, stream: 0, drift: 1.2 },
  stats: { camera: [0, 1.1, 6.0], lookAt: [0, 1.6, 0], fogColor: "#0a1116", fogDensity: 0.06, moonX: 2.6, moonY: 4.2, moonScale: 0.85, stream: 1, drift: 0.5 },
  projects: { camera: [1.4, 1.0, 7], lookAt: [0.6, 1.3, 0], fogColor: "#0e0b0a", fogDensity: 0.05, moonX: 0.4, moonY: 2.8, moonScale: 0.95, stream: 0, drift: 0.9 },
  finale: { camera: [0, 1.2, 10], lookAt: [0, 2.2, 0], fogColor: "#070a0e", fogDensity: 0.04, moonX: 0, moonY: 3.8, moonScale: 1.7, stream: 0, drift: 0.4 },
};
```

Add:

```ts
export function countStars(): number {
  if (typeof navigator === "undefined") return 420;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 4 ? 180 : 420;
}

export function countEmbers(): number {
  if (typeof navigator === "undefined") return 460;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 4 ? 220 : 460;
}
```

(Keep `LIVE_WINDOW_OFFSETS`, `SCENE_DAMP`, `countParticles` — `countParticles` may become unused after Task 4; delete it here if nothing imports it anymore, grep first.)

- [ ] **Step 2: shared-refs v2** — `moonState.pos` init `new THREE.Vector3(-3.2, 3.8, -14)`; replace `mistState` with:

```ts
export const emberState = {
  energy: 0,
};
```

- [ ] **Step 3: EmberMoon v2** — keep structure; changes:
  - frag: multiply final color/intensity so core exceeds 1.0: change last line to
    `gl_FragColor = vec4(col * (core * 1.8 + halo * 0.5) * pulse * uIntensity, (core + halo * 0.6) * uIntensity);` and add `toneMapped={false}` to the shaderMaterial.
  - Add a fresnel halo shell mesh (BackSide sphere):

```tsx
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
```

  Render: `<mesh scale={2.6}><sphereGeometry args={[1, 24, 16]} /><shaderMaterial uniforms={{ uIntensity: { value: 1 } }} vertexShader={shellVert} fragmentShader={shellFrag} side={THREE.BackSide} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>` — scale/position follow `moonState` in the same useFrame (shell position copies moonState.pos; keep the main quad at scale moonState.scale, shell at moonState.scale * 2.6).

- [ ] **Step 4: Stars (rework MistField)** — create `src/components/canvas/Stars.tsx`; delete `MistField.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { countStars } from "@/lib/scene-state";
import { REDUCED } from "./shared-refs";

const uniforms = {
  uTime: { value: 0 },
  uSize: { value: 1.6 },
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
attribute float aSeed;
varying float vFade;
varying float vSeed;
void main() {
  vSeed = aSeed;
  vec3 p = position;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.4 + aSeed) * (30.0 / -mv.z);
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.5 + aSeed * 1.5) + aSeed * 40.0);
  vFade = smoothstep(-24.0, -8.0, mv.z) * twinkle * (0.4 + aSeed * 0.6);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
varying float vFade;
varying float vSeed;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.05, d) * vFade;
  vec3 col = mix(vec3(0.78, 0.83, 0.82), vec3(0.85, 0.72, 0.62), step(0.8, vSeed));
  gl_FragColor = vec4(col, alpha);
}
`;

export function Stars() {
  const count = useMemo(() => countStars(), []);
  const { positions, seeds } = useMemo(() => {
    /* eslint-disable react-hooks/purity -- one-time procedural buffer init */
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = 2.5 + Math.random() * 7.5;
      positions[i * 3 + 2] = -8 - Math.random() * 12;
      seeds[i] = Math.random();
    }
    /* eslint-enable react-hooks/purity */
    return { positions, seeds };
  }, [count]);

  useFrame((_, delta) => {
    uniforms.uTime.value += REDUCED ? delta * 0.05 : delta;
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
```

- [ ] **Step 5: Embers** — create `src/components/canvas/Embers.tsx`:

```tsx
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
```

- [ ] **Step 6: Rig + SceneInner updates** — swap `MistField`→`Stars`, add `<Embers />`; rig damping block: replace `mistState.stream/drift` lines with:

```ts
    emberState.energy = THREE.MathUtils.damp(emberState.energy, s.stream, SCENE_DAMP.uniforms, dt);
    moonState.intensity = 1 - 0.45 * emberState.energy;
```

(grep for any other `mistState`/`MistField` importers and update; `countParticles` deletion only if now unused.)

- [ ] **Step 7: Verify** — tsc/lint/build; dev smoke: twinkling stars high, warm embers drifting up, moon strong left-top with fresnel halo, bloom around moon + windows.

- [ ] **Step 8: Commit** — `feat: hdr moon, stars, embers, per-chapter scene state v2`

---

### Task 5: Foreground silhouettes (own assets) + chapter layers

**Files:**
- Create: `src/components/foreground/silhouettes.tsx`
- Create: `src/components/ui/ForegroundLayers.tsx`
- Modify: `src/app/globals.css` (`.fg-item`, `.fg-sway`, keyframes)
- Modify: `src/app/page.tsx` (mount inside z-10 content div)

**Interfaces:**
- Produces: `DryTree`, `BrokenTower`, `GrassTufts` (SVG components, `className?` prop); `<ForegroundLayers />` (reads chapter store + scrollProgress for parallax).

- [ ] **Step 1: Create `src/components/foreground/silhouettes.tsx`**

```tsx
"use client";

import { useMemo } from "react";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function branch(rng: () => number, x: number, y: number, len: number, angle: number, depth: number, out: string[]) {
  const x2 = x + Math.cos(angle) * len;
  const y2 = y - Math.sin(angle) * len;
  out.push(`M ${x.toFixed(1)} ${y.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  if (depth <= 0) return;
  const n = 2 + (rng() > 0.6 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    branch(rng, x2, y2, len * (0.62 + rng() * 0.18), angle + (rng() - 0.5) * 1.5, depth - 1, out);
  }
}

export function DryTree({ className, flip }: { className?: string; flip?: boolean }) {
  const paths = useMemo(() => {
    const rng = mulberry32(7331);
    const out: string[] = [];
    branch(rng, 200, 300, 92, Math.PI / 2 + (rng() - 0.5) * 0.2, 4, out);
    return out;
  }, []);
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <linearGradient id="fg-fade-tree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04070a" stopOpacity="0.92" />
          <stop offset="1" stopColor="#04070a" stopOpacity="1" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} stroke="url(#fg-fade-tree)" strokeWidth={i === 0 ? 7 : 3.2} strokeLinecap="round" fill="none" />
      ))}
    </svg>
  );
}

export function BrokenTower({ className, flip }: { className?: string; flip?: boolean }) {
  const d = useMemo(() => {
    const rng = mulberry32(4242);
    const pts: string[] = [];
    const baseY = 300;
    const leftX = 60;
    const rightX = 300;
    let x = leftX;
    let y = baseY;
    pts.push(`M ${x} ${y}`);
    x = leftX - 8;
    y = 90 + rng() * 30;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    x += 20;
    y -= 18 + rng() * 16;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    x += 60 + rng() * 40;
    y += (rng() - 0.5) * 30;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    x = rightX;
    y = 120 + rng() * 40;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    pts.push(`L ${rightX + 8} ${baseY}`);
    pts.push("Z");
    return pts.join(" ");
  }, []);
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d={d} fill="#04070a" fillOpacity="0.94" />
    </svg>
  );
}

export function GrassTufts({ className, flip }: { className?: string; flip?: boolean }) {
  const blades = useMemo(() => {
    const rng = mulberry32(909);
    return Array.from({ length: 46 }, () => {
      const x = 20 + rng() * 360;
      const h = 26 + rng() * 54;
      const lean = (rng() - 0.5) * 60;
      return `M ${x.toFixed(1)} 300 Q ${(x + lean * 0.4).toFixed(1)} ${(300 - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(300 - h).toFixed(1)}`;
    });
  }, []);
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {blades.map((d, i) => (
        <path key={i} d={d} stroke="#04070a" strokeOpacity={0.9} strokeWidth={2 + (i % 3)} fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/ForegroundLayers.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useChapterStore, type ChapterId } from "@/lib/chapter-store";
import { scrollProgress } from "@/lib/scroll-progress";
import { DryTree, BrokenTower, GrassTufts } from "@/components/foreground/silhouettes";

type Piece = { Comp: typeof DryTree; left: string; width: number; flip?: boolean; bottom?: string };
const SETS: Record<ChapterId, Piece[]> = {
  hero: [
    { Comp: DryTree, left: "-4%", width: 340 },
    { Comp: GrassTufts, left: "58%", width: 420, flip: true },
  ],
  about: [
    { Comp: GrassTufts, left: "-6%", width: 460 },
    { Comp: BrokenTower, left: "70%", width: 300 },
  ],
  stats: [{ Comp: GrassTufts, left: "64%", width: 420, flip: true }],
  projects: [
    { Comp: BrokenTower, left: "-8%", width: 340 },
    { Comp: DryTree, left: "74%", width: 300, flip: true },
  ],
  finale: [{ Comp: GrassTufts, left: "40%", width: 480 }],
};

export function ForegroundLayers() {
  const wrap = useRef<HTMLDivElement>(null);
  const active = useChapterStore((s) => s.active);

  useEffect(() => {
    const onScroll = () => {
      if (wrap.current) {
        wrap.current.style.transform = `translate3d(0, ${-scrollProgress.value * 36}px, 0)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pieces = SETS[active];

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-[1]">
      {pieces.map((p, i) => (
        <div
          key={`${active}-${i}`}
          className={`fg-item fg-sway absolute bottom-[-12px] ${i > 0 ? "fg-delay" : ""}`}
          style={{ left: p.left, width: p.width }}
        >
          <p.Comp className="block w-full" flip={p.flip} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: CSS in `src/app/globals.css`** (append):

```css
/* ===== Foreground layers ===== */
.fg-item {
  opacity: 0;
  transform: translate3d(0, 12%, 0);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fg-item.on { opacity: 1; transform: translate3d(0, 0, 0); }
.fg-delay { transition-delay: 0.12s; }

.fg-sway svg { animation: fg-sway 21s ease-in-out infinite alternate; transform-origin: 40% 100%; }
@keyframes fg-sway {
  from { transform: rotate(-0.5deg) translate3d(0, 2px, 0); }
  to { transform: rotate(0.5deg) translate3d(0, -6px, 0); }
}

.fg-item svg { filter: saturate(0.85) brightness(0.8); }
```

Then in `ForegroundLayers`, mark items active: add `on` class when mounted — since the set re-renders per chapter, simplest: items render with `on` applied via a small effect: in the component add

```ts
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      wrap.current?.querySelectorAll(".fg-item").forEach((el) => el.classList.add("on"));
    });
    return () => cancelAnimationFrame(t);
  }, [active]);
```

(SVGs must render inside elements with class `fg-item fg-sway` — adjust Step 2's JSX: outer div gets `fg-item`, inner wraps svg with the sway class; final code: outer `div.fg-item` with `style`, inner `div.fg-sway` wrapping `<p.Comp />`.)

- [ ] **Step 4: Mount in `page.tsx`** — inside the `relative z-10` content div, BEFORE `<Hero />`:

```tsx
            <ForegroundLayers />
```

- [ ] **Step 5: Verify** — tsc/lint; dev: silhouettes rise per chapter, sway gently, sit behind text but above scrims.

- [ ] **Step 6: Commit** — `feat: procedural foreground silhouettes, chapter-owned layers`

---

### Task 6: Scene interludes

**Files:**
- Modify: `src/components/ui/Animations.tsx` (add `RevealTitle`)
- Create: `src/components/ui/Interlude.tsx`
- Modify: `src/components/features/About.tsx`, `src/components/features/Stats.tsx`, `src/components/features/ProjectList.tsx` (prepend interlude inside each section)

**Interfaces:**
- Produces: `<Interlude numeral title tagline />` (fills 100svh, includes eyebrow "Chapter NN", giant outline numeral with scroll parallax, `RevealTitle`).

- [ ] **Step 1: Add `RevealTitle` to Animations.tsx**

```tsx
export function RevealTitle({ text, className }: { text: string; className?: string }) {
    return (
        <motion.h2
            className={className}
            initial={{ opacity: 0, y: 34, filter: "blur(14px)", letterSpacing: "0.08em" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "-0.02em" }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
            {text}
        </motion.h2>
    );
}
```

- [ ] **Step 2: Create `src/components/ui/Interlude.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealTitle } from "@/components/ui/Animations";

export function Interlude({ numeral, title, tagline }: { numeral: string; title: string; tagline: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

    return (
        <div ref={ref} className="relative flex min-h-svh flex-col items-start justify-center px-[clamp(20px,3.4vw,56px)]">
            <div className="sec-scrim sec-scrim--open" />
            <motion.span
                aria-hidden
                style={{ y }}
                className="pointer-events-none absolute right-[4vw] top-1/2 z-0 -translate-y-1/2 select-none text-[22vw] font-light leading-none text-transparent [-webkit-text-stroke:1px_rgba(223,231,224,0.10)]"
            >
                {numeral}
            </motion.span>
            <div className="relative z-10">
                <p className="eyebrow mb-6 flex items-center gap-2.5">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#e0231c] shadow-[0_0_10px_#e0231c]" />
                    Chapter {numeral}
                </p>
                <RevealTitle
                    text={title}
                    className="text-[clamp(48px,10vw,140px)] uppercase leading-[0.95] tracking-[-0.02em] text-bone"
                />
                <p className="mt-6 max-w-[42ch] text-[clamp(14px,1.02vw,17px)] font-light text-[#9aa5a0]">{tagline}</p>
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Restructure sections** — in each of About/Stats/ProjectsSection, insert as the FIRST child of the `<section>`:

- About: `<Interlude numeral="01" title="The Builder" tagline="How I work: PRDs, structured prompts, and engineering discipline — applied with AI agents, not replaced by them." />`
- Stats: `<Interlude numeral="02" title="Live Pulse" tagline="Contributions, hours, and languages — measured while they happen, not remembered afterwards." />`
- Projects: `<Interlude numeral="03" title="The Work" tagline="Shipped systems with real users. Selected, not collected." />`

Keep existing content blocks unchanged below the interlude; section-level scrim stays (interlude carries its own `sec-scrim--open`).

- [ ] **Step 4: Verify** — tsc/lint; dev: interludes at each chapter entry, giant numeral parallax, title blur-in; chips/rail anchors unchanged.

- [ ] **Step 5: Commit** — `feat: chapter scene interludes with giant outline numerals`

---

### Task 7: Cards v2 — dedicated camera framings + anchored glow

**Files:**
- Modify: `src/lib/scene-state.ts` (add `CARD_VIEWS`)
- Modify: `src/components/canvas/live-registry.ts` (v2 shape)
- Modify: `src/components/canvas/SceneInner.tsx` (rig card loop uses per-card cam/look + hover push)
- Modify: `src/components/canvas/LiveWindow.tsx` (v2 props + glow + hover)
- Modify: `src/components/features/ProjectList.tsx` (pass glow configs)
- Modify: `src/app/globals.css` (`.card-glow` + keyframes)

**Interfaces:**
- `scene-state.ts` produces:

```ts
export interface CardView {
  cam: [number, number, number];
  look: [number, number, number];
}

export const CARD_VIEWS: CardView[] = [
  { cam: [2.2, 1.6, -3.2], look: [2.6, 2.4, -8] },
  { cam: [-4.6, 3.4, 2.2], look: [-3.2, 3.8, -12] },
  { cam: [-1.0, 0.8, 1.2], look: [1.4, 0.9, -6] },
];
```

- `live-registry.ts` v2 (full file):

```ts
import type { CardView } from "@/lib/scene-state";

export interface LiveView {
  el: HTMLElement;
  view: CardView;
  hover: boolean;
}

const views = new Map<HTMLElement, LiveView>();

export function registerLiveView(el: HTMLElement, view: CardView): () => void {
  views.set(el, { el, view, hover: false });
  return () => {
    views.delete(el);
  };
}

export function setLiveViewHover(el: HTMLElement, hover: boolean): void {
  const v = views.get(el);
  if (v) v.hover = hover;
}

export function getLiveViews(): LiveView[] {
  return Array.from(views.values());
}
```

- Rig card loop replacement (keep priority 2, viewport reset, rect math; remove `cardCam.copy(camera)` and the ± camOffsetX):

```ts
      for (const v of views) {
        const r = v.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) continue;
        const x = Math.floor(r.left * dpr);
        const y = Math.floor((window.innerHeight - r.bottom) * dpr);
        const w = Math.floor(r.width * dpr);
        const h = Math.floor(r.height * dpr);
        const push = v.hover ? 0.12 : 0;
        cardCam.position.set(
          v.view.cam[0] + (v.view.look[0] - v.view.cam[0]) * push,
          v.view.cam[1] + (v.view.look[1] - v.view.cam[1]) * push,
          v.view.cam[2] + (v.view.look[2] - v.view.cam[2]) * push
        );
        cardCam.aspect = r.width / r.height;
        cardCam.updateProjectionMatrix();
        cardCam.lookAt(v.view.look[0], v.view.look[1], v.view.look[2]);
        gl.setViewport(x, y, w, h);
        gl.setScissor(x, y, w, h);
        gl.render(scene, cardCam);
      }
```

- `LiveWindow.tsx` v2 (full file):

```tsx
"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { registerLiveView, setLiveViewHover } from "./live-registry";
import { CARD_VIEWS } from "@/lib/scene-state";

export interface CardGlow {
  gx: number;
  gy: number;
  gr: number;
  variant: "moon" | "flame";
}

export function LiveWindow({
  index,
  className,
  glow,
}: {
  index: number;
  className?: string;
  glow?: CardGlow;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || document.documentElement.classList.contains("no-webgl")) return;
        const view = CARD_VIEWS[index % CARD_VIEWS.length];
        const unregister = registerLiveView(el, view);
        return () => unregister();
    }, [index]);

    return (
        <div className={`relative overflow-hidden bg-[linear-gradient(150deg,#101a1d,#0a0d10_62%,#1a0c0b)] ${className ?? ""}`}>
            <div
                ref={ref}
                className="absolute inset-0"
                data-live-window={index}
                onMouseEnter={() => ref.current && setLiveViewHover(ref.current, true)}
                onMouseLeave={() => ref.current && setLiveViewHover(ref.current, false)}
            />
            {glow && (
                <span
                    aria-hidden
                    className={`card-glow ${glow.variant === "flame" ? "card-glow--flame" : ""}`}
                    style={{ left: `${glow.gx}%`, top: `${glow.gy}%`, "--gr": `${glow.gr}%` } as CSSProperties}
                />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/70" />
        </div>
    );
}
```

- `ProjectList.tsx` — pass glows:

```tsx
const CARD_GLOWS: CardGlow[] = [
  { gx: 50, gy: 38, gr: 20, variant: "flame" },
  { gx: 24, gy: 22, gr: 16, variant: "moon" },
  { gx: 62, gy: 55, gr: 18, variant: "flame" },
];
```

and `<LiveWindow index={idx} className="absolute inset-0" glow={CARD_GLOWS[idx]} />` (import `CardGlow` type).

- `globals.css` append:

```css
/* ===== Card glow (anchored on lit sources) ===== */
.card-glow {
  position: absolute;
  z-index: 5;
  pointer-events: none;
  translate: -50% -50%;
  width: calc(var(--gr) * 2);
  aspect-ratio: 1;
  mix-blend-mode: screen;
  animation: glow-swell 9.7s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;
}
.card-glow::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: radial-gradient(closest-side, rgba(255, 142, 108, 0.5), rgba(212, 56, 38, 0.24) 40%, transparent 72%);
  animation: glow-pulse 6.1s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}
.card-glow--flame::before { animation: glow-flame 4.3s linear infinite; }
@keyframes glow-swell {
  from { transform: scale(0.93); }
  to { transform: scale(1.07); }
}
@keyframes glow-pulse {
  from { opacity: 0.78; }
  50% { opacity: 1; }
  to { opacity: 0.78; }
}
@keyframes glow-flame {
  0% { opacity: 0.74; } 6% { opacity: 0.97; } 12% { opacity: 0.63; } 19% { opacity: 0.9; }
  27% { opacity: 0.55; } 34% { opacity: 0.94; } 42% { opacity: 0.71; } 51% { opacity: 1; }
  58% { opacity: 0.6; } 66% { opacity: 0.88; } 74% { opacity: 0.67; } 83% { opacity: 0.96; }
  91% { opacity: 0.72; } 100% { opacity: 0.74; }
}
@media (prefers-reduced-motion: reduce) {
  .card-glow, .card-glow::before { animation: none; }
}
```

- [ ] **Steps:** implement → gates (`tsc`, `lint`, `build`) → dev smoke (cards show lit tower / moon+ridge / ember field with anchored glow; hover pushes in) → commit `feat: project cards frame lit features with anchored glow`

---

### Task 8: Extras — marquee, stats count-up, finale stagger

**Files:**
- Modify: `src/components/features/Contact.tsx` (marquee strip between CTA block and footer; CTA motion delay)
- Modify: `src/components/features/Stats.tsx` (CountUp on StatCard values)

- [ ] **Step 1: Marquee in Contact** — between the centered CTA column and `<footer>`, add:

```tsx
            <div className="relative z-10 mt-20 overflow-hidden border-y border-bone/[0.07] py-3">
                <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
                    {[0, 1].map((half) => (
                        <div key={half} className="flex items-center gap-10">
                            {["Live Data", "Shipped", "Open Source", "No Fluff", "Built in the Open"].map((word) => (
                                <span key={word} className="flex items-center gap-10 text-[13px] uppercase tracking-[0.3em] text-bone/25">
                                    {word}
                                    <span className="text-[#e0231c]">·</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
```

(`animate-marquee` + its keyframes already exist in globals from v1; two identical halves over `w-max` = seamless loop.)

- [ ] **Step 2: CTA stagger** — wrap the CTA `<a className="cta-pill …">` in:

```tsx
                <motion.a
                    href="mailto:mvickymosafan@gmail.com"
                    className="cta-pill mt-11 border border-bone/15 px-[30px] py-[17px] text-[11px] font-medium uppercase tracking-[0.22em] text-bone"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
```

(same inner content; import `motion` in Contact.tsx.)

- [ ] **Step 3: CountUp in Stats** — add to `src/components/features/Stats.tsx`:

```tsx
function CountUp({ value }: { value: string }) {
    const match = value.match(/^([\d.,]+)/);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    useEffect(() => {
        if (!inView || !match || !ref.current) return;
        const target = parseFloat(match[1].replace(/,/g, ""));
        const controls = animate(0, target, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                if (ref.current) {
                    ref.current.textContent = Math.round(v).toLocaleString("en-US") + value.slice(match[1].length);
                }
            },
        });
        return () => controls.stop();
    }, [inView, match, value]);

    if (!match) return <>{value}</>;
    return <span ref={ref}>{match[1]}</span>;
}
```

imports: `animate, useInView` from framer-motion, `useEffect, useRef` from react. In `StatCard`, replace `{value}` in the `<h3>` with `<CountUp value={value} />`.

- [ ] **Step 4: Verify + commit** — tsc/lint; marquee loops seamlessly; numbers count up; CTA staggers. Commit `feat: kinetic marquee, stat count-up, finale stagger`.

---

### Task 9: Verification sweep

**Files:** only files with real issues.

- [ ] **Step 1:** `npx tsc --noEmit && npm run lint && npm run build` — fix all findings.
- [ ] **Step 2: Headless smoke** — dev/start server, verify SSR: all 5 `data-chapter` + interlude titles ("The Builder", "Live Pulse", "The Work") present; stats data values render; no console errors.
- [ ] **Step 3: Browser checklist for the human** (not verifiable headless): bloom intensity taste, fog density, card framings (may want CARD_VIEWS/`glow` tweaks), interlude numeral parallax, foreground silhouettes per chapter, hover push on cards, mobile (sheets/cards/foreground), reduced-motion (fog static, glows static, reveals instant), Lighthouse.
- [ ] **Step 4:** fix found issues; commit `chore: v2 verification fixes`.

---

## Self-Review

- **Spec coverage:** §3 layers → Tasks 2 (sky/fog/ridges), 3 (city), 4 (moon/stars/embers/grade), 1 (bloom/priorities); mouse parallax + scroll drift → Task 1; §4 foreground → Task 5; §5 interludes → Task 6; §6 cards → Task 7; §7 extras → Task 8; §8 performance/reduced-motion → constraints + each task; §9 out-of-scope — constraints.
- **Placeholders:** none — every step carries final code or exact values.
- **Type consistency:** `emberState`, `CardView`, `CARD_VIEWS`, `registerLiveView(el, view)`, `setLiveViewHover`, `LiveView`, `countStars`, `countEmbers`, `Interlude`, `RevealTitle`, `ForegroundLayers`, `SmoothScroll` (existing) — referenced consistently; `LIVE_WINDOW_OFFSETS` becomes dead after Task 7 → delete it in Task 7 (grep first).
