"use client";

import { useEffect, useRef } from "react";
import { useWalkStore } from "@/lib/walk-store";

const SENSITIVITY = 0.0008;

export function WheelCapture() {
  const touchStart = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      useWalkStore.getState().advance(e.deltaY * SENSITIVITY);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStart.current - e.touches[0].clientY;
      touchStart.current = e.touches[0].clientY;
      useWalkStore.getState().advance(dy * SENSITIVITY * 3);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const s = useWalkStore.getState();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        s.walkTo(s.district + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        s.walkTo(s.district - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
