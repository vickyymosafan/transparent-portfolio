"use client";

import { useEffect, useState, useCallback } from "react";
import { useWalkStore } from "@/lib/walk-store";

interface IntroScreenProps {
  onEnter?: () => void;
}

export function IntroScreen({ onEnter }: IntroScreenProps) {
  const [entered, setEntered] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return (
        params.get("no-intro") === "1" ||
        params.get("entered") === "1" ||
        params.get("zone") !== null ||
        params.get("section") !== null
      );
    }
    return false;
  });
  const [fadedOut, setFadedOut] = useState(() => entered);
  const advance = useWalkStore((s) => s.advance);

  const handleEnter = useCallback(() => {
    setEntered(true);
    onEnter?.();
    // Gentle initial impulse forward into the courtyard
    setTimeout(() => {
      advance(0.04);
    }, 400);
    setTimeout(() => {
      setFadedOut(true);
    }, 900);
  }, [onEnter, advance]);

  // If user scrolled/advanced externally, auto-enter
  useEffect(() => {
    const unsub = useWalkStore.subscribe((state) => {
      if (state.progress > 0.01) {
        setEntered(true);
        setFadedOut(true);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!entered && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered, handleEnter]);

  if (fadedOut) return null;

  return (
    <div
      aria-hidden={entered}
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-between px-6 py-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        entered
          ? "pointer-events-none opacity-0 backdrop-blur-0 scale-[1.03]"
          : "opacity-100 bg-ink/90 backdrop-blur-md"
      }`}
    >
      {/* Top Bar Label */}
      <div className="flex w-full max-w-5xl items-center justify-between text-[11px] uppercase tracking-[0.3em] text-bone/40">
        <span>ARCHITECTURAL PORTFOLIO</span>
        <span>JAKARTA / TOKYO EST. 2024</span>
      </div>

      {/* Main Center Editorial Lockup */}
      <div className="flex flex-col items-center text-center">
        <span className="mb-4 text-[12px] uppercase tracking-[0.45em] text-[#cca872] font-mono">
          Interactive 3D Studio Walkthrough
        </span>

        <h1 className="text-5xl md:text-8xl font-light tracking-[-0.03em] text-bone mb-6 uppercase">
          Vicky Mosafan
        </h1>

        <div className="h-px w-20 bg-[#cca872]/60 mb-6" />

        <h2 className="text-sm md:text-base font-medium tracking-[0.35em] text-bone/80 uppercase mb-2">
          Creative Developer
        </h2>

        <p className="text-xs md:text-sm tracking-[0.25em] text-bone/50 uppercase font-mono">
          AI × WEB × 3D
        </p>

        {/* Enter Experience Button */}
        <button
          onClick={handleEnter}
          className="group relative mt-12 inline-flex items-center gap-4 overflow-hidden border border-bone/20 bg-bone/[0.04] px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-bone transition-all duration-500 hover:border-[#cca872] hover:bg-[#cca872]/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#cca872]"
        >
          <span className="relative z-10">Enter Experience</span>
          <svg
            className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </button>
      </div>

      {/* Footer Navigation Tip */}
      <div className="flex flex-col items-center gap-2 text-center text-[10px] uppercase tracking-[0.25em] text-bone/30">
        <span>Press <kbd className="border border-bone/20 px-1 py-0.5 rounded text-bone/60">Enter</kbd> or Scroll to Navigate</span>
        <span>Procedural Three.js · Natural Lighting · Zero Neon</span>
      </div>
    </div>
  );
}
