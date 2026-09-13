# Cinematic Scroll — 3D Walk Path Design

**Date:** 2026-09-13
**Status:** Draft
**Branch:** `night-city-sprint1`

---

## 1. Objective

Transform the portfolio's flat scroll into a **cinematic 3D walkthrough** where each section feels like entering/exiting a different room or space. Scrolling drives the camera along a predefined 3D path that weaves through the city, through doorways, into rooms, and out to a rooftop finale — all while the existing DOM content (Hero, About, Experience, Stats, Projects, Contact) scrolls normally.

---

## 2. Architecture

```
scrollProgress.value (0–1)    ← Lenis smooth scroll
       │
       ▼
useChapterProgress.ts          ← maps 0–1 → { chapter, localProgress }
       │
       ├──► WalkPathController.tsx
       │       ├── CatmullRomCurve3 (from walk-path.ts)
       │       ├── camera.position lerp along path
       │       ├── camera.lookAt lerp (separate target array)
       │       ├── camera.fov lerp (38–65 per chapter)
       │       └── fog color/density sync
       │
       ├──► TransitionArch.tsx
       │       ├── doorway pillars (fade in/out per chapter)
       │       ├── ceiling planes (fade in for indoor chapters)
       │       └── frame geometry (per-chapter variation)
       │
       └──► RoomLights.tsx
               ├── ambientLight color per chapter
               └── directionalLight color + intensity per chapter
```

### 2.1 Component Relationships

| Component | Role | Reads | Mutates |
|-----------|------|-------|---------|
| `walk-path.ts` | Data — path nodes + curve builder | — | — |
| `useChapterProgress.ts` | Hook — scroll → chapter mapping | `scrollProgress.value` | — |
| `WalkPathController.tsx` | Core — camera animation per frame | `useChapterProgress`, `walk-path` | `camera.position`, `camera.fov`, `camera.lookAt` |
| `TransitionArch.tsx` | Visual — foreground doorway/ceiling | chapter local progress | mesh opacity |
| `RoomLights.tsx` | Visual — per-chapter lighting | active chapter | light color/intensity |
| `SceneRig` (existing) | Ambient — fog/moon/embers damping | `CHAPTER_SCENES` | scene fog, moon, embers |

### 2.2 Data Flow

```
Lenis scroll → scrollProgress.value (0–1)
       │
       ▼
useChapterProgress()
  ├── chapterIndex = floor(progress * 6)
  ├── localProgress = (progress * 6) - chapterIndex  (0–1 within chapter)
  └── activeChapter = CHAPTER_ORDER[chapterIndex]
       │
       ├──► WalkPathController: getPointAt(progress) → pos + lookAt + fov
       ├──► TransitionArch: localProgress → pillar/ceiling opacity
       └──► RoomLights: activeChapter → light color
```

---

## 3. Path Definition

### 3.1 PathNode Interface

```typescript
// src/lib/walk-path.ts
interface PathNode {
  position: [number, number, number];   // camera world position
  lookAt: [number, number, number];     // camera look-at target
  fov: number;                          // camera FOV at this node
  chapter: ChapterId;                   // which chapter this node belongs to
}
```

### 3.2 Full Path (21 Nodes)

```
HERO (3 nodes)
  N1:  pos=[0, 3, 12],  look=[0, 2, -5],   fov=38, chapter=hero
  N2:  pos=[0, 2.5, 9], look=[0, 1.8, -2],  fov=42, chapter=hero
  N3:  pos=[0, 2, 7],   look=[0, 1.5, 0],   fov=45, chapter=hero

ABOUT (3 nodes)
  N4:  pos=[0, 1.5, 5], look=[0, 1.2, 0],   fov=55, chapter=about
  N5:  pos=[0.3, 1.5, 4], look=[0.2, 1.2, -1], fov=58, chapter=about
  N6:  pos=[0.5, 1.5, 3.5], look=[0.3, 1.2, -1.5], fov=58, chapter=about

EXPERIENCE (3 nodes)
  N7:  pos=[-0.5, 1.5, 3], look=[0.3, 1.2, -1], fov=58, chapter=experience
  N8:  pos=[-0.8, 1.5, 2.5], look=[0.5, 1.2, -2], fov=60, chapter=experience
  N9:  pos=[-1, 1.5, 2], look=[0.5, 1.2, -2.5], fov=60, chapter=experience

STATS (3 nodes)
  N10: pos=[0, 1.8, 3], look=[0, 1.5, -3], fov=50, chapter=stats
  N11: pos=[0, 2, 3],   look=[0, 1.5, -3], fov=50, chapter=stats
  N12: pos=[0, 2, 3],   look=[0, 1.5, -3], fov=50, chapter=stats

PROJECTS (3 nodes)
  N13: pos=[1.5, 1.5, 4], look=[-0.3, 1.3, -2], fov=45, chapter=projects
  N14: pos=[2, 1.5, 4],   look=[-0.5, 1.3, -2], fov=45, chapter=projects
  N15: pos=[2, 1.5, 4],   look=[-0.5, 1.3, -2], fov=45, chapter=projects

FINALE (3 nodes)
  N16: pos=[0.5, 1.5, 2.5], look=[0, 1.8, -6], fov=55, chapter=finale
  N17: pos=[0, 1.5, 2],     look=[0, 2, -8],   fov=60, chapter=finale
  N18: pos=[0, 1.5, 2],     look=[0, 2.2, -10], fov=60, chapter=finale

FINALE (3 nodes)
  N16: pos=[0.5, 1.5, 2.5], look=[0, 1.8, -6], fov=55, chapter=finale
  N17: pos=[0, 1.5, 2],     look=[0, 2, -8],   fov=60, chapter=finale
  N18: pos=[0, 1.5, 2],     look=[0, 2.2, -10], fov=60, chapter=finale
```

### 3.3 Curve Construction

```typescript
const curve = new THREE.CatmullRomCurve3(
  PATH_NODES.map(n => new THREE.Vector3(...n.position))
);
// lookAt targets interpolated separately via lerpVectors
// FOV interpolated via THREE.MathUtils.lerp
```

---

## 4. Transition Architecture (Foreground)

### 4.1 Transition Types

| Type | Geometry | Chapters |
|------|----------|----------|
| `doorway` | 2 pillar boxes (kiri+kanan) + 1 lintel (atas) | Hero→About, Finale exit |
| `corridor` | 2 wall planes (kiri+kanan) + 1 ceiling plane | About→Experience |
| `data-frame` | 2 thin frame rectangles + horizontal beam | Experience→Stats |
| `gallery-frame` | 1 large picture frame (kiri) | Stats→Projects |
| `balcony` | 1 railing plane + 1 ceiling beam | Projects→Finale |

### 4.2 Fade Timing

Each transition follows the same opacity curve based on `localProgress` (0–1 within the departing chapter):

```
localProgress: 0.0────0.3────0.5────0.7────1.0
                      │      │      │
Pillar opacity:  0 → 0.8 → 0.6 → 0.3 → 0
Ceiling opacity: 0 → 0   → 0.4 → 0.6 → 0
FOV:            current → lerp → next
Fog color:      current → lerp → next
```

### 4.3 RoomLights Per Chapter

```typescript
const ROOM_LIGHTS: Record<ChapterId, {
  ambient: string;
  dirColor: string;
  dirPos: [number, number, number];
  intensity: number;
}> = {
  hero:       { ambient: "#1a2030", dirColor: "#d6e7ff", dirPos: [9, 18, 7],   intensity: 0.8 },
  about:      { ambient: "#2a1a10", dirColor: "#ffd4a0", dirPos: [5, 12, 5],   intensity: 0.6 },
  experience: { ambient: "#1a1a2a", dirColor: "#b8c8ff", dirPos: [-5, 10, 8],  intensity: 0.7 },
  stats:      { ambient: "#0a1a2a", dirColor: "#4080ff", dirPos: [0, 15, 0],   intensity: 1.0 },
  projects:   { ambient: "#2a2a20", dirColor: "#ffe8c0", dirPos: [8, 10, 5],   intensity: 0.9 },
  finale:     { ambient: "#1a2030", dirColor: "#d6e7ff", dirPos: [9, 18, 7],   intensity: 1.2 },
};
```

---

## 5. Integration Points

### 5.1 SceneInner.tsx Changes

```tsx
// Default mode — after MonolithCity
<MonolithCity />
<RoomLights chapter={activeChapter} />
<WalkPathController progress={scrollProgress.value} />
<TransitionArch
  type={currentTransitionType}
  progress={chapterLocalProgress}
/>
```

### 5.2 SceneRig Changes

SceneRig keeps fog/moon/embers damping but **removes camera position/lookAt interpolation** — that's handled by WalkPathController now.

### 5.3 No Changes To

- `page.tsx` (all DOM components stay identical)
- Feature components (Hero, About, Experience, Stats, Projects, Contact)
- `ProgressRail`, `SiteNav`, `ForegroundLayers`, `CustomCursor`
- Night mode (`/night` route)
- `SmoothScroll` (Lenis)

---

## 6. Performance

| Concern | Mitigation |
|---------|------------|
| TransitionArch geometry | Only 2–4 thin meshes per transition, total < 100 vertices |
| RoomLights | 1 ambient + 1 directional — existing pattern |
| Path curve evaluation | `CatmullRomCurve3.getPointAt()` called once per frame — negligible cost |
| FOV changes | `camera.updateProjectionMatrix()` once per frame — standard R3F |
| Existing scene load | MonolithCity (18 instanced meshes) unchanged |

---

## 7. File Plan

### New Files

| File | Est. Lines | Purpose |
|------|-----------|---------|
| `src/lib/walk-path.ts` | 80 | PathNode array + curve builder + getWalkPathState helper |
| `src/hooks/useChapterProgress.ts` | 30 | Map scrollProgress 0–1 → chapter + local progress |
| `src/components/canvas/WalkPathController.tsx` | 70 | useFrame: camera animation along path |
| `src/components/canvas/TransitionArch.tsx` | 90 | Foreground doorway/ceiling geometry per transition type |
| `src/components/canvas/RoomLights.tsx` | 50 | Per-chapter ambient + directional lights |

### Modified Files

| File | Change |
|------|--------|
| `src/components/canvas/SceneInner.tsx` | Mount WalkPathController, TransitionArch, RoomLights in default mode; remove camera lerp from SceneRig |

---

## 8. Implementation Order

### Sprint A: Core Engine
1. `walk-path.ts` — path data + curve builder
2. `useChapterProgress.ts` — scroll → chapter mapping
3. `WalkPathController.tsx` — camera animation
4. `SceneInner.tsx` — integrate controller, disable camera lerp in SceneRig
5. Gate: `npx tsc --noEmit && npm run lint && npm run build`

### Sprint B: Transitions & Lighting
6. `TransitionArch.tsx` — foreground geometry per transition type
7. `RoomLights.tsx` — per-chapter lighting
8. Integrate both in SceneInner
9. Gate: visual check — each chapter has distinct atmosphere

### Sprint C: Polish
10. Tuning FOV curve, damping, fog speed
11. End-to-end test all 6 chapters
12. ProgressRail click → scrollToChapter → camera follows
13. Mobile / reduced-motion test
