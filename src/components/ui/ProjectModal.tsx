"use client";

import { useEffect } from "react";
import type { Project } from "@/lib/projects";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-bone/15 bg-[#14161a] p-8 md:p-10 shadow-2xl text-bone">
        {/* Header with Category and Close button */}
        <div className="flex items-center justify-between border-b border-bone/10 pb-4 mb-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#cca872] font-mono">
            {project.category}
          </span>
          <button
            onClick={onClose}
            aria-label="Close project modal"
            className="text-bone/50 hover:text-bone text-xl p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Title and Tagline */}
        <h2
          id="modal-project-title"
          className="text-2xl md:text-4xl font-light tracking-[-0.02em] text-bone mb-2"
        >
          {project.title}
        </h2>
        <p className="text-sm font-mono text-bone/60 mb-6">{project.tagline}</p>

        {/* Year and Role */}
        <div className="grid grid-cols-2 gap-4 border-y border-bone/10 py-3 mb-6 text-xs font-mono text-bone/60">
          <div>
            <span className="text-bone/40 uppercase tracking-widest text-[10px] block mb-1">Year</span>
            <span className="text-bone">{project.year}</span>
          </div>
          <div>
            <span className="text-bone/40 uppercase tracking-widest text-[10px] block mb-1">Role</span>
            <span className="text-bone">{project.role}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-bone/40 mb-2 font-mono">
            Overview
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-bone/80 font-light">
            {project.description}
          </p>
        </div>

        {/* Key Highlights */}
        <div className="mb-6">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-bone/40 mb-3 font-mono">
            Key Architecture & Metrics
          </h3>
          <ul className="space-y-2">
            {project.metrics.map((metric, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-bone/70">
                <span className="text-[#cca872] mt-0.5">•</span>
                <span>{metric}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Badges */}
        <div className="mb-8">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-bone/40 mb-3 font-mono">
            Technologies & Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="border border-bone/15 bg-bone/[0.04] px-3 py-1 text-xs font-mono text-bone/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links / Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-bone/10">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-bone/20 bg-bone/[0.04] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-all hover:border-[#cca872] hover:text-[#cca872]"
            >
              <span>GitHub Repository</span>
              <span>↗</span>
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#cca872]/40 bg-[#cca872]/10 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#cca872] transition-all hover:bg-[#cca872]/20"
            >
              <span>Live Demonstration</span>
              <span>↗</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-xs uppercase tracking-[0.2em] text-bone/40 hover:text-bone transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
