"use client";

import { H3, P } from "@/components/ui/Typography";
import { MOCK_GITHUB, MOCK_WAKATIME } from "@/services/mockData";
import { Github, Clock, Code2, Flame } from "lucide-react";

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Item 1 */}
            <div className="neo-brutal-border bg-surface p-6 relative group hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-sm uppercase text-primary font-bold">Contributions</span>
                    <Github className="w-8 h-8 text-muted group-hover:text-primary transition-colors" />
                </div>
                <H3 className="text-5xl font-black group-hover:text-glow transition-all">{MOCK_GITHUB.contributions}</H3>
                <div className="mt-2 text-xs font-mono bg-primary text-black px-2 py-1 w-fit">LAST YEAR</div>
            </div>

            {/* Stat Item 2 */}
            <div className="neo-brutal-border bg-surface p-6 relative group hover:bg-white/5 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-sm uppercase text-primary font-bold">Coding Time</span>
                    <Clock className="w-8 h-8 text-muted group-hover:text-primary transition-colors" />
                </div>
                <H3 className="text-5xl font-black group-hover:text-glow transition-all">{MOCK_WAKATIME.total_hours}</H3>
                <div className="mt-2 text-xs font-mono bg-primary text-black px-2 py-1 w-fit">TRACKED HOURS</div>
            </div>

            {/* Stat Item 3 */}
            <div className="neo-brutal-border bg-surface p-6 relative group hover:bg-white/5 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-sm uppercase text-primary font-bold">Daily Avg</span>
                    <Flame className="w-8 h-8 text-muted group-hover:text-primary transition-colors" />
                </div>
                <H3 className="text-5xl font-black group-hover:text-glow transition-all">{MOCK_WAKATIME.daily_average}</H3>
                <div className="mt-2 text-xs font-mono bg-primary text-black px-2 py-1 w-fit">CONSISTENCY</div>
            </div>

            {/* Stat Item 4 */}
            <div className="neo-brutal-border bg-surface p-6 relative group hover:bg-white/5 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-sm uppercase text-primary font-bold">Top Lang</span>
                    <Code2 className="w-8 h-8 text-muted group-hover:text-primary transition-colors" />
                </div>
                <H3 className="text-5xl font-black group-hover:text-glow transition-all">{MOCK_GITHUB.top_languages[0].name}</H3>
                <div className="mt-2 text-xs font-mono bg-primary text-black px-2 py-1 w-fit">{MOCK_GITHUB.top_languages[0].percentage}% USAGE</div>
            </div>

            {/* Detailed Lang Bar (Span 2 or 4 cols) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2 neo-brutal-border bg-surface p-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-lg uppercase text-foreground font-bold border-b-2 border-primary">Language Distribution</span>
                </div>
                <div className="flex h-8 w-full border-2 border-white/20">
                    {MOCK_GITHUB.top_languages.map((lang) => (
                        <div
                            key={lang.name}
                            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                            className="h-full hover:brightness-125 hover:scale-y-110 transition-transform origin-bottom cursor-crosshair border-r border-black/50 last:border-0 relative group"
                            title={`${lang.name}: ${lang.percentage}%`}
                        >
                             {/* Tooltip on hover */}
                             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-primary text-primary text-xs font-mono px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                                {lang.name}
                             </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-6 mt-6 flex-wrap">
                    {MOCK_GITHUB.top_languages.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-3 border border-white/10 px-3 py-1 bg-white/5">
                            <div className="w-3 h-3" style={{ backgroundColor: lang.color }} />
                            <span className="text-sm font-mono text-foreground font-bold uppercase">{lang.name} <span className="text-muted">{lang.percentage}%</span></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
