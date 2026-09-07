"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { registerLiveView, setLiveViewHover } from "./live-registry";
import { CARD_VIEWS } from "@/lib/scene-state";

export interface CardGlow {
  gx: number;
  gy: number;
  gr: number;
  variant: "moon" | "flame";
}

export function LiveWindow({
  index,
  className,
  glow,
}: {
  index: number;
  className?: string;
  glow?: CardGlow;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || document.documentElement.classList.contains("no-webgl")) return;
        const view = CARD_VIEWS[index % CARD_VIEWS.length];
        const unregister = registerLiveView(el, view);
        return () => unregister();
    }, [index]);

    return (
        <div className={`relative overflow-hidden bg-[linear-gradient(150deg,#101a1d,#0a0d10_62%,#1a0c0b)] ${className ?? ""}`}>
            <div
                ref={ref}
                className="absolute inset-0"
                data-live-window={index}
                onMouseEnter={() => ref.current && setLiveViewHover(ref.current, true)}
                onMouseLeave={() => ref.current && setLiveViewHover(ref.current, false)}
            />
            {glow && (
                <span
                    aria-hidden
                    className={`card-glow ${glow.variant === "flame" ? "card-glow--flame" : ""}`}
                    style={{ left: `${glow.gx}%`, top: `${glow.gy}%`, "--gr": `${glow.gr}%` } as CSSProperties}
                />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/70" />
        </div>
    );
}
