"use client";

import { useState } from "react";
import { useWalkStore, ZONE_LABELS } from "@/lib/walk-store";
import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectModal } from "./ProjectModal";

const ZONE_SUBTITLES = [
  "Basalt reflection pool, cloud pine landscaping & concrete canopy",
  "European oak flooring, vein-cut travertine & floating staircase",
  "Honed basalt breezeway, bamboo groves & warm floor wash",
  "Physical exhibition of production web & AI architectures",
  "Solid walnut workstation, triple monitors & city skyline view",
  "Teak wood terrace, sunken fire pit lounge & panoramic skyline",
];

function HUDProgressPercentage() {
  const progress = useWalkStore((s) => s.progress);
  const pct = Math.round(progress * 100);
  return (
    <span className="text-xs font-mono tabular-nums text-bone/60">
      {pct}%
    </span>
  );
}

function HUDProgressBar() {
  const progress = useWalkStore((s) => s.progress);
  const pct = Math.round(progress * 100);
  return (
    <div className="hidden md:block w-36 h-1 bg-bone/10 relative overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-[#cca872] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ArchitecturalHUD() {
  const zone = useWalkStore((s) => s.zone);
  const walkTo = useWalkStore((s) => s.walkTo);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      {/* ═══ 1. TOP EDITORIAL BAR ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 select-none backdrop-blur-sm bg-ink/30 border-b border-bone/5">
        <div className="flex items-center gap-6">
          <button
            onClick={() => walkTo(0)}
            className="text-left group focus:outline-none"
          >
            <span className="block text-xs font-light tracking-[0.25em] text-bone uppercase group-hover:text-[#cca872] transition-colors">
              Vicky Mosafan
            </span>
            <span className="block text-[10px] font-mono tracking-[0.15em] text-bone/40">
              Studio Architecture
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 border-l border-bone/10 pl-6 text-[10px] font-mono tracking-widest text-bone/50 uppercase">
            <span className="text-[#cca872]">0{zone + 1}</span>
            <span>/</span>
            <span>{ZONE_LABELS[zone]}</span>
          </div>
        </div>

        {/* Space Navigation Menu */}
        <nav aria-label="Studio Spaces" className="hidden lg:flex items-center gap-1">
          {ZONE_LABELS.map((label, idx) => (
            <button
              key={idx}
              onClick={() => walkTo(idx)}
              className={`px-3 py-1 text-[10px] uppercase font-mono tracking-[0.15em] transition-all rounded-sm ${
                zone === idx
                  ? "bg-bone/15 text-bone border border-bone/30"
                  : "text-bone/40 hover:text-bone hover:bg-bone/5 border border-transparent"
              }`}
            >
              0{idx + 1} {label.split(" ")[0]}
            </button>
          ))}
        </nav>

        {/* Progress & Project Drawer Button */}
        <div className="flex items-center gap-4">
          <HUDProgressPercentage />
          <button
            onClick={() => setSelectedProject(PROJECTS[0])}
            className="border border-bone/20 bg-bone/[0.04] px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-bone/80 hover:border-[#cca872] hover:text-[#cca872] transition-all"
          >
            Index ({PROJECTS.length})
          </button>
        </div>
      </header>

      {/* ═══ 2. CONTEXTUAL IN-SPACE OVERLAYS ═══ */}
      {/* Zone 3: Project Gallery Interactive Overlay */}
      <div
        className={`fixed bottom-20 left-6 md:left-12 z-40 max-w-lg transition-all duration-700 pointer-events-none ${
          zone === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="pointer-events-auto border border-bone/15 bg-ink/80 backdrop-blur-md p-6 shadow-2xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#cca872] block mb-1">
            04 / Exhibition Gallery
          </span>
          <h2 className="text-xl md:text-2xl font-light text-bone mb-2">
            Selected Works & Systems
          </h2>
          <p className="text-xs text-bone/60 mb-4 font-light leading-relaxed">
            Click any physical slab in the room or select a project below to inspect full architecture, source code, and live demos.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="border border-bone/15 bg-bone/[0.03] px-2.5 py-1 text-[10px] font-mono text-bone/80 hover:border-[#cca872] hover:text-[#cca872] hover:bg-[#cca872]/10 transition-all"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone 4: Developer Studio Editorial Overlay */}
      <div
        className={`fixed top-1/3 left-6 md:left-14 z-40 max-w-md transition-all duration-700 pointer-events-none ${
          zone === 4 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <div className="pointer-events-auto border-l-2 border-[#cca872] pl-6 bg-ink/60 backdrop-blur-sm py-4 pr-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#cca872] block mb-2">
            Workspace · 70% Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-bone mb-3">
            WHERE I BUILD
          </h2>
          <h3 className="text-xs md:text-sm font-medium tracking-[0.25em] text-bone/80 uppercase mb-3 font-mono">
            Creative Developer · AI × Web × 3D
          </h3>
          <p className="text-xs md:text-sm text-bone/60 font-light leading-relaxed">
            Architecting intelligent systems, fast streaming LLM interfaces, and real-time WebGL environments with Next.js, TypeScript, and Three.js.
          </p>
        </div>
      </div>

      {/* Zone 5: Rooftop Finale & Contact Overlay */}
      <div
        className={`fixed inset-x-6 md:inset-x-auto md:right-12 bottom-20 z-40 max-w-lg transition-all duration-700 pointer-events-none ${
          zone === 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="pointer-events-auto border border-bone/15 bg-ink/85 backdrop-blur-md p-6 md:p-8 shadow-2xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#cca872] block mb-2">
            Finale · Rooftop Sky Lounge
          </span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-bone mb-4 leading-none uppercase">
            Let&apos;s Build<br />
            Something<br />
            Impressive.
          </h2>
          <p className="text-xs md:text-sm text-bone/70 font-light leading-relaxed mb-6">
            Available for creative engineering roles, high-impact contract systems, and innovative WebGL & AI integrations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:vickymosafan@gmail.com"
              className="inline-flex items-center justify-center gap-2 border border-[#cca872] bg-[#cca872]/15 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#cca872] hover:bg-[#cca872]/25 transition-all text-center"
            >
              <span>Email Me</span>
              <span>✉</span>
            </a>
            <a
              href="https://github.com/vickyymosafan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-bone/20 bg-bone/[0.04] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-bone hover:border-bone transition-all text-center"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
            <a
              href="https://linkedin.com/in/vickymosafan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-bone/20 bg-bone/[0.04] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-bone hover:border-bone transition-all text-center"
            >
              <span>LinkedIn</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* ═══ 3. BOTTOM CINEMATIC RAIL ═══ */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 select-none backdrop-blur-sm bg-ink/40 border-t border-bone/5 text-bone">
        {/* Current Space Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => walkTo(Math.max(0, zone - 1))}
              disabled={zone === 0}
              className="h-7 w-7 border border-bone/15 flex items-center justify-center text-xs text-bone/60 hover:text-bone hover:border-bone/40 disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Previous space"
            >
              ←
            </button>
            <button
              onClick={() => walkTo(Math.min(5, zone + 1))}
              disabled={zone === 5}
              className="h-7 w-7 border border-bone/15 flex items-center justify-center text-xs text-bone/60 hover:text-bone hover:border-bone/40 disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Next space"
            >
              →
            </button>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-bone">
              0{zone + 1} — {ZONE_LABELS[zone]}
            </p>
            <p className="text-[10px] font-mono text-bone/40 hidden sm:block">
              {ZONE_SUBTITLES[zone]}
            </p>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="flex items-center gap-4">
          <HUDProgressBar />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-bone/40">
            Scroll or Drag to Explore
          </span>
        </div>
      </footer>

      {/* ═══ 4. PROJECT MODAL ═══ */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
