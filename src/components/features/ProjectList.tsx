import { PROJECTS } from "@/services/mockData";
import { ArrowUpRight } from "lucide-react";
import { LiveWindow, type CardGlow } from "@/components/canvas/LiveWindow";
import { WordMask } from "@/components/ui/Animations";
import { Interlude } from "@/components/ui/Interlude";

const CARD_GLOWS: CardGlow[] = [
  { gx: 50, gy: 38, gr: 20, variant: "flame" },
  { gx: 24, gy: 22, gr: 16, variant: "moon" },
  { gx: 62, gy: 55, gr: 18, variant: "flame" },
];

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
    return (
        <article
            className={`group relative ${index === 1 ? "md:translate-y-[clamp(26px,5vw,74px)]" : ""} ${
                index === 2 ? "md:translate-y-[clamp(52px,10vw,148px)]" : ""
            }`}
        >
            <a href={project.link ?? "#"} className="block" data-cursor>
                <div className="relative aspect-[4/5] outline outline-1 -outline-offset-1 outline-bone/[0.09] transition-[outline-color] duration-500 group-hover:outline-bone/30">
                    <LiveWindow index={index} className="absolute inset-0" glow={CARD_GLOWS[index]} />
                    <ArrowUpRight className="absolute right-3.5 top-3.5 z-20 size-6 -translate-x-1 -translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-90" />
                    <b className="absolute bottom-3.5 left-4 right-4 z-10 text-[clamp(13px,1.15vw,17px)] uppercase tracking-wide text-bone drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                        {project.title}
                    </b>
                </div>
                <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.16em] text-muted-k">
                    <span>{project.category ?? "Project"}</span>
                    <span>{project.tech.slice(0, 2).join(" · ")}</span>
                </div>
            </a>
        </article>
    );
}

export function ProjectList() {
    const cards = PROJECTS.slice(0, 3);
    const rows = PROJECTS.slice(3);

    return (
        <div>
            <div className="grid gap-[clamp(10px,1.4vw,22px)] md:grid-cols-3">
                {cards.map((project, idx) => (
                    <ProjectCard key={project.title} project={project} index={idx} />
                ))}
            </div>

            {rows.length > 0 && (
                <div className="mt-16 border-t border-bone/[0.07]">
                    {rows.map((project, i) => (
                        <a
                            key={project.title}
                            href={project.link ?? "#"}
                            className="lesson-row group grid grid-cols-[44px_1fr_auto] items-center gap-6 border-b border-bone/[0.07] py-6"
                        >
                            <span className="text-[11px] tabular-nums text-muted-k transition-colors duration-500 group-hover:text-[#e0231c]">
                                {String(i + 4).padStart(2, "0")}
                            </span>
                            <h3 className="text-[clamp(16px,1.5vw,23px)] font-normal text-bone">{project.title}</h3>
                            <span className="text-right text-[11px] tracking-[0.14em] text-muted-k">{project.tech[0]}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ProjectsSection() {
    return (
        <section id="chapter-projects" data-chapter="projects" className="relative overflow-x-clip px-[clamp(20px,3.4vw,56px)] py-[clamp(88px,15vh,190px)]">
            <Interlude numeral="03" title="The Work" tagline="Shipped systems with real users. Selected, not collected." />
            <div className="sec-scrim" />
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-10 flex items-baseline gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                        <b className="font-medium text-[#e0231c]">03</b> / 04 — Projects
                    </span>
                    <span className="h-px flex-1 bg-bone/[0.07]" />
                </div>
                <h2 className="mb-3 text-[clamp(30px,4vw,60px)] font-normal uppercase leading-[1.05] tracking-[-0.012em] text-bone">
                    <WordMask text="Selected work" />
                </h2>
                <p className="mb-12 max-w-xl text-[clamp(14px,1.02vw,17px)] font-light text-[#9aa5a0]">
                    Production-grade applications I&apos;ve shipped.
                </p>
                <ProjectList />
            </div>
        </section>
    );
}
