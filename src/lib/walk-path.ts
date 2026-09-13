import * as THREE from "three";
import type { ChapterId } from "@/lib/chapter-store";

export interface PathNode {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  chapter: ChapterId;
}

/*
 * CINEMATIC CAMERA PATH — 6 Zones
 *
 * The camera follows a dramatic 3D spline that moves through:
 *   Zone 0: City Approach — aerial descent to street level   (z: 25→8)
 *   Zone 1: Building Lobby — enter through door, atrium      (z: 8→-2)
 *   Zone 2: Glass Skybridge — elevated corridor, rise up     (z: -2→-12)
 *   Zone 3: Server/Data Room — descend into dark room        (z: -12→-22)
 *   Zone 4: Exhibition Gallery — walk through bright gallery  (z: -22→-32)
 *   Zone 5: Rooftop Finale — ascend to rooftop panorama      (z: -32→-42)
 *
 * Each zone spans ~10 units in Z, with camera Y and X varying dramatically.
 */

export const PATH_NODES: PathNode[] = [
  // ═══════════════════════════════════════════════════════════
  // ZONE 0: CITY APPROACH — Aerial descent through rain
  // ═══════════════════════════════════════════════════════════
  // Start: high up, far away — dramatic aerial view of the city
  { position: [0, 8, 25],    lookAt: [0, 2, 0],    fov: 38, chapter: "hero" },
  // Descend, slight pan right — see neon signs along buildings
  { position: [1.5, 5, 20],  lookAt: [0, 2.5, 5],  fov: 42, chapter: "hero" },
  // Sweep left, approaching street level
  { position: [-1, 3, 15],   lookAt: [0, 2, 2],    fov: 48, chapter: "hero" },
  // Touch down to walking height, looking at building entrance
  { position: [0, 1.6, 11],  lookAt: [0, 1.8, 0],  fov: 52, chapter: "hero" },
  // Approach the entrance — looking straight at the doorway
  { position: [0, 1.6, 9],   lookAt: [0, 1.6, -2],  fov: 55, chapter: "hero" },
  // Enter through the doorframe
  { position: [0, 1.6, 7.5], lookAt: [0, 1.6, -3],  fov: 56, chapter: "hero" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 1: BUILDING LOBBY — Cyberpunk atrium interior
  // ═══════════════════════════════════════════════════════════
  // Just inside the door — see the atrium open up
  { position: [0, 1.6, 5],    lookAt: [0, 2.5, -5],   fov: 58, chapter: "about" },
  // Pan right to see reception desk, holographic display
  { position: [1.2, 1.6, 3],  lookAt: [0, 2, -6],     fov: 55, chapter: "about" },
  // Walk deeper into the lobby, look up at the soaring atrium
  { position: [0.5, 1.6, 0],  lookAt: [-0.5, 4, -8],  fov: 60, chapter: "about" },
  // Approach the elevator / skybridge entrance
  { position: [0, 1.6, -2],   lookAt: [0, 2.5, -10],  fov: 55, chapter: "about" },
  // Turn toward corridor that leads to the skybridge
  { position: [-0.5, 1.6, -3.5], lookAt: [0, 3, -12], fov: 52, chapter: "about" },
  // Pass through doorway into skybridge zone
  { position: [0, 1.8, -5],   lookAt: [0, 3, -14],    fov: 50, chapter: "about" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 2: GLASS SKYBRIDGE — Elevated glass corridor
  // ═══════════════════════════════════════════════════════════
  // Enter skybridge — camera rises, glass walls become visible
  { position: [0, 4, -7],     lookAt: [0, 3.5, -16],  fov: 52, chapter: "experience" },
  // Midpoint — peak height, look down through glass floor
  { position: [0.3, 5.5, -10], lookAt: [-0.3, 3, -18], fov: 55, chapter: "experience" },
  // Side glance — city visible through glass walls
  { position: [-0.5, 5, -12], lookAt: [1, 4, -20],    fov: 58, chapter: "experience" },
  // Begin descent at far end of skybridge
  { position: [0, 4.5, -14],  lookAt: [0, 2, -22],    fov: 55, chapter: "experience" },
  // Drop toward server room entrance
  { position: [0.3, 3, -16],  lookAt: [0, 1.5, -24],  fov: 50, chapter: "experience" },
  // Pass through security door into darkness
  { position: [0, 2, -17.5],  lookAt: [0, 1.6, -25],  fov: 48, chapter: "experience" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 3: SERVER / DATA ROOM — Dark with glowing racks
  // ═══════════════════════════════════════════════════════════
  // Enter dark room — eyes adjust, LED strips glow
  { position: [0, 1.6, -19],  lookAt: [0, 1.5, -28],  fov: 45, chapter: "stats" },
  // Walk between server rack rows
  { position: [0, 1.6, -21],  lookAt: [0.8, 1.8, -30], fov: 42, chapter: "stats" },
  // Pause at holographic data display
  { position: [0.5, 1.7, -23], lookAt: [-0.5, 2, -30], fov: 40, chapter: "stats" },
  // Look up at data visualizations
  { position: [0, 1.8, -25],  lookAt: [0, 3, -32],    fov: 44, chapter: "stats" },
  // Move toward exit
  { position: [-0.3, 1.6, -27], lookAt: [0, 1.6, -34], fov: 48, chapter: "stats" },
  // Exit through glass doors into gallery light
  { position: [0, 1.6, -28.5], lookAt: [0, 1.8, -36], fov: 50, chapter: "stats" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 4: EXHIBITION GALLERY — Bright project showcase
  // ═══════════════════════════════════════════════════════════
  // Enter gallery — dramatic light change from dark server room
  { position: [0, 1.6, -30],  lookAt: [0, 2, -38],    fov: 52, chapter: "projects" },
  // Pan to see left wall displays
  { position: [-1.5, 1.6, -32], lookAt: [2, 1.8, -38], fov: 48, chapter: "projects" },
  // Walk center aisle, see displays on both sides
  { position: [0, 1.6, -34],  lookAt: [0, 1.8, -40],  fov: 45, chapter: "projects" },
  // Pause near featured project display
  { position: [1, 1.7, -36],  lookAt: [-1, 2, -42],   fov: 42, chapter: "projects" },
  // Approach exit toward stairwell
  { position: [0.5, 1.6, -38], lookAt: [0, 2.5, -44], fov: 50, chapter: "projects" },
  // Enter stairwell / exit door to rooftop
  { position: [0, 1.8, -39.5], lookAt: [0, 4, -46],   fov: 55, chapter: "projects" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 5: ROOFTOP — Open sky panorama finale
  // ═══════════════════════════════════════════════════════════
  // Emerge through rooftop door — sky opens up
  { position: [0, 6, -41],    lookAt: [0, 5, -48],    fov: 58, chapter: "finale" },
  // Rise to rooftop level — helipad visible
  { position: [0.5, 8, -43],  lookAt: [-1, 6, -50],   fov: 62, chapter: "finale" },
  // Pan around — full city panorama below
  { position: [-1, 9, -45],   lookAt: [2, 4, -48],    fov: 65, chapter: "finale" },
  // Final position — looking at skyline, wide shot
  { position: [0, 10, -46],   lookAt: [0, 6, -40],    fov: 60, chapter: "finale" },
  // Hold — dramatic finale view
  { position: [0, 10.5, -47], lookAt: [0, 5, -38],    fov: 58, chapter: "finale" },
  // Fade to credits position
  { position: [0, 11, -47],   lookAt: [0, 8, -35],    fov: 55, chapter: "finale" },
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