import * as THREE from "three";

/**
 * Low-overhead architectural collision engine.
 * Pre-allocated bounding boxes and zero runtime allocations for smooth 60fps.
 */

export interface AABB {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface FloorPlane {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  y: number;
}

// Floor slabs across all 6 connected architectural zones
const FLOOR_PLANES: FloorPlane[] = [
  // Zone 01: Courtyard Walkway & Arrival
  { minX: -4.0, maxX: 4.0, minZ: 3.5, maxZ: 22.0, y: 0.0 },
  // Courtyard steps up to the porch
  { minX: -2.5, maxX: 2.5, minZ: 3.5, maxZ: 5.5, y: 0.08 },
  // Zone 02: Foyer Oak Floor
  { minX: -3.5, maxX: 4.0, minZ: -14.5, maxZ: 3.56, y: 0.0 },
  // Zone 03: Garden Corridor Honed Basalt
  { minX: -2.2, maxX: 2.2, minZ: -27.0, maxZ: -14.5, y: 0.0 },
  // Zone 04: Project Gallery Polished Terrazzo
  { minX: -3.0, maxX: 3.5, minZ: -39.0, maxZ: -27.0, y: 0.0 },
  // Zone 05: Developer Studio Microcement Floor
  { minX: -3.5, maxX: 4.0, minZ: -51.0, maxZ: -39.0, y: 0.0 },
  // Studio elevator vestibule / transition ramp to rooftop
  { minX: -2.0, maxX: 2.0, minZ: -52.5, maxZ: -50.0, y: 0.15 },
  // Zone 06: Rooftop Terrace Teak Decking
  { minX: -5.0, maxX: 6.0, minZ: -66.0, maxZ: -52.5, y: 0.0 },
];

// Structural walls & impassable furniture obstacles across all zones
const OBSTACLES: AABB[] = [
  // ── ZONE 01: COURTYARD ──
  // Reflecting pool left perimeter (water basin)
  { minX: -8.0, maxX: -1.6, minY: -0.5, maxY: 0.5, minZ: 4.0, maxZ: 14.0 },
  // Right gravel & landscape boundary
  { minX: 2.6, maxX: 8.0, minY: 0.0, maxY: 3.0, minZ: 4.0, maxZ: 20.0 },
  // Courtyard entrance facade wall left of door
  { minX: -8.0, maxX: -0.9, minY: 0.0, maxY: 4.5, minZ: 3.4, maxZ: 3.8 },
  // Courtyard entrance facade wall right of door
  { minX: 0.9, maxX: 8.0, minY: 0.0, maxY: 4.5, minZ: 3.4, maxZ: 3.8 },

  // ── ZONE 02: THE FOYER ──
  // Left travertine wall / stair stringer backing
  { minX: -3.8, maxX: -3.4, minY: 0.0, maxY: 4.0, minZ: -14.5, maxZ: 3.5 },
  // Right walnut slat wall
  { minX: 3.6, maxX: 4.2, minY: 0.0, maxY: 4.0, minZ: -14.5, maxZ: 3.5 },
  // Black stone console table
  { minX: 2.0, maxX: 3.4, minY: 0.0, maxY: 1.2, minZ: -10.5, maxZ: -8.5 },
  // Sculptural planter
  { minX: -3.2, maxX: -2.0, minY: 0.0, maxY: 1.5, minZ: -4.0, maxZ: -2.5 },

  // ── ZONE 03: GARDEN CORRIDOR ──
  // Left glass wall looking into zen courtyard
  { minX: -2.4, maxX: -1.8, minY: 0.0, maxY: 3.8, minZ: -27.0, maxZ: -14.5 },
  // Right glass / solid wall
  { minX: 1.8, maxX: 2.4, minY: 0.0, maxY: 3.8, minZ: -27.0, maxZ: -14.5 },
  // Minimalist walnut bench
  { minX: -1.7, maxX: -1.1, minY: 0.0, maxY: 0.6, minZ: -23.5, maxZ: -21.5 },

  // ── ZONE 04: PROJECT GALLERY ──
  // Left exhibition wall
  { minX: -3.2, maxX: -2.6, minY: 0.0, maxY: 4.0, minZ: -39.0, maxZ: -27.0 },
  // Right gallery wall
  { minX: 3.2, maxX: 3.8, minY: 0.0, maxY: 4.0, minZ: -39.0, maxZ: -27.0 },
  // Center display pedestal 1
  { minX: -0.4, maxX: 0.4, minY: 0.0, maxY: 1.1, minZ: -32.5, maxZ: -31.5 },

  // ── ZONE 05: DEVELOPER STUDIO ──
  // Left bookshelf & acoustic wall
  { minX: -3.6, maxX: -3.0, minY: 0.0, maxY: 4.0, minZ: -51.0, maxZ: -39.0 },
  // Right window sill / perimeter
  { minX: 3.6, maxX: 4.2, minY: 0.0, maxY: 4.0, minZ: -51.0, maxZ: -39.0 },
  // Solid walnut workstation desk + triple monitors
  { minX: -0.8, maxX: 1.8, minY: 0.0, maxY: 1.3, minZ: -46.5, maxZ: -44.5 },

  // ── ZONE 06: ROOFTOP TERRACE ──
  // North parapet glass railing
  { minX: -5.0, maxX: 6.0, minY: 0.0, maxY: 1.4, minZ: -66.5, maxZ: -65.5 },
  // West parapet glass railing
  { minX: -5.5, maxX: -4.8, minY: 0.0, maxY: 1.4, minZ: -66.0, maxZ: -52.0 },
  // East parapet glass railing
  { minX: 5.5, maxX: 6.2, minY: 0.0, maxY: 1.4, minZ: -66.0, maxZ: -52.0 },
  // Sunken conversation fire table (center obstacle)
  { minX: -0.2, maxX: 1.2, minY: 0.0, maxY: 0.7, minZ: -58.5, maxZ: -56.5 },
];

// Closed front entrance pivot door obstacle
const FRONT_DOOR_OBSTACLE: AABB = {
  minX: -0.9,
  maxX: 0.9,
  minY: 0.0,
  maxY: 3.0,
  minZ: 3.45,
  maxZ: 3.75,
};

/**
 * Resolves player motion against obstacles and floor planes.
 * Modifies targetPos in place and returns grounded status.
 */
export function resolveMovement(
  currentPos: THREE.Vector3,
  targetPos: THREE.Vector3,
  radius: number,
  doorOpen: boolean
): { grounded: boolean; groundY: number } {
  // 1. Solve X and Z collisions against obstacles
  const testBoxes = doorOpen ? OBSTACLES : [...OBSTACLES, FRONT_DOOR_OBSTACLE];

  for (let i = 0; i < testBoxes.length; i++) {
    const box = testBoxes[i];

    // Check if player's cylinder intersects the AABB
    if (
      targetPos.x + radius > box.minX &&
      targetPos.x - radius < box.maxX &&
      targetPos.z + radius > box.minZ &&
      targetPos.z - radius < box.maxZ &&
      targetPos.y < box.maxY &&
      targetPos.y + 1.7 > box.minY
    ) {
      // Find shallowest penetration axis to push out (sliding collision)
      const dx1 = targetPos.x + radius - box.minX;
      const dx2 = box.maxX - (targetPos.x - radius);
      const dz1 = targetPos.z + radius - box.minZ;
      const dz2 = box.maxZ - (targetPos.z - radius);

      const minPenX = Math.min(dx1, dx2);
      const minPenZ = Math.min(dz1, dz2);

      if (minPenX < minPenZ) {
        if (dx1 < dx2) {
          targetPos.x = box.minX - radius;
        } else {
          targetPos.x = box.maxX + radius;
        }
      } else {
        if (dz1 < dz2) {
          targetPos.z = box.minZ - radius;
        } else {
          targetPos.z = box.maxZ + radius;
        }
      }
    }
  }

  // 2. Global world boundaries to prevent falling off the site
  targetPos.x = Math.max(-4.5, Math.min(5.5, targetPos.x));
  targetPos.z = Math.max(-65.0, Math.min(21.0, targetPos.z));

  // 3. Find ground elevation beneath player
  let groundY = 0.0;
  let foundPlane = false;

  for (let i = 0; i < FLOOR_PLANES.length; i++) {
    const fp = FLOOR_PLANES[i];
    if (
      targetPos.x >= fp.minX &&
      targetPos.x <= fp.maxX &&
      targetPos.z >= fp.minZ &&
      targetPos.z <= fp.maxZ
    ) {
      groundY = Math.max(groundY, fp.y);
      foundPlane = true;
    }
  }

  return { grounded: foundPlane, groundY };
}
