"use client";

import { motion } from "framer-motion";
import { WordMask } from "@/components/ui/Animations";
import { CHAPTER_LABELS } from "@/lib/chapter-store";

const CHIP_IDS = ["about", "stats", "projects", "finale"] as const;
type ChipId = (typeof CHIP_IDS)[number];
const CHAPTER_DESC: Record<ChipId, string> = {
    about: "Who I am and how I work",
    stats: "GitHub & WakaTime, live",
    projects: "Shipped, production-grade",
    finale: "Let's build something",
};

export function Hero() {
    return (
        <section id="chapter-hero" data-chapter="hero" className="relative flex min-h-svh flex-col px-[clamp(20px,3.4vw,56px)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

            <div className="relative z-10 max-w-[560px] pt-[calc(84px+2rem)]">
                <div className="eyebrow mb-5 flex items-center gap-2.5">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#e0231c] shadow-[0_0_10px_#e0231c]" />
                    Transparent Portfolio — Live Data
                </div>
                <h1 className="mb-4 text-[clamp(26px,3.05vw,46px)] uppercase leading-[1.055] tracking-[-0.012em] text-bone">
                    <WordMask text="Fullstack developer," />
                    <br />
                    <WordMask text="built in the open." delay={0.25} />
                </h1>
                <p className="max-w-[322px] text-[clamp(14px,1.02vw,17px)] font-light leading-[1.72] text-[#b4bfb7]">
                    Scalable apps, no fluff — backed by live data from GitHub and WakaTime, not promises.
                </p>
            </div>

            <div className="min-h-[clamp(140px,26vh,300px)] flex-1" aria-hidden />

            <motion.div
                className="relative z-10 pb-[clamp(22px,4.2vh,42px)]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="mb-3.5 flex items-center justify-end gap-3 text-[9px] uppercase tracking-[0.3em] text-muted-k">
                    Scroll
                    <span className="relative block h-px w-[54px] overflow-hidden bg-bone/15">
                        <i className="absolute inset-0 origin-left animate-cue bg-bone" />
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-bone/[0.07] pt-[18px] md:grid-cols-4">
                    {CHIP_IDS.map((id, i) => (
                        <a key={id} href={`#chapter-${id}`} className="group flex gap-3.5">
                            <span className="text-[clamp(26px,2.5vw,36px)] font-light leading-none tabular-nums text-bone-dim transition-colors duration-500 group-hover:text-[#ff5a3c]">
                                {`0${i + 1}`}
                            </span>
                            <span className="min-w-0 pt-[3px]">
                                <b className="block text-[10px] font-medium uppercase tracking-[0.2em] text-bone-dim transition-colors duration-500 group-hover:text-bone">
                                    {CHAPTER_LABELS[id]}
                                </b>
                                <span className="mt-1.5 block text-[11px] leading-normal text-muted-k">{CHAPTER_DESC[id]}</span>
                            </span>
                        </a>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
