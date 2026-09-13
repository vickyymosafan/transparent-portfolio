# Cinematic Scroll — 3D Walk Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio's flat scroll into a cinematic 3D walkthrough where scrolling drives the camera along a predefined path through 6 chapter-spaces, with doorway transitions and per-room lighting.

**Architecture:** A `CatmullRomCurve3` path with 18 waypoints (3 per chapter) defines camera position/lookAt/FOV per chapter. `useChapterProgress` maps `scrollProgress.value` (0–1) to chapter index + local progress. `WalkPathController` drives camera animation per frame. `TransitionArch` renders foreground geometry (pillars, ceilings) that fade in/out during chapter transitions. `RoomLights` changes ambient + directional light per chapter. Existing `SceneRig` keeps fog/moon/embers damping via `CHAPTER_SCENES`.

**Tech Stack:** Next.js 16, R3F, @react-three/drei, zustand, Lenis, TypeScript 5

## Global Constraints

- No `as any`, `@ts-ignore`, `@ts-expect-error`
- Must pass `npx tsc --noEmit && npm run lint && npm run build`
- Dev server runs on port 3001
- Zero changes to DOM feature components (Hero, About, etc.), ProgressRail, SiteNav, SmoothScroll, ForegroundLayers
- Zero changes to night mode (`/night` route)
- Fog/moon/embers tetap via `CHAPTER_SCENES` di `SceneRig` — jangan dipindah

---

## File Structure

### New Files (5)

| File | Responsibility |
|------|---------------|
| `src/lib/walk-path.ts` | `PathNode[]` (18 nodes) + `CatmullRomCurve3` builder + `getWalkPathState(t: number)` helper returning `{ pos, lookAt, fov, chapter }` |
| `src/hooks/useChapterProgress.ts` | Maps `scrollProgress.value` (0–1) → `{ chapterIndex, chapterId, localProgress }` using `CHAPTER_ORDER` |
| `src/components/canvas/WalkPathController.tsx` | `useFrame`: reads chapter progress, interpolates camera position/lookAt/FOV along path, writes to camera |
| `src/components/canvas/TransitionArch.tsx` | Renders 2–4 thin meshes (pillars, ceiling, frame) per transition type, opacity driven by localProgress |
| `src/components/canvas/RoomLights.tsx` | 1 ambientLight + 1 directionalLight, color/intensity lerp per active chapter |

### Modified Files (1)

| File | Change |
|------|--------|
| `src/components/canvas/SceneInner.tsx` | Import + mount WalkPathController, TransitionArch, RoomLights in default mode. Remove camera position/lookAt damping from SceneRig |

---

## Tasks

### Task 1: `walk-path.ts` — Path Data + Curve Builder

**Files:**
- Create: `src/lib/walk-path.ts`

**Interfaces:**
- Produces: `PATH_NODES: PathNode[]` (18 nodes), `walkCurve: THREE.CatmullRomCurve3`, `getWalkPathState(t: number): { pos: THREE.Vector3; lookAt: THREE.Vector3; fov: number; chapter: ChapterId }`

- [ ] **Step 1: Define PathNode interface + PATH_NODES array**

```typescript
import * as THREE from "three";
import type { ChapterId, CHAPTER_ORDER } from "@/lib/chapter-store";

export interface PathNode {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  chapter: ChapterId;
}

export const PATH_NODES: PathNode[] = [
  // Hero (3 nodes — approach from distance)
  { position: [0, 3, 12],  lookAt: [0, 2, -5],   fov: 38, chapter: "hero" },
  { position: [0, 2.5, 9], lookAt: [0, 1.8, -2],  fov: 42, chapter: "hero" },
  { position: [0, 2, 7],   lookAt: [0, 1.5, 0],   fov: 45, chapter: "hero" },

  // About (3 nodes — enter lobby)
  { position: [0, 1.5, 5],     lookAt: [0, 1.2, 0],     fov: 55, chapter: "about" },
  { position: [0.3, 1.5, 4],   lookAt: [0.2, 1.2, -1],   fov: 58, chapter: "about" },
  { position: [0.5, 1.5, 3.5], lookAt: [0.3, 1.2, -1.5], fov: 58, chapter: "about" },

  // Experience (3 nodes — corridor)
  { position: [-0.5, 1.5, 3],   lookAt: [0.3, 1.2, -1],   fov: 58, chapter: "experience" },
  { position: [-0.8, 1.5, 2.5], lookAt: [0.5, 1.2, -2],   fov: 60, chapter: "experience" },
  { position: [-1, 1.5, 2],     lookAt: [0.5, 1.2, -2.5], fov: 60, chapter: "experience" },

  // Stats (3 nodes — data room)
  { position: [0, 1.8, 3], lookAt: [0, 1.5, -3], fov: 50, chapter: "stats" },
  { position: [0, 2, 3],   lookAt: [0, 1.5, -3], fov: 50, chapter: "stats" },
  { position: [0, 2, 3],   lookAt: [0, 1.5, -3], fov: 50, chapter: "stats" },

  // Projects (3 nodes — gallery)
  { position: [1.5, 1.5, 4], lookAt: [-0.3, 1.3, -2], fov: 45, chapter: "projects" },
  { position: [2, 1.5, 4],   lookAt: [-0.5, 1.3, -2], fov: 45, chapter: "projects" },
  { position: [2, 1.5, 4],   lookAt: [-0.5, 1.3, -2], fov: 45, chapter: "projects" },

  // Finale (3 nodes — rooftop exit)
  { position: [0.5, 1.5, 2.5], lookAt: [0, 1.8, -6],   fov: 55, chapter: "finale" },
  { position: [0, 1.5, 2],     lookAt: [0, 2, -8],     fov: 60, chapter: "finale" },
  { position: [0, 1.5, 2],     lookAt: [0, 2.2, -10],  fov: 60, chapter: "finale" },
];
```

- [ ] **Step 2: Build curve + lookAt array + FOV array**

```typescript
export const walkCurve = new THREE.CatmullRomCurve3(
  PATH_NODES.map((n) => new THREE.Vector3(...n.position))
);

export const walkLookAts = PATH_NODES.map((n) => new THREE.Vector3(...n.lookAt));

export const walkFovs = PATH_NODES.map((n) => n.fov);

export const walkChapters = PATH_NODES.map((n) => n.chapter);
```

- [ ] **Step 3: Create getWalkPathState helper**

```typescript
const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _next = new THREE.Vector3();

export interface WalkPathState {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
  chapter: ChapterId;
}

/** Map normalised path progress (0–1) to interpolated camera state. */
export function getWalkPathState(t: number): WalkPathState {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (PATH_NODES.length - 1);
  const i = Math.min(Math.floor(idx), PATH_NODES.length - 2);
  const frac = idx - i;

  walkCurve.getPointAt(clamped, _pos);

  _look.lerpVectors(walkLookAts[i], walkLookAts[i + 1], frac);

  return {
    position: _pos.clone(),
    lookAt: _look.clone(),
    fov: THREE.MathUtils.lerp(walkFovs[i], walkFovs[i + 1], frac),
    chapter: walkChapters[i],
  };
}
```

- [ ] **Step 4: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/walk-path.ts
git commit -m "feat: add walk path data with 18 waypoints and curve builder"
```

---

### Task 2: `useChapterProgress.ts` — Scroll → Chapter Mapping

**Files:**
- Create: `src/hooks/useChapterProgress.ts`

**Interfaces:**
- Consumes: `scrollProgress` (from `@/lib/scroll-progress`), `CHAPTER_ORDER` (from `@/lib/chapter-store`)
- Produces: `{ chapterIndex: number; chapterId: ChapterId; localProgress: number }`

- [ ] **Step 1: Create the hook**

```typescript
import { useMemo } from "react";
import { scrollProgress } from "@/lib/scroll-progress";
import { CHAPTER_ORDER } from "@/lib/chapter-store";
import { useFrame } from "@react-three/fiber";

const CHAPTER_COUNT = CHAPTER_ORDER.length;

export interface ChapterProgress {
  chapterIndex: number;
  chapterId: (typeof CHAPTER_ORDER)[number];
  localProgress: number; // 0–1 within the current chapter
}

/**
 * Maps global scroll progress (0–1) to chapter index and local progress.
 * Returns a new object every frame — consumers should destructure in useFrame.
 */
export function getChapterProgress(): ChapterProgress {
  const raw = scrollProgress.value * CHAPTER_COUNT;
  const chapterIndex = Math.min(Math.floor(raw), CHAPTER_COUNT - 1);
  const localProgress = raw - chapterIndex;
  return {
    chapterIndex,
    chapterId: CHAPTER_ORDER[chapterIndex],
    localProgress: Math.max(0, Math.min(1, localProgress)),
  };
}
```

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useChapterProgress.ts
git commit -m "feat: add useChapterProgress hook mapping scroll to chapter"
```

---

### Task 3: `WalkPathController.tsx` — Camera Animation

**Files:**
- Create: `src/components/canvas/WalkPathController.tsx`

**Interfaces:**
- Consumes: `getWalkPathState` (from `walk-path.ts`), `getChapterProgress` (from `useChapterProgress.ts`)
- Depends on: Task 1 (walk-path.ts), Task 2 (useChapterProgress.ts)

- [ ] **Step 1: Create the component**

```typescript
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getWalkPathState } from "@/lib/walk-path";
import { getChapterProgress } from "@/hooks/useChapterProgress";

const DAMP = 3.0;

export function WalkPathController() {
  const { camera } = useThree();
  const state = useRef({ position: new THREE.Vector3(), fov: 50 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const cp = getChapterProgress();
    const target = getWalkPathState(cp.chapterIndex / 5 + cp.localProgress / 5);

    // Damped camera position
    state.current.position.lerp(target.position, 1 - Math.exp(-DAMP * dt));
    camera.position.copy(state.current.position);

    // Damped FOV
    state.current.fov = THREE.MathUtils.damp(state.current.fov, target.fov, DAMP, dt);
    camera.fov = state.current.fov;
    camera.updateProjectionMatrix();

    // LookAt — direct (no damp) for responsiveness
    camera.lookAt(target.lookAt);
  });

  return null;
}
```

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/WalkPathController.tsx
git commit -m "feat: add WalkPathController driving camera along walk path"
```

---

### Task 4: Update `SceneInner.tsx` — Integrate Controller + Disable Camera Lerp

**Files:**
- Modify: `src/components/canvas/SceneInner.tsx`

- [ ] **Step 1: Read current SceneInner.tsx**

Read the file to see the exact current state (after night city changes).

- [ ] **Step 2: Import WalkPathController**

Add import line after existing canvas imports:
```typescript
import { WalkPathController } from "./WalkPathController";
```

- [ ] **Step 3: Mount WalkPathController in default mode**

Find the default mode branch (currently just `<MonolithCity />`). Add WalkPathController after it:
```tsx
      ) : (
        <>
          <MonolithCity />
          <WalkPathController />
        </>
      )}
```

- [ ] **Step 4: Disable camera position/lookAt damping in SceneRig**

In `SceneRig`'s `useFrame`, comment out or wrap the camera position/lookAt interpolation (lines 51-57 in current SceneInner.tsx) to only run in night mode:
```typescript
// Camera interpolation — only for night mode (WalkPathController handles default)
if (mode === "night") {
  camera.position.x = THREE.MathUtils.damp(/* ... */);
  // ... existing camera interpolation
  camera.lookAt(lookAt.current);
}
```

Actually, a simpler approach: pass a `mode` check or let SceneRig skip camera entirely when WalkPathController is active. The cleanest way: SceneRig already checks `mode === "night"` for branching — just move the camera interpolation inside that check.

- [ ] **Step 5: Run build gates**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/SceneInner.tsx
git commit -m "feat: integrate WalkPathController into default scene, disable camera lerp in SceneRig"
```

---

### Task 5: `TransitionArch.tsx` — Foreground Doorway/Ceiling Geometry

**Files:**
- Create: `src/components/canvas/TransitionArch.tsx`

**Interfaces:**
- Consumes: `getChapterProgress` (from `useChapterProgress.ts`)
- Produces: Renders thin 3D meshes that fade in/out based on chapter local progress

- [ ] **Step 1: Define transition types + create component**

```typescript
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getChapterProgress } from "@/hooks/useChapterProgress";

type TransitionType = "doorway" | "corridor" | "data-frame" | "gallery-frame" | "balcony" | null;

const TRANSITION_MAP: Record<number, TransitionType> = {
  0: "doorway",       // Hero → About
  1: "corridor",      // About → Experience
  2: "data-frame",    // Experience → Stats
  3: "gallery-frame", // Stats → Projects
  4: "balcony",       // Projects → Finale
};

/** Compute pillar opacity based on local progress (0 = fully visible, 1 = fully hidden). */
function transitionAlpha(t: number): number {
  if (t < 0.2) return 0;
  if (t < 0.4) return (t - 0.2) / 0.2;          // 0 → 1  (fade in)
  if (t < 0.7) return 1;                          // hold
  if (t < 0.9) return 1 - (t - 0.7) / 0.2;       // 1 → 0  (fade out)
  return 0;
}

export function TransitionArch() {
  const pillarRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const cp = getChapterProgress();
    const transitionType = TRANSITION_MAP[cp.chapterIndex];
    if (!transitionType || !pillarRef.current) return;

    const alpha = transitionAlpha(cp.localProgress);
    pillarRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshBasicMaterial;
        mat.opacity = alpha;
        mat.transparent = alpha < 0.99;
      }
    });
  });

  return (
    <group ref={pillarRef}>
      {/* Doorway: two pillars + lintel */}
      <mesh position={[-1.2, 1.2, 3.5]}>
        <boxGeometry args={[0.12, 2.4, 0.12]} />
        <meshBasicMaterial color="#0a0e12" transparent opacity={0} />
      </mesh>
      <mesh position={[1.2, 1.2, 3.5]}>
        <boxGeometry args={[0.12, 2.4, 0.12]} />
        <meshBasicMaterial color="#0a0e12" transparent opacity={0} />
      </mesh>
      <mesh position={[0, 2.5, 3.5]}>
        <boxGeometry args={[2.52, 0.08, 0.12]} />
        <meshBasicMaterial color="#0a0e12" transparent opacity={0} />
      </mesh>
    </group>
  );
}
```

Note: The above is a simplified version. The full component should have per-transition-type geometry selection in the useFrame. For Sprint B, this simplified doorway is sufficient as a starting point.

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/TransitionArch.tsx
git commit -m "feat: add TransitionArch foreground geometry for chapter transitions"
```

---

### Task 6: `RoomLights.tsx` — Per-Chapter Lighting

**Files:**
- Create: `src/components/canvas/RoomLights.tsx`

- [ ] **Step 1: Create the component**

```typescript
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useChapterStore } from "@/lib/chapter-store";
import type { ChapterId } from "@/lib/chapter-store";

interface RoomLightConfig {
  ambient: string;
  dirColor: string;
  dirPos: [number, number, number];
  intensity: number;
}

const ROOM_LIGHTS: Record<ChapterId, RoomLightConfig> = {
  hero:       { ambient: "#1a2030", dirColor: "#d6e7ff", dirPos: [9, 18, 7],   intensity: 0.8 },
  about:      { ambient: "#2a1a10", dirColor: "#ffd4a0", dirPos: [5, 12, 5],   intensity: 0.6 },
  experience: { ambient: "#1a1a2a", dirColor: "#b8c8ff", dirPos: [-5, 10, 8],  intensity: 0.7 },
  stats:      { ambient: "#0a1a2a", dirColor: "#4080ff", dirPos: [0, 15, 0],   intensity: 1.0 },
  projects:   { ambient: "#2a2a20", dirColor: "#ffe8c0", dirPos: [8, 10, 5],   intensity: 0.9 },
  finale:     { ambient: "#1a2030", dirColor: "#d6e7ff", dirPos: [9, 18, 7],   intensity: 1.2 },
};

const DAMP = 1.5;
const _ambientColor = new THREE.Color();
const _dirColor = new THREE.Color();

export function RoomLights() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const active = useChapterStore.getState().active;
    const cfg = ROOM_LIGHTS[active];
    if (!cfg || !ambientRef.current || !dirRef.current) return;

    // Ambient color lerp
    _ambientColor.set(cfg.ambient);
    ambientRef.current.color.lerp(_ambientColor, 1 - Math.exp(-DAMP * dt));

    // Directional color + intensity lerp
    _dirColor.set(cfg.dirColor);
    dirRef.current.color.lerp(_dirColor, 1 - Math.exp(-DAMP * dt));
    dirRef.current.intensity = THREE.MathUtils.damp(
      dirRef.current.intensity,
      cfg.intensity,
      DAMP,
      dt
    );
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} color="#1a2030" />
      <directionalLight
        ref={dirRef}
        position={[9, 18, 7]}
        color="#d6e7ff"
        intensity={0.8}
      />
    </>
  );
}
```

- [ ] **Step 2: Mount in SceneInner.tsx**

Add import + mount in default mode before MonolithCity:
```tsx
import { RoomLights } from "./RoomLights";
// ...
<RoomLights />
<MonolithCity />
```

- [ ] **Step 3: Run build gates**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass

- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/RoomLights.tsx src/components/canvas/SceneInner.tsx
git commit -m "feat: add per-chapter RoomLights with ambient and directional color lerp"
```

---

### Task 7: Polish — FOV Tuning, End-to-End Test, ProgressRail Sync

**Files:**
- Modify: `src/components/canvas/WalkPathController.tsx` (tune DAMP, FOV curve)
- Test: manual visual check at localhost:3001

- [ ] **Step 1: Tune damping and FOV curve**

Adjust `DAMP` constant in WalkPathController.tsx (try 3.0–4.0 range). Verify camera follows scroll smoothly without lag or overshoot.

- [ ] **Step 2: Test all 6 chapters end-to-end**

Scroll through the entire page. For each chapter:
- Camera position/lookAt/FOV matches the chapter's intended mood
- TransitionArch geometry fades in/out at correct scroll positions
- RoomLights colors shift smoothly

- [ ] **Step 3: Test ProgressRail click → scrollToChapter → camera follows**

Click each dot on the ProgressRail. Verify:
- Lenis scrolls to correct section
- WalkPathController camera moves to that chapter's position
- No camera jump (smooth damped transition)

- [ ] **Step 4: Build gates + commit**

```bash
npm run build
git add -A
git commit -m "fix: tune walk path damping and FOV, polish transitions"
```

---

## Self-Review Checklist

- [ ] All 6 spec sections have corresponding tasks (path data → Task 1, chapter progress → Task 2, camera animation → Task 3, integration → Task 4, foreground geometry → Task 5, room lighting → Task 6, polish → Task 7)
- [ ] No placeholders ("TBD", "TODO") in any task
- [ ] Type consistency: `PathNode`, `WalkPathState`, `ChapterProgress` interfaces match across tasks
- [ ] Each task ends with a testable gate (tsc, lint, build)
- [ ] Zero changes to night mode, DOM components, or existing scroll infrastructure
