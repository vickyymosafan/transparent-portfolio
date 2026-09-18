import { create } from "zustand";

export const ZONE_COUNT = 6;

export const ZONE_LABELS = [
  "Courtyard Entry",
  "The Foyer",
  "Garden Corridor",
  "Project Gallery",
  "Developer Studio",
  "Rooftop Terrace",
] as const;

interface WalkState {
  progress: number;
  district: number;
  /** Current cinematic zone index (0-5) */
  zone: number;
  /** Progress within current zone (0-1) */
  zoneProgress: number;
  /** True when camera is crossing a zone boundary (±10% of boundary) */
  transitioning: boolean;
  advance: (delta: number) => void;
  walkTo: (district: number) => void;
}

const ZONE_THRESHOLDS = [0.0, 0.22, 0.40, 0.56, 0.70, 0.84, 1.0];

function computeZone(progress: number) {
  let zone = 0;
  for (let i = 0; i < ZONE_COUNT; i++) {
    if (progress >= ZONE_THRESHOLDS[i] && progress < ZONE_THRESHOLDS[i + 1]) {
      zone = i;
      break;
    }
  }
  if (progress >= ZONE_THRESHOLDS[ZONE_COUNT]) {
    zone = ZONE_COUNT - 1;
  }

  const start = ZONE_THRESHOLDS[zone];
  const end = ZONE_THRESHOLDS[zone + 1] ?? 1.0;
  const zoneProgress = Math.max(0, Math.min(1, (progress - start) / Math.max(0.001, end - start)));

  const transitioning =
    zone < ZONE_COUNT - 1 && (zoneProgress > 0.85 || zoneProgress < 0.15);

  return { zone, zoneProgress, transitioning };
}

export const ZONE_TARGET_PROGRESS = [0.14, 0.31, 0.49, 0.63, 0.77, 0.90];

export const useWalkStore = create<WalkState>((set) => ({
  progress: 0,
  district: 0,
  zone: 0,
  zoneProgress: 0,
  transitioning: false,
  advance: (delta) =>
    set((s) => {
      const next = Math.max(0, Math.min(1, s.progress + delta));
      const { zone, zoneProgress, transitioning } = computeZone(next);
      return {
        progress: next,
        district: zone,
        zone,
        zoneProgress,
        transitioning,
      };
    }),
  walkTo: (district) =>
    set(() => {
      const d = Math.max(0, Math.min(5, district));
      const progress = ZONE_TARGET_PROGRESS[d] ?? (d / 5);
      const { zone, zoneProgress, transitioning } = computeZone(progress);
      return { progress, district: d, zone, zoneProgress, transitioning };
    }),
}));
