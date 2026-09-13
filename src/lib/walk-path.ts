import * as THREE from "three";
import type { ChapterId } from "@/lib/chapter-store";

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

export const walkCurve = new THREE.CatmullRomCurve3(
  PATH_NODES.map((n) => new THREE.Vector3(...n.position))
);

export const walkLookAts = PATH_NODES.map((n) => new THREE.Vector3(...n.lookAt));

export const walkFovs = PATH_NODES.map((n) => n.fov);

export const walkChapters = PATH_NODES.map((n) => n.chapter);

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

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