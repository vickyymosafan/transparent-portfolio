"use client";

import { useWalkStore, ZONE_LABELS } from "@/lib/walk-store";

export function NightProgressRail() {
  const zone = useWalkStore((s) => s.zone);
  const walkTo = useWalkStore((s) => s.walkTo);

  return (
    <nav
      aria-label="Zones"
      className="fixed right-6 top-1/2 z-[45] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      {ZONE_LABELS.map((label, i) => (
        <button
          key={i}
          aria-label={label}
          onClick={() => walkTo(i)}
          className="group grid h-2.5 w-5 place-items-center"
        >
          <i
            className={`block h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              zone === i
                ? "w-[22px] bg-bone"
                : "w-3.5 bg-bone/25 hover:w-5 hover:bg-bone/60"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
