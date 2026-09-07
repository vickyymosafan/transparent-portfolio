"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
    const dot = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const el = dot.current;
        if (!el) return;
        let x = -100;
        let y = -100;
        let cx = -100;
        let cy = -100;
        let raf = 0;
        const onMove = (e: MouseEvent) => {
            x = e.clientX;
            y = e.clientY;
        };
        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement | null;
            el.classList.toggle("act", !!t?.closest("a, button, [data-cursor]"));
        };
        const loop = () => {
            cx += (x - cx) * 0.18;
            cy += (y - cy) * 0.18;
            el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
            raf = requestAnimationFrame(loop);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseover", onOver);
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onOver);
        };
    }, []);

    return <div ref={dot} className="cur-dot" aria-hidden />;
}
