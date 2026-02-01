"use client";

import { Hero } from "@/components/features/Hero";
import { ProjectList } from "@/components/features/ProjectList";
import { StatsGrid } from "@/components/features/Stats";
import { Container, Section } from "@/components/layout/Wrappers";
import { Reveal } from "@/components/ui/Animations";
import { H2, P } from "@/components/ui/Typography";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Grid Pattern (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Hero Section */}
      <Section className="min-h-[80vh] flex items-center relative z-10">
        <Container>
          <Reveal>
            <Hero />
          </Reveal>
        </Container>
      </Section>

      {/* Stats - Transparency Section */}
      <Section className="bg-surface/30 border-y border-white/5 relative z-10">
        <Container>
          <Reveal>
            <div className="mb-12">
              <H2 className="mb-4">Live Statistics</H2>
              <P>Real-time data fetched from GitHub & WakaTime. No lies.</P>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <StatsGrid />
          </Reveal>
        </Container>
      </Section>

      {/* Projects Section */}
      <Section className="relative z-10">
        <Container>
          <Reveal>
            <div className="mb-12 flex justify-between items-end">
              <div>
                <H2 className="mb-4">Featured Work</H2>
                <P>Production-grade applications I've shipped.</P>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ProjectList />
          </Reveal>
        </Container>
      </Section>

      {/* Footer / Contact */}
      <Section className="pb-12 relative z-10 text-center">
        <Container>
          <Reveal>
            <div className="p-12 border border-white/10 rounded-2xl bg-surface/50">
              <H2 className="text-4xl md:text-5xl mb-6">Let's Build Something.</H2>
              <P className="mb-8 max-w-xl mx-auto">
                I'm currently available for freelance work and full-time positions.
              </P>
              <a
                href="mailto:hello@example.com"
                className="inline-block text-primary text-xl hover:underline underline-offset-4 decoration-2 transition-all hover:text-glow"
              >
                hello@example.com
              </a>
            </div>
          </Reveal>

          <footer className="mt-12 text-sm text-muted">
            &copy; {new Date().getFullYear()} Code Wizard. Built with Next.js 16 & Tailwind 4.
          </footer>
        </Container>
      </Section>
    </main>
  );
}
