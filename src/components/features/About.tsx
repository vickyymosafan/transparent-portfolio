import { ArrowUpRight } from "lucide-react";
import { WordMask } from "@/components/ui/Animations";
import { Interlude } from "@/components/ui/Interlude";
import { TECH_STACK } from "@/services/mockData";

const FOCUS = [
    ["Backend", "Efficient architecture & security"],
    ["Frontend", "Reusable components & consistency"],
    ["Principles", "SOLID · DRY · KISS"],
] as const;

export function About() {
    return (
        <section id="chapter-about" data-chapter="about" className="relative overflow-x-clip px-[clamp(20px,3.4vw,56px)] py-[clamp(88px,15vh,190px)]">
            <Interlude numeral="01" title="The Builder" tagline="How I work: PRDs, structured prompts, and engineering discipline — applied with AI agents, not replaced by them." />
            <div className="sec-scrim" />
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-[clamp(30px,5vh,66px)] flex items-baseline gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                        <b className="font-medium text-[#e0231c]">01</b> / 04 — About
                    </span>
                    <span className="h-px flex-1 bg-bone/[0.07]" />
                </div>

                <div className="grid items-start gap-[clamp(28px,5vw,90px)] lg:grid-cols-[1.02fr_1fr]">
                    <h2 className="max-w-[11ch] text-[clamp(30px,4vw,60px)] font-normal leading-[1.05] tracking-[-0.012em] text-bone">
                        <WordMask text="Engineering, quietly precise." />
                    </h2>
                    <div className="pt-1.5">
                        <p className="text-[clamp(15px,1.16vw,19px)] font-light leading-[1.66] text-[#c2cdc5]">
                            I am a <span className="text-bone">Fullstack Developer</span> and Prompting Engineer who leverages AI coding
                            agents to accelerate development — with PRDs, structured prompts and clear docs defining every architecture
                            and workflow.
                        </p>
                        <a href="#chapter-projects" className="group mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone">
                            See the work
                            <span className="grid size-[34px] place-items-center rounded-full border border-bone/15 transition-colors duration-500 group-hover:border-bone group-hover:bg-bone">
                                <ArrowUpRight className="size-[13px] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:stroke-[#05070a]" />
                            </span>
                        </a>
                    </div>
                </div>

                <div className="mt-[clamp(46px,8vh,96px)] grid grid-cols-2 gap-[clamp(24px,4vw,62px)] border-t border-bone/[0.07] pt-6 md:grid-cols-3">
                    {FOCUS.map(([b, s]) => (
                        <div key={b}>
                            <b className="block text-[clamp(22px,2.1vw,32px)] font-light tracking-[-0.02em] text-bone">{b}</b>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-k">{s}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-14 border-t border-bone/[0.07]">
                    {Object.entries(TECH_STACK).map(([category, techs]) => (
                        <div key={category} className="flex items-baseline gap-6 border-b border-bone/[0.07] py-4">
                            <span className="w-28 shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted-k">{category}</span>
                            <p className="text-sm font-light text-[#9aa5a0]">{techs.join(" · ")}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
