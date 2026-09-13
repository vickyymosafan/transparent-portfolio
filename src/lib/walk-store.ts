import { create } from "zustand";

export const ZONE_COUNT = 6;

export const ZONE_LABELS = [
  "City Approach",
  "The Lobby",
  "Skybridge",
  "Data Core",
  "Gallery",
  "Rooftop",
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

function computeZone(progress: number) {
  const scaled = progress * ZONE_COUNT;
  const zone = Math.min(ZONE_COUNT - 1, Math.floor(scaled));
  const zoneProgress = scaled - zone;

  // Transitioning if within 10% of a zone boundary
  const fractional = scaled % 1;
  const transitioning =
    zone < ZONE_COUNT - 1 && (fractional > 0.9 || fractional < 0.1);

  return { zone, zoneProgress, transitioning };
}

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
        district: Math.min(5, Math.floor(next * 6)),
        zone,
        zoneProgress,
        transitioning,
      };
    }),
  walkTo: (district) =>
    set(() => {
      const d = Math.max(0, Math.min(5, district));
      const progress = d / 5;
      const { zone, zoneProgress, transitioning } = computeZone(progress);
      return { progress, district: d, zone, zoneProgress, transitioning };
    }),
}));
