# Kage-Style Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a Kage-style experience: one fixed WebGL scene behind the whole page, five scroll-driven "chapters" that evolve the scene, live-window project cards, and Kage furniture (preloader, nav, rail, custom cursor) — with zero borrowed Kage assets.

**Architecture:** A single fixed `<Canvas>` (react-three-fiber) at z-0 renders a shader-built world (mist particles, instanced monolith skyline, ember moon). A zustand store holds the active chapter (`hero | about | stats | projects | finale`), set by an IntersectionObserver mounted in the nav; the scene rig damps camera/fog/uniforms toward that chapter's state every frame. DOM content scrolls above with per-section radial scrims. Project cards register their DOM rects into a module registry; a `useFrame(..., 1)` rig takes over rendering and re-renders the same scene into each card's rect via scissor viewports. Full CSS fallback when WebGL is unavailable or motion is reduced.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · framer-motion (existing) · three + @react-three/fiber v9 + zustand (new)

**Spec:** `docs/superpowers/specs/2026-09-06-kage-style-portfolio-redesign-design.md`

## Global Constraints

- No Japanese characters anywhere (no kanji, no Noto fonts, no `.jp` classes).
- Palette tokens (exact): `--ink:#05070a` · `--ink-2:#0a0e12` · `--bone:#dfe7e0` · `--bone-dim:#aab4ad` · `--muted-k:#78837c` · `--line:rgba(223,231,224,.13)` · `--line-soft:rgba(223,231,224,.07)` · `--vermilion:#e0231c` · `--ember:#ff5a3c`.
- Easing (exact): reveals/UI `cubic-bezier(.16,1,.3,1)`; scroll cue `cubic-bezier(.65,0,.35,1)`.
- DPR cap `[1, 1.75]`; particles: 2500 desktop / 800 weak devices (cores ≤ 4 or deviceMemory ≤ 4).
- `prefers-reduced-motion`: reveals instant, scene drift ×0.05, damped transitions flattened by CSS.
- No-WebGL: hide canvas (`#scene-canvas`), CSS radial-gradient sky on body, static gradient in project cards; the page never depends on the scene.
- Scene is never the LCP: hero text is SSR; scene fades in over 1200ms.
- Chapter lerp targets come only from `CHAPTER_SCENES`; components never hardcode scene values.
- Every task gates on `npx tsc --noEmit && npm run lint` before commit; Tasks 3, 9, 10 also run `npm run build`.
- Data sources untouched: `src/services/mockData.ts` exports `PROJECTS` (title, desc, tech, category?, link?), `TECH_STACK`, `MOCK_GITHUB`, `MOCK_WAKATIME`, `Language`.
- Conventional commits, one commit per task.

---

### Task 1: Dependencies + all Kage CSS

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm)
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces (used by every later task): Tailwind tokens `ink, ink-2, bone, bone-dim, muted-k, vermilion, ember`; classes `.vignette`, `.sec-scrim`, `.sec-scrim--center`, `.sec-scrim--open`, `.eyebrow`, `.cur-dot`, `.cur-dot.act`, `.nav-wash`, `.lesson-row`, `.cta-pill`, `.no-webgl` fallback; `animate-cue`.

- [ ] **Step 1: Install dependencies**

```bash
npm i three @react-three/fiber zustand
npm i -D @types/three
```

- [ ] **Step 2: Edit `src/app/globals.css`**

Inside the existing `:root {}` block, append:

```css
  --ink: #05070a;
  --ink-2: #0a0e12;
  --bone: #dfe7e0;
  --bone-dim: #aab4ad;
  --muted-k: #78837c;
  --line: rgba(223, 231, 224, 0.13);
  --line-soft: rgba(223, 231, 224, 0.07);
  --vermilion: #e0231c;
  --ember: #ff5a3c;
```

Inside the existing `@theme inline {}` block, add:

```css
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-bone: var(--bone);
  --color-bone-dim: var(--bone-dim);
  --color-muted-k: var(--muted-k);
  --color-line: var(--line);
  --color-line-soft: var(--line-soft);
  --color-vermilion: var(--vermilion);
  --color-ember: var(--ember);

  --animate-cue: cue 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;

  @keyframes cue {
    0% { transform: scaleX(0); }
    42% { transform: scaleX(1); }
    100% { transform: scaleX(1) translateX(100%); }
  }
```

At the end of the file, append:

```css
/* ===== Kage utilities ===== */
.vignette {
  position: fixed;
  inset: 0;
  z-index: 55;
  pointer-events: none;
  background: radial-gradient(125% 95% at 50% 42%, transparent 40%, rgba(2, 4, 6, 0.55) 100%);
}

.sec-scrim {
  position: absolute;
  inset: -22% -4%;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(110% 62% at 30% 50%, rgba(4, 7, 10, 0.88), rgba(4, 7, 10, 0.62) 42%, rgba(4, 7, 10, 0.18) 74%, rgba(4, 7, 10, 0));
  mask-image: linear-gradient(transparent, #000 44%);
  -webkit-mask-image: linear-gradient(transparent, #000 44%);
}
.sec-scrim--center {
  background: radial-gradient(108% 64% at 50% 50%, rgba(4, 7, 10, 0.7), rgba(4, 7, 10, 0.44) 50%, rgba(4, 7, 10, 0));
}
.sec-scrim--open {
  background: radial-gradient(82% 58% at 50% 46%, rgba(4, 7, 10, 0.26), rgba(4, 7, 10, 0.66) 56%, rgba(4, 7, 10, 0.9) 82%, rgba(4, 7, 10, 0));
}

.eyebrow {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bone-dim);
}

.cur-dot {
  position: fixed;
  z-index: 80;
  top: 0;
  left: 0;
  width: 26px;
  height: 26px;
  margin: -13px 0 0 -13px;
  border: 1px solid rgba(223, 231, 224, 0.42);
  border-radius: 9999px;
  pointer-events: none;
  opacity: 0;
  transition:
    width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    margin 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.35s,
    border-color 0.35s,
    opacity 0.3s;
}
.cur-dot.act {
  width: 52px;
  height: 52px;
  margin: -26px 0 0 -26px;
  background: rgba(223, 231, 224, 0.07);
  border-color: rgba(223, 231, 224, 0.6);
}
@media (hover: hover) and (pointer: fine) {
  .cur-dot { opacity: 1; }
}

.nav-wash {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgba(5, 7, 10, 0.62);
  backdrop-filter: blur(14px) saturate(1.1);
  -webkit-backdrop-filter: blur(14px) saturate(1.1);
  opacity: 0;
  transition: opacity 0.5s linear;
}
.nav-wash.on { opacity: 1; }

.lesson-row { position: relative; transition: padding 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.lesson-row::before {
  content: "";
  position: absolute;
  left: -1.5rem;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(224, 35, 28, 0.09), transparent 46%);
  opacity: 0;
  transition: opacity 0.55s;
  pointer-events: none;
}
.lesson-row:hover::before { opacity: 1; }
.lesson-row::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 1px;
  width: 100%;
  background: var(--vermilion);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.lesson-row:hover::after { transform: scaleX(1); }

.cta-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  overflow: hidden;
  border: 1px solid rgba(223, 231, 224, 0.15);
  border-radius: 100px;
  transition: color 0.45s, border-color 0.45s;
}
.cta-pill i {
  position: absolute;
  inset: 0;
  background: var(--bone);
  transform: translate3d(0, 101%, 0);
  transition: transform 0.62s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta-pill:hover { color: var(--ink); border-color: var(--bone); }
.cta-pill:hover i { transform: none; }

.no-webgl #scene-canvas { display: none; }
.no-webgl body {
  background:
    radial-gradient(11vw 11vw at 73% 17%, rgba(232, 52, 28, 0.95), rgba(158, 20, 16, 0.62) 44%, rgba(96, 12, 12, 0.2) 64%, transparent 72%),
    radial-gradient(38vw 32vw at 50% 46%, rgba(228, 104, 24, 0.4), rgba(122, 42, 10, 0.18) 54%, transparent 74%),
    radial-gradient(120% 80% at 50% 0%, rgba(120, 150, 158, 0.16), transparent 60%),
    #05070a;
  background-attachment: fixed;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit && npm run lint` → pass.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/app/globals.css
git commit -m "feat: three/r3f/zustand deps and kage design tokens"
```

---

### Task 2: Chapter store, scene state, chapter observer

**Files:**
- Create: `src/lib/chapter-store.ts`
- Create: `src/lib/scene-state.ts`
- Create: `src/lib/use-chapter-observer.ts`

**Interfaces:**
- Produces:
  - `type ChapterId = "hero" | "about" | "stats" | "projects" | "finale"`
  - `useChapterStore` → `{ active: ChapterId; setActive: (c: ChapterId) => void }`
  - `CHAPTER_ORDER: ChapterId[]`, `CHAPTER_LABELS: Record<ChapterId, string>`
  - `ChapterScene`, `CHAPTER_SCENES: Record<ChapterId, ChapterScene>`, `SCENE_DAMP = { camera: 2.2, uniforms: 1.8 }`, `countParticles(): number`
  - `useChapterTracker(): void`

- [ ] **Step 1: Create `src/lib/chapter-store.ts`**

```ts
import { create } from "zustand";

export type ChapterId = "hero" | "about" | "stats" | "projects" | "finale";

interface ChapterState {
  active: ChapterId;
  setActive: (chapter: ChapterId) => void;
}

export const useChapterStore = create<ChapterState>((set) => ({
  active: "hero",
  setActive: (active) => set({ active }),
}));

export const CHAPTER_ORDER: ChapterId[] = ["hero", "about", "stats", "projects", "finale"];

export const CHAPTER_LABELS: Record<ChapterId, string> = {
  hero: "Intro",
  about: "About",
  stats: "Live Data",
  projects: "Projects",
  finale: "Contact",
};
```

- [ ] **Step 2: Create `src/lib/scene-state.ts`**

```ts
import type { ChapterId } from "./chapter-store";

export interface ChapterScene {
  camera: [number, number, number];
  lookAt: [number, number, number];
  fogColor: string;
  fogDensity: number;
  moonX: number;
  moonY: number;
  moonScale: number;
  stream: number;
  drift: number;
}

export const CHAPTER_SCENES: Record<ChapterId, ChapterScene> = {
  hero: { camera: [0, 1.0, 9], lookAt: [0, 1.2, 0], fogColor: "#0a0e12", fogDensity: 0.055, moonX: 3.4, moonY: 3.6, moonScale: 1, stream: 0, drift: 1 },
  about: { camera: [0.6, 1.0, 6.5], lookAt: [0.3, 1.4, 0], fogColor: "#0c0f12", fogDensity: 0.06, moonX: 3.0, moonY: 3.2, moonScale: 1.05, stream: 0, drift: 1.2 },
  stats: { camera: [0, 1.1, 6.0], lookAt: [0, 1.6, 0], fogColor: "#0a1116", fogDensity: 0.075, moonX: -2.6, moonY: 4.0, moonScale: 0.8, stream: 1, drift: 0.5 },
  projects: { camera: [1.4, 1.0, 7], lookAt: [0.6, 1.3, 0], fogColor: "#100c0a", fogDensity: 0.06, moonX: 0.8, moonY: 2.8, moonScale: 0.95, stream: 0, drift: 0.9 },
  finale: { camera: [0, 1.2, 10], lookAt: [0, 2.2, 0], fogColor: "#080a0e", fogDensity: 0.05, moonX: 0, moonY: 3.4, moonScale: 1.7, stream: 0, drift: 0.4 },
};

export const SCENE_DAMP = { camera: 2.2, uniforms: 1.8 } as const;

export function countParticles(): number {
  if (typeof navigator === "undefined") return 2500;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 4 ? 800 : 2500;
}
```

- [ ] **Step 3: Create `src/lib/use-chapter-observer.ts`**

```ts
"use client";

import { useEffect } from "react";
import { useChapterStore, type ChapterId } from "./chapter-store";

export function useChapterTracker() {
  const setActive = useChapterStore((s) => s.setActive);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.chapter as ChapterId | undefined;
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setActive]);
}
```

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npm run lint` → pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chapter-store.ts src/lib/scene-state.ts src/lib/use-chapter-observer.ts
git commit -m "feat: chapter store, per-chapter scene states, scroll tracker"
```

---

### Task 3: WebGL scene — shared refs, EmberMoon, MistField, Monoliths, SceneInner, SceneCanvas

**Files:**
- Create: `src/components/canvas/shared-refs.ts`
- Create: `src/components/canvas/live-registry.ts`
- Create: `src/components/canvas/EmberMoon.tsx`
- Create: `src/components/canvas/MistField.tsx`
- Create: `src/components/canvas/Monoliths.tsx`
- Create: `src/components/canvas/SceneInner.tsx`
- Create: `src/components/canvas/SceneCanvas.tsx`
- Modify: `src/app/page.tsx` (temporary `<SceneCanvas />` mount for verification)

**Interfaces:**
- Consumes: `CHAPTER_SCENES`, `SCENE_DAMP`, `countParticles` (Task 2).
- Produces:
  - `moonState = { pos: THREE.Vector3; scale: number; intensity: number }`, `mistState = { stream: number; drift: number }`, `cardCam: THREE.PerspectiveCamera`, `tmpColor: THREE.Color` from `shared-refs.ts`
  - `registerLiveView(el: HTMLElement, camOffsetX: number): () => void`, `getLiveViews(): LiveView[]` from `live-registry.ts` (consumed by Task 8)
  - `SceneCanvas` named export from `SceneCanvas.tsx`

- [ ] **Step 1: Create `src/components/canvas/shared-refs.ts`**

```ts
import * as THREE from "three";

export const moonState = {
  pos: new THREE.Vector3(3.4, 3.6, -14),
  scale: 1,
  intensity: 1,
};

export const mistState = {
  stream: 0,
  drift: 1,
};

export const cardCam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 100);

export const tmpColor = new THREE.Color();
```

- [ ] **Step 2: Create `src/components/canvas/live-registry.ts`**

```ts
export interface LiveView {
  el: HTMLElement;
  camOffsetX: number;
}

const views = new Map<HTMLElement, LiveView>();

export function registerLiveView(el: HTMLElement, camOffsetX: number): () => void {
  views.set(el, { el, camOffsetX });
  return () => {
    views.delete(el);
  };
}

export function getLiveViews(): LiveView[] {
  return Array.from(views.values());
}
```

- [ ] **Step 3: Create `src/components/canvas/EmberMoon.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `src/components/canvas/MistField.tsx`**

```tsx
"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { countParticles } from "@/lib/scene-state";
import { mistState } from "./shared-refs";

const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const mistUniforms = {
  uTime: { value: 0 },
  uStream: { value: 0 },
  uDrift: { value: 1 },
  uSize: { value: 2.2 },
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uStream;
uniform float uDrift;
uniform float uSize;
attribute float aSeed;
varying float vFade;
varying float vSeed;
void main() {
  vSeed = aSeed;
  vec3 p = position;
  float t = uTime * (0.05 + aSeed * 0.08) * uDrift;
  p.x += sin(t + aSeed * 6.2831) * 0.9;
  p.z += cos(t * 0.8 + aSeed * 4.0) * 0.5;
  float fall = mod(position.y - uTime * (0.5 + aSeed * 0.6), 9.0) - 4.0;
  p.y = mix(p.y, fall, uStream);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.5 + aSeed) * (30.0 / -mv.z);
  vFade = smoothstep(-20.0, -6.0, mv.z) * (0.3 + aSeed * 0.6);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uStream;
varying float vFade;
varying float vSeed;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.05, d) * vFade;
  vec3 col = mix(vec3(0.72, 0.78, 0.75), vec3(0.55, 0.72, 0.80), uStream);
  col = mix(col, vec3(1.0, 0.35, 0.24), step(0.94, vSeed) * 0.8);
  gl_FragColor = vec4(col, alpha);
}
`;

export function MistField() {
  const count = useMemo(countParticles, []);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = -1 - Math.random() * 14;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  useFrame((_, delta) => {
    mistUniforms.uTime.value += REDUCED ? delta * 0.05 : delta;
    mistUniforms.uStream.value = mistState.stream;
    mistUniforms.uDrift.value = mistState.drift;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={mistUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

(R3F v9: bufferAttribute uses `args={[array, itemSize]}`. `frustumCulled={false}` because positions move in-shader.)

- [ ] **Step 5: Create `src/components/canvas/Monoliths.tsx`**

```tsx
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
```

- [ ] **Step 6: Create `src/components/canvas/SceneInner.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useChapterStore } from "@/lib/chapter-store";
import { CHAPTER_SCENES, SCENE_DAMP } from "@/lib/scene-state";
import { getLiveViews } from "./live-registry";
import { EmberMoon } from "./EmberMoon";
import { MistField } from "./MistField";
import { Monoliths } from "./Monoliths";
import { cardCam, mistState, moonState, tmpColor } from "./shared-refs";

function SceneRig() {
  const { camera, gl, scene } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((_, rawDelta) => {
    const s = CHAPTER_SCENES[useChapterStore.getState().active];
    const dt = Math.min(rawDelta, 0.05);

    moonState.pos.x = THREE.MathUtils.damp(moonState.pos.x, s.moonX, SCENE_DAMP.uniforms, dt);
    moonState.pos.y = THREE.MathUtils.damp(moonState.pos.y, s.moonY, SCENE_DAMP.uniforms, dt);
    moonState.scale = THREE.MathUtils.damp(moonState.scale, s.moonScale, SCENE_DAMP.uniforms, dt);
    mistState.stream = THREE.MathUtils.damp(mistState.stream, s.stream, SCENE_DAMP.uniforms, dt);
    mistState.drift = THREE.MathUtils.damp(mistState.drift, s.drift, SCENE_DAMP.uniforms, dt);
    moonState.intensity = 1 - 0.45 * mistState.stream;

    const fog = scene.fog;
    if (fog instanceof THREE.FogExp2) {
      fog.color.lerp(tmpColor.set(s.fogColor), 1 - Math.exp(-SCENE_DAMP.uniforms * dt));
      fog.density = THREE.MathUtils.damp(fog.density, s.fogDensity, SCENE_DAMP.uniforms, dt);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, s.camera[0], SCENE_DAMP.camera, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, s.camera[1], SCENE_DAMP.camera, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, s.camera[2], SCENE_DAMP.camera, dt);
    lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, s.lookAt[0], SCENE_DAMP.camera, dt);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, s.lookAt[1], SCENE_DAMP.camera, dt);
    lookAt.current.z = THREE.MathUtils.damp(lookAt.current.z, s.lookAt[2], SCENE_DAMP.camera, dt);
    camera.lookAt(lookAt.current);

    gl.setScissorTest(false);
    gl.setViewport(0, 0, gl.domElement.width, gl.domElement.height);
    gl.render(scene, camera);

    const views = getLiveViews();
    if (views.length > 0) {
      const dpr = gl.getPixelRatio();
      cardCam.copy(camera as THREE.PerspectiveCamera);
      gl.setScissorTest(true);
      for (const v of views) {
        const r = v.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) continue;
        const x = Math.floor(r.left * dpr);
        const y = Math.floor((window.innerHeight - r.bottom) * dpr);
        const w = Math.floor(r.width * dpr);
        const h = Math.floor(r.height * dpr);
        cardCam.position.x += v.camOffsetX;
        gl.setViewport(x, y, w, h);
        gl.setScissor(x, y, w, h);
        gl.render(scene, cardCam);
        cardCam.position.x -= v.camOffsetX;
      }
      gl.setScissorTest(false);
    }
  }, 1);

  return <fogExp2 attach="fog" args={["#05070a", 0.055]} />;
}

export default function SceneInner({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      camera={{ fov: 50, position: [0, 1, 9] }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#05070a");
        requestAnimationFrame(() => onReady?.());
      }}
    >
      <SceneRig />
      <EmberMoon />
      <MistField />
      <Monoliths />
    </Canvas>
  );
}
```

Note: with `useFrame(cb, 1)` R3F disables its automatic render — the main `gl.render(scene, camera)` pass above is required and must run before the scissor pass.

- [ ] **Step 7: Create `src/components/canvas/SceneCanvas.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SceneInner = dynamic(() => import("./SceneInner"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function SceneCanvas() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ok = hasWebGL();
    if (!ok) document.documentElement.classList.add("no-webgl");
    setSupported(ok);
  }, []);

  if (supported !== true) return null;

  return (
    <div
      id="scene-canvas"
      className={`fixed inset-0 z-0 transition-opacity duration-[1200ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <SceneInner onReady={() => setReady(true)} />
    </div>
  );
}
```

- [ ] **Step 8: Temporary mount in `src/app/page.tsx`** — add the import and place `<SceneCanvas />` as the first child inside `<main>` (final layout comes in Task 9):

```tsx
import { SceneCanvas } from "@/components/canvas/SceneCanvas";
```

```tsx
<SceneCanvas />
```

- [ ] **Step 9: Verify** — `npm run dev`: near-black page, drifting particles, red moon glow upper right, faint monolith skyline. `npx tsc --noEmit && npm run lint && npm run build` → pass.

- [ ] **Step 10: Commit**

```bash
git add src/components/canvas src/app/page.tsx
git commit -m "feat: webgl scene — mist, monolith skyline, ember moon, chapter rig + scissor support"
```

---

### Task 4: Furniture — WordMask, Preloader, CustomCursor, ProgressRail, SiteNav

**Files:**
- Modify: `src/components/ui/Animations.tsx` (append `WordMask`)
- Create: `src/components/ui/Preloader.tsx`
- Create: `src/components/ui/CustomCursor.tsx`
- Create: `src/components/ui/ProgressRail.tsx`
- Create: `src/components/layout/SiteNav.tsx`

**Interfaces:**
- Consumes: `CHAPTER_ORDER`, `CHAPTER_LABELS`, `useChapterTracker` (Task 2).
- Produces: `WordMask({ text, className?, delay?, stagger? })` (Tasks 5–9); `Preloader`, `CustomCursor`, `ProgressRail`, `SiteNav` (mounted in Task 9). SiteNav runs `useChapterTracker()` internally.

- [ ] **Step 1: Append `WordMask` to `src/components/ui/Animations.tsx`** (extend the existing framer-motion import to include `useReducedMotion` is NOT needed — global CSS handles reduced motion; exact code):

```tsx
export function WordMask({
    text,
    className,
    delay = 0,
    stagger = 0.08,
}: {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
}) {
    const words = text.split(" ");
    return (
        <motion.span className={className} initial="hidden" whileInView="visible" viewport={{ once: true }} aria-label={text}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
                    <motion.span
                        className="inline-block"
                        initial={{ y: "112%", opacity: 0 }}
                        variants={{ visible: { y: "0%", opacity: 1 } }}
                        transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
                    >
                        {word}
                        {i < words.length - 1 ? "\u00A0" : ""}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}
```

- [ ] **Step 2: Create `src/components/ui/Preloader.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

export function Preloader() {
    const [done, setDone] = useState(false);
    const [pct, setPct] = useState(0);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const start = performance.now();
        let raf = 0;
        let finished = false;
        const tick = (t: number) => {
            if (finished) return;
            const elapsed = t - start;
            setPct(Math.min(100, Math.round((elapsed / 1600) * 100)));
            if (elapsed >= 2200 || (elapsed >= 1600 && document.fonts.status === "loaded")) {
                finished = true;
                document.body.style.overflow = "";
                setDone(true);
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            finished = true;
            cancelAnimationFrame(raf);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            aria-hidden={done}
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-all duration-700 ${
                done ? "pointer-events-none invisible opacity-0" : "opacity-100"
            }`}
        >
            <div className="w-[min(420px,74vw)] text-center">
                <div className="mx-auto mb-6 h-11 w-11 rounded-full border border-bone/30" />
                <p className="eyebrow mb-5 tracking-[0.5em]">Transparent Portfolio</p>
                <div className="relative h-px overflow-hidden bg-bone/15">
                    <i className="absolute inset-y-0 left-0 bg-bone transition-[right] duration-300" style={{ right: `${100 - pct}%` }} />
                </div>
                <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted-k">
                    <span>Loading</span>
                    <b className="font-medium tabular-nums text-bone-dim">{pct}%</b>
                </div>
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Create `src/components/ui/CustomCursor.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
    const dot = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const el = dot.current;
        if (!el) return;
        let x = -100;
        let y = -100;
        let cx = -100;
        let cy = -100;
        let raf = 0;
        const onMove = (e: MouseEvent) => {
            x = e.clientX;
            y = e.clientY;
        };
        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement | null;
            el.classList.toggle("act", !!t?.closest("a, button, [data-cursor]"));
        };
        const loop = () => {
            cx += (x - cx) * 0.18;
            cy += (y - cy) * 0.18;
            el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
            raf = requestAnimationFrame(loop);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseover", onOver);
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onOver);
        };
    }, []);

    return <div ref={dot} className="cur-dot" aria-hidden />;
}
```

- [ ] **Step 4: Create `src/components/ui/ProgressRail.tsx`**

```tsx
"use client";

import { CHAPTER_LABELS, CHAPTER_ORDER, useChapterStore } from "@/lib/chapter-store";

export function ProgressRail() {
    const active = useChapterStore((s) => s.active);
    return (
        <nav aria-label="Chapters" className="fixed right-6 top-1/2 z-[45] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
            {CHAPTER_ORDER.map((id) => (
                <button
                    key={id}
                    aria-label={CHAPTER_LABELS[id]}
                    onClick={() => document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: "smooth" })}
                    className="grid h-2.5 w-5 place-items-center"
                >
                    <i
                        className={`block h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            active === id ? "w-[22px] bg-bone" : "w-3.5 bg-bone/25 hover:w-5 hover:bg-bone/60"
                        }`}
                    />
                </button>
            ))}
        </nav>
    );
}
```

- [ ] **Step 5: Create `src/components/layout/SiteNav.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useChapterTracker } from "@/lib/use-chapter-observer";

const LINKS = [
    { label: "About", href: "#chapter-about" },
    { label: "Stats", href: "#chapter-stats" },
    { label: "Projects", href: "#chapter-projects" },
    { label: "Contact", href: "#chapter-finale" },
];

export function SiteNav() {
    useChapterTracker();
    const [stuck, setStuck] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [open, setOpen] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setStuck(y > 24);
            setHidden(!open && y > 120 && y > lastY.current);
            lastY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <header
            className={`fixed top-0 left-0 z-50 flex h-[84px] w-full items-center gap-6 px-[clamp(20px,3.4vw,56px)] transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                hidden && !open ? "-translate-y-full" : "translate-y-0"
            }`}
        >
            <span className={`nav-wash ${stuck ? "on" : ""}`} />
            <a href="#chapter-hero" className="flex flex-col gap-1">
                <b className="text-[12px] font-medium tracking-[0.26em] text-bone">VM.</b>
                <i className="text-[8px] not-italic tracking-[0.34em] text-muted-k">PORTFOLIO</i>
            </a>
            <nav className="ml-auto hidden items-center gap-[clamp(18px,2.6vw,46px)] md:flex">
                {LINKS.map((l) => (
                    <a
                        key={l.href}
                        href={l.href}
                        className="text-[11px] font-medium uppercase tracking-[0.2em] text-bone-dim transition-colors duration-300 hover:text-bone"
                    >
                        {l.label}
                    </a>
                ))}
            </nav>
            <button
                aria-label="Menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="ml-auto flex h-4 w-6 flex-col justify-between md:hidden"
            >
                <i className={`block h-px w-full bg-bone transition-transform duration-500 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
                <i className={`block h-px bg-bone transition-all duration-500 ${open ? "w-full -translate-y-[6.5px] -rotate-45" : "w-2/3 self-end"}`} />
            </button>
            {open && (
                <div className="absolute top-[84px] right-0 left-0 flex flex-col border-b border-bone/[0.07] bg-[rgba(3,6,9,0.98)] px-[clamp(20px,3.4vw,56px)] pb-8 md:hidden">
                    {LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="border-b border-bone/[0.07] py-4 text-[17px] font-light text-bone-dim transition-colors hover:text-bone"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
}
```

- [ ] **Step 6: Verify** — `npx tsc --noEmit && npm run lint`; manual `npm run dev`: (mount them temporarily anywhere in page.tsx to see them) preloader counts then fades ≤2.2s, cursor ring follows + expands over links, rail dots visible.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/Animations.tsx src/components/ui/Preloader.tsx src/components/ui/CustomCursor.tsx src/components/ui/ProgressRail.tsx src/components/layout/SiteNav.tsx src/app/page.tsx
git commit -m "feat: kage furniture — preloader, cursor, rail, nav, word mask"
```

---

### Task 5: Hero rebuild

**Files:**
- Modify: `src/components/features/Hero.tsx` (full rewrite — component owns its section wrapper)
- Modify: `src/app/page.tsx` (render `<Hero />` directly, remove old `Section/Container/Reveal` hero wrapper)

**Interfaces:**
- Consumes: `WordMask` (Task 4), `CHAPTER_LABELS`, `ChapterId` (Task 2).
- Produces: `<section id="chapter-hero" data-chapter="hero">` rendered by `<Hero />`.

- [ ] **Step 1: Rewrite `src/components/features/Hero.tsx`** (complete file):

```tsx
"use client";

import { motion } from "framer-motion";
import { WordMask } from "@/components/ui/Animations";
import { CHAPTER_LABELS, type ChapterId } from "@/lib/chapter-store";

const CHIP_IDS = ["about", "stats", "projects", "finale"] as const;
type ChipId = (typeof CHIP_IDS)[number];
const CHAPTER_DESC: Record<ChipId, string> = {
    about: "Who I am and how I work",
    stats: "GitHub & WakaTime, live",
    projects: "Shipped, production-grade",
    finale: "Let's build something",
};
const _typeGuard: ChapterId[] = [...CHIP_IDS];
void _typeGuard;

export function Hero() {
    return (
        <section id="chapter-hero" data-chapter="hero" className="relative flex min-h-svh flex-col px-[clamp(20px,3.4vw,56px)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

            <div className="relative z-10 max-w-[560px] pt-[calc(84px+2rem)]">
                <div className="eyebrow mb-5 flex items-center gap-2.5">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#e0231c] shadow-[0_0_10px_#e0231c]" />
                    Transparent Portfolio — Live Data
                </div>
                <h1 className="mb-4 text-[clamp(26px,3.05vw,46px)] uppercase leading-[1.055] tracking-[-0.012em] text-bone">
                    <WordMask text="Fullstack developer," />
                    <br />
                    <WordMask text="built in the open." delay={0.25} />
                </h1>
                <p className="max-w-[322px] text-[clamp(14px,1.02vw,17px)] font-light leading-[1.72] text-[#b4bfb7]">
                    Scalable apps, no fluff — backed by live data from GitHub and WakaTime, not promises.
                </p>
            </div>

            <div className="min-h-[clamp(140px,26vh,300px)] flex-1" aria-hidden />

            <motion.div
                className="relative z-10 pb-[clamp(22px,4.2vh,42px)]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="mb-3.5 flex items-center justify-end gap-3 text-[9px] uppercase tracking-[0.3em] text-muted-k">
                    Scroll
                    <span className="relative block h-px w-[54px] overflow-hidden bg-bone/15">
                        <i className="absolute inset-0 origin-left animate-cue bg-bone" />
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-bone/[0.07] pt-[18px] md:grid-cols-4">
                    {CHIP_IDS.map((id, i) => (
                        <a key={id} href={`#chapter-${id}`} className="group flex gap-3.5">
                            <span className="text-[clamp(26px,2.5vw,36px)] font-light leading-none tabular-nums text-bone-dim transition-colors duration-500 group-hover:text-[#ff5a3c]">
                                {`0${i + 1}`}
                            </span>
                            <span className="min-w-0 pt-[3px]">
                                <b className="block text-[10px] font-medium uppercase tracking-[0.2em] text-bone-dim transition-colors duration-500 group-hover:text-bone">
                                    {CHAPTER_LABELS[id]}
                                </b>
                                <p className="mt-1.5 text-[11px] leading-normal text-muted-k">{CHAPTER_DESC[id]}</p>
                            </span>
                        </a>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
```

(Drop the `_typeGuard` lines and the `ChapterId` import if unused after simplification — prefer deleting them for lint cleanliness.)

- [ ] **Step 2: Update `src/app/page.tsx`** — replace the old hero `<Section><Container><Reveal><Hero /></Reveal></Container></Section>` block with `<Hero />` directly; remove imports that become unused.

- [ ] **Step 3: Verify** — `npx tsc --noEmit && npm run lint`; manual: word-mask reveal plays once; chips navigate; cue animates.

- [ ] **Step 4: Commit**

```bash
git add src/components/features/Hero.tsx src/app/page.tsx
git commit -m "feat: kage hero — word-mask reveal, chapter chips, scroll cue"
```

---

### Task 6: About chapter

**Files:**
- Modify: `src/components/features/About.tsx` (full rewrite — component owns its section wrapper)

**Interfaces:**
- Consumes: `TECH_STACK` (mockData).
- Produces: `<section id="chapter-about" data-chapter="about">` rendered by `<About />`.

- [ ] **Step 1: Rewrite `src/components/features/About.tsx`** (complete file):

```tsx
import { ArrowUpRight } from "lucide-react";
import { WordMask } from "@/components/ui/Animations";
import { TECH_STACK } from "@/services/mockData";

const FOCUS = [
    ["Backend", "Efficient architecture & security"],
    ["Frontend", "Reusable components & consistency"],
    ["Principles", "SOLID · DRY · KISS"],
] as const;

export function About() {
    return (
        <section id="chapter-about" data-chapter="about" className="relative overflow-x-clip px-[clamp(20px,3.4vw,56px)] py-[clamp(88px,15vh,190px)]">
            <div className="sec-scrim" />
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-[clamp(30px,5vh,66px)] flex items-baseline gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                        <b className="font-medium text-[#e0231c]">01</b> / 04 — About
                    </span>
                    <span className="h-px flex-1 bg-bone/[0.07]" />
                </div>

                <div className="grid items-start gap-[clamp(28px,5vw,90px)] lg:grid-cols-[1.02fr_1fr]">
                    <h2 className="max-w-[11ch] text-[clamp(30px,4vw,60px)] font-normal leading-[1.05] tracking-[-0.012em] text-bone">
                        <WordMask text="Engineering, quietly precise." />
                    </h2>
                    <div className="pt-1.5">
                        <p className="text-[clamp(15px,1.16vw,19px)] font-light leading-[1.66] text-[#c2cdc5]">
                            I am a <span className="text-bone">Fullstack Developer</span> and Prompting Engineer who leverages AI coding
                            agents to accelerate development — with PRDs, structured prompts and clear docs defining every architecture
                            and workflow.
                        </p>
                        <a href="#chapter-projects" className="group mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone">
                            See the work
                            <span className="grid size-[34px] place-items-center rounded-full border border-bone/15 transition-colors duration-500 group-hover:border-bone group-hover:bg-bone">
                                <ArrowUpRight className="size-[13px] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:stroke-[#05070a]" />
                            </span>
                        </a>
                    </div>
                </div>

                <div className="mt-[clamp(46px,8vh,96px)] grid grid-cols-2 gap-[clamp(24px,4vw,62px)] border-t border-bone/[0.07] pt-6 md:grid-cols-3">
                    {FOCUS.map(([b, s]) => (
                        <div key={b}>
                            <b className="block text-[clamp(22px,2.1vw,32px)] font-light tracking-[-0.02em] text-bone">{b}</b>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-k">{s}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-14 border-t border-bone/[0.07]">
                    {Object.entries(TECH_STACK).map(([category, techs]) => (
                        <div key={category} className="flex items-baseline gap-6 border-b border-bone/[0.07] py-4">
                            <span className="w-28 shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted-k">{category}</span>
                            <p className="text-sm font-light text-[#9aa5a0]">{techs.join(" · ")}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Verify** — tsc/lint; visual: split grid, arrow hover fill, hairline rows.
- [ ] **Step 3: Commit**

```bash
git add src/components/features/About.tsx
git commit -m "feat: about section as kage gate chapter"
```

---

### Task 7: Stats section restyle

**Files:**
- Modify: `src/components/features/Stats.tsx` (restyle internals; add `StatsSection` wrapper export; keep `StatsGrid` export)

**Interfaces:**
- Consumes: `MOCK_GITHUB`, `MOCK_WAKATIME`, `Language` (mockData), `WordMask` (Task 4).
- Produces: `<section id="chapter-stats" data-chapter="stats">` rendered by `StatsSection`.

- [ ] **Step 1: Restyle `StatCard` internals** — keep the `StatCardProps` interface and `fontSizeClass` length logic; replace the returned JSX with:

```tsx
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="group relative flex flex-col justify-between overflow-hidden bg-[#070a0d]/85 p-6 outline outline-1 -outline-offset-1 outline-bone/[0.07] transition-[outline-color] duration-500 hover:outline-bone/30 md:p-8"
        >
            <div className="mb-8 flex items-start justify-between md:mb-12">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-bone-dim">{label}</span>
                <Icon className="size-5 opacity-50" />
            </div>
            <div className="flex min-h-20 items-end">
                <h3 className={`${fontSizeClass} font-light tabular-nums tracking-[-0.02em] text-bone transition-colors group-hover:text-[#ff5a3c]`}>{value}</h3>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-bone/10 pt-3.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-k">{sub}</span>
                <ArrowUpRight className="size-4 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
        </motion.div>
    );
```

- [ ] **Step 2: Restyle `LanguageBar`** — keep motion props and data mapping; replace outer/inner chrome:

```tsx
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="col-span-full mt-8"
        >
            <div className="bg-[#070a0d]/85 p-8 outline outline-1 -outline-offset-1 outline-bone/[0.07]">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <h4 className="text-[clamp(30px,4vw,60px)] font-normal uppercase leading-[1.05] tracking-[-0.012em] text-bone">
                        <WordMask text="Languages" />
                    </h4>
                    <span className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-k">
                        Detected: {languages.length}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {languages.map((lang, i) => (
                        <motion.div
                            key={lang.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            viewport={{ once: true }}
                            className="group flex h-32 flex-col justify-between bg-ink/85 p-5 outline outline-1 -outline-offset-1 outline-bone/[0.07] transition-[outline-color] duration-500 hover:outline-bone/30"
                        >
                            <span
                                className="size-3 rounded-full shadow-[0_0_10px_currentColor]"
                                style={{ color: lang.color, backgroundColor: lang.color }}
                            />
                            <div>
                                <div className="text-3xl font-light tabular-nums text-bone transition-colors group-hover:text-[#ff5a3c]">
                                    {lang.percentage}
                                    <span className="ml-1 text-sm font-light text-muted-k">%</span>
                                </div>
                                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-k">{lang.name}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
```

- [ ] **Step 3: Add `StatsSection` wrapper** — append to the same file (add imports `WordMask` from `@/components/ui/Animations`):

```tsx
export function StatsSection() {
    return (
        <section id="chapter-stats" data-chapter="stats" className="relative overflow-x-clip px-[clamp(20px,3.4vw,56px)] py-[clamp(88px,15vh,190px)]">
            <div className="sec-scrim sec-scrim--center" />
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-10 flex items-baseline gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                        <b className="font-medium text-[#e0231c]">02</b> / 04 — Live Data
                    </span>
                    <span className="h-px flex-1 bg-bone/[0.07]" />
                </div>
                <h2 className="mb-3 text-[clamp(30px,4vw,60px)] font-normal uppercase leading-[1.05] tracking-[-0.012em] text-bone">
                    <WordMask text="Live statistics" />
                </h2>
                <p className="mb-12 max-w-xl text-[clamp(14px,1.02vw,17px)] font-light text-[#9aa5a0]">
                    Numbers pulled straight from GitHub and WakaTime — nothing staged.
                </p>
                <StatsGrid />
            </div>
        </section>
    );
}
```

Also change the grid container in `StatsGrid` to `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4` (remove old gap-6). Remove all `neo-brutal-border` / `bg-primary` / grid-pattern usages.

- [ ] **Step 4: Verify** — tsc/lint; values render from mockData.
- [ ] **Step 5: Commit**

```bash
git add src/components/features/Stats.tsx
git commit -m "feat: restyle live statistics as kage data chapter"
```

---

### Task 8: Projects — staggered live-window cards

**Files:**
- Create: `src/components/canvas/LiveWindow.tsx`
- Modify: `src/components/features/ProjectList.tsx` (rewrite; add `ProjectsSection` wrapper export)

**Interfaces:**
- Consumes: `registerLiveView` (Task 3), `PROJECTS: Project[]` (mockData), `WordMask`.
- Produces: `<LiveWindow index className />`; `ProjectsSection` renders `<section id="chapter-projects" data-chapter="projects">`.

- [ ] **Step 1: Create `src/components/canvas/LiveWindow.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { registerLiveView } from "./live-registry";

const OFFSETS = [-1.6, 0.3, 1.6];

export function LiveWindow({ index, className }: { index: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || document.documentElement.classList.contains("no-webgl")) return;
        const unregister = registerLiveView(el, OFFSETS[index % OFFSETS.length]);
        return () => unregister();
    }, [index]);

    return (
        <div className={`relative overflow-hidden bg-[linear-gradient(150deg,#101a1d,#0a0d10_62%,#1a0c0b)] ${className ?? ""}`}>
            <div ref={ref} className="absolute inset-0" data-live-window={index} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/70" />
        </div>
    );
}
```

(The outer div carries the no-WebGL fallback gradient; the inner div's rect is what the rig renders into.)

- [ ] **Step 2: Rewrite `src/components/features/ProjectList.tsx`**

```tsx
import { PROJECTS } from "@/services/mockData";
import { ArrowUpRight } from "lucide-react";
import { LiveWindow } from "@/components/canvas/LiveWindow";
import { WordMask } from "@/components/ui/Animations";

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
    return (
        <article
            className={`group relative ${index === 1 ? "md:translate-y-[clamp(26px,5vw,74px)]" : ""} ${
                index === 2 ? "md:translate-y-[clamp(52px,10vw,148px)]" : ""
            }`}
        >
            <a href={project.link ?? "#"} className="block" data-cursor>
                <div className="relative aspect-[4/5] outline outline-1 -outline-offset-1 outline-bone/[0.09] transition-[outline-color] duration-500 group-hover:outline-bone/30">
                    <LiveWindow index={index} className="absolute inset-0" />
                    <ArrowUpRight className="absolute right-3.5 top-3.5 z-20 size-6 -translate-x-1 -translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-90" />
                    <b className="absolute bottom-3.5 left-4 right-4 z-10 text-[clamp(13px,1.15vw,17px)] uppercase tracking-wide text-bone drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                        {project.title}
                    </b>
                </div>
                <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.16em] text-muted-k">
                    <span>{project.category ?? "Project"}</span>
                    <span>{project.tech.slice(0, 2).join(" · ")}</span>
                </div>
            </a>
        </article>
    );
}

export function ProjectList() {
    const cards = PROJECTS.slice(0, 3);
    const rows = PROJECTS.slice(3);

    return (
        <div>
            <div className="grid gap-[clamp(10px,1.4vw,22px)] md:grid-cols-3">
                {cards.map((project, idx) => (
                    <ProjectCard key={project.title} project={project} index={idx} />
                ))}
            </div>

            {rows.length > 0 && (
                <div className="mt-16 border-t border-bone/[0.07]">
                    {rows.map((project, i) => (
                        <a
                            key={project.title}
                            href={project.link ?? "#"}
                            className="lesson-row group grid grid-cols-[44px_1fr_auto] items-center gap-6 border-b border-bone/[0.07] py-6"
                        >
                            <span className="text-[11px] tabular-nums text-muted-k transition-colors duration-500 group-hover:text-[#e0231c]">
                                {String(i + 4).padStart(2, "0")}
                            </span>
                            <h3 className="text-[clamp(16px,1.5vw,23px)] font-normal text-bone">{project.title}</h3>
                            <span className="text-right text-[11px] tracking-[0.14em] text-muted-k">{project.tech[0]}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ProjectsSection() {
    return (
        <section id="chapter-projects" data-chapter="projects" className="relative overflow-x-clip px-[clamp(20px,3.4vw,56px)] py-[clamp(88px,15vh,190px)]">
            <div className="sec-scrim" />
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-10 flex items-baseline gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                        <b className="font-medium text-[#e0231c]">03</b> / 04 — Projects
                    </span>
                    <span className="h-px flex-1 bg-bone/[0.07]" />
                </div>
                <h2 className="mb-3 text-[clamp(30px,4vw,60px)] font-normal uppercase leading-[1.05] tracking-[-0.012em] text-bone">
                    <WordMask text="Selected work" />
                </h2>
                <p className="mb-12 max-w-xl text-[clamp(14px,1.02vw,17px)] font-light text-[#9aa5a0]">
                    Production-grade applications I&apos;ve shipped.
                </p>
                <ProjectList />
            </div>
        </section>
    );
}
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit && npm run lint` (ProjectsSection is not yet mounted — that is fine, tsc covers it); temporarily replace `<ProjectList />` usage in page.tsx if you want a visual check; three cards show three different scene views, hover states work, mobile stacks single-column.
- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/LiveWindow.tsx src/components/features/ProjectList.tsx src/app/page.tsx
git commit -m "feat: project cards as live scissor windows onto the scene"
```

---

### Task 9: Finale (Contact) + final page assembly

**Files:**
- Modify: `src/components/features/Contact.tsx` (rewrite)
- Modify: `src/app/page.tsx` (final assembly)

**Interfaces:**
- Consumes: everything prior.
- Produces: final home page; `Contact` renders `<section id="chapter-finale" data-chapter="finale">`.

- [ ] **Step 1: Rewrite `src/components/features/Contact.tsx`** (complete file):

```tsx
"use client";

import { ArrowUpRight } from "lucide-react";
import { WordMask } from "@/components/ui/Animations";

const FOOTER_COLS: { label: string; links: [string, string][] }[] = [
    { label: "Index", links: [["About", "#chapter-about"], ["Live Data", "#chapter-stats"], ["Projects", "#chapter-projects"]] },
    { label: "Social", links: [["Github", "https://github.com/vickyymosafan"], ["LinkedIn", "#"]] },
    { label: "Contact", links: [["Email", "mailto:mvickymosafan@gmail.com"]] },
];

export function Contact() {
    return (
        <section id="chapter-finale" data-chapter="finale" className="relative min-h-svh px-[clamp(20px,3.4vw,56px)] pb-[clamp(26px,4vh,40px)] pt-[clamp(50px,8vh,96px)]">
            <div className="sec-scrim sec-scrim--open" />

            <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl flex-col items-center justify-center text-center">
                <div className="eyebrow mb-6 flex items-center gap-2.5">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#e0231c] shadow-[0_0_10px_#e0231c]" />
                    What&apos;s next
                </div>
                <h2 className="text-[clamp(38px,7.4vw,124px)] uppercase leading-[0.94] tracking-[-0.03em] text-bone">
                    <WordMask text="Let's build" />
                    <br />
                    <WordMask text="together." delay={0.2} />
                </h2>
                <a
                    href="mailto:mvickymosafan@gmail.com"
                    className="cta-pill mt-11 border border-bone/15 px-[30px] py-[17px] text-[11px] font-medium uppercase tracking-[0.22em] text-bone"
                >
                    <i aria-hidden />
                    <span className="relative z-10">Say hello</span>
                    <ArrowUpRight className="relative size-3.5" />
                </a>
            </div>

            <footer className="relative z-10 mt-[clamp(50px,8vh,96px)] border-t border-bone/[0.07] pt-[clamp(50px,8vh,96px)]">
                <div className="mx-auto grid max-w-7xl gap-[clamp(22px,4vw,60px)] md:grid-cols-[1.4fr_repeat(3,minmax(0,.6fr))]">
                    <div>
                        <b className="text-[12px] font-medium tracking-[0.26em] text-bone">VM.</b>
                        <p className="mt-4 max-w-[34ch] text-[13px] font-light text-[#79847e]">
                            A transparent, data-driven portfolio. Every number on this page comes from real activity.
                        </p>
                    </div>
                    {FOOTER_COLS.map((col) => (
                        <div key={col.label}>
                            <h4 className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-k">{col.label}</h4>
                            <ul className="flex flex-col gap-2.5">
                                {col.links.map(([label, href]) => (
                                    <li key={label}>
                                        <a href={href} className="text-[13px] font-light text-[#8f9a93] transition-colors duration-300 hover:text-bone">
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mx-auto mt-[clamp(38px,6vh,74px)] flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t border-bone/[0.07] pt-5 text-[10px] uppercase tracking-[0.16em] text-muted-k">
                    <span>&copy; {new Date().getFullYear()} Transparent Portfolio</span>
                    <span>Backed by live data, not promises</span>
                </div>
            </footer>
        </section>
    );
}
```

- [ ] **Step 2: Final `src/app/page.tsx`** (complete file — replaces everything, including the Task 3 temporary mount):

```tsx
import { Hero } from "@/components/features/Hero";
import { About } from "@/components/features/About";
import { StatsSection } from "@/components/features/Stats";
import { ProjectsSection } from "@/components/features/ProjectList";
import { Contact } from "@/components/features/Contact";
import { SceneCanvas } from "@/components/canvas/SceneCanvas";
import { Preloader } from "@/components/ui/Preloader";
import { SiteNav } from "@/components/layout/SiteNav";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { CustomCursor } from "@/components/ui/CustomCursor";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-x-clip bg-ink text-bone selection:bg-[#e0231c] selection:text-white">
            <SceneCanvas />
            <div className="vignette" aria-hidden />
            <div className="pointer-events-none fixed inset-0 z-[60] bg-noise opacity-[0.06] mix-blend-overlay" aria-hidden />
            <Preloader />
            <SiteNav />
            <ProgressRail />
            <CustomCursor />

            <div className="relative z-10">
                <Hero />
                <About />
                <StatsSection />
                <ProjectsSection />
                <Contact />
            </div>
        </main>
    );
}
```

- [ ] **Step 3: Verify fallback** — DevTools → Rendering → "Disable WebGL": canvas hidden, CSS sky visible, cards show static gradient, all content functional.
- [ ] **Step 4: Verify reduced motion** — DevTools emulation: no transform reveals, scene near-static.
- [ ] **Step 5: Full gate** — `npx tsc --noEmit && npm run lint && npm run build`; then `npm run dev` and walk the full page once.
- [ ] **Step 6: Commit**

```bash
git add src/components/features/Contact.tsx src/app/page.tsx
git commit -m "feat: finale contact + full kage chapter wiring"
```

---

### Task 10: Verification sweep + polish

**Files:**
- Modify: only files with real issues found.

**Interfaces:** none new.

- [ ] **Step 1:** `npx tsc --noEmit && npm run lint && npm run build` — fix all findings.
- [ ] **Step 2: Manual checklist (spec §7):**
  - Scroll all 5 chapters → camera/fog/moon lerp matches `CHAPTER_SCENES`; per-section scrims keep copy readable.
  - Project scissor cards render on desktop + mobile (≤820px: single column, still live).
  - Fallback: "Disable WebGL" → CSS sky, gradient cards, content functional.
  - Reduced motion (emulation): no transform reveals, scene near-static.
  - Nav hides on scroll-down / washes when stuck; rail active dot follows chapter; preloader unlocks ≤ 2.2s.
  - Lighthouse perf & a11y within −5 of pre-redesign baseline.
- [ ] **Step 3: Fix found issues; commit** — `chore: kage redesign verification fixes`

---

## Self-Review

- **Spec coverage:** §2 architecture → Tasks 2–3; §3 scene → Task 3; §4 furniture → Task 4; Hero → Task 5; About → Task 6; Stats → Task 7; Projects → Task 8; Finale + integration → Task 9; §5 fallback/perf → Tasks 1 (CSS), 3 (WebGL detect, DPR, counts, reduced motion), 9 (verification); §7 testing → Task 10; §8 YAGNI — enforced via Global Constraints.
- **Placeholders:** none — every step carries final code or exact CSS; each new file's snippet is its complete final content.
- **Type consistency:** `ChapterId`, `CHAPTER_SCENES`, `SCENE_DAMP`, `countParticles`, `moonState`, `mistState`, `cardCam`, `tmpColor`, `registerLiveView(el, camOffsetX)`, `getLiveViews()`, `LiveView`, `WordMask`, `useChapterTracker`, `StatsSection`, `ProjectsSection` — names match across all tasks; section wrappers are owned by the feature components, and `page.tsx` (Task 9) only mounts them.
