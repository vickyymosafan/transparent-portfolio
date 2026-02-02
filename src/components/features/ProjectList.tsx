import { P } from "@/components/ui/Typography";
import { PROJECTS } from "@/services/mockData";
import { ArrowUpRight } from "lucide-react";

export function ProjectList() {
    return (
        <div className="space-y-12">
            {PROJECTS.map((project, idx) => (
                <div key={idx} className="group relative neo-brutal-border bg-surface p-8 transition-transform hover:-translate-y-2">
                    <div className="absolute -top-4 -right-4 bg-primary text-black px-4 py-2 font-mono font-bold text-xl neo-brutal-border opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-12 group-hover:rotate-0">
                        OPEN PROJECT
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                             <div className="flex items-center gap-4 mb-4">
                                <span className="text-6xl font-black text-muted/20">0{idx + 1}</span>
                                <div className="h-1 flex-1 bg-white/10" />
                             </div>
                            
                            <h3 className="text-4xl md:text-5xl font-black uppercase mb-4 group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>
                            
                            <P className="text-lg text-muted-foreground mb-6 border-l-4 border-primary pl-4">
                                {project.desc}
                            </P>

                            <div className="flex flex-wrap gap-3">
                                {project.tech.map(t => (
                                    <span key={t} className="text-xs font-bold font-mono px-3 py-1 bg-white text-black uppercase transform hover:scale-110 transition-transform cursor-default">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Abstract Visual or Image Placeholder */}
                        <div className="h-full min-h-[200px] border-2 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden bg-black/50">
                             <div className="absolute inset-0 bg-noise opacity-20" />
                             <ArrowUpRight className="w-24 h-24 text-primary opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
