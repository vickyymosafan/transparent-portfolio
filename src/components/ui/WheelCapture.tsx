"use client";

import { useEffect, useRef } from "react";
import { useWalkStore } from "@/lib/walk-store";

/*
 * Tuned for buttery-smooth cinematic scrolling:
 * - Higher sensitivity = less scroll needed to traverse
 * - Exponential ease with velocity decay = natural momentum
 * - No double-damping (WalkPathController handles camera smoothing separately)
 */
const SENSITIVITY = 0.00055;
const TOUCH_MULT = 2.5;
const FRICTION = 0.88;        // Velocity decay per frame (momentum feel)
const MIN_VELOCITY = 0.00002;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function WheelCapture() {
  const velocity = useRef(0);
  const current = useRef(0);
  const touchStart = useRef(0);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const store = useWalkStore.getState().progress;

      // External jump (e.g. rail click) — resync
      if (Math.abs(store - current.current) > 0.05) {
        current.current = store;
        velocity.current = 0;
      }

      // Apply velocity with friction decay
      if (Math.abs(velocity.current) > MIN_VELOCITY) {
        const next = clamp01(current.current + velocity.current);
        const delta = next - current.current;
        if (Math.abs(delta) > 0.000001) {
          useWalkStore.getState().advance(delta);
          current.current = next;
        }
        velocity.current *= FRICTION;
      } else {
        velocity.current = 0;
        current.current = store; // Stay synced
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Add to velocity (accumulative for smooth momentum)
      velocity.current += e.deltaY * SENSITIVITY * 0.016; // Normalize by ~frame time
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
      velocity.current = 0; // Kill momentum on touch
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStart.current - e.touches[0].clientY;
      touchStart.current = e.touches[0].clientY;
      velocity.current = dy * SENSITIVITY * TOUCH_MULT * 0.016;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const s = useWalkStore.getState();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        const target = clamp01((s.district + 1) / 5);
        velocity.current = (target - current.current) * 0.08;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        const target = clamp01((s.district - 1) / 5);
        velocity.current = (target - current.current) * 0.08;
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
