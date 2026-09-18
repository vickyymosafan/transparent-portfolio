"use client";

import { PROJECTS } from "@/lib/projects";

export function PortfolioSemanticContent() {
  return (
    <div className="semantic-seo-layer sr-only no-webgl:not-sr-only no-webgl:relative no-webgl:z-20 no-webgl:max-w-4xl no-webgl:mx-auto no-webgl:px-6 no-webgl:py-24 no-webgl:text-bone">
      {/* ─── Hero / Header ─── */}
      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-[#cca872] mb-2 font-mono">
          Interactive Architectural Portfolio
        </p>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
          Vicky Mosafan
        </h1>
        <h2 className="text-lg md:text-xl font-mono text-bone/70 uppercase tracking-widest mb-6">
          Creative Developer · AI × Web × 3D
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-bone/80 font-light max-w-2xl">
          Architecting modern digital experiences that combine high-performance web engineering, intelligent AI workflows, and procedural real-time 3D environments.
        </p>
      </header>

      {/* ─── Spaces / Sections ─── */}
      <section className="mb-16" aria-labelledby="sec-about">
        <h2 id="sec-about" className="text-xs uppercase tracking-[0.25em] text-[#cca872] mb-4 font-mono">
          01 / About & Studio Philosophy
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-bone/80 font-light mb-4">
          Based in Indonesia with global perspective. Specialized in fullstack TypeScript engineering, generative AI integration (Groq API, DeepSeek LLM, LangChain), and procedural WebGL rendering using Three.js and React Three Fiber.
        </p>
        <p className="text-sm md:text-base leading-relaxed text-bone/80 font-light">
          Former Head of MediaTech at HIMAFORSI UMJ (2022–2024), leading digital platform initiatives, technical workshops, and brand systems.
        </p>
      </section>

      {/* ─── Projects Catalog ─── */}
      <section className="mb-16" aria-labelledby="sec-projects">
        <h2 id="sec-projects" className="text-xs uppercase tracking-[0.25em] text-[#cca872] mb-6 font-mono">
          02 / Production Projects & Case Studies
        </h2>
        <div className="space-y-12">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="border border-bone/15 p-6 md:p-8 bg-bone/[0.02]"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#cca872] font-mono block mb-2">
                {project.category} · {project.year}
              </span>
              <h3 className="text-2xl font-light mb-2">{project.title}</h3>
              <p className="text-xs font-mono text-bone/60 mb-4">{project.tagline}</p>
              <p className="text-sm leading-relaxed text-bone/80 font-light mb-6">
                {project.description}
              </p>

              <div className="mb-6">
                <h4 className="text-[11px] uppercase tracking-wider text-bone/50 mb-2 font-mono">
                  Key Metrics & Architecture
                </h4>
                <ul className="space-y-1 text-xs text-bone/70">
                  {project.metrics.map((metric, idx) => (
                    <li key={idx}>• {metric}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="border border-bone/15 px-2.5 py-1 text-[11px] font-mono text-bone/70"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 text-xs font-mono">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    className="text-[#cca872] hover:underline"
                  >
                    GitHub Source ↗
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    className="text-[#cca872] hover:underline"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Contact & Socials ─── */}
      <section className="border-t border-bone/15 pt-12" aria-labelledby="sec-contact">
        <h2 id="sec-contact" className="text-xs uppercase tracking-[0.25em] text-[#cca872] mb-4 font-mono">
          03 / Connect & Inquiries
        </h2>
        <p className="text-2xl md:text-4xl font-light mb-6 uppercase">
          Let&apos;s Build Something Impressive.
        </p>
        <div className="flex flex-wrap gap-6 text-sm font-mono">
          <a
            href="mailto:vickymosafan@gmail.com"
            className="border border-bone/20 px-4 py-2 hover:border-[#cca872] hover:text-[#cca872] transition-colors"
          >
            vickymosafan@gmail.com
          </a>
          <a
            href="https://github.com/vickyymosafan"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-bone/20 px-4 py-2 hover:border-[#cca872] hover:text-[#cca872] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/vickymosafan"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-bone/20 px-4 py-2 hover:border-[#cca872] hover:text-[#cca872] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
