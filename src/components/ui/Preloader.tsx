"use client";

import { useEffect, useState } from "react";

export function Preloader() {
    const [done, setDone] = useState(false);
    const [pct, setPct] = useState(0);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const start = performance.now();
        let raf = 0;
        let finished = false;
        const tick = (t: number) => {
            if (finished) return;
            const elapsed = t - start;
            setPct(Math.min(100, Math.round((elapsed / 1600) * 100)));
            if (elapsed >= 2200 || (elapsed >= 1600 && document.fonts.status === "loaded")) {
                finished = true;
                document.body.style.overflow = "";
                setDone(true);
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            finished = true;
            cancelAnimationFrame(raf);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            aria-hidden={done}
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-all duration-700 ${
                done ? "pointer-events-none invisible opacity-0" : "opacity-100"
            }`}
        >
            <div className="w-[min(420px,74vw)] text-center">
                <div className="mx-auto mb-6 h-11 w-11 rounded-full border border-bone/30" />
                <p className="eyebrow mb-5 tracking-[0.5em]">Transparent Portfolio</p>
                <div className="relative h-px overflow-hidden bg-bone/15">
                    <i className="absolute inset-y-0 left-0 bg-bone transition-[right] duration-300" style={{ right: `${100 - pct}%` }} />
                </div>
                <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted-k">
                    <span>Loading</span>
                    <b className="font-medium tabular-nums text-bone-dim">{pct}%</b>
                </div>
            </div>
        </div>
    );
}
