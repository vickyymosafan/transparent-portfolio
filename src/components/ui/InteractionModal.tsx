"use client";

import { useEffect } from "react";
import { useWalkStore } from "@/lib/walk-store";
import { CV_DATA } from "@/lib/cv";
import { Project } from "@/lib/projects";
import { X, ExternalLink, Github, Mail, Linkedin } from "lucide-react";

/**
 * Editorial Architectural Interaction Modal.
 * Displays discovered project exhibits, CV credentials, tech stack, and contact dialogues.
 * Antislop compliant: WCAG AA contrast, no em dashes, keyboard dismissible.
 */

export function InteractionModal() {
  const { activeModal, modalPayload, closeModal } = useWalkStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModal !== null) {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModal, closeModal]);

  if (!activeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080b10]/80 p-4 backdrop-blur-md transition-all duration-300 sm:p-6"
      onClick={closeModal}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#cca872]/25 bg-[#12151c] p-6 text-[#f2eee6] shadow-2xl transition-all sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-[#cca872] hover:text-[#cca872] focus:outline-none focus:ring-2 focus:ring-[#cca872]"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── 1. PROJECT EXHIBIT MODAL ── */}
        {activeModal === "project" && Boolean(modalPayload) ? (
          <ProjectDetail project={modalPayload as Project} />
        ) : null}

        {/* ── 2. FOYER IDENTITY MODAL ── */}
        {activeModal === "cv-identity" && <IdentityDetail />}

        {/* ── 3. CORRIDOR EXPERIENCE & EDUCATION MODAL ── */}
        {activeModal === "cv-experience" && <ExperienceDetail />}

        {/* ── 4. STUDIO TECH STACK & SKILLS MODAL ── */}
        {activeModal === "skills" && <SkillsDetail />}

        {/* ── 5. ROOFTOP CONTACT MODAL ── */}
        {activeModal === "contact" && <ContactDetail />}
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-semibold tracking-widest text-[#cca872] uppercase">
          {project.category} • {project.year}
        </span>
        <h2 className="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
          {project.title}
        </h2>
        <p className="mt-1 text-sm text-[#cca872]/85 italic">{project.tagline}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
          Overview & Architecture
        </h3>
        <p className="text-sm leading-relaxed text-white/80">{project.description}</p>
      </div>

      {project.metrics && project.metrics.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
            Engineering Highlights
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="border border-white/10 bg-white/[0.03] p-3 text-xs text-white/90"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
          Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="border border-[#cca872]/30 bg-[#cca872]/10 px-2.5 py-1 text-xs text-[#cca872]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {project.links && (
        <div className="flex gap-4 pt-4 border-t border-white/10">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-white transition-colors hover:border-[#cca872] hover:text-[#cca872]"
            >
              <Github className="h-3.5 w-3.5" />
              Source Code
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#cca872] bg-[#cca872] px-4 py-2 text-xs font-medium tracking-wide text-[#0e1117] transition-opacity hover:opacity-90"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Launch Live Site
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function IdentityDetail() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-semibold tracking-widest text-[#cca872] uppercase">
          Developer Profile
        </span>
        <h2 className="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
          {CV_DATA.name}
        </h2>
        <p className="mt-1 text-sm text-[#cca872]">{CV_DATA.role} • {CV_DATA.focus}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
          Architectural Narrative
        </h3>
        <p className="text-sm leading-relaxed text-white/80">{CV_DATA.bio}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <span className="text-xs font-semibold tracking-wider text-white/50 uppercase">
            Location
          </span>
          <p className="mt-1 text-sm text-white/90">{CV_DATA.location}</p>
        </div>
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <span className="text-xs font-semibold tracking-wider text-white/50 uppercase">
            Direct Contact
          </span>
          <p className="mt-1 text-sm text-[#cca872]">{CV_DATA.contact.email}</p>
        </div>
      </div>
    </div>
  );
}

function ExperienceDetail() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-semibold tracking-widest text-[#cca872] uppercase">
          Timeline & Leadership
        </span>
        <h2 className="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
          Academic & Leadership Experience
        </h2>
      </div>

      {/* Education */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
          Education
        </h3>
        {CV_DATA.education.map((edu, idx) => (
          <div key={idx} className="border-l border-[#cca872] pl-4 py-1">
            <h4 className="text-base font-medium text-white">{edu.institution}</h4>
            <p className="text-xs text-[#cca872]">{edu.degree} ({edu.period})</p>
            <p className="mt-1 text-xs text-white/70">{edu.major}</p>
          </div>
        ))}
      </div>

      {/* Experience list */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
          Experience & Organization Roles
        </h3>
        <div className="space-y-3">
          {CV_DATA.experience.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 bg-white/[0.02] p-3 text-xs transition-colors hover:border-white/20"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-white text-sm">{item.role}</h4>
                <span className="text-[10px] tracking-wider uppercase text-[#cca872]">
                  {item.category}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#cca872]/80">{item.organization}</p>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsDetail() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-semibold tracking-widest text-[#cca872] uppercase">
          Where I Build
        </span>
        <h2 className="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
          Technology Stack & Competencies
        </h2>
      </div>

      <div className="space-y-5">
        {CV_DATA.skills.map((category, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                {category.title}
              </h3>
              <span className="text-[11px] text-white/40 italic">{category.focus}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/90 hover:border-[#cca872] hover:text-[#cca872] transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactDetail() {
  return (
    <div className="space-y-6 text-center sm:text-left">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-semibold tracking-widest text-[#cca872] uppercase">
          Zone 06 Rooftop Terrace
        </span>
        <h2 className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl leading-tight">
          LET&apos;S BUILD SOMETHING IMPRESSIVE.
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Open for creative developer collaborations, fullstack web applications, and real-time 3D interactive projects.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
        <a
          href={`mailto:${CV_DATA.contact.email}`}
          className="flex flex-col items-center justify-center gap-2 border border-white/10 bg-white/[0.02] p-5 text-center transition-all hover:border-[#cca872] hover:bg-[#cca872]/5"
        >
          <Mail className="h-5 w-5 text-[#cca872]" />
          <span className="text-xs font-semibold uppercase text-white/60">Email</span>
          <span className="text-xs text-white truncate max-w-full">{CV_DATA.contact.email}</span>
        </a>

        <a
          href={CV_DATA.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 border border-white/10 bg-white/[0.02] p-5 text-center transition-all hover:border-[#cca872] hover:bg-[#cca872]/5"
        >
          <Github className="h-5 w-5 text-[#cca872]" />
          <span className="text-xs font-semibold uppercase text-white/60">GitHub</span>
          <span className="text-xs text-white">@vickyymosafan</span>
        </a>

        <a
          href={CV_DATA.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 border border-white/10 bg-white/[0.02] p-5 text-center transition-all hover:border-[#cca872] hover:bg-[#cca872]/5"
        >
          <Linkedin className="h-5 w-5 text-[#cca872]" />
          <span className="text-xs font-semibold uppercase text-white/60">LinkedIn</span>
          <span className="text-xs text-white">M. Vicky Mosafan</span>
        </a>
      </div>
    </div>
  );
}
