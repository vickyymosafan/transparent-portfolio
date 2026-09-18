# Sprint 1: Night City Engine

Tanggal: 2026-09-11
Status: Design (approved)

## Scope

Build the core Night City walkthrough engine: procedural city generation, camera path, scroll→walk interaction, rain + fog + bloom, navigation controls, placeholder panels per district. No real content yet.

## Arsitektur

**Interaction model**
- Page: `100vh`, `overflow: hidden`, no native scroll.
- `walkProgress: number` (0..1) driven by wheel/touch/arrow keys → stored in a zustand store `useWalkStore`.
- Camera `t` = `MathUtils.damp(walkProgress)` → `CatmullRomCurve3.getPointAt(t)`.

**City layout** (looking down the z-axis):
```
  ── building ──        ── building ──
                 street (z)
  ── building ──        ── building ──
```
- 6 blocks (districts) along z, ~5 units per block.
- Buildings both sides, height 2–8 units, width 2–4, gap 0.5.
- Reuse `buildTowerTexture` from MonolithCity for window facades.
- Neon sign per block: `glowFrag` quad with district color.

**Camera path**
- `CatmullRomCurve3` with 7 waypoints (start + 6 district centers).
- Camera at `getPointAt(t)` (street center, y=1.6), lookAt `getPointAt(t+0.02)`.

**Navigation**
- Wheel → `walkProgress += delta * speed`.
- Arrow keys → increment district.
- Progress rail (reuse, refactored) → `walkTo(district)`.
- Touch drag → `walkProgress` based on deltaY.

**Weather**
- Rain: Points (reuse Ember pattern), count 2000/800, downward velocity, alpha fade.
- Fog banks (reuse, adapted horizontal).
- Bloom (existing, intensity 1.1).

**District panels** (placeholder)
- Fixed-position `div` per district, opacity 0→1 when active.
- Only title + "Coming soon".
- `districtIndex = floor(walkProgress * 6)`.

## Out of Scope (Sprint 2+)

- Real content (About/Experience/Stats/Projects/Contact).
- Neon billboards with text.
- Panel transitions (will be added in Sprint 2).
