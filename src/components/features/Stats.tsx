"use client";

import { MOCK_GITHUB, MOCK_WAKATIME, Language } from "@/services/mockData";
import { Github, Clock, Code2, Flame, ArrowUpRight, type LucideIcon } from "lucide-react";
import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { WordMask } from "@/components/ui/Animations";
import { Interlude } from "@/components/ui/Interlude";

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stat Item 1: Contributions */}
            <StatCard
                label="Contributions"
                value={MOCK_GITHUB.contributions.toString()}
                sub="Last Year"
                icon={Github}
                delay={0}
            />

            {/* Stat Item 2: Coding Time */}
            <StatCard
                label="Coding Time"
                value={MOCK_WAKATIME.total_hours}
                sub="Tracked Hours"
                icon={Clock}
                delay={0.1}
            />

            {/* Stat Item 3: Daily Avg */}
            <StatCard
                label="Daily Avg"
                value={MOCK_WAKATIME.daily_average}
                sub="Consistency"
                icon={Flame}
                delay={0.2}
            />

            {/* Stat Item 4: Top Lang */}
            <StatCard
                label="Top Lang"
                value={MOCK_GITHUB.top_languages[0].name}
                sub={`${MOCK_GITHUB.top_languages[0].percentage}% Usage`}
                icon={Code2}
                delay={0.3}
            />

            {/* Detailed Lang Bar */}
            <LanguageBar languages={MOCK_GITHUB.top_languages} />
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string;
    sub: string;
    icon: LucideIcon;
    delay: number;
}

function CountUp({ value }: { value: string }) {
    const match = value.match(/^([\d.,]+)/);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    useEffect(() => {
        if (!inView || !match || !ref.current) return;
        const target = parseFloat(match[1].replace(/,/g, ""));
        const controls = animate(0, target, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                if (ref.current) {
                    ref.current.textContent = Math.round(v).toLocaleString("en-US") + value.slice(match[1].length);
                }
            },
        });
        return () => controls.stop();
    }, [inView, match, value]);

    if (!match) return <>{value}</>;
    return <span ref={ref}>{match[1]}</span>;
}

function StatCard({ label, value, sub, icon: Icon, delay }: StatCardProps) {
    // Determine font size based on value length to prevent overflow
    const length = value.length;
    let fontSizeClass = "text-5xl md:text-6xl lg:text-7xl"; // Default (< 6 chars)

    if (length > 15) {
        fontSizeClass = "text-2xl md:text-3xl lg:text-4xl";
    } else if (length > 8) { // "TypeScript" (10) and "4 hrs 20 mins" (13) hit here
        fontSizeClass = "text-3xl md:text-4xl lg:text-5xl";
    } else if (length > 5) {
        fontSizeClass = "text-4xl md:text-5xl lg:text-6xl";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="group relative flex flex-col justify-between overflow-hidden bg-[#070a0d]/85 p-6 outline outline-1 -outline-offset-1 outline-bone/[0.07] transition-[outline-color] duration-500 hover:outline-bone/30 md:p-8"
        >
            <div className="mb-8 flex items-start justify-between md:mb-12">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-bone-dim">{label}</span>
                <Icon className="size-5 opacity-50" />
            </div>
            <div className="flex min-h-20 items-end">
                <h3 className={`${fontSizeClass} font-light tabular-nums tracking-[-0.02em] text-bone transition-colors group-hover:text-[#ff5a3c]`}><CountUp value={value} /></h3>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-bone/10 pt-3.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-k">{sub}</span>
                <ArrowUpRight className="size-4 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
        </motion.div>
    );
}

function LanguageBar({ languages }: { languages: Language[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="col-span-full mt-8"
        >
            <div className="bg-[#070a0d]/85 p-8 outline outline-1 -outline-offset-1 outline-bone/[0.07]">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <h4 className="text-[clamp(30px,4vw,60px)] font-normal uppercase leading-[1.05] tracking-[-0.012em] text-bone">
                        <WordMask text="Languages" />
                    </h4>
                    <span className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-k">
                        Detected: {languages.length}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {languages.map((lang, i) => (
                        <motion.div
                            key={lang.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            viewport={{ once: true }}
                            className="group flex h-32 flex-col justify-between bg-ink/85 p-5 outline outline-1 -outline-offset-1 outline-bone/[0.07] transition-[outline-color] duration-500 hover:outline-bone/30"
                        >
                            <span
                                className="size-3 rounded-full shadow-[0_0_10px_currentColor]"
                                style={{ color: lang.color, backgroundColor: lang.color }}
                            />
                            <div>
                                <div className="text-3xl font-light tabular-nums text-bone transition-colors group-hover:text-[#ff5a3c]">
                                    {lang.percentage}
                                    <span className="ml-1 text-sm font-light text-muted-k">%</span>
                                </div>
                                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-k">{lang.name}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export function StatsSection() {
    return (
        <section id="chapter-stats" data-chapter="stats" className="relative overflow-x-clip px-[clamp(20px,3.4vw,56px)] py-[clamp(88px,15vh,190px)]">
            <Interlude numeral="02" title="Live Pulse" tagline="Contributions, hours, and languages — measured while they happen, not remembered afterwards." />
            <div className="sec-scrim sec-scrim--center" />
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-10 flex items-baseline gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-k">
                        <b className="font-medium text-[#e0231c]">02</b> / 04 — Live Data
                    </span>
                    <span className="h-px flex-1 bg-bone/[0.07]" />
                </div>
                <h2 className="mb-3 text-[clamp(30px,4vw,60px)] font-normal uppercase leading-[1.05] tracking-[-0.012em] text-bone">
                    <WordMask text="Live statistics" />
                </h2>
                <p className="mb-12 max-w-xl text-[clamp(14px,1.02vw,17px)] font-light text-[#9aa5a0]">
                    Numbers pulled straight from GitHub and WakaTime — nothing staged.
                </p>
                <StatsGrid />
            </div>
        </section>
    );
}
