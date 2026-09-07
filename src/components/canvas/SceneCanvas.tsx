"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SceneInner = dynamic(() => import("./SceneInner"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
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
    return () => cancelAnimationFrame(raf);
  }, []);

  if (supported !== true) return null;

  return (
    <div
      id="scene-canvas"
      className={`fixed inset-0 z-0 transition-opacity duration-[1200ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <SceneInner onReady={() => setReady(true)} />
    </div>
  );
}
