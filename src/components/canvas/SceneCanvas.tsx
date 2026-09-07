"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { initPointerState } from "@/lib/pointer-state";
import { initScrollProgress } from "@/lib/scroll-progress";

const SceneInner = dynamic(() => import("./SceneInner"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function SceneCanvas() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ok = hasWebGL();
    if (!ok) document.documentElement.classList.add("no-webgl");
    const raf = requestAnimationFrame(() => setSupported(ok));
    const cleanups: Array<() => void> = [];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cleanups.push(initPointerState(), initScrollProgress());
    }
    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (supported !== true) return null;

  return (
    <div
      id="scene-canvas"
      className={`fixed inset-0 z-0 transition-opacity duration-[1200ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <SceneInner onReady={() => setReady(true)} onContextLost={() => setSupported(false)} />
    </div>
  );
}
