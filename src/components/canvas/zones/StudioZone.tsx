"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import {
  getDarkWalnutMat,
  matteBlackMetalMat,
  brushedBrassMat,
  architecturalGlassMat,
  warmCoveLedMat,
} from "@/lib/architectural-materials";

const brushedSteelMat = new THREE.MeshStandardMaterial({
  color: "#9aa0a6",
  roughness: 0.35,
  metalness: 0.9,
});

// Dedicated interior architectural materials matching Reference 3
const microcementFloorMat = new THREE.MeshStandardMaterial({
  color: "#c2baa8",
  roughness: 0.68,
  metalness: 0.03,
});

const woolRugMat = new THREE.MeshStandardMaterial({
  color: "#35383e",
  roughness: 0.95,
  metalness: 0.02,
});

const wallMat = new THREE.MeshStandardMaterial({
  color: "#d8d3c7",
  roughness: 0.82,
  metalness: 0.02,
});

const ceilingMat = new THREE.MeshStandardMaterial({
  color: "#eae5da",
  roughness: 0.88,
  metalness: 0.02,
});

const chairMeshMat = new THREE.MeshStandardMaterial({
  color: "#1c1e22",
  roughness: 0.78,
  metalness: 0.15,
});

const curtainMat = new THREE.MeshStandardMaterial({
  color: "#cdc5b7",
  roughness: 0.92,
  metalness: 0.01,
});

const bonsaiFoliageMat = new THREE.MeshStandardMaterial({
  color: "#283e22",
  roughness: 0.75,
  metalness: 0.05,
});

const bookSpineColors = ["#8a4b38", "#384a5c", "#3d5440", "#63503c", "#44444c", "#a86c38"];
const bookMaterials: Record<string, THREE.MeshStandardMaterial> = Object.fromEntries(
  bookSpineColors.map((col) => [
    col,
    new THREE.MeshStandardMaterial({
      color: col,
      roughness: 0.65,
      metalness: 0.02,
    }),
  ])
);

// High-resolution (2048x1280) Left Monitor: VS Code TypeScript Reasoning Engine
function createCodeScreenTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0c1017";
  ctx.fillRect(0, 0, 2048, 1280);

  // Tab bar
  ctx.fillStyle = "#151b23";
  ctx.fillRect(0, 0, 2048, 88);

  // Window controls
  ctx.fillStyle = "#ff5f56";
  ctx.beginPath(); ctx.arc(48, 44, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffbd2e";
  ctx.beginPath(); ctx.arc(88, 44, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#27c93f";
  ctx.beginPath(); ctx.arc(128, 44, 12, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#8b949e";
  ctx.font = "32px 'JetBrains Mono', monospace";
  ctx.fillText("src/services/deepseek-streaming.ts", 180, 54);

  // Active file tab indicator
  ctx.fillStyle = "#238636";
  ctx.fillRect(170, 82, 540, 6);

  const lines = [
    { num: "01", text: "import { GroqLPU, StreamResponse } from '@ai/groq-streaming';", color: "#ff7b72" },
    { num: "02", text: "import { DeepSeekReasoner } from '@/lib/models/reasoner';", color: "#ff7b72" },
    { num: "03", text: "import { SceneGraph, CatmullRomCurve3 } from 'three';", color: "#ff7b72" },
    { num: "04", text: "", color: "#e6edf3" },
    { num: "05", text: "// Ultra low-latency contextual reasoning stream pipeline", color: "#8b949e" },
    { num: "06", text: "export async function handleInferenceStream(prompt: string): Promise<StreamResponse> {", color: "#d2a8ff" },
    { num: "07", text: "  const model = new DeepSeekReasoner({ temperature: 0.15, maxTokens: 4096 });", color: "#79c0ff" },
    { num: "08", text: "  const session = await GroqLPU.createSession({", color: "#e6edf3" },
    { num: "09", text: "    model: 'deepseek-r1-distill-llama-70b',", color: "#a5d6ff" },
    { num: "10", text: "    ttftTarget: '<280ms', // ultra-fast time-to-first-token", color: "#8b949e" },
    { num: "11", text: "    systemPrompt: 'You are an autonomous senior archviz & creative developer.'", color: "#a5d6ff" },
    { num: "12", text: "  });", color: "#e6edf3" },
    { num: "13", text: "  console.log('[Groq] Session established with low jitter');", color: "#7ee787" },
    { num: "14", text: "  return session.pipeThrough(new TextDecoderStream());", color: "#7ee787" },
    { num: "15", text: "}", color: "#d2a8ff" },
    { num: "16", text: "", color: "#e6edf3" },
    { num: "17", text: "export const runtime = 'edge';", color: "#ff7b72" },
    { num: "18", text: "export const preferredRegion = ['sin1', 'iad1'];", color: "#ffa657" },
  ];

  ctx.font = "34px 'JetBrains Mono', monospace";
  lines.forEach((l, i) => {
    const y = 160 + i * 58;
    ctx.fillStyle = "#484f58";
    ctx.fillText(l.num, 44, y);
    ctx.fillStyle = l.color;
    ctx.fillText(l.text, 128, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// High-resolution (2048x1280) Center Monitor: Architecture Topology Node Graph
function createArchitectureDiagramTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#080c12";
  ctx.fillRect(0, 0, 2048, 1280);

  // Subtle architectural coordinate grid
  ctx.strokeStyle = "#141c26";
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 2048; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1280); ctx.stroke();
  }
  for (let y = 0; y < 1280; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2048, y); ctx.stroke();
  }

  // Header bar
  ctx.fillStyle = "#cca872";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText("DISTRIBUTED SYSTEM TOPOLOGY & REALTIME PIPELINES", 64, 88);

  ctx.fillStyle = "#7ee787";
  ctx.font = "24px monospace";
  ctx.fillText("ACTIVE TOPOLOGY · REGION: ASIA-PACIFIC · 60 FPS WEBGL", 64, 130);

  function drawNode(x: number, y: number, w: number, h: number, title: string, subtitle: string, color = "#58a6ff") {
    if (!ctx) return;
    ctx.fillStyle = "#121720";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Header badge
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 8, h);

    ctx.fillStyle = "#f0f6fc";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(title, x + 28, y + 50);

    ctx.fillStyle = "#8b949e";
    ctx.font = "24px monospace";
    ctx.fillText(subtitle, x + 28, y + 90);
  }

  function drawArrow(x1: number, y1: number, x2: number, y2: number) {
    if (!ctx) return;
    ctx.strokeStyle = "#484f58";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.fillStyle = "#58a6ff";
    ctx.beginPath(); ctx.arc(x2, y2, 6, 0, Math.PI * 2); ctx.fill();
  }

  // Top tier
  drawNode(120, 260, 440, 130, "Next.js 16 WebGL Client", "R3F Canvas · CatmullRom Path", "#7ee787");
  drawNode(780, 260, 460, 130, "Edge Gateway Engine", "Vercel Edge · Low Jitter Cache", "#58a6ff");
  drawNode(1460, 260, 460, 130, "Groq LPU Array Cluster", "DeepSeek-R1 Distill 70B · 800 T/s", "#d2a8ff");

  // Bottom tier
  drawNode(780, 640, 460, 130, "Zustand State Graph", "Micro-State · Scrub Sync Engine", "#ffa657");
  drawNode(1460, 640, 460, 130, "Prisma + Mongo Cluster", "Vector Context Indexes · Sharded", "#79c0ff");

  // Interconnects
  drawArrow(560, 325, 780, 325);
  drawArrow(1240, 325, 1460, 325);
  drawArrow(1010, 390, 1010, 640);
  drawArrow(1690, 390, 1690, 640);
  drawArrow(1240, 705, 1460, 705);

  // Status footer
  ctx.fillStyle = "#121720";
  ctx.fillRect(120, 1000, 1800, 120);
  ctx.strokeStyle = "#30363d";
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 1000, 1800, 120);

  ctx.fillStyle = "#7ee787";
  ctx.beginPath(); ctx.arc(160, 1060, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#e6edf3";
  ctx.font = "28px monospace";
  ctx.fillText("All telemetry nominal · GPU VRAM: 320 MB · Render Latency: 16.6ms · 0 Drop Frames", 200, 1070);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// High-resolution (2048x1280) Right Monitor: Terminal & Deployment Telemetry
function createTerminalTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#070b10";
  ctx.fillRect(0, 0, 2048, 1280);

  ctx.fillStyle = "#131922";
  ctx.fillRect(0, 0, 2048, 80);
  ctx.fillStyle = "#8b949e";
  ctx.font = "30px monospace";
  ctx.fillText("zsh - node v22.14.0 - pnpm 10.5.2", 48, 52);

  const termLines = [
    { text: "vicky@studio-macbook-pro ~ % pnpm run build", color: "#58a6ff" },
    { text: "▲ Next.js 16.1.6 (Turbopack Enabled)", color: "#f0f6fc" },
    { text: "  - Environment: production", color: "#8b949e" },
    { text: "  - Static Route Optimization: active", color: "#8b949e" },
    { text: "", color: "#e6edf3" },
    { text: "✓ Compiled successfully in 1.4s", color: "#7ee787" },
    { text: "✓ Linting and type checking: 0 errors detected", color: "#7ee787" },
    { text: "✓ Generating static pages (5/5) in 620ms", color: "#7ee787" },
    { text: "✓ Finalizing production bundles", color: "#7ee787" },
    { text: "", color: "#e6edf3" },
    { text: "Route (app)                              Size     First Load JS", color: "#8b949e" },
    { text: "┌ ○ /                                    142 B           118 kB", color: "#e6edf3" },
    { text: "├ ○ /night                               142 B           118 kB", color: "#e6edf3" },
    { text: "└ ○ /_not-found                          994 B           101 kB", color: "#e6edf3" },
    { text: "", color: "#e6edf3" },
    { text: "○  (Static)  prerendered as static HTML content", color: "#7ee787" },
    { text: "λ  (Edge)    edge server-rendered on demand", color: "#79c0ff" },
    { text: "", color: "#e6edf3" },
    { text: "vicky@studio-macbook-pro ~ % git status", color: "#58a6ff" },
    { text: "On branch main: your branch is up to date with 'origin/main'.", color: "#8b949e" },
    { text: "nothing to commit, working tree clean", color: "#7ee787" },
  ];

  ctx.font = "32px 'JetBrains Mono', monospace";
  termLines.forEach((tl, idx) => {
    const y = 148 + idx * 52;
    ctx.fillStyle = tl.color;
    ctx.fillText(tl.text, 48, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

export function StudioZone() {
  const { scene } = useGLTF("/models/studio_master.glb");

  const walnutMat = useMemo(() => getDarkWalnutMat(), []);
  const blackMetalMat = matteBlackMetalMat;
  const brassMat = brushedBrassMat;
  const glassMat = architecturalGlassMat;
  const ledMat = warmCoveLedMat;
  const steelMat = brushedSteelMat;

  const codeTex = useMemo(() => createCodeScreenTexture(), []);
  const diagTex = useMemo(() => createArchitectureDiagramTexture(), []);
  const termTex = useMemo(() => createTerminalTexture(), []);

  const codeScreenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: codeTex,
        roughness: 0.8,
        metalness: 0.0,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: codeTex,
        emissiveIntensity: 0.92,
      }),
    [codeTex]
  );

  const diagScreenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: diagTex,
        roughness: 0.8,
        metalness: 0.0,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: diagTex,
        emissiveIntensity: 0.92,
      }),
    [diagTex]
  );

  const termScreenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: termTex,
        roughness: 0.8,
        metalness: 0.0,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: termTex,
        emissiveIntensity: 0.92,
      }),
    [termTex]
  );

  // Traverse and assign calibrated materials to Blender objects
  const clonedScene = useMemo(() => {
    const cl = scene.clone(true);
    cl.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const name = child.name;

        if (name.includes("Walnut") || name.includes("Desk") || name.includes("Bookcase")) {
          child.material = walnutMat;
        } else if (name.includes("Microcement") || name.includes("Floor")) {
          child.material = microcementFloorMat;
        } else if (name.includes("Wool_Rug") || name.includes("Rug")) {
          child.material = woolRugMat;
        } else if (name.includes("Plaster") || name.includes("Ceiling") || name.includes("Wall")) {
          child.material = wallMat;
        } else if (name.includes("Black") || name.includes("Mullion") || name.includes("Clamp") || name.includes("Post") || name.includes("Keyboard") || name.includes("Mouse") || name.includes("Mat")) {
          child.material = blackMetalMat;
        } else if (name.includes("Brass") || name.includes("Lamp") || name.includes("Pen") || name.includes("Vase") || name.includes("Cube") || name.includes("Bookend")) {
          child.material = brassMat;
        } else if (name.includes("Glass") || name.includes("Curtain_Wall")) {
          child.material = glassMat;
        } else if (name.includes("Curtain")) {
          child.material = curtainMat;
        } else if (name.includes("Chair_Seat") || name.includes("Chair_Backrest") || name.includes("Chair_Mesh")) {
          child.material = chairMeshMat;
        } else if (name.includes("Chair")) {
          child.material = blackMetalMat;
        } else if (name.includes("LED") || name.includes("Indicator") || name.includes("Btn")) {
          child.material = ledMat;
        } else if (name.includes("Elevator_Door") || name.includes("Steel")) {
          child.material = steelMat;
        } else if (name.includes("Plant_Foliage") || name.includes("Green")) {
          child.material = bonsaiFoliageMat;
        } else if (name.includes("Book_H") || name.includes("Book_V")) {
          const colorKey = bookSpineColors[Math.abs(name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % bookSpineColors.length];
          child.material = bookMaterials[colorKey] ?? bookMaterials[bookSpineColors[0]];
        }
      }
    });
    return cl;
  }, [scene, walnutMat, blackMetalMat, brassMat, glassMat, ledMat, steelMat]);

  return (
    <group position={[-1.75, 0, 3.56]}>
      {/* ═══ 1. MASTER 3D MODEL FROM BLENDER ═══ */}
      <primitive object={clonedScene} />

      {/* ═══ 2. UNIFIED ARTICULATED CURVED TRIPLE-MONITOR WORKSTATION ═══ */}
      <group position={[1.00, 1.25, -49.26]}>
        {/* Rear structural crossbar connecting monitor arms */}
        <mesh position={[0, 0, -0.04]} material={blackMetalMat} castShadow>
          <boxGeometry args={[2.70, 0.04, 0.03]} />
        </mesh>

        {/* ── A. Center Monitor: System Architecture Node Graph (Facing user) ── */}
        <group position={[0, 0, 0]}>
          {/* Bezel frame */}
          <mesh material={blackMetalMat} castShadow>
            <boxGeometry args={[0.96, 0.58, 0.024]} />
          </mesh>
          {/* Display surface locked to bezel front with +0.013m offset */}
          <mesh position={[0, 0, 0.013]} material={diagScreenMat}>
            <planeGeometry args={[0.94, 0.56]} />
          </mesh>
        </group>

        {/* ── B. Left Monitor: VS Code TypeScript Stream (Seamless 18° inward curve) ── */}
        <group position={[-0.936, 0, 0.148]} rotation={[0, Math.PI * 18 / 180, 0]}>
          <mesh material={blackMetalMat} castShadow>
            <boxGeometry args={[0.96, 0.58, 0.024]} />
          </mesh>
          <mesh position={[0, 0, 0.013]} material={codeScreenMat}>
            <planeGeometry args={[0.94, 0.56]} />
          </mesh>
        </group>

        {/* ── C. Right Monitor: Terminal & Deployment Telemetry (Seamless -18° inward curve) ── */}
        <group position={[0.936, 0, 0.148]} rotation={[0, -Math.PI * 18 / 180, 0]}>
          <mesh material={blackMetalMat} castShadow>
            <boxGeometry args={[0.96, 0.58, 0.024]} />
          </mesh>
          <mesh position={[0, 0, 0.013]} material={termScreenMat}>
            <planeGeometry args={[0.94, 0.56]} />
          </mesh>
        </group>
      </group>

      {/* ═══ 3. CALIBRATED ARCHITECTURAL LIGHTING ═══ */}
      {/* A. Warm downward cove wash along top of walnut slat wall (offset from wall grazing) */}
      {[-1.2, 0.8, 2.6].map((cx, idx) => (
        <pointLight
          key={`studio-cove-${idx}`}
          position={[cx, 3.65, -50.70]}
          color="#ffe4b8"
          intensity={2.2}
          distance={6.0}
          decay={2}
        />
      ))}

      {/* B. Slim brushed brass desk lamp: task light directed DOWNWARD onto desktop */}
      <pointLight
        position={[2.05, 0.92, -48.65]}
        color="#ffe2a0"
        intensity={1.8}
        distance={2.5}
        decay={2}
      />

      {/* C. Subtle bounce fill on keyboard and desk mat from screens */}
      <pointLight
        position={[1.00, 0.82, -48.70]}
        color="#80abdd"
        intensity={0.7}
        distance={1.8}
        decay={2}
      />

      {/* D. Integrated bookshelf warm fill (soft ambient, no shadow acne) */}
      <pointLight
        position={[4.50, 1.85, -50.45]}
        color="#ffe4b0"
        intensity={0.7}
        distance={2.2}
        decay={2}
      />

      {/* E. Natural cool dusk light washing from left corner window */}
      <pointLight
        position={[-2.40, 2.40, -46.50]}
        color="#7ca0c8"
        intensity={2.0}
        distance={9.0}
        decay={2}
      />

      {/* F. Elevator indicator warm light at the north rooftop portal */}
      <pointLight
        position={[1.75, 2.58, -52.80]}
        color="#ffcc88"
        intensity={1.0}
        distance={3.0}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload("/models/studio_master.glb");
