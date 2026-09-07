"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { WordMask } from "@/components/ui/Animations";
import { scrollToChapter } from "@/lib/smooth-scroll";

const FOOTER_COLS: { label: string; links: [string, string][] }[] = [
    { label: "Index", links: [["About", "#chapter-about"], ["Live Data", "#chapter-stats"], ["Projects", "#chapter-projects"]] },
    { label: "Social", links: [["Github", "https://github.com/vickyymosafan"], ["LinkedIn", "#"]] },
    { label: "Contact", links: [["Email", "mailto:mvickymosafan@gmail.com"]] },
];

export function Contact() {
    return (
        <section id="chapter-finale" data-chapter="finale" className="relative min-h-svh px-[clamp(20px,3.4vw,56px)] pb-[clamp(26px,4vh,40px)] pt-[clamp(50px,8vh,96px)]">
            <div className="sec-scrim sec-scrim--open" />

            <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl flex-col items-center justify-center text-center">
                <div className="eyebrow mb-6 flex items-center gap-2.5">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#e0231c] shadow-[0_0_10px_#e0231c]" />
                    What&apos;s next
                </div>
                <h2 className="text-[clamp(38px,7.4vw,124px)] uppercase leading-[0.94] tracking-[-0.03em] text-bone">
                    <WordMask text="Let's build" />
                    <br />
                    <WordMask text="together." delay={0.2} />
                </h2>
                <motion.a
                    href="mailto:mvickymosafan@gmail.com"
                    className="cta-pill mt-11 border border-bone/15 px-[30px] py-[17px] text-[11px] font-medium uppercase tracking-[0.22em] text-bone"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <i aria-hidden />
                    <span className="relative z-10">Say hello</span>
                    <ArrowUpRight className="relative size-3.5" />
                </motion.a>
            </div>

            <div className="relative z-10 mt-20 overflow-hidden border-y border-bone/[0.07] py-3">
                <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
                    {[0, 1].map((half) => (
                        <div key={half} className="flex items-center gap-10">
                            {["Live Data", "Shipped", "Open Source", "No Fluff", "Built in the Open"].map((word) => (
                                <span key={word} className="flex items-center gap-10 text-[13px] uppercase tracking-[0.3em] text-bone/25">
                                    {word}
                                    <span className="text-[#e0231c]">&middot;</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <footer className="relative z-10 mt-[clamp(50px,8vh,96px)] border-t border-bone/[0.07] pt-[clamp(50px,8vh,96px)]">
                <div className="mx-auto grid max-w-7xl gap-[clamp(22px,4vw,60px)] md:grid-cols-[1.4fr_repeat(3,minmax(0,.6fr))]">
                    <div>
                        <b className="text-[12px] font-medium tracking-[0.26em] text-bone">VM.</b>
                        <p className="mt-4 max-w-[34ch] text-[13px] font-light text-[#79847e]">
                            A transparent, data-driven portfolio. Every number on this page comes from real activity.
                        </p>
                    </div>
                    {FOOTER_COLS.map((col) => (
                        <div key={col.label}>
                            <h4 className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-k">{col.label}</h4>
                            <ul className="flex flex-col gap-2.5">
                                {col.links.map(([label, href]) => (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            onClick={href.startsWith("#") ? (e) => { e.preventDefault(); scrollToChapter(href.slice(1)); } : undefined}
                                            className="text-[13px] font-light text-[#8f9a93] transition-colors duration-300 hover:text-bone"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mx-auto mt-[clamp(38px,6vh,74px)] flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t border-bone/[0.07] pt-5 text-[10px] uppercase tracking-[0.16em] text-muted-k">
                    <span>&copy; {new Date().getFullYear()} Transparent Portfolio</span>
                    <span>Backed by live data, not promises</span>
                </div>
            </footer>
        </section>
    );
}
