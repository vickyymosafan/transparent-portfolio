"use client";

import * as THREE from "three";

/**
 * Procedural Architectural PBR Texture Generator
 * Generates high-fidelity, high-performance canvas textures for PBR materials:
 * - Terrazzo floor (speckled chips, glossy specularity)
 * - Travertine limestone (vein striations, porous stone roughness)
 * - Venetian plaster (subtle limewash mottling)
 * - Wood planks (oak/teak grain and plank joints)
 * - Basalt paver (flamed volcanic stone grain)
 * - Nero Marquina (deep black marble with white calcite veins)
 * - River pebbles / pea gravel (dark smooth stones with water gloss)
 * - Water ripples normal/bump map
 */

const textureCache: Record<string, THREE.CanvasTexture> = {};

function getCanvas(width = 1024, height = 1024): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  return { canvas, ctx };
}

/**
 * Architectural board-formed cast concrete with subtle wood-grain formwork lines
 * Matches Reference Image 5 (Courtyard Pavilion & Cantilevered Slabs)
 */
export function getBoardFormedConcreteTexture(): THREE.CanvasTexture {
  if (textureCache.concrete) return textureCache.concrete;
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Base warm architectural concrete
  ctx.fillStyle = "#7c828c";
  ctx.fillRect(0, 0, 1024, 1024);

  // Porous cement grain variation
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const v = Math.random() > 0.5 ? 20 : -20;
    const g = 124 + v + Math.floor(Math.random() * 15);
    ctx.fillStyle = `rgba(${g}, ${g + 2}, ${g + 5}, ${0.12 + Math.random() * 0.2})`;
    ctx.fillRect(x, y, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }

  // Horizontal wood board formwork planks (height ~64px each)
  for (let y = 0; y < 1024; y += 64) {
    // Plank seam / shadow groove
    ctx.strokeStyle = "rgba(45, 50, 58, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // Subtle plank highlight
    ctx.strokeStyle = "rgba(180, 185, 195, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + 2);
    ctx.lineTo(1024, y + 2);
    ctx.stroke();

    // Formwork tie holes (subtle indented circles every 256px)
    for (let x = 64; x < 1024; x += 256) {
      ctx.fillStyle = "rgba(40, 45, 52, 0.5)";
      ctx.beginPath();
      ctx.arc(x, y + 32, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(190, 195, 205, 0.25)";
      ctx.beginPath();
      ctx.arc(x, y + 34, 4, 0, Math.PI);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = 8;
  textureCache.concrete = tex;
  return tex;
}

/**
 * Polished dark terrazzo floor texture with subtle stone aggregate chips
 * Matches Reference Image 1 (Exhibition Gallery)
 */
export function getTerrazzoTexture(): THREE.CanvasTexture {
  if (textureCache.terrazzo) return textureCache.terrazzo;
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Base polished charcoal-graphite stone
  ctx.fillStyle = "#1e2126";
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle tonal cloud variation
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 1.0 + Math.random() * 3.5;
    const gray = 35 + Math.floor(Math.random() * 55);
    ctx.fillStyle = `rgba(${gray}, ${gray + 2}, ${gray + 6}, ${0.18 + Math.random() * 0.35})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Aggregate chips: quartz, marble, calcite, basalt flecks
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const size = 1.8 + Math.random() * 4.5;
    const rand = Math.random();
    let r = 200, g = 200, b = 200;
    if (rand > 0.7) {
      // White calcite flecks
      r = 230 + Math.floor(Math.random() * 25);
      g = 228 + Math.floor(Math.random() * 25);
      b = 225 + Math.floor(Math.random() * 25);
    } else if (rand > 0.4) {
      // Warm amber/sand chips
      r = 175 + Math.floor(Math.random() * 40);
      g = 145 + Math.floor(Math.random() * 30);
      b = 110 + Math.floor(Math.random() * 20);
    } else {
      // Dark slate chips
      r = 50 + Math.floor(Math.random() * 30);
      g = 55 + Math.floor(Math.random() * 30);
      b = 65 + Math.floor(Math.random() * 30);
    }
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.45 + Math.random() * 0.45})`;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * (0.5 + Math.random() * 0.5), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = 8;
  textureCache.terrazzo = tex;
  return tex;
}

/**
 * Vein-cut Roman travertine limestone with soft warm horizontal striations
 * Matches Reference Image 3 (Entrance Foyer)
 */
export function getTravertineTexture(): THREE.CanvasTexture {
  if (textureCache.travertine) return textureCache.travertine;
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Base warm sand travertine
  ctx.fillStyle = "#d8cdbc";
  ctx.fillRect(0, 0, 1024, 1024);

  // Horizontal sedimentary vein striations
  for (let y = 0; y < 1024; y += 3) {
    const opacity = 0.05 + Math.sin(y * 0.05) * 0.03 + Math.random() * 0.06;
    const dark = Math.random() > 0.45;
    ctx.fillStyle = dark
      ? `rgba(145, 128, 108, ${opacity})`
      : `rgba(245, 238, 226, ${opacity})`;
    ctx.fillRect(0, y, 1024, 2 + Math.random() * 4);
  }

  // Soft micro-porous natural cavities
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const w = 6 + Math.random() * 22;
    const h = 1.5 + Math.random() * 3.2;
    ctx.fillStyle = "rgba(115, 98, 80, 0.09)";
    ctx.fillRect(x, y, w, h);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = 8;
  textureCache.travertine = tex;
  return tex;
}

/**
 * Venetian plaster / limewash wall with delicate artisan tonal mottling
 */
export function getPlasterTexture(): THREE.CanvasTexture {
  if (textureCache.plaster) return textureCache.plaster;
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Neutral warm alabaster / light greige
  ctx.fillStyle = "#ece6dc";
  ctx.fillRect(0, 0, 1024, 1024);

  // Organic cloudy trowel strokes
  for (let i = 0; i < 140; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 50 + Math.random() * 100;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    const dark = Math.random() > 0.48;
    grad.addColorStop(0, dark ? "rgba(215, 205, 192, 0.26)" : "rgba(255, 252, 246, 0.28)");
    grad.addColorStop(1, "rgba(236, 230, 220, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = 8;
  textureCache.plaster = tex;
  return tex;
}

/**
 * Wood plank texture (European oak, teak, or walnut)
 */
export function getWoodPlankTexture(type: "oak" | "teak" | "walnut" = "oak"): THREE.CanvasTexture {
  const key = `wood_${type}`;
  if (textureCache[key]) return textureCache[key];
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  const baseColor =
    type === "oak" ? "#ba9365" : type === "teak" ? "#a27549" : "#4a3222";
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 1024, 1024);

  // 8 Planks vertically (each 128px wide)
  const plankH = 128;
  for (let p = 0; p < 8; p++) {
    const y = p * plankH;
    const shift = (Math.random() - 0.5) * 22;
    ctx.fillStyle = `rgba(${shift > 0 ? 255 : 0}, ${shift > 0 ? 240 : 0}, ${shift > 0 ? 200 : 0}, ${Math.abs(shift) / 255})`;
    ctx.fillRect(0, y, 1024, plankH);

    // Fine wood grain lines inside each plank
    for (let g = 0; g < 28; g++) {
      const gy = y + Math.random() * plankH;
      ctx.fillStyle = type === "walnut" ? "rgba(25, 15, 8, 0.12)" : "rgba(60, 38, 20, 0.09)";
      ctx.fillRect(0, gy, 1024, 1.2 + Math.random() * 2.0);
    }

    // Dark plank bevel seam
    ctx.fillStyle = "rgba(25, 15, 8, 0.48)";
    ctx.fillRect(0, y, 1024, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(type === "oak" ? 3 : 4, type === "oak" ? 3 : 4);
  tex.anisotropy = 8;
  textureCache[key] = tex;
  return tex;
}

/**
 * Honed basalt volcanic stone pavers with clean tile grid
 * Matches Reference Image 4 (Zen Garden Corridor)
 */
export function getBasaltTexture(): THREE.CanvasTexture {
  if (textureCache.basalt) return textureCache.basalt;
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Dark slate-basalt base
  ctx.fillStyle = "#202428";
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro-cleft fine noise
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const dark = Math.random() > 0.5;
    ctx.fillStyle = dark ? "rgba(12, 14, 17, 0.28)" : "rgba(65, 74, 85, 0.22)";
    ctx.fillRect(x, y, 2.0, 2.0);
  }

  // Stone slab tile grid seams (256x256 pavers)
  ctx.strokeStyle = "rgba(10, 12, 15, 0.75)";
  ctx.lineWidth = 4;
  for (let x = 0; x <= 1024; x += 256) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += 256) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 8;
  textureCache.basalt = tex;
  return tex;
}

/**
 * Nero Marquina black marble with crisp white calcite veins
 * Matches console table in Reference Image 3
 */
export function getNeroMarquinaTexture(): THREE.CanvasTexture {
  if (textureCache.marquina) return textureCache.marquina;
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Rich deep black marble base
  ctx.fillStyle = "#121417";
  ctx.fillRect(0, 0, 1024, 1024);

  // Diagonal branching white calcite veins
  ctx.strokeStyle = "rgba(240, 245, 255, 0.7)";
  ctx.lineWidth = 2.5;

  const drawVein = (startX: number, startY: number, length: number, angle: number) => {
    let curX = startX;
    let curY = startY;
    ctx.beginPath();
    ctx.moveTo(curX, curY);
    for (let s = 0; s < length; s += 12) {
      curX += Math.cos(angle) * 12 + (Math.random() - 0.5) * 8;
      curY += Math.sin(angle) * 12 + (Math.random() - 0.5) * 8;
      ctx.lineTo(curX, curY);
    }
    ctx.stroke();
  };

  drawVein(100, 50, 600, 0.75);
  drawVein(350, 120, 500, 0.82);
  drawVein(200, 600, 450, 0.70);
  drawVein(650, 200, 400, 0.88);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.anisotropy = 8;
  textureCache.marquina = tex;
  return tex;
}

/**
 * Rounded river pebbles & dark pea gravel texture
 * Matches Reference Images 4 & 5 (Zen Gardens & Courtyard)
 */
export function getPebblesTexture(): THREE.CanvasTexture {
  if (textureCache.pebbles) return textureCache.pebbles;
  const c = getCanvas(1024, 1024);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Dark wet soil / gravel base
  ctx.fillStyle = "#16181b";
  ctx.fillRect(0, 0, 1024, 1024);

  // Dense rounded river stones
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const rx = 5 + Math.random() * 12;
    const ry = 4 + Math.random() * 10;
    const gray = 30 + Math.floor(Math.random() * 50);
    const highlight = Math.random() > 0.4;
    ctx.fillStyle = `rgb(${gray}, ${gray + 2}, ${gray + 5})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Specular top highlight
    if (highlight) {
      ctx.fillStyle = `rgba(180, 190, 205, ${0.15 + Math.random() * 0.25})`;
      ctx.beginPath();
      ctx.ellipse(x - rx * 0.2, y - ry * 0.2, rx * 0.4, ry * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = 8;
  textureCache.pebbles = tex;
  return tex;
}

/**
 * Animated/static water normal texture for architectural reflection pool
 */
export function getWaterTexture(): THREE.CanvasTexture {
  if (textureCache.water) return textureCache.water;
  const c = getCanvas(512, 512);
  if (!c) return new THREE.CanvasTexture({} as HTMLCanvasElement);
  const { canvas, ctx } = c;

  // Deep twilight water tone
  ctx.fillStyle = "#0c1524";
  ctx.fillRect(0, 0, 512, 512);

  // Soft wavy ripples
  for (let y = 0; y < 512; y += 4) {
    const alpha = 0.08 + Math.sin(y * 0.08) * 0.05;
    ctx.fillStyle = `rgba(160, 210, 255, ${alpha})`;
    ctx.fillRect(0, y, 512, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  textureCache.water = tex;
  return tex;
}
