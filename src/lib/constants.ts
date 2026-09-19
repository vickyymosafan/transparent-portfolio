/**
 * Architectural Residence & Player Simulation Constants
 * All spatial dimensions are strictly in real-world meters (1 unit = 1 meter).
 */

export interface ZoneConfig {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  zStart: number;
  zEnd: number;
  spawnPoint: [number, number, number];
  heroCamera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
}

export const ZONES: ZoneConfig[] = [
  {
    id: 0,
    slug: "courtyard",
    name: "Courtyard Entry",
    subtitle: "Zone 01",
    tagline: "Arrival & Reflection Pool",
    zStart: 22.0,
    zEnd: 3.56,
    spawnPoint: [0, 0, 14.0],
    heroCamera: {
      position: [0, 2.2, 16.5],
      target: [0, 1.6, 2.0],
      fov: 48,
    },
  },
  {
    id: 1,
    slug: "foyer",
    name: "The Foyer",
    subtitle: "Zone 02",
    tagline: "Oak & Travertine Threshold",
    zStart: 3.56,
    zEnd: -14.5,
    spawnPoint: [0.25, 0, 1.2],
    heroCamera: {
      position: [0.25, 1.58, -4.5],
      target: [-0.1, 1.6, -11.0],
      fov: 50,
    },
  },
  {
    id: 2,
    slug: "garden-corridor",
    name: "Garden Corridor",
    subtitle: "Zone 03",
    tagline: "Glass Breezeway & Courtyard",
    zStart: -14.5,
    zEnd: -27.0,
    spawnPoint: [0, 0, -15.5],
    heroCamera: {
      position: [0, 1.6, -18.5],
      target: [0, 1.6, -25.0],
      fov: 48,
    },
  },
  {
    id: 3,
    slug: "project-gallery",
    name: "Project Gallery",
    subtitle: "Zone 04",
    tagline: "Exhibition of Production Works",
    zStart: -27.0,
    zEnd: -39.0,
    spawnPoint: [0.5, 0, -28.0],
    heroCamera: {
      position: [0.8, 1.55, -30.0],
      target: [-1.4, 1.75, -35.0],
      fov: 48,
    },
  },
  {
    id: 4,
    slug: "developer-studio",
    name: "Developer Studio",
    subtitle: "Zone 05",
    tagline: "Workstation & Technology Stack",
    zStart: -39.0,
    zEnd: -51.0,
    spawnPoint: [0.1, 0, -40.0],
    heroCamera: {
      position: [0.05, 1.5, -42.5],
      target: [0.15, 1.35, -46.0],
      fov: 46,
    },
  },
  {
    id: 5,
    slug: "rooftop-terrace",
    name: "Rooftop Terrace",
    subtitle: "Zone 06",
    tagline: "Twilight Sky Lounge & Dialogue",
    zStart: -51.0,
    zEnd: -66.0,
    spawnPoint: [0, 0, -53.0],
    heroCamera: {
      position: [-2.6, 1.68, -54.0],
      target: [0.8, 0.1, -58.0],
      fov: 50,
    },
  },
];

export const PLAYER_CONFIG = {
  height: 1.75,
  eyeHeight: 1.62,
  radius: 0.35,
  walkSpeed: 2.8,
  sprintSpeed: 4.8,
  acceleration: 14.0,
  deceleration: 10.0,
  gravity: 18.0,
  stepHeight: 0.3,
  initialPosition: [0, 0, 14.0] as [number, number, number],
  initialYaw: Math.PI, // Facing south into the residence (-Z direction)
};

export const CAMERA_CONFIG = {
  shoulderOffset: [0.35, 1.62, 2.3] as [number, number, number],
  minDistance: 0.8,
  maxDistance: 2.6,
  minPitch: -0.35, // Looking up ~20 deg
  maxPitch: 0.95,  // Looking down ~55 deg
  mouseSensitivity: 0.0022,
  touchSensitivity: 0.0035,
  fov: 50,
  collisionPadding: 0.35,
  damping: 10.0,
};

export const INTERACTION_RADIUS = 2.4;
