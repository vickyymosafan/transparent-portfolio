import { WordMask } from "@/components/ui/Animations";
import { Interlude } from "@/components/ui/Interlude";
import { EXPERIENCE, TRAINING } from "@/services/mockData";
import { ArrowUpRight } from "lucide-react";

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

                <div className="mt-24 border-t border-bone/[0.07]" />

                <div className="mt-14">
                    <div className="mb-10 flex items-baseline gap-4">
                        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                            Training & Certifications
                        </span>
                        <span className="h-px flex-1 bg-bone/[0.07]" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {TRAINING.map((t) => (
                            <a
                                key={t.program}
                                href={t.certUrl ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex flex-col gap-2 bg-ink/85 p-6 outline outline-1 -outline-offset-1 outline-bone/[0.07] transition-all duration-500 hover:outline-bone/30 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-k">{t.institution}</span>
                                    <ArrowUpRight className="size-3.5 shrink-0 text-bone-dim opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </div>
                                <h4 className="text-sm font-normal text-bone">{t.program}</h4>
                                <p className="text-xs font-light leading-relaxed text-muted-k">{t.description}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}