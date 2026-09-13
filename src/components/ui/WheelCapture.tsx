"use client";

import { useEffect, useRef } from "react";
import { useWalkStore } from "@/lib/walk-store";

const SENSITIVITY = 0.0008;
const TOUCH_MULT = 3;
const EASE = 0.12;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function WheelCapture() {
  const target = useRef(0);
  const current = useRef(0);
  const touchStart = useRef(0);

  useEffect(() => {
    let raf = 0;

    const ease = () => {
      const store = useWalkStore.getState().progress;
      // External jump (e.g. rail click) — resync instead of fighting it.
      if (Math.abs(store - current.current) > 0.05) {
        current.current = store;
        target.current = store;
      } else {
        const diff = target.current - current.current;
        if (Math.abs(diff) > 0.00005) {
          const next = clamp01(current.current + diff * EASE);
          useWalkStore.getState().advance(next - current.current);
          current.current = next;
        }
      }
      raf = requestAnimationFrame(ease);
    };
    raf = requestAnimationFrame(ease);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current = clamp01(target.current + e.deltaY * SENSITIVITY);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStart.current - e.touches[0].clientY;
      touchStart.current = e.touches[0].clientY;
      target.current = clamp01(target.current + dy * SENSITIVITY * TOUCH_MULT);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const s = useWalkStore.getState();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        target.current = clamp01((s.district + 1) / 5);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        target.current = clamp01((s.district - 1) / 5);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
