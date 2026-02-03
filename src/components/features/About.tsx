import { Container, Section } from "@/components/layout/Wrappers";
import { Reveal } from "@/components/ui/Animations";
import { TECH_STACK } from "@/services/mockData";

export function About() {
    return (
        <Section className="relative z-10 py-24 overflow-hidden">
            {/* Chaotic Background Elements */}
            <div className="absolute top-10 left-0 w-full h-full pointer-events-none opacity-20">
                 <div className="absolute top-20 left-10 text-[10rem] font-black text-white/5 rotate-12 select-none">ABOUT</div>
                 <div className="absolute bottom-20 right-10 text-[10rem] font-black text-white/5 -rotate-6 select-none">STACK</div>
            </div>

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
                    {/* Left Column: Bio - Spans 7 cols */}
                    <div className="lg:col-span-7 flex flex-col justify-center relative z-10">
                        <Reveal>
                            <div className="relative mb-8">
                                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-transparent stroke-text-bold hover:text-white transition-colors duration-500">
                                    Engineering
                                </h2>
                                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-primary ml-12 md:ml-24">
                                    Intelligence
                                </h2>
                                {/* Decoration Tag */}
                                <div className="absolute -top-6 right-0 md:left-[60%] bg-accent text-black font-mono text-sm font-bold px-3 py-1 -rotate-6 shadow-[4px_4px_0px_white]">
                                    v2.0.24
                                </div>
                            </div>
                        
                            <div className="neo-brutal-border bg-surface/80 backdrop-blur-md p-8 border border-white/10 relative group">
                                <div className="absolute top-0 right-0 p-2 opacity-50">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                </div>
                                
                                <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed mt-4">
                                    <span className="text-primary font-bold">I don&apos;t just write code.</span> I architect digital ecosystems. 
                                    Specializing in <span className="text-foreground border-b-2 border-accent">Fullstack Development</span> and <span className="text-foreground border-b-2 border-accent">AI Integration</span>, 
                                    I bridge the gap between creative chaos and engineering precision.
                                </p>
                                <p className="mt-6 text-lg md:text-xl font-medium text-muted-foreground leading-relaxed">
                                    My workflow is simple: <span className="text-white bg-black px-2 font-mono">Analysis</span> → <span className="text-white bg-black px-2 font-mono">Execution</span> → <span className="text-white bg-black px-2 font-mono">Perfection</span>.
                                    No fluff, no excuses. Just shipped products.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-sm font-mono uppercase font-bold text-accent">
                                        <span>SOLID Principles</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-mono uppercase font-bold text-accent">
                                        <span>Clean Architecture</span>
                                    </div>
                                </div>
                                
                                <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-primary -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Column: Tech Stack - Spans 5 cols */}
                    <div className="lg:col-span-5 relative">
                         <Reveal delay={0.2}>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-[2px] bg-primary" />
                                    <h3 className="font-mono text-xl font-bold uppercase tracking-widest text-primary">Tech Arsenal</h3>
                                </div>

                                <div className="grid gap-6">
                                    {Object.entries(TECH_STACK).map(([category, techs]) => (
                                        <div key={category} className="group relative">
                                            <div className="absolute inset-0 bg-white/5 transform -skew-x-12 -z-10 group-hover:bg-primary/20 transition-colors" />
                                            <div className="p-6 border-l-4 border-white/20 group-hover:border-primary transition-colors">
                                                <h4 className="text-xs font-black uppercase text-muted group-hover:text-foreground mb-4 tracking-[0.2em]">{category}</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {techs.map((tech) => (
                                                        <span key={tech} className="px-3 py-1.5 bg-black border border-white/10 text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary hover:-translate-y-1 transition-all cursor-default shadow-sm">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         </Reveal>
                    </div>
                </div>
                
                <style jsx>{`
                    .stroke-text-bold {
                        -webkit-text-stroke: 2px rgba(255, 255, 255, 0.8);
                    }
                `}</style>
            </Container>
        </Section>
    );
}
