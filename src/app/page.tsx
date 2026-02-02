"use client";

import { Hero } from "@/components/features/Hero";
import { ProjectList } from "@/components/features/ProjectList";
import { StatsGrid } from "@/components/features/Stats";
import { Container, Section } from "@/components/layout/Wrappers";
import { Reveal } from "@/components/ui/Animations";
import { H2, P } from "@/components/ui/Typography";
import { TECH_STACK } from "@/services/mockData";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-30 mix-blend-overlay" />
      
      {/* Background Grid Pattern (Subtle) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] pointer-events-none z-0" />

      {/* Hero Section */}
      <Section className="min-h-[90vh] flex items-center relative z-10 pb-0">
        <Container>
          <Reveal>
            <Hero />
          </Reveal>
        </Container>
      </Section>

      {/* About Me Section (New) */}
      <Section className="relative z-10 py-24 bg-surface/50 border-y border-white/5">
        <Container>
            <Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                             <span className="w-4 h-4 bg-accent animate-spin-slow rounded-none" />
                             <span className="font-mono text-accent uppercase font-bold tracking-widest">About Me</span>
                        </div>
                        <H2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 max-w-xl">
                            Engineering <span className="text-primary">Intelligence</span>
                        </H2>
                        <div className="space-y-6 text-lg text-muted-foreground font-medium">
                            <P>
                                I am a <strong className="text-foreground">Fullstack Developer</strong> and <strong className="text-foreground">Prompting Engineer</strong> who leverages AI coding agents to accelerate development.
                            </P>
                            <P>
                                I apply an engineering approach to every project—creating PRDs, structured prompts, and clear documentation to define architecture and workflows with clarity.
                            </P>
                            <ul className="space-y-2 list-none mt-4 font-mono text-sm border-l-2 border-primary pl-4">
                                <li className="flex gap-2"><span className="text-primary">01.</span> Backend Focus: Efficient architecture & Security</li>
                                <li className="flex gap-2"><span className="text-primary">02.</span> Frontend Focus: Reusable components & Consistency</li>
                                <li className="flex gap-2"><span className="text-primary">03.</span> Principles: SOLID, DRY, KISS</li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Tech Stack Grid */}
                    <div className="neo-brutal-border bg-black p-8">
                        <H2 className="text-3xl font-black uppercase mb-6 border-b border-white/10 pb-4">Tech Arsenal</H2>
                        <div className="space-y-6">
                            {Object.entries(TECH_STACK).map(([category, techs]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-mono uppercase text-muted mb-2 tracking-widest">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {techs.map((tech) => (
                                            <span key={tech} className="px-2 py-1 bg-white/10 text-sm font-bold hover:bg-primary hover:text-black transition-colors cursor-default">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Reveal>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="relative z-10 py-24">
        <Container>
          <Reveal>
            <div className="mb-16 border-b-2 border-white/10 pb-8">
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-4 h-4 bg-primary animate-pulse" />
                    <span className="font-mono text-primary uppercase font-bold tracking-widest">Live Data</span>
                </div>
              <H2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-4">Live Statistics</H2>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <StatsGrid />
          </Reveal>
        </Container>
      </Section>

      {/* Projects Section */}
      <Section className="relative z-10 py-24 bg-surface/30">
        <Container>
          <Reveal>
            <div className="mb-20">
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-4 h-4 bg-accent animate-pulse" />
                    <span className="font-mono text-accent uppercase font-bold tracking-widest">Portfolio</span>
                </div>
                <H2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-4">Featured Work</H2>
                <P className="text-xl max-w-2xl">Production-grade applications I&apos;ve shipped.</P>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ProjectList />
          </Reveal>
        </Container>
      </Section>

      {/* Footer / Contact */}
      <Section className="py-32 relative z-10 text-center bg-primary text-black selection:bg-black selection:text-white">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center gap-8">
                <h2 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase mix-blend-multiply">
                    Let&apos;s Build<br />Something
                </h2>
                
                <a
                    href="mailto:hello@example.com"
                    className="mt-8 px-12 py-6 bg-black text-white text-2xl md:text-4xl font-bold font-mono hover:scale-110 hover:-rotate-2 transition-transform neo-brutal-border border-white shadow-[8px_8px_0px_#ffffff]"
                >
                    hello@example.com
                </a>
                
                <div className="mt-16 flex gap-8 font-mono font-bold uppercase tracking-widest text-sm md:text-base opacity-80">
                    <a href="#" className="hover:underline decoration-4 underline-offset-4">GitHub</a>
                    <a href="#" className="hover:underline decoration-4 underline-offset-4">LinkedIn</a>
                    <a href="#" className="hover:underline decoration-4 underline-offset-4">Twitter</a>
                </div>
            </div>
          </Reveal>

          <footer className="mt-24 text-sm font-bold opacity-50 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Code Wizard. Built with Next.js 16 & Tailwind 4.
          </footer>
        </Container>
      </Section>
    </main>
  );
}
