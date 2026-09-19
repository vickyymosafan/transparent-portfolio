"use client";

import { useEffect, useState, useCallback } from "react";
import { useWalkStore } from "@/lib/walk-store";
import { ArrowRight } from "lucide-react";

interface IntroScreenProps {
  onEnter?: () => void;
}

export function IntroScreen({ onEnter }: IntroScreenProps) {
  const { mode, setMode } = useWalkStore();
  const [fadedOut, setFadedOut] = useState(mode !== "intro");

  const handleEnter = useCallback(() => {
    setMode("walk");
    onEnter?.();
    setTimeout(() => {
      setFadedOut(true);
    }, 600);
  }, [onEnter, setMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode === "intro" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, handleEnter]);

  if (fadedOut && mode !== "intro") return null;

  const isLeaving = mode !== "intro";

  return (
    <div
      role="dialog"
      aria-label="Welcome screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 select-none transition-all duration-700 ${
        isLeaving
          ? "pointer-events-none opacity-0 backdrop-blur-0 scale-105"
          : "opacity-100 bg-[#0c1017]/80 backdrop-blur-sm"
      }`}
    >
      {/* Top Header */}
      <div className="flex w-full max-w-5xl items-center justify-between text-xs tracking-widest text-white/50 uppercase">
        <span>Architectural Portfolio</span>
        <span>Interactive 3D Residence</span>
      </div>

      {/* Main Lockup */}
      <div className="flex flex-col items-center text-center max-w-xl">
        <span className="text-xs font-semibold tracking-widest text-[#cca872] uppercase mb-3">
          Playable Developer Residence
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white uppercase leading-none mb-4">
          M. Vicky Mosafan
        </h1>

        <div className="h-px w-16 bg-[#cca872]/60 mb-4" />

        <h2 className="text-sm sm:text-base font-medium tracking-widest text-white/85 uppercase mb-1">
          Creative Frontend Developer
        </h2>

        <p className="text-xs sm:text-sm tracking-widest text-white/50 uppercase font-mono mb-8">
          AI x Web x 3D
        </p>

        {/* Enter Residence CTA */}
        <button
          onClick={handleEnter}
          className="group flex items-center gap-3 border border-[#cca872] bg-[#cca872] px-8 py-3.5 text-xs font-semibold tracking-widest text-[#0e1117] uppercase transition-all duration-300 hover:bg-[#d8b580] hover:shadow-[0_0_25px_rgba(204,168,114,0.3)] active:scale-95"
        >
          <span>Enter Residence</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Footer Instructions */}
      <div className="flex flex-col items-center gap-1.5 text-center text-[11px] tracking-wider text-white/40 uppercase">
        <span>Explore with <kbd className="border border-white/20 px-1 py-0.5 text-white/70">W A S D</kbd> &bull; Mouse to look &bull; <kbd className="border border-white/20 px-1 py-0.5 text-white/70">E</kbd> to interact</span>
        <span>Real Scale &bull; Natural Archviz Lighting &bull; Smooth 60 FPS</span>
      </div>
    </div>
  );
}
