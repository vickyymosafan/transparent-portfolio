import { create } from "zustand";

interface WalkState {
  progress: number;
  district: number;
  advance: (delta: number) => void;
  walkTo: (district: number) => void;
}

export const useWalkStore = create<WalkState>((set) => ({
  progress: 0,
  district: 0,
  advance: (delta) =>
    set((s) => {
      const next = Math.max(0, Math.min(1, s.progress + delta));
      return { progress: next, district: Math.min(5, Math.floor(next * 6)) };
    }),
  walkTo: (district) =>
    set(() => {
      const d = Math.max(0, Math.min(5, district));
      return { progress: d / 5, district: d };
    }),
}));
