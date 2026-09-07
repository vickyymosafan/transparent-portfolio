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
  hero: { camera: [0, 1.0, 9], lookAt: [0, 1.2, 0], fogColor: "#080c11", fogDensity: 0.045, moonX: -3.2, moonY: 3.8, moonScale: 1, stream: 0, drift: 1 },
  about: { camera: [0.6, 1.0, 6.5], lookAt: [0.3, 1.4, 0], fogColor: "#0a0e12", fogDensity: 0.05, moonX: -2.8, moonY: 3.4, moonScale: 1.05, stream: 0, drift: 1.2 },
  stats: { camera: [0, 1.1, 6.0], lookAt: [0, 1.6, 0], fogColor: "#0a1116", fogDensity: 0.06, moonX: 2.6, moonY: 4.2, moonScale: 0.85, stream: 1, drift: 0.5 },
  projects: { camera: [1.4, 1.0, 7], lookAt: [0.6, 1.3, 0], fogColor: "#0e0b0a", fogDensity: 0.05, moonX: 0.4, moonY: 2.8, moonScale: 0.95, stream: 0, drift: 0.9 },
  finale: { camera: [0, 1.2, 10], lookAt: [0, 2.2, 0], fogColor: "#070a0e", fogDensity: 0.04, moonX: 0, moonY: 3.8, moonScale: 1.7, stream: 0, drift: 0.4 },
};

export const SCENE_DAMP = { camera: 1.5, uniforms: 1.2 } as const;

export interface CardView {
  cam: [number, number, number];
  look: [number, number, number];
}

export const CARD_VIEWS: CardView[] = [
  { cam: [2.2, 1.6, -3.2], look: [2.6, 2.4, -8] },
  { cam: [-4.6, 3.4, 2.2], look: [-3.2, 3.8, -12] },
  { cam: [-1.0, 0.8, 1.2], look: [1.4, 0.9, -6] },
];

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
