"use client";

import { Hero } from "@/components/features/Hero";
import { ProjectList } from "@/components/features/ProjectList";
import { StatsGrid } from "@/components/features/Stats";
import { Container, Section } from "@/components/layout/Wrappers";
import { Reveal } from "@/components/ui/Animations";
import { H2, P } from "@/components/ui/Typography";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-30 mix-blend-overlay" />
      
      {/* Background Grid Pattern (Subtle) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-0" />

      {/* Hero Section */}
      <Section className="min-h-[90vh] flex items-center relative z-10 pb-0">
        <Container>
          <Reveal>
            <Hero />
          </Reveal>
        </Container>
      </Section>

      {/* Stats - Transparency Section */}
      <Section className="relative z-10 py-24">
        <Container>
          <Reveal>
            <div className="mb-16 border-b-2 border-white/10 pb-8">
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-4 h-4 bg-primary animate-pulse" />
                    <span className="font-mono text-primary uppercase font-bold tracking-widest">Live Data</span>
                </div>
              <H2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-4">Live Statistics</H2>
              <P className="text-xl max-w-2xl">Real-time data fetched from GitHub & WakaTime. Transparent. Unfiltered.</P>
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
                <P className="text-xl max-w-2xl">Production-grade applications I've shipped. No tutorials here.</P>
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
                    Let's Build<br />Something
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
