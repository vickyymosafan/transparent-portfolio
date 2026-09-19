import { SceneCanvas } from "@/components/canvas/SceneCanvas";
import { IntroScreen } from "@/components/ui/IntroScreen";
import { ArchitecturalHUD } from "@/components/ui/ArchitecturalHUD";
import { InteractionModal } from "@/components/ui/InteractionModal";
import { MobileControls } from "@/components/ui/MobileControls";
import { PortfolioSemanticContent } from "@/components/ui/PortfolioSemanticContent";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0c1017] text-[#f2eee6] selection:bg-[#cca872] selection:text-[#0c1017]">
      {/* 3D WebGL Architectural Residence Environment */}
      <SceneCanvas />

      {/* Intro Overlay: VICKY MOSAFAN / CREATIVE DEVELOPER / ENTER RESIDENCE */}
      <IntroScreen />

      {/* Architectural Studio HUD: Navigation, Space Labels, Interaction Prompt, Esc Menu */}
      <ArchitecturalHUD />

      {/* Responsive Touch Controls for Mobile & Tablet */}
      <MobileControls />

      {/* Discovered Exhibits Detail Modal: Projects, CV, Skills, Contact */}
      <InteractionModal />

      {/* Crawlable Semantic HTML & WebGL Fallback Layer */}
      <PortfolioSemanticContent />
    </main>
  );
}
