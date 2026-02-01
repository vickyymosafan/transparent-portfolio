import { Card } from "@/components/ui/Card";
import { H3, P } from "@/components/ui/Typography";
import { PROJECTS, type Project } from "@/services/mockData";
import { ArrowUpRight } from "lucide-react";

export function ProjectList() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, idx) => (
                <Card key={idx} className="group relative flex flex-col justify-between h-full hover:bg-white/5">
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="text-primary w-6 h-6" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <H3 className="text-2xl">{project.title}</H3>
                        <P className="text-sm text-balance">{project.desc}</P>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {project.tech.map(t => (
                                <span key={t} className="text-xs font-mono px-2 py-1 bg-white/5 border border-white/10 rounded text-muted">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
