import { Hero } from "@/components/features/Hero";
import { About } from "@/components/features/About";
import { StatsSection } from "@/components/features/Stats";
import { ProjectsSection } from "@/components/features/ProjectList";
import { Contact } from "@/components/features/Contact";
import { SceneCanvas } from "@/components/canvas/SceneCanvas";
import { Preloader } from "@/components/ui/Preloader";
import { SiteNav } from "@/components/layout/SiteNav";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-x-clip bg-ink text-bone selection:bg-[#e0231c] selection:text-white">
            <SmoothScroll />
            <MotionProvider>
                <SceneCanvas />
                <div className="vignette" aria-hidden />
                <div className="pointer-events-none fixed inset-0 z-[60] bg-noise opacity-[0.06] mix-blend-overlay" aria-hidden />
                <Preloader />
                <SiteNav />
                <ProgressRail />
                <CustomCursor />

                <div className="relative z-10">
                    <Hero />
                    <About />
                    <StatsSection />
                    <ProjectsSection />
                    <Contact />
                </div>
            </MotionProvider>
        </main>
    );
}
