"use client";

import { useEffect } from "react";
import { useChapterStore, type ChapterId } from "./chapter-store";

export function useChapterTracker() {
  const setActive = useChapterStore((s) => s.setActive);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.chapter as ChapterId | undefined;
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setActive]);
}
