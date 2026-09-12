# Sprint 1: Night City Engine — Implementation Plan

**Goal:** Build the core walkthrough: procedural city street + camera path + scroll→walk interaction + rain + fog + placeholder district panels + navigation controls.

**Architecture:** Single R3F Canvas (fixed 100vh). `walkProgress` stored in zustand. Camera driven by CatmullRomCurve3. Buildings both sides (reuse MonolithCity texture). Rain as Points. Panel per district (React divs, opacity driven by progress).

## Files to modify/create

### New files
- `src/lib/walk-store.ts` — zustand store for walkProgress
- `src/lib/city-path.ts` — CatmullRomCurve3 definition
- `src/components/canvas/CityGenerator.tsx` — procedural buildings along street
- `src/components/canvas/Rain.tsx` — rain particle system
- `src/components/canvas/WalkCam.tsx` — useFrame driving camera from walkProgress
- `src/components/ui/DistrictPanel.tsx` — placeholder panel per district
- `src/components/ui/WheelCapture.tsx` — captures wheel/touch/keys → walkProgress
- `src/app/night/page.tsx` (or modify page.tsx to night mode)

### Modified files
- `src/components/canvas/SceneInner.tsx` — replace MonolithCity with CityGenerator, add Rain, add WalkCam
- `src/components/canvas/SceneCanvas.tsx` — accept `mode` prop ("default" | "night")

## Task 1: Walk store + path + interaction

- zustand store: `{ progress: 0; district: number }` + `walkTo(t)` / `advance(delta)`.
- `city-path.ts`: `CatmullRomCurve3` with 7 points at z = -15, -10, -5, 0, 5, 10, 15; y=1.6, x=0.
- `WheelCapture.tsx`: client component, captures wheel/touch/keyboard, calls `advance(delta)` with appropriate sensitivity.

## Task 2: City generator + rain + walk cam

- `CityGenerator.tsx`: 12 buildings (6 left + 6 right) along z, window texture reuse, height/width variation. Neon sign per block: additive glow quad.
- `Rain.tsx`: 2000/800 points, downward y velocity + sway, alpha fade at bottom.
- `WalkCam.tsx`: useFrame → `path.getPointAt(dampedProgress, pos)`, camera.position = pos, lookAt path.getPointAt(t+0.015).

## Task 3: District panels + navigation + integration

- `DistrictPanel.tsx`: 6 fixed-position overlays, opacity based on `district === index`.
- Navigation: progress rail (reuse, refactored to call walkTo), keyboard arrows.
- page.tsx: lock scroll, mount SceneCanvas(mode="night") + panels + wheel capture.

## Task 4: Verification

- Gates + SSR smoke + walk end-to-end.
