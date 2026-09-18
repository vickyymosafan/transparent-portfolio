"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  getDarkWalnutMat,
  matteBlackMetalMat,
  brushedBrassMat,
  architecturalGlassMat,
  warmCoveLedMat,
} from "@/lib/architectural-materials";

// Dedicated interior materials
const microcementFloorMat = new THREE.MeshStandardMaterial({
  color: "#c8beaf",
  roughness: 0.65,
  metalness: 0.05,
});

const woolRugMat = new THREE.MeshStandardMaterial({
  color: "#3a3c42",
  roughness: 0.95,
  metalness: 0.02,
});

const wallMat = new THREE.MeshStandardMaterial({
  color: "#ded8cb",
  roughness: 0.82,
  metalness: 0.02,
});

const ceilingMat = new THREE.MeshStandardMaterial({
  color: "#f5f2eb",
  roughness: 0.88,
  metalness: 0.02,
});

const chairMeshMat = new THREE.MeshStandardMaterial({
  color: "#222428",
  roughness: 0.78,
  metalness: 0.15,
});

const screenBezelMat = new THREE.MeshStandardMaterial({
  color: "#101215",
  roughness: 0.18,
  metalness: 0.92,
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

function createCodeScreenTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, 1024, 640);

  ctx.fillStyle = "#161b22";
  ctx.fillRect(0, 0, 1024, 52);
  ctx.fillStyle = "#ff5f56";
  ctx.beginPath(); ctx.arc(32, 26, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffbd2e";
  ctx.beginPath(); ctx.arc(56, 26, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#27c93f";
  ctx.beginPath(); ctx.arc(80, 26, 7, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#8b949e";
  ctx.font = "20px monospace";
  ctx.fillText("src/services/intellichat-engine.ts", 120, 33);

  const lines = [
    { num: "01", text: "import { GroqLPU } from '@ai/groq-streaming';", color: "#ff7b72" },
    { num: "02", text: "import { DeepSeekReasoner } from '@/lib/models';", color: "#ff7b72" },
    { num: "03", text: "import { ThreeScene, CatmullSpline } from 'three';", color: "#ff7b72" },
    { num: "04", text: "", color: "#e6edf3" },
    { num: "05", text: "// Initialize low-latency contextual reasoning stream", color: "#8b949e" },
    { num: "06", text: "export async function handleInferenceStream(prompt: string) {", color: "#d2a8ff" },
    { num: "07", text: "  const model = new DeepSeekReasoner({ temperature: 0.2 });", color: "#79c0ff" },
    { num: "08", text: "  const stream = await GroqLPU.createSession({", color: "#e6edf3" },
    { num: "09", text: "    model: 'deepseek-r1-distill-llama-70b',", color: "#a5d6ff" },
    { num: "10", text: "    ttftTarget: '<350ms', // ultra-fast streaming", color: "#8b949e" },
    { num: "11", text: "    systemPrompt: 'You are an autonomous AI specialist.'", color: "#a5d6ff" },
    { num: "12", text: "  });", color: "#e6edf3" },
    { num: "13", text: "  return stream.pipeThrough(new TextDecoderStream());", color: "#7ee787" },
    { num: "14", text: "}", color: "#d2a8ff" },
  ];

  ctx.font = "21px monospace";
  lines.forEach((l, i) => {
    const y = 92 + i * 36;
    ctx.fillStyle = "#484f58";
    ctx.fillText(l.num, 28, y);
    ctx.fillStyle = l.color;
    ctx.fillText(l.text, 82, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

function createArchitectureDiagramTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0a0e14";
  ctx.fillRect(0, 0, 1024, 640);

  ctx.strokeStyle = "#16202c";
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 640); ctx.stroke();
  }
  for (let y = 0; y < 640; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  ctx.fillStyle = "#cca872";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("SYSTEM TOPOLOGY & PIPELINES", 40, 52);

  function drawNode(x: number, y: number, w: number, h: number, title: string, subtitle: string, color = "#58a6ff") {
    if (!ctx) return;
    ctx.fillStyle = "#161b22";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#f0f6fc";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(title, x + 16, y + 28);

    ctx.fillStyle = "#8b949e";
    ctx.font = "14px sans-serif";
    ctx.fillText(subtitle, x + 16, y + 50);
  }

  function drawArrow(x1: number, y1: number, x2: number, y2: number) {
    if (!ctx) return;
    ctx.strokeStyle = "#484f58";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.fillStyle = "#484f58";
    ctx.beginPath(); ctx.arc(x2, y2, 4, 0, Math.PI * 2); ctx.fill();
  }

  drawNode(60, 140, 240, 72, "Client Browser", "Next.js 16 + R3F Canvas", "#7ee787");
  drawNode(380, 140, 240, 72, "Edge Gateway", "Vercel Edge Functions", "#58a6ff");
  drawNode(700, 140, 240, 72, "Groq LPU Array", "DeepSeek-R1 Distill 70B", "#d2a8ff");

  drawNode(380, 320, 240, 72, "State Memory Store", "Zustand Reactive Graph", "#ffa657");
  drawNode(700, 320, 240, 72, "MongoDB Cluster", "Vector Context Indexes", "#79c0ff");

  drawArrow(300, 176, 380, 176);
  drawArrow(620, 176, 700, 176);
  drawArrow(500, 212, 500, 320);
  drawArrow(820, 212, 820, 320);
  drawArrow(620, 356, 700, 356);

  ctx.fillStyle = "#7ee787";
  ctx.beginPath(); ctx.arc(60, 480, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#e6edf3";
  ctx.font = "16px monospace";
  ctx.fillText("All systems nominal · Latency: 42ms · 60 FPS WebGL", 80, 485);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

function createTerminalTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#090d13";
  ctx.fillRect(0, 0, 1024, 640);

  ctx.fillStyle = "#121822";
  ctx.fillRect(0, 0, 1024, 44);
  ctx.fillStyle = "#8b949e";
  ctx.font = "18px monospace";
  ctx.fillText("bash - node v22.14.0", 24, 28);

  const termLines = [
    { text: "vicky@studio-macbook-pro ~ % pnpm run build", color: "#58a6ff" },
    { text: "▲ Next.js 16.1.6", color: "#f0f6fc" },
    { text: "  - Environments: .env.production", color: "#8b949e" },
    { text: "  - Experiments: optimizePackageImports", color: "#8b949e" },
    { text: "", color: "#e6edf3" },
    { text: "✓ Compiled successfully in 1.4s", color: "#7ee787" },
    { text: "✓ Linting and type checking ... 0 errors", color: "#7ee787" },
    { text: "✓ Generating static pages (6/6)", color: "#7ee787" },
    { text: "✓ Finalizing page optimization", color: "#7ee787" },
    { text: "", color: "#e6edf3" },
    { text: "Route (app)                              Size     First Load JS", color: "#8b949e" },
    { text: "┌ ○ /                                    142 B           118 kB", color: "#e6edf3" },
    { text: "├ ○ /night                               142 B           118 kB", color: "#e6edf3" },
    { text: "└ ○ /_not-found                          994 B           101 kB", color: "#e6edf3" },
    { text: "", color: "#e6edf3" },
    { text: "○  (Static)  prerendered as static content", color: "#8b949e" },
    { text: "●  (SSG)     prerendered as static HTML", color: "#8b949e" },
  ];

  ctx.font = "20px monospace";
  termLines.forEach((tl, idx) => {
    const y = 84 + idx * 30;
    ctx.fillStyle = tl.color;
    ctx.fillText(tl.text, 24, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

export function StudioZone() {
  const roomW = 10.5;
  const roomH = 4.8;
  const roomD = 12.0;
  const floorY = 0.0;
  const zCenter = -45.0; // Spans from z = -39.0 to z = -51.0

  const walnutMat = useMemo(() => getDarkWalnutMat(), []);
  const codeTex = useMemo(() => createCodeScreenTexture(), []);
  const diagTex = useMemo(() => createArchitectureDiagramTexture(), []);
  const termTex = useMemo(() => createTerminalTexture(), []);

  const codeScreenMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: codeTex,
    roughness: 0.22,
    metalness: 0.1,
    emissive: new THREE.Color("#ffffff"),
    emissiveMap: codeTex,
    emissiveIntensity: 0.85,
  }), [codeTex]);

  const diagScreenMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: diagTex,
    roughness: 0.22,
    metalness: 0.1,
    emissive: new THREE.Color("#ffffff"),
    emissiveMap: diagTex,
    emissiveIntensity: 0.85,
  }), [diagTex]);

  const termScreenMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: termTex,
    roughness: 0.22,
    metalness: 0.1,
    emissive: new THREE.Color("#ffffff"),
    emissiveMap: termTex,
    emissiveIntensity: 0.85,
  }), [termTex]);

  // Dark walnut vertical slats for the hero accent wall (Reference 3)
  const slats = useMemo(() => {
    const list: number[] = [];
    for (let x = -roomW / 2 + 0.3; x <= roomW / 2 - 2.8; x += 0.14) {
      list.push(x);
    }
    return list;
  }, [roomW]);

  // Bookshelf items
  const books = useMemo(() => {
    const list: { shelfY: number; x: number; w: number; h: number; color: string }[] = [];
    const shelfYs = [1.2, 1.8, 2.4, 3.0];
    shelfYs.forEach((sy, sidx) => {
      let curX = -0.7;
      const count = 5 + (sidx % 3) * 2;
      for (let b = 0; b < count && curX < 0.7; b++) {
        const factor = Math.abs(Math.sin((sidx + 1) * 4.2 + b * 2.7));
        const w = 0.045 + factor * 0.035;
        const h = 0.24 + Math.abs(Math.cos(sidx * 3.1 + b * 1.9)) * 0.18;
        const color = bookSpineColors[(sidx * 3 + b) % bookSpineColors.length];
        list.push({ shelfY: sy, x: curX, w, h, color });
        curX += w + 0.015;
      }
    });
    return list;
  }, []);

  return (
    <group position={[0, floorY, zCenter]}>
      {/* ═══ 1. MICROCEMENT FLOOR WITH HEATHER GREY WOOL RUG (Reference 3) ═══ */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={microcementFloorMat}>
        <planeGeometry args={[roomW, roomD]} />
      </mesh>
      {/* Wool Area Rug under desk and chair */}
      <mesh receiveShadow position={[-0.4, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={woolRugMat}>
        <planeGeometry args={[5.4, 4.4]} />
      </mesh>

      {/* ═══ 2. PERIMETER WARM COVE CEILING LIGHTING (Reference 3) ═══ */}
      <mesh position={[0, roomH, 0]} material={ceilingMat}>
        <boxGeometry args={[roomW, 0.2, roomD]} />
      </mesh>
      {/* Linear Cove light wash along top of walnut slat wall */}
      <mesh position={[0, roomH - 0.04, -roomD / 2 + 0.25]} material={warmCoveLedMat}>
        <boxGeometry args={[roomW - 1.0, 0.03, 0.04]} />
      </mesh>
      {/* Ambient downward light from the cove */}
      {[-3, 0, 3].map((cx, idx) => (
        <pointLight
          key={`studio-cove-${idx}`}
          position={[cx, roomH - 0.2, -roomD / 2 + 0.5]}
          color="#ffe4b8"
          intensity={3.2}
          distance={8.0}
          decay={2}
        />
      ))}

      {/* ═══ 3. NORTH HERO ACCENT WALL: FULL-HEIGHT WALNUT SLATS (Reference 3) ═══ */}
      <mesh position={[0, roomH / 2, -roomD / 2]} castShadow receiveShadow material={wallMat}>
        <boxGeometry args={[roomW, roomH, 0.4]} />
      </mesh>
      {slats.map((sx, idx) => (
        <mesh key={`stud-slat-${idx}`} position={[sx, roomH / 2, -roomD / 2 + 0.22]} castShadow material={walnutMat}>
          <boxGeometry args={[0.06, roomH, 0.06]} />
        </mesh>
      ))}

      {/* ═══ 4. INTEGRATED WALNUT BOOKCASE (RIGHT SIDE OF SLAT WALL) ═══ */}
      <group position={[roomW / 2 - 1.8, 0, -roomD / 2 + 0.35]}>
        {/* Bookshelf Outer Carcass */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow material={walnutMat}>
          <boxGeometry args={[1.8, 3.4, 0.45]} />
        </mesh>
        {/* Recessed interior cavity */}
        <mesh position={[0, 2.2, 0.04]} material={walnutMat}>
          <boxGeometry args={[1.68, 3.28, 0.38]} />
        </mesh>
        {/* Horizontal Shelves */}
        {[1.2, 1.8, 2.4, 3.0].map((sy, idx) => (
          <group key={`shelf-${idx}`} position={[0, sy, 0.08]}>
            <mesh castShadow receiveShadow material={walnutMat}>
              <boxGeometry args={[1.68, 0.05, 0.36]} />
            </mesh>
            {/* Integrated LED warm shelf glow underneath */}
            <mesh position={[0, -0.03, 0]} material={warmCoveLedMat}>
              <boxGeometry args={[1.6, 0.015, 0.03]} />
            </mesh>
            <pointLight position={[0, -0.15, 0.1]} color="#ffe0a3" intensity={0.9} distance={2.5} decay={2} />
          </group>
        ))}

        {/* Procedural Books on Shelves */}
        {books.map((b, idx) => (
          <mesh
            key={`book-${idx}`}
            position={[b.x, b.shelfY + b.h / 2 + 0.025, 0.08]}
            castShadow
            material={bookMaterials[b.color] ?? bookMaterials[bookSpineColors[0]]}
          >
            <boxGeometry args={[b.w, b.h, 0.26]} />
          </mesh>
        ))}

        {/* Small ceramic art piece and desk succulent on top shelf */}
        <group position={[-0.45, 3.16, 0.08]}>
          <mesh castShadow material={brushedBrassMat}>
            <cylinderGeometry args={[0.07, 0.1, 0.22, 16]} />
          </mesh>
        </group>
      </group>

      {/* ═══ 5. SOLID DARK WALNUT WATERFALL EXECUTIVE DESK (Reference 3) ═══ */}
      <group position={[-0.4, 0, -1.2]}>
        {/* Main Desktop Slab */}
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow material={walnutMat}>
          <boxGeometry args={[3.2, 0.08, 1.25]} />
        </mesh>
        {/* Waterfall Right Leg */}
        <mesh position={[1.56, 0.35, 0]} castShadow receiveShadow material={walnutMat}>
          <boxGeometry args={[0.08, 0.7, 1.25]} />
        </mesh>
        {/* Waterfall Left Leg */}
        <mesh position={[-1.56, 0.35, 0]} castShadow receiveShadow material={walnutMat}>
          <boxGeometry args={[0.08, 0.7, 1.25]} />
        </mesh>
        {/* Modesty Panel / Cable Management Back */}
        <mesh position={[0, 0.45, -0.58]} castShadow material={walnutMat}>
          <boxGeometry args={[3.04, 0.5, 0.04]} />
        </mesh>

        {/* Minimalist Brass Desk Lamp (Right side, casting warm pool) */}
        <group position={[1.1, 0.78, -0.2]}>
          {/* Base */}
          <mesh material={brushedBrassMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 18]} />
          </mesh>
          {/* Slim vertical stem */}
          <mesh position={[0, 0.24, 0]} material={brushedBrassMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.48, 12]} />
          </mesh>
          {/* Horizontal linear head */}
          <mesh position={[-0.14, 0.48, 0]} rotation={[0, 0, 0]} material={brushedBrassMat}>
            <boxGeometry args={[0.34, 0.02, 0.04]} />
          </mesh>
          {/* Underside LED emitter */}
          <mesh position={[-0.14, 0.47, 0]} material={warmCoveLedMat}>
            <boxGeometry args={[0.3, 0.01, 0.025]} />
          </mesh>
          {/* Warm pool of task light hitting walnut desktop */}
          <pointLight position={[-0.14, 0.4, 0]} color="#ffe0a3" intensity={2.8} distance={4.0} decay={2} />
        </group>

        {/* Mechanical Keyboard & Mouse Pad */}
        <group position={[0, 0.785, 0.25]}>
          {/* Desk Mat */}
          <mesh receiveShadow material={matteBlackMetalMat}>
            <boxGeometry args={[0.9, 0.005, 0.42]} />
          </mesh>
          {/* Keyboard Chassis */}
          <mesh position={[-0.08, 0.012, 0]} castShadow material={matteBlackMetalMat}>
            <boxGeometry args={[0.38, 0.018, 0.14]} />
          </mesh>
          {/* Keycaps */}
          <mesh position={[-0.08, 0.023, 0]} material={screenBezelMat}>
            <boxGeometry args={[0.36, 0.008, 0.12]} />
          </mesh>
          {/* Precision Wireless Mouse */}
          <mesh position={[0.26, 0.018, 0.02]} castShadow material={screenBezelMat}>
            <boxGeometry args={[0.07, 0.025, 0.12]} />
          </mesh>
        </group>

        {/* Minimalist Ceramic Coffee Mug & Leather Notebook */}
        <group position={[-0.95, 0.785, 0.1]}>
          {/* Ceramic Mug */}
          <mesh position={[0, 0.06, 0]} castShadow material={microcementFloorMat}>
            <cylinderGeometry args={[0.045, 0.04, 0.11, 16]} />
          </mesh>
          {/* Leather Journal */}
          <mesh position={[0.3, 0.01, 0.05]} castShadow material={new THREE.MeshStandardMaterial({ color: "#2d241e", roughness: 0.75 })}>
            <boxGeometry args={[0.18, 0.02, 0.24]} />
          </mesh>
        </group>

        {/* ═══ 6. CURVED TRIPLE MONITORS ON GAS-SPRING ARMS (Reference 3) ═══ */}
        <group position={[0, 0.78, -0.42]}>
          {/* Center Desk Clamp Mount */}
          <mesh position={[0, 0.08, 0]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.16, 0.16, 0.14]} />
          </mesh>
          {/* Vertical Post */}
          <mesh position={[0, 0.32, 0]} material={matteBlackMetalMat}>
            <cylinderGeometry args={[0.025, 0.025, 0.45, 12]} />
          </mesh>

          {/* ── Center Monitor: IDE Code Editor ── */}
          <group position={[0, 0.45, 0.05]}>
            {/* Bezel */}
            <mesh castShadow material={screenBezelMat}>
              <boxGeometry args={[1.04, 0.62, 0.03]} />
            </mesh>
            {/* Screen Display */}
            <mesh position={[0, 0, 0.018]} material={codeScreenMat}>
              <planeGeometry args={[1.0, 0.58]} />
            </mesh>
          </group>

          {/* ── Left Monitor: Architecture / System Diagram (Angled Inward) ── */}
          <group position={[-1.02, 0.45, -0.05]} rotation={[0, 0.32, 0]}>
            <mesh castShadow material={screenBezelMat}>
              <boxGeometry args={[1.04, 0.62, 0.03]} />
            </mesh>
            <mesh position={[0, 0, 0.018]} material={diagScreenMat}>
              <planeGeometry args={[1.0, 0.58]} />
            </mesh>
          </group>

          {/* ── Right Monitor: Terminal & Pipeline Metrics (Angled Inward) ── */}
          <group position={[1.02, 0.45, -0.05]} rotation={[0, -0.32, 0]}>
            <mesh castShadow material={screenBezelMat}>
              <boxGeometry args={[1.04, 0.62, 0.03]} />
            </mesh>
            <mesh position={[0, 0, 0.018]} material={termScreenMat}>
              <planeGeometry args={[1.0, 0.58]} />
            </mesh>
          </group>
        </group>

        {/* ═══ 7. ERGONOMIC TASK CHAIR (Herman Miller Embody Silhouette) ═══ */}
        <group position={[0, 0, 0.95]} rotation={[0, Math.PI, 0]}>
          {/* 5-Star Caster Base */}
          <mesh position={[0, 0.08, 0]} material={matteBlackMetalMat}>
            <cylinderGeometry args={[0.34, 0.34, 0.04, 5]} />
          </mesh>
          {/* Central Pneumatic Cylinder */}
          <mesh position={[0, 0.28, 0]} material={matteBlackMetalMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.38, 12]} />
          </mesh>
          {/* Contoured Seat Pan */}
          <mesh position={[0, 0.46, 0]} castShadow material={chairMeshMat}>
            <boxGeometry args={[0.56, 0.08, 0.54]} />
          </mesh>
          {/* Spine & Rib Lumbar Structure */}
          <mesh position={[0, 0.85, -0.25]} castShadow material={chairMeshMat}>
            <boxGeometry args={[0.48, 0.72, 0.05]} />
          </mesh>
          {/* Adjustable Armrests */}
          {[-0.3, 0.3].map((ax, idx) => (
            <mesh key={`arm-${idx}`} position={[ax, 0.65, -0.02]} material={chairMeshMat}>
              <boxGeometry args={[0.08, 0.04, 0.28]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ═══ 8. FLOOR-TO-CEILING CORNER WINDOW & CITYSCAPE (LEFT SIDE) ═══ */}
      <group position={[-roomW / 2, 0, 0]}>
        {/* Glass Wall */}
        <mesh position={[0, roomH / 2, 0]} material={architecturalGlassMat}>
          <boxGeometry args={[0.04, roomH, roomD]} />
        </mesh>
        {/* Exterior Mullions */}
        {[-4, 0, 4].map((wz, idx) => (
          <mesh key={`win-mul-${idx}`} position={[0.05, roomH / 2, wz]} material={matteBlackMetalMat}>
            <boxGeometry args={[0.08, roomH, 0.08]} />
          </mesh>
        ))}
        {/* Soft cool ambient light coming through the window */}
        <pointLight position={[1.5, 2.5, 0]} color="#7098c4" intensity={2.0} distance={9.0} decay={2} />
      </group>

      {/* ═══ 9. ELEVATOR VESTIBULE TO ROOFTOP (AT NORTH-EAST REAR) ═══ */}
      <group position={[roomW / 2 - 0.2, 0, 3.8]}>
        <mesh position={[0, roomH / 2, 0]} material={wallMat}>
          <boxGeometry args={[0.4, roomH, 3.2]} />
        </mesh>
        {/* Bronze Elevator Doors */}
        <mesh position={[-0.15, 1.45, 0]} castShadow material={brushedBrassMat}>
          <boxGeometry args={[0.04, 2.8, 1.6]} />
        </mesh>
        {/* Floor indicator and call button */}
        <mesh position={[-0.18, 1.5, 1.1]} material={matteBlackMetalMat}>
          <boxGeometry args={[0.02, 0.32, 0.12]} />
        </mesh>
        <mesh position={[-0.2, 1.55, 1.1]} material={warmCoveLedMat}>
          <boxGeometry args={[0.01, 0.04, 0.04]} />
        </mesh>
      </group>
    </group>
  );
}
