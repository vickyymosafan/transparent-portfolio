import { SceneCanvas } from "@/components/canvas/SceneCanvas";
import { DistrictPanel } from "@/components/ui/DistrictPanel";
import { WheelCapture } from "@/components/ui/WheelCapture";

export default function NightPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-ink">
      <SceneCanvas mode="night" />
      <DistrictPanel />
      <WheelCapture />
    </main>
  );
}
