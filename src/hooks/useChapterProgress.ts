import { scrollProgress } from "@/lib/scroll-progress";
import { CHAPTER_ORDER } from "@/lib/chapter-store";
import type { ChapterId } from "@/lib/chapter-store";

const CHAPTER_COUNT = CHAPTER_ORDER.length;

export interface ChapterProgress {
  chapterIndex: number;
  chapterId: ChapterId;
  localProgress: number;
}

/**
 * Maps global scroll progress (0–1) to chapter index and local progress (0–1).
 * Called every frame from useFrame.
 */
export function getChapterProgress(): ChapterProgress {
  const raw = scrollProgress.value * CHAPTER_COUNT;
  const chapterIndex = Math.min(Math.floor(raw), CHAPTER_COUNT - 1);
  const localProgress = raw - chapterIndex;
  return {
    chapterIndex,
    chapterId: CHAPTER_ORDER[chapterIndex],
    localProgress: Math.max(0, Math.min(1, localProgress)),
  };
}