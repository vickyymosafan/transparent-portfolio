"use client";

import { useEffect, useRef } from "react";
import { useChapterStore, type ChapterId } from "@/lib/chapter-store";
import { scrollProgress } from "@/lib/scroll-progress";
import { DryTree, BrokenTower, GrassTufts } from "@/components/foreground/silhouettes";

type Piece = { Comp: typeof DryTree; left: string; width: number; flip?: boolean; bottom?: string };
const SETS: Record<ChapterId, Piece[]> = {
  hero: [
    { Comp: DryTree, left: "-4%", width: 340 },
    { Comp: GrassTufts, left: "58%", width: 420, flip: true },
  ],
  about: [
    { Comp: GrassTufts, left: "-6%", width: 460 },
    { Comp: BrokenTower, left: "70%", width: 300 },
  ],
  stats: [{ Comp: GrassTufts, left: "64%", width: 420, flip: true }],
  projects: [
    { Comp: BrokenTower, left: "-8%", width: 340 },
    { Comp: DryTree, left: "74%", width: 300, flip: true },
  ],
  finale: [{ Comp: GrassTufts, left: "40%", width: 480 }],
};

export function ForegroundLayers() {
  const wrap = useRef<HTMLDivElement>(null);
  const active = useChapterStore((s) => s.active);

  useEffect(() => {
    const onScroll = () => {
      if (wrap.current) {
        wrap.current.style.transform = `translate3d(0, ${-scrollProgress.value * 36}px, 0)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      wrap.current?.querySelectorAll(".fg-item").forEach((el) => el.classList.add("on"));
    });
    return () => cancelAnimationFrame(t);
  }, [active]);

  const pieces = SETS[active];

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-[1]">
      {pieces.map((p, i) => (
        <div
          key={`${active}-${i}`}
          className={`fg-item absolute bottom-[-12px] ${i > 0 ? "fg-delay" : ""}`}
          style={{ left: p.left, width: p.width }}
        >
          <div className="fg-sway">
            <p.Comp className="block w-full" flip={p.flip} />
          </div>
        </div>
      ))}
    </div>
  );
}
