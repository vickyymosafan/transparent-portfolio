"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useWalkStore } from "@/lib/walk-store";
import { triggerInteraction } from "../player/InteractionSystem";

/**
 * Mobile Virtual Joystick & Touch Controls.
 * Left screen half: smooth analog virtual joystick for WASD movement.
 * Right screen half: touch drag for camera look.
 * Dedicated Interact button displayed when near interactive exhibits.
 */

export function MobileControls() {
  const { mode, activeInteraction, quality, setMobileMove, addMobileLook } = useWalkStore();
  const [touchDevice, setTouchDevice] = useState(false);

  const joystickCenter = useRef<{ x: number; y: number } | null>(null);
  const joystickTouchId = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [joystickActive, setJoystickActive] = useState(false);

  const lookTouchId = useRef<number | null>(null);
  const lastLookPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || quality.isMobile;
    setTouchDevice(isTouch);
  }, [quality.isMobile]);

  // Touch look listener on window
  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (mode !== "walk") return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        // Right half of screen triggers camera look
        if (t.clientX > window.innerWidth * 0.45 && lookTouchId.current === null) {
          lookTouchId.current = t.identifier;
          lastLookPos.current = { x: t.clientX, y: t.clientY };
        }
      }
    },
    [mode]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (mode !== "walk") return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === lookTouchId.current && lastLookPos.current) {
          const dx = t.clientX - lastLookPos.current.x;
          const dy = t.clientY - lastLookPos.current.y;
          lastLookPos.current = { x: t.clientX, y: t.clientY };

          addMobileLook(dx, dy);
        }
      }
    },
    [mode, addMobileLook]
  );

  const onTouchEnd = useCallback((e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === lookTouchId.current) {
        lookTouchId.current = null;
        lastLookPos.current = null;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  // Virtual Joystick Handlers (Left Half)
  const handleJoystickStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    joystickCenter.current = { x: centerX, y: centerY };
    joystickTouchId.current = touch.identifier;
    setJoystickActive(true);
  };

  const handleJoystickMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!joystickCenter.current) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === joystickTouchId.current) {
        const maxRadius = 45;
        const dx = t.clientX - joystickCenter.current.x;
        const dy = t.clientY - joystickCenter.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let clampedX = dx;
        let clampedY = dy;

        if (dist > maxRadius) {
          clampedX = (dx / dist) * maxRadius;
          clampedY = (dy / dist) * maxRadius;
        }

        setKnobPos({ x: clampedX, y: clampedY });
        // Normalize -1 to 1: X is strafe, Y is forward/back (-1 is forward)
        setMobileMove(clampedX / maxRadius, clampedY / maxRadius);
      }
    }
  };

  const handleJoystickEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        joystickCenter.current = null;
        setKnobPos({ x: 0, y: 0 });
        setJoystickActive(false);
        setMobileMove(0, 0);
      }
    }
  };

  if (!touchDevice || mode !== "walk") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none">
      {/* ── Virtual Joystick (Bottom Left) ── */}
      <div
        className="pointer-events-auto absolute bottom-8 left-8 flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm touch-none"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        <div
          className={`h-12 w-12 rounded-full transition-transform ${
            joystickActive ? "bg-[#cca872]" : "bg-white/40"
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* ── Contextual Mobile Interact Button (Bottom Right) ── */}
      {activeInteraction && (
        <button
          onClick={() => triggerInteraction(activeInteraction)}
          className="pointer-events-auto absolute bottom-10 right-8 flex h-14 min-w-[3.5rem] items-center justify-center gap-2 rounded-full border border-[#cca872] bg-[#cca872] px-6 text-sm font-semibold tracking-wider text-[#0e1117] shadow-xl active:scale-95"
        >
          INTERACT
        </button>
      )}
    </div>
  );
}
