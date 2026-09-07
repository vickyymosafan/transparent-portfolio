"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealTitle } from "@/components/ui/Animations";

export function Interlude({ numeral, title, tagline }: { numeral: string; title: string; tagline: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

    return (
        <div ref={ref} className="relative flex min-h-svh flex-col items-start justify-center">
            <div className="sec-scrim sec-scrim--open" />
            <motion.span
                aria-hidden
                style={{ y }}
                className="pointer-events-none absolute right-[4vw] top-1/2 z-0 -translate-y-1/2 select-none text-[22vw] font-light leading-none text-transparent [-webkit-text-stroke:1px_rgba(223,231,224,0.10)]"
            >
                {numeral}
            </motion.span>
            <div className="relative z-10">
                <p className="eyebrow mb-6 flex items-center gap-2.5">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#e0231c] shadow-[0_0_10px_#e0231c]" />
                    Chapter {numeral}
                </p>
                <RevealTitle
                    text={title}
                    className="text-[clamp(48px,10vw,140px)] uppercase leading-[0.95] tracking-[-0.02em] text-bone"
                />
                <p className="mt-6 max-w-[42ch] text-[clamp(14px,1.02vw,17px)] font-light text-[#9aa5a0]">{tagline}</p>
            </div>
        </div>
    );
}
