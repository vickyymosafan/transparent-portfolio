"use client";

import { Hero } from "@/components/features/Hero";
import { ProjectList } from "@/components/features/ProjectList";
import { About } from "@/components/features/About";
import { StatsGrid } from "@/components/features/Stats";
import { Contact } from "@/components/features/Contact";
import { Container, Section } from "@/components/layout/Wrappers";
import { Reveal } from "@/components/ui/Animations";
import { H2, P } from "@/components/ui/Typography";
import { TextReveal } from "@/components/ui/TextReveal";

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
      <About />

      {/* Stats Section */}
      <Section className="relative z-10 py-24">
        <Container>
          <Reveal>
            <div className="mb-16 border-b-2 border-white/10 pb-8">
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-4 h-4 bg-primary animate-pulse" />
                    <span className="font-mono text-primary uppercase font-bold tracking-widest">Live Data</span>
                </div>
              <H2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-4"><TextReveal>Live Statistics</TextReveal></H2>
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
                <H2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-4"><TextReveal>Featured Work</TextReveal></H2>
                <P className="text-xl max-w-2xl">Production-grade applications I&apos;ve shipped.</P>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ProjectList />
          </Reveal>
        </Container>
      </Section>

      {/* Footer / Contact */}
      <Contact />
    </main>
  );
}
