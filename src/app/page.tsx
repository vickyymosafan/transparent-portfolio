import { SceneCanvas } from "@/components/canvas/SceneCanvas";
import { IntroScreen } from "@/components/ui/IntroScreen";
import { ArchitecturalHUD } from "@/components/ui/ArchitecturalHUD";
import { NightProgressRail } from "@/components/ui/NightProgressRail";
import { WheelCapture } from "@/components/ui/WheelCapture";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PortfolioSemanticContent } from "@/components/ui/PortfolioSemanticContent";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-ink text-bone selection:bg-[#cca872] selection:text-ink">
      {/* 3D WebGL Architectural Environment */}
      <SceneCanvas />

      {/* Intro Overlay: VICKY MOSAFAN / CREATIVE DEVELOPER / ENTER EXPERIENCE */}
      <IntroScreen />

      {/* Architectural Studio UI Layer: Navigation, Space Labels, Project Drawer, Rooftop Contact */}
      <ArchitecturalHUD />

      {/* Interactive Navigation & Input Controllers */}
      <NightProgressRail />
      <WheelCapture />
      <CustomCursor />

      {/* Crawlable Semantic HTML & WebGL Fallback Layer */}
      <PortfolioSemanticContent />
    </main>
  );
}
