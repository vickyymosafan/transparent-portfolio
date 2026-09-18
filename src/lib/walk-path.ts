import * as THREE from "three";
export type ChapterId = "hero" | "about" | "experience" | "stats" | "projects" | "finale";

export interface PathNode {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  chapter: ChapterId;
}

/*
 * CINEMATIC ARCHITECTURAL CAMERA PATH — 6 Photorealistic Spaces
 * Calibrated for exact 1-point and 2-point perspective matching the reference images:
 *   Zone 0: Exterior Courtyard Entrance   z: 21.0 → 0.2    (Eye level descending over reflection pool)
 *   Zone 1: The Entrance Foyer            z: 0.0 → -14.5   (Eye level y = 1.55 framing floating stairs & fluted wall)
 *   Zone 2: Zen Garden Corridor           z: -14.5 → -27.0 (Symmetrical 1-point breezeway perspective at y = 1.6)
 *   Zone 3: Project Exhibition Gallery    z: -27.0 → -39.0 (Framed 2-point view of backlit slabs & bench, y = 1.55)
 *   Zone 4: Developer Studio              z: -39.0 → -51.0 (Desk & triple monitors with city window, y = 1.48)
 *   Zone 5: Rooftop Sky Lounge            z: -51.0 → -63.0 (Elevated terrace angle framing sunken pit & fire table)
 */

export const PATH_NODES: PathNode[] = [
  // ═══════════════════════════════════════════════════════════
  // ZONE 0: EXTERIOR COURTYARD (Reference Image 5)
  // ═══════════════════════════════════════════════════════════
  // 0. High approach overview
  { position: [0, 3.8, 20.0],    lookAt: [0, 2.0, 0],     fov: 46, chapter: "hero" },
  // 1. Gliding down along basalt walkway
  { position: [0.2, 2.8, 15.0],  lookAt: [-0.1, 1.9, 0],  fov: 48, chapter: "hero" },
  // 2. Mid courtyard hero view: reflection pool & cloud pine on left, canopy ahead
  { position: [0, 1.8, 8.5],     lookAt: [0, 1.7, 0],     fov: 50, chapter: "hero" },
  // 3. Eye-level alignment approaching the entrance steps
  { position: [0, 1.68, 5.0],    lookAt: [0, 1.72, -1],   fov: 52, chapter: "hero" },
  // 4. In front of cantilevered canopy & glowing basalt steps
  { position: [0, 1.62, 2.6],    lookAt: [0, 1.65, -3],   fov: 53, chapter: "hero" },
  // 5. Approaching the grand dark walnut pivot door
  { position: [0.18, 1.6, 0.8],     lookAt: [0, 1.65, -5],   fov: 54, chapter: "hero" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 1: THE FOYER (Reference Image 3)
  // ═══════════════════════════════════════════════════════════
  // 6. Passing through pivot portal into oak foyer
  { position: [0.25, 1.58, -2.0],  lookAt: [-0.1, 1.6, -9],   fov: 52, chapter: "about" },
  // 7. Symmetrical 1-point hero view: floating stairs on left, console on right, garden ahead
  { position: [0.35, 1.58, -4.5], lookAt: [-0.2, 1.62, -11], fov: 50, chapter: "about" },
  // 8. Mid-foyer sweet spot: framing floating open treads, glass balustrade, fluted oak wall
  { position: [0.2, 1.58, -7.25], lookAt: [0, 1.6, -14], fov: 50, chapter: "about" },
  // 9. Glancing past the Nero Marquina console & wabi-sabi vase
  { position: [-0.15, 1.58, -9.8], lookAt: [0.6, 1.6, -14], fov: 51, chapter: "about" },
  // 10. Approaching the garden corridor opening
  { position: [0, 1.6, -12.2],  lookAt: [0, 1.6, -17],   fov: 52, chapter: "about" },
  // 11. Crossing portal into the Zen breezeway
  { position: [0, 1.6, -14.2],  lookAt: [0, 1.6, -20],   fov: 52, chapter: "about" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 2: ZEN GARDEN CORRIDOR (Reference Image 4)
  // ═══════════════════════════════════════════════════════════
  // 12. Entering glass breezeway: linear baseboard lights glowing
  { position: [0, 1.6, -16.2],  lookAt: [0, 1.6, -23],   fov: 50, chapter: "experience" },
  // 13. Symmetrical 1-point perspective down the honed basalt floor & bamboo gardens
  { position: [0, 1.6, -18.5],  lookAt: [0, 1.6, -25],   fov: 48, chapter: "experience" },
  // 14. Mid-corridor: looking out through glass at bamboo groves & granite rocks
  { position: [0.1, 1.6, -20.8], lookAt: [-0.3, 1.6, -27], fov: 48, chapter: "experience" },
  // 15. Passing minimalist walnut bench
  { position: [-0.1, 1.6, -23.0], lookAt: [0.3, 1.6, -29], fov: 49, chapter: "experience" },
  // 16. Approaching gallery entrance portal
  { position: [0, 1.6, -25.2],  lookAt: [0, 1.6, -31],   fov: 50, chapter: "experience" },
  // 17. Crossing threshold into bright Exhibition Gallery
  { position: [0, 1.6, -27.0],  lookAt: [0, 1.65, -33],  fov: 52, chapter: "experience" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 3: PROJECT GALLERY (Reference Image 1)
  // ═══════════════════════════════════════════════════════════
  // 18. Entering pristine gallery: polished terrazzo floor reflections
  { position: [0.7, 1.55, -29.0], lookAt: [-1.2, 1.8, -34], fov: 48, chapter: "projects" },
  // 19. Framed architectural view of 4 backlit display slabs, travertine bench, elevator
  { position: [0.8, 1.55, -30.0], lookAt: [-1.4, 1.75, -35.0], fov: 48, chapter: "projects" },
  // 20. Center gallery promenade: inspecting featured project details
  { position: [0.5, 1.55, -32.5], lookAt: [-1.6, 1.8, -36], fov: 46, chapter: "projects" },
  // 21. Viewing works with glass elevator vestibule in the background
  { position: [0.2, 1.55, -35.0], lookAt: [-0.6, 1.7, -39], fov: 48, chapter: "projects" },
  // 22. Moving toward the Developer Studio portal
  { position: [0, 1.58, -37.0], lookAt: [0, 1.6, -42],   fov: 49, chapter: "projects" },
  // 23. Entering Developer Studio
  { position: [0, 1.58, -38.8], lookAt: [0, 1.55, -44],  fov: 50, chapter: "projects" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 4: DEVELOPER STUDIO ("WHERE I BUILD")
  // ═══════════════════════════════════════════════════════════
  // 24. Entering warm walnut studio sanctuary
  { position: [0.4, 1.55, -40.5], lookAt: [-0.6, 1.45, -45], fov: 48, chapter: "stats" },
  // 25. 2-Point perspective: walnut desk, triple monitors, bookcase, city window
  { position: [0.6, 1.5, -42.5], lookAt: [-0.7, 1.35, -45.5], fov: 45, chapter: "stats" },
  // 26. Workstation focus: code on center monitor, AI graph on left, brass lamp glow
  { position: [0.2, 1.48, -44.5], lookAt: [-0.8, 1.3, -45.5], fov: 42, chapter: "stats" },
  // 27. Looking past workstation toward the large floor-to-ceiling city window
  { position: [0.5, 1.52, -46.5], lookAt: [1.8, 1.6, -48], fov: 48, chapter: "stats" },
  // 28. Approaching bronze elevator vestibule
  { position: [0, 1.58, -48.5], lookAt: [0, 2.0, -51],   fov: 50, chapter: "stats" },
  // 29. Ascending into elevator to the rooftop
  { position: [0, 1.8, -50.5],  lookAt: [0, 2.8, -53],   fov: 52, chapter: "stats" },

  // ═══════════════════════════════════════════════════════════
  // ZONE 5: ROOFTOP SKY LOUNGE (Reference Image 2)
  // ═══════════════════════════════════════════════════════════
  // 30. Emerging onto open-air teak roof terrace under evening sky
  { position: [-3.8, 1.65, -52.2], lookAt: [0.6, 0.1, -57.2], fov: 50, chapter: "finale" },
  // 31. Elevated 3/4 diagonal perspective: sunken pit, dancing flame, beige sectional, pines, skyline
  { position: [-3.4, 1.50, -53.6], lookAt: [0.6, -0.12, -57.2], fov: 48, chapter: "finale" },
  // 32. Lower intimate lounge perspective near the fire table
  { position: [-2.6, 1.40, -55.2], lookAt: [0.6, -0.15, -57.5], fov: 48, chapter: "finale" },
  // 33. Front view of fire table and glowing river rocks
  { position: [-1.0, 1.25, -56.8], lookAt: [0.6, -0.10, -58.0], fov: 50, chapter: "finale" },
  // 34. Skyline view over the glass balustrade with warm perimeter wash
  { position: [0.0, 1.45, -59.2], lookAt: [0, 1.2, -66.0],  fov: 52, chapter: "finale" },
  // 35. Final serene hover view: "LET'S BUILD SOMETHING IMPRESSIVE"
  { position: [0.0, 1.60, -61.5], lookAt: [0, 1.4, -68.0],  fov: 50, chapter: "finale" },
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
  walkCurve.getPointAt(clamped, _pos);

  // Synchronize lookAt and fov precisely with camera's physical Z coordinate
  let i = 0;
  for (let n = 0; n < PATH_NODES.length - 1; n++) {
    const zCurr = PATH_NODES[n].position[2];
    const zNext = PATH_NODES[n + 1].position[2];
    if (_pos.z <= zCurr && _pos.z >= zNext) {
      i = n;
      break;
    }
  }
  const zA = PATH_NODES[i].position[2];
  const zB = PATH_NODES[i + 1].position[2];
  const frac = Math.abs(zA - zB) > 0.001 ? (_pos.z - zA) / (zB - zA) : 0;
  const clampedFrac = Math.max(0, Math.min(1, frac));

  _look.lerpVectors(walkLookAts[i], walkLookAts[i + 1], clampedFrac);

  return {
    position: _pos.clone(),
    lookAt: _look.clone(),
    fov: THREE.MathUtils.lerp(walkFovs[i], walkFovs[i + 1], clampedFrac),
    chapter: walkChapters[i],
  };
}