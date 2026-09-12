import Link from "next/link";
import type { Metadata } from "next";
import { SceneCanvas } from "@/components/canvas/SceneCanvas";
import { DistrictPanel } from "@/components/ui/DistrictPanel";
import { NightProgressRail } from "@/components/ui/NightProgressRail";
import { WheelCapture } from "@/components/ui/WheelCapture";

export const metadata: Metadata = {
  title: "Night City Walkthrough | Vicky Mosafan",
  description: "A 3D night city walkthrough experience — explore districts with procedural architecture, rain, and neon lights.",
};

export default function NightPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-ink">
      <SceneCanvas mode="night" />
      <DistrictPanel />
      <NightProgressRail />
      <WheelCapture />

      <Link
        href="/"
        className="fixed left-6 top-6 z-50 text-sm text-bone/50 transition-colors hover:text-bone"
      >
        ← Back
      </Link>
    </main>
  );
}
