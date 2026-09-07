"use client";

import { CHAPTER_LABELS, CHAPTER_ORDER, useChapterStore } from "@/lib/chapter-store";

export function ProgressRail() {
    const active = useChapterStore((s) => s.active);
    return (
        <nav aria-label="Chapters" className="fixed right-6 top-1/2 z-[45] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
            {CHAPTER_ORDER.map((id) => (
                <button
                    key={id}
                    aria-label={CHAPTER_LABELS[id]}
                    onClick={() =>
                        document.getElementById(`chapter-${id}`)?.scrollIntoView({
                            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                        })
                    }
                    className="grid h-2.5 w-5 place-items-center"
                >
                    <i
                        className={`block h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            active === id ? "w-[22px] bg-bone" : "w-3.5 bg-bone/25 hover:w-5 hover:bg-bone/60"
                        }`}
                    />
                </button>
            ))}
        </nav>
    );
}
