import { create } from "zustand";

export type ChapterId = "hero" | "about" | "stats" | "projects" | "finale";

interface ChapterState {
  active: ChapterId;
  setActive: (chapter: ChapterId) => void;
}

export const useChapterStore = create<ChapterState>((set) => ({
  active: "hero",
  setActive: (active) => set({ active }),
}));

export const CHAPTER_ORDER: ChapterId[] = ["hero", "about", "stats", "projects", "finale"];

export const CHAPTER_LABELS: Record<ChapterId, string> = {
  hero: "Intro",
  about: "About",
  stats: "Live Data",
  projects: "Projects",
  finale: "Contact",
};
