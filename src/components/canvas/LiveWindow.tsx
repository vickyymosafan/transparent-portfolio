"use client";

import { useEffect, useRef } from "react";
import { registerLiveView } from "./live-registry";
import { LIVE_WINDOW_OFFSETS } from "@/lib/scene-state";

export function LiveWindow({ index, className }: { index: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || document.documentElement.classList.contains("no-webgl")) return;
        const unregister = registerLiveView(el, LIVE_WINDOW_OFFSETS[index % LIVE_WINDOW_OFFSETS.length]);
        return () => unregister();
    }, [index]);

    return (
        <div className={`relative overflow-hidden bg-[linear-gradient(150deg,#101a1d,#0a0d10_62%,#1a0c0b)] ${className ?? ""}`}>
            <div ref={ref} className="absolute inset-0" data-live-window={index} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/70" />
        </div>
    );
}
