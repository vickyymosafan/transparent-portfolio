"use client";

import { useEffect, useState } from "react";
import { useWalkStore } from "@/lib/walk-store";
import { ZONES } from "@/lib/constants";
import { Menu, X, Compass, ArrowRight, User, FolderGit2, Mail } from "lucide-react";
import { triggerInteraction } from "../player/InteractionSystem";

/**
 * Editorial Architectural HUD.
 * Provides location tracking, contextual [E] interaction cues,
 * controls guidance, and a clean Esc navigation drawer.
 * Antislop compliant: WCAG AA contrast, no em dashes, no decorative emoji.
 */

export function ArchitecturalHUD() {
  const {
    mode,
    currentZone,
    activeInteraction,
    hasMoved,
    setMode,
    teleportToZone,
    openModal,
  } = useWalkStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const zoneInfo = ZONES[currentZone] || ZONES[0];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (useWalkStore.getState().activeModal !== null) {
          useWalkStore.getState().closeModal();
        } else if (useWalkStore.getState().mode === "walk") {
          setMenuOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (mode === "intro") return null;

  return (
    <>
      {/* ── Top Header Navigation Bar ── */}
      <header className="pointer-events-none fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6 select-none">
        {/* Identity */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-widest text-[#cca872] uppercase">
            M. Vicky Mosafan
          </span>
          <span className="text-[11px] font-medium tracking-wider text-white/70 uppercase">
            Creative Frontend Developer
          </span>
        </div>

        {/* Current Zone Badge & Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="hidden border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md sm:flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cca872] animate-pulse" />
            <span className="text-xs font-medium tracking-wider text-white uppercase">
              {zoneInfo.subtitle}: {zoneInfo.name}
            </span>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-[#cca872] hover:text-[#cca872] focus:outline-none focus:ring-2 focus:ring-[#cca872]"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ── Center / Lower-Third Contextual [E] Interaction Prompt ── */}
      {activeInteraction && !menuOpen && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 z-30 select-none animate-in fade-in zoom-in duration-200">
          <div
            onClick={() => triggerInteraction(activeInteraction)}
            className="pointer-events-auto flex cursor-pointer items-center gap-3 border border-[#cca872] bg-[#0c1017]/90 px-5 py-2.5 shadow-2xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
          >
            <span className="flex h-6 w-6 items-center justify-center border border-[#cca872] bg-[#cca872]/20 text-[11px] font-bold text-[#cca872]">
              E
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold tracking-wide text-white uppercase">
                {activeInteraction.title}
              </span>
              <span className="text-[11px] text-[#cca872]/90">
                {activeInteraction.prompt}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Controls Guidance Overlay (Fades out upon first movement) ── */}
      {!hasMoved && !menuOpen && (
        <div className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 z-20 select-none text-center transition-opacity duration-700">
          <div className="border border-white/10 bg-black/50 px-4 py-2 text-xs font-medium tracking-wider text-white/80 backdrop-blur-sm">
            <span className="text-[#cca872]">W A S D</span> to Move • <span className="text-[#cca872]">Mouse</span> to Look • <span className="text-[#cca872]">Shift</span> to Sprint • <span className="text-[#cca872]">E</span> to Interact
          </div>
        </div>
      )}

      {/* ── Esc / Menu Drawer Overlay ── */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="relative w-full max-w-xl border border-white/15 bg-[#10131a] p-6 text-white sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-light tracking-wide text-white uppercase">
                  Residence Navigation
                </h3>
                <p className="text-xs text-[#cca872]">Explore Rooms & Portfolio Exhibits</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Zone Travel */}
            <div className="mt-5 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Architectural Zones
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      teleportToZone(zone.id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-between border p-3 text-left transition-colors ${
                      currentZone === zone.id
                        ? "border-[#cca872] bg-[#cca872]/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="text-[10px] text-[#cca872] tracking-wider uppercase">
                        {zone.subtitle}
                      </div>
                      <div className="text-xs font-medium text-white">{zone.name}</div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Content Drawers */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openModal("cv-identity");
                }}
                className="flex flex-col items-center justify-center gap-1.5 border border-white/10 p-3 text-center transition-colors hover:border-[#cca872] hover:text-[#cca872]"
              >
                <User className="h-4 w-4" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Bio & CV</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  openModal("skills");
                }}
                className="flex flex-col items-center justify-center gap-1.5 border border-white/10 p-3 text-center transition-colors hover:border-[#cca872] hover:text-[#cca872]"
              >
                <FolderGit2 className="h-4 w-4" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Tech Stack</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  openModal("contact");
                }}
                className="flex flex-col items-center justify-center gap-1.5 border border-white/10 p-3 text-center transition-colors hover:border-[#cca872] hover:text-[#cca872]"
              >
                <Mail className="h-4 w-4" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Contact</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full border border-[#cca872] bg-[#cca872] py-2.5 text-xs font-semibold tracking-widest text-[#0e1117] uppercase transition-opacity hover:opacity-90"
              >
                Resume Walk Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
