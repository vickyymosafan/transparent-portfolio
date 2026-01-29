"use client";

import { MOCK_GITHUB, MOCK_WAKATIME, Language } from "@/services/mockData";
import { Github, Clock, Code2, Flame, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { ElementType } from "react";

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    icon: ElementType;
    delay: number;
}

function StatCard({ label, value, sub, icon: Icon, delay }: StatCardProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            className="neo-brutal-border bg-black text-white p-8 relative group overflow-hidden hover:bg-primary hover:text-black transition-colors duration-300"
        >
            {/* Background Noise/Grid on Hover */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] bg-size-[10px_10px] opacity-0 group-hover:opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start mb-12 relative z-10">
                <span className="font-mono text-sm uppercase tracking-[0.2em] font-bold border-b-2 border-primary group-hover:border-black transition-colors">
                    {label}
                </span>
                <Icon className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Value (Giant) */}
            <div className="relative z-10">
                <h3 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.8]">
                    {value}
                </h3>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-white/20 group-hover:border-black/20 pt-4 relative z-10">
                <span className="text-xs font-mono uppercase bg-white/10 px-2 py-1 group-hover:bg-black/10 transition-colors">
                    {sub}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 p-2 opacity-50">
                <div className="w-2 h-2 bg-primary group-hover:bg-black transition-colors" />
            </div>
            <div className="absolute bottom-0 left-0 p-2 opacity-50">
                <div className="w-2 h-2 bg-primary group-hover:bg-black transition-colors" />
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
            className="col-span-1 md:col-span-2 lg:col-span-4 mt-8"
        >
            <div className="neo-brutal-border bg-black p-8 border-l-8 border-l-primary relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[14px_24px] pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative z-10 gap-4">
                    <div>
                        <h4 className="font-black text-4xl uppercase tracking-tighter text-white">Language</h4>
                    </div>
                    <div className="px-3 py-1 bg-white/10 dark:bg-white/5 rounded-full border border-white/10 text-xs font-mono text-muted-foreground">
                        DETECTED_LANGUAGES: {languages.length}
                    </div>
                </div>



                {/* New Grid Data Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
                    {languages.map((lang, i) => (
                        <motion.div 
                            key={lang.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.05) }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-primary/50 transition-all group cursor-pointer flex flex-col justify-between h-32"
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: lang.color, backgroundColor: lang.color }} />
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                            
                            <div>
                                <div className="text-3xl font-black text-white group-hover:text-primary transition-colors tracking-tighter">
                                    {lang.percentage}<span className="text-sm text-muted-foreground font-normal ml-1">%</span>
                                </div>
                                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground group-hover:text-white transition-colors mt-1">
                                    {lang.name}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
