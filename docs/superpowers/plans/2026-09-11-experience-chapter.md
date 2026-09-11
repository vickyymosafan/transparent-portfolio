# Work Experience Chapter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Work Experience" chapter (02) between About and Stats, in English, Kage-styled, with all chapter numbering updated to 5 chapters.

**Architecture:** New chapter id `experience` inserted into the existing chapter system (store → scene state → foreground set → hero chips → nav → footer index), a new `Experience` section component (interlude + timeline rows), and numeral renumbering of the three existing numbered sections.

**Tech Stack:** Next.js 16 · React 19 · TS · Tailwind v4 · framer-motion (no new deps)

**Spec:** `docs/superpowers/specs/2026-09-11-experience-chapter-design.md`

## Global Constraints

- Copy is exactly the spec's English text (MQL5 / Universitas Muhammadiyah Jember / PT. Antosa Architect entries).
- Chapter order: hero, about, **experience**, stats, projects, finale.
- Renumbering: About head `01 / 05`, Experience `02 / 05`, Stats `03 / 05` (interlude numeral "03"), Projects `04 / 05` (interlude numeral "04"); Contact unchanged.
- Kage discipline: hairlines `border-bone/[0.07]`, `lesson-row` hover, tokens only, no new colors beyond existing (vermilion bullet tick).
- Gates per task: `npx tsc --noEmit && npm run lint` (0/0) + `npm run build` for Task 2/3.
- No new dependencies. Conventional commits.

---

### Task 1: Data + chapter integration

**Files:**
- Modify: `src/services/mockData.ts` (append)
- Modify: `src/lib/chapter-store.ts`
- Modify: `src/lib/scene-state.ts`
- Modify: `src/components/ui/ForegroundLayers.tsx`
- Modify: `src/components/features/Hero.tsx`
- Modify: `src/components/layout/SiteNav.tsx`
- Modify: `src/components/features/Contact.tsx`

- [ ] **Step 1: Append to `src/services/mockData.ts`**

```ts
export interface ExperienceEntry {
    company: string;
    location: string;
    period: string;
    role: string;
    bullets: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
    {
        company: "MQL5 Algo Trading",
        location: "Jember Regency, East Java, Indonesia",
        period: "August 2026 — Present",
        role: "Algorithmic Trading Developer",
        bullets: [
            "Developed an automated algorithmic trading system (Expert Advisors) and custom technical indicators for the MetaTrader 5 platform using MQL5.",
            "Published and sold the financial software on the MQL5 Market, with ongoing maintenance through bug fixes, feature additions, and version updates to keep performance optimal for traders.",
        ],
    },
    {
        company: "Universitas Muhammadiyah Jember",
        location: "Jember Regency, East Java, Indonesia",
        period: "July 2025 — August 2026",
        role: "Freelance Website Developer",
        bullets: [
            "Developed a web-based elderly health monitoring system for Posyandu.",
            "Features include BMI checks, blood pressure (systolic and diastolic), cholesterol, and uric acid tracking, with automatic trend analysis and health status summaries.",
            "Built with Next.js on the frontend, Express.js + Prisma ORM on the backend, and PostgreSQL for the database.",
            "Designed for ease of use by Posyandu staff and accurate health data management.",
        ],
    },
    {
        company: "PT. Antosa Architect",
        location: "Jember Regency, East Java, Indonesia",
        period: "April 2025 — July 2025",
        role: "Project Web Architect — Information Systems",
        bullets: [
            "Designed and implemented a web-based information system to support architectural project management and company information needs.",
            "Responsible for system architecture, user interface (UI), and database design based on project requirements and business workflows.",
            "Built web features that improve management, accessibility, and operational efficiency, integrating frontend and backend into a functional, structured system.",
            "Applied modern web development practices with a focus on maintainability, usability, and system performance.",
        ],
    },
];
```

- [ ] **Step 2: `src/lib/chapter-store.ts`** — three edits:

```ts
export type ChapterId = "hero" | "about" | "experience" | "stats" | "projects" | "finale";
```

```ts
export const CHAPTER_ORDER: ChapterId[] = ["hero", "about", "experience", "stats", "projects", "finale"];
```

```ts
export const CHAPTER_LABELS: Record<ChapterId, string> = {
  hero: "Intro",
  about: "About",
  experience: "Experience",
  stats: "Live Data",
  projects: "Projects",
  finale: "Contact",
};
```

- [ ] **Step 3: `src/lib/scene-state.ts`** — insert into `CHAPTER_SCENES` between `about` and `stats`:

```ts
  experience: { camera: [0.9, 1.15, 7.2], lookAt: [0.4, 1.5, 0], fogColor: "#0b0f14", fogDensity: 0.05, moonX: -3.0, moonY: 3.6, moonScale: 1, stream: 0, drift: 1 },
```

- [ ] **Step 4: `src/components/ui/ForegroundLayers.tsx`** — insert into `SETS` between `about` and `stats`:

```ts
  experience: [
    { Comp: DryTree, left: "-6%", width: 320 },
    { Comp: GrassTufts, left: "66%", width: 400, flip: true },
  ],
```

- [ ] **Step 5: `src/components/features/Hero.tsx`** — two edits:

```ts
const CHIP_IDS = ["about", "experience", "stats", "projects", "finale"] as const;
```

```ts
const CHAPTER_DESC: Record<ChipId, string> = {
    about: "Who I am and how I work",
    experience: "Where I've worked",
    stats: "GitHub & WakaTime, live",
    projects: "Shipped, production-grade",
    finale: "Let's build something",
};
```

And the chips grid class: `md:grid-cols-4` → `md:grid-cols-5`.

- [ ] **Step 6: `src/components/layout/SiteNav.tsx`** — insert into `LINKS` after About:

```ts
    { label: "Experience", href: "#chapter-experience" },
```

- [ ] **Step 7: `src/components/features/Contact.tsx`** — insert into the Index column links after About:

```ts
["Experience", "#chapter-experience"],
```

- [ ] **Step 8: Gates** — `npx tsc --noEmit && npm run lint` (0/0).

- [ ] **Step 9: Commit** — `feat: add experience chapter id across store, scene, nav, chips`

---

### Task 2: Experience section + renumbering + mount

**Files:**
- Create: `src/components/features/Experience.tsx`
- Modify: `src/components/features/About.tsx` (head numeral)
- Modify: `src/components/features/Stats.tsx` (interlude numeral + head)
- Modify: `src/components/features/ProjectList.tsx` (interlude numeral + head)
- Modify: `src/app/page.tsx` (mount)

- [ ] **Step 1: Create `src/components/features/Experience.tsx`**

```tsx
import { WordMask } from "@/components/ui/Animations";
import { Interlude } from "@/components/ui/Interlude";
import { EXPERIENCE } from "@/services/mockData";

export function Experience() {
    return (
        <section id="chapter-experience" data-chapter="experience" className="relative overflow-x-clip px-[clamp(20px,3.4vw,56px)] py-[clamp(88px,15vh,190px)]">
            <Interlude numeral="02" title="The Journey" tagline="From freelance builds to algorithmic trading — every stop taught a system." />
            <div className="sec-scrim" />
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-[clamp(30px,5vh,66px)] flex items-baseline gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                        <b className="font-medium text-[#e0231c]">02</b> / 05 — Experience
                    </span>
                    <span className="h-px flex-1 bg-bone/[0.07]" />
                </div>

                <h2 className="mb-3 text-[clamp(30px,4vw,60px)] font-normal uppercase leading-[1.05] tracking-[-0.012em] text-bone">
                    <WordMask text="Where I've worked" />
                </h2>

                <div className="mt-10 border-t border-bone/[0.07]">
                    {EXPERIENCE.map((entry) => (
                        <article key={entry.company} className="lesson-row group border-b border-bone/[0.07] py-8">
                            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                                <div>
                                    <h3 className="text-[clamp(16px,1.5vw,23px)] font-normal text-bone">{entry.company}</h3>
                                    <p className="mt-1 text-[13px] font-light text-muted-k">{entry.location}</p>
                                </div>
                                <span className="text-[11px] uppercase tracking-[0.16em] tabular-nums text-bone-dim">{entry.period}</span>
                            </div>
                            <p className="mt-3 text-[13px] italic text-[#9aa5a0]">{entry.role}</p>
                            <ul className="mt-4 flex flex-col gap-2">
                                {entry.bullets.map((b) => (
                                    <li key={b} className="flex gap-3 text-sm font-light leading-relaxed text-[#9aa5a0]">
                                        <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-[#e0231c]/70" />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Renumber `About.tsx`** head: `01 / 04 — About` → `01 / 05 — About` (the `<b>01</b> / 04 — About` text becomes `<b>01</b> / 05 — About`).

- [ ] **Step 3: Renumber `Stats.tsx`**: `<Interlude numeral="02"` → `numeral="03"`; head `<b>02</b> / 04 — Live Data` → `<b>03</b> / 05 — Live Data`.

- [ ] **Step 4: Renumber `ProjectList.tsx`** (ProjectsSection): `<Interlude numeral="03"` → `numeral="04"`; head `<b>03</b> / 04 — Projects` → `<b>04</b> / 05 — Projects`.

- [ ] **Step 5: `src/app/page.tsx`** — import and mount:

```tsx
import { Experience } from "@/components/features/Experience";
```

```tsx
                <About />
                <Experience />
                <StatsSection />
```

- [ ] **Step 6: Gates** — `npx tsc --noEmit && npm run lint` (0/0) `&& npm run build`.

- [ ] **Step 7: Commit** — `feat: experience chapter section with timeline and renumbered chapters`

---

### Task 3: Verification sweep

- [ ] **Step 1:** `npx tsc --noEmit && npm run lint && npm run build` — fix findings.
- [ ] **Step 2: SSR smoke** (port 3001): HTML contains `data-chapter="experience"`, `id="chapter-experience"`, "The Journey", "Where I've worked", "MQL5 Algo Trading", "Universitas Muhammadiyah Jember", "PT. Antosa Architect", "02 / 05", "03 / 05", "04 / 05"; existing markers intact (5→6 data-chapter incl. hero).
- [ ] **Step 3: Browser checklist (human)** — chapter transitions now include Experience; chips show 5; rail has 6 ticks; nav Experience link; foreground set for experience; interlude numerals correct.
- [ ] **Step 4:** fix + commit `chore: experience chapter verification fixes` if needed.

---

## Self-Review

- Spec coverage: content → Task 1 Step 1; chapter integration → Steps 2-7; section + numbering → Task 2; verification → Task 3.
- Placeholders: none.
- Type consistency: `ExperienceEntry`, `EXPERIENCE`, chapter id `"experience"` consistent across store/scene/foreground/hero/nav/footer/page.
