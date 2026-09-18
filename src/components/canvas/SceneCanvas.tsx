"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { initPointerState } from "@/lib/pointer-state";

const SceneInner = dynamic(() => import("./SceneInner"), { ssr: false });

interface SceneCanvasProps {
  onReady?: () => void;
  onContextLost?: () => void;
}

export function SceneCanvas({ onReady, onContextLost }: SceneCanvasProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return initPointerState();
    }
  }, []);

  return (
    <div id="scene-canvas" className="fixed inset-0 z-0">
      <SceneInner onReady={onReady} onContextLost={onContextLost} />
    </div>
  );
}

