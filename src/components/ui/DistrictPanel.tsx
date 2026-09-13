"use client";

import { useWalkStore, ZONE_LABELS } from "@/lib/walk-store";

export function DistrictPanel() {
  const zone = useWalkStore((s) => s.zone);

  return (
    <>
      {ZONE_LABELS.map((title, i) => (
        <div
          key={i}
          className="fixed left-1/2 top-1/3 z-40 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-700"
          style={{ opacity: zone === i ? 1 : 0, pointerEvents: zone === i ? "auto" : "none" }}
        >
          <h2 className="text-5xl font-bold tracking-tight text-bone drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            {title}
          </h2>
          <p className="mt-4 text-lg text-bone/50">
            {i === 0 && "Approaching the neon district"}
            {i === 1 && "Welcome to headquarters"}
            {i === 2 && "42 floors above the city"}
            {i === 3 && "Where data comes alive"}
            {i === 4 && "Featured works"}
            {i === 5 && "Above it all"}
          </p>
        </div>
      ))}
    </>
  );
}
