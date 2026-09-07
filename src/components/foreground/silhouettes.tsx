"use client";

import { useMemo } from "react";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function branch(rng: () => number, x: number, y: number, len: number, angle: number, depth: number, out: string[]) {
  const x2 = x + Math.cos(angle) * len;
  const y2 = y - Math.sin(angle) * len;
  out.push(`M ${x.toFixed(1)} ${y.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  if (depth <= 0) return;
  const n = 2 + (rng() > 0.6 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    branch(rng, x2, y2, len * (0.62 + rng() * 0.18), angle + (rng() - 0.5) * 1.5, depth - 1, out);
  }
}

export function DryTree({ className, flip }: { className?: string; flip?: boolean }) {
  const paths = useMemo(() => {
    const rng = mulberry32(7331);
    const out: string[] = [];
    branch(rng, 200, 300, 92, Math.PI / 2 + (rng() - 0.5) * 0.2, 4, out);
    return out;
  }, []);
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <linearGradient id="fg-fade-tree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04070a" stopOpacity="0.92" />
          <stop offset="1" stopColor="#04070a" stopOpacity="1" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} stroke="url(#fg-fade-tree)" strokeWidth={i === 0 ? 7 : 3.2} strokeLinecap="round" fill="none" />
      ))}
    </svg>
  );
}

export function BrokenTower({ className, flip }: { className?: string; flip?: boolean }) {
  const d = useMemo(() => {
    const rng = mulberry32(4242);
    const pts: string[] = [];
    const baseY = 300;
    const leftX = 60;
    const rightX = 300;
    let x = leftX;
    let y = baseY;
    pts.push(`M ${x} ${y}`);
    x = leftX - 8;
    y = 90 + rng() * 30;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    x += 20;
    y -= 18 + rng() * 16;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    x += 60 + rng() * 40;
    y += (rng() - 0.5) * 30;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    x = rightX;
    y = 120 + rng() * 40;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    pts.push(`L ${rightX + 8} ${baseY}`);
    pts.push("Z");
    return pts.join(" ");
  }, []);
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d={d} fill="#04070a" fillOpacity="0.94" />
    </svg>
  );
}

export function GrassTufts({ className, flip }: { className?: string; flip?: boolean }) {
  const blades = useMemo(() => {
    const rng = mulberry32(909);
    return Array.from({ length: 46 }, () => {
      const x = 20 + rng() * 360;
      const h = 26 + rng() * 54;
      const lean = (rng() - 0.5) * 60;
      return `M ${x.toFixed(1)} 300 Q ${(x + lean * 0.4).toFixed(1)} ${(300 - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(300 - h).toFixed(1)}`;
    });
  }, []);
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {blades.map((d, i) => (
        <path key={i} d={d} stroke="#04070a" strokeOpacity={0.9} strokeWidth={2 + (i % 3)} fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}
