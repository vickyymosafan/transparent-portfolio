"use client";

import { Card } from "@/components/ui/Card";
import { H3, P } from "@/components/ui/Typography";
import { MOCK_GITHUB, MOCK_WAKATIME, type Language } from "@/services/mockData";
import { Github, Clock, Code2, Flame } from "lucide-react";

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Github className="w-6 h-6" />
                    <span className="font-mono text-sm uppercase">Contributions</span>
                </div>
                <H3 className="text-4xl">{MOCK_GITHUB.contributions}</H3>
                <P className="text-sm">In the last year</P>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Clock className="w-6 h-6" />
                    <span className="font-mono text-sm uppercase">Coding Time</span>
                </div>
                <H3 className="text-4xl">{MOCK_WAKATIME.total_hours}</H3>
                <P className="text-sm">Total tracked hours</P>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Flame className="w-6 h-6" />
                    <span className="font-mono text-sm uppercase">Daily Avg</span>
                </div>
                <H3 className="text-4xl">{MOCK_WAKATIME.daily_average}</H3>
                <P className="text-sm">Consistency is key</P>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Code2 className="w-6 h-6" />
                    <span className="font-mono text-sm uppercase">Top Lang</span>
                </div>
                <H3 className="text-4xl">{MOCK_GITHUB.top_languages[0].name}</H3>
                <P className="text-sm">{MOCK_GITHUB.top_languages[0].percentage}% usage</P>
            </Card>

            {/* Detailed Lang Bar (Span 2 or 4 cols) */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 mt-2">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-sm uppercase text-muted">Language Distribution</span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-secondary">
                    {MOCK_GITHUB.top_languages.map((lang) => (
                        <div
                            key={lang.name}
                            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                            className="h-full transition-all duration-1000 ease-out hover:brightness-110"
                            title={`${lang.name}: ${lang.percentage}%`}
                        />
                    ))}
                </div>
                <div className="flex gap-4 mt-2 flex-wrap">
                    {MOCK_GITHUB.top_languages.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                            <span className="text-xs font-mono text-muted">{lang.name} {lang.percentage}%</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
