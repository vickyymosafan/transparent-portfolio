"use client";

import { useWalkStore } from "@/lib/walk-store";

const PANELS = ["Hero", "About", "Experience", "Training", "Stats", "Projects"];

export function DistrictPanel() {
  const district = useWalkStore((s) => s.district);

  return (
    <>
      {PANELS.map((title, i) => (
        <div
          key={i}
          className="fixed left-1/2 top-1/3 z-40 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-700"
          style={{ opacity: district === i ? 1 : 0, pointerEvents: district === i ? "auto" : "none" }}
        >
          <h2 className="text-5xl font-bold tracking-tight text-bone drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            {title}
          </h2>
          <p className="mt-4 text-lg text-bone/50">Coming soon</p>
        </div>
      ))}
    </>
  );
}
