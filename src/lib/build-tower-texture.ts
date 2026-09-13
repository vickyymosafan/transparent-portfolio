import * as THREE from "three";

const TEX_W = 512;
const TEX_H = 1024;
const COLS = 12;
const ROWS = 48;
const PAD_X = 14;
const PAD_Y = 16;
const STEP_X = 40;
const STEP_Y = 21;
const WIN_W = 24;
const WIN_H = 12;

function getWindowState(row: number, col: number) {
  const hash = Math.sin(row * 23.41 + col * 67.89) * 43758.5453;
  const rand = hash - Math.floor(hash);
  const isLit = rand < 0.38;

  const toneHash = Math.sin(col * 41.17 + row * 83.43) * 12345.67;
  const toneRand = toneHash - Math.floor(toneHash);
  const tone =
    toneRand < 0.42
      ? "#ffe8b8" // warm golden incandescent
      : toneRand < 0.78
      ? "#d8eeff" // cool corporate fluorescent
      : "#ffcf94"; // amber executive office

  const hasBlinds = (rand * 100) % 1 > 0.6;
  const blindLevel = Math.floor(((rand * 10) % 1) * 3);
  return { isLit, tone, hasBlinds, blindLevel };
}

export function buildTowerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  // Deep architectural titanium/slate facade
  g.fillStyle = "#151b24";
  g.fillRect(0, 0, TEX_W, TEX_H);

  // Vertical structural mullion columns
  g.fillStyle = "#1c2430";
  for (let x = 0; x < TEX_W; x += STEP_X) {
    g.fillRect(x, 0, 8, TEX_H);
    // Bevel highlight
    g.fillStyle = "#273242";
    g.fillRect(x, 0, 1.5, TEX_H);
    g.fillStyle = "#1c2430";
  }

  // Horizontal floor spandrels
  g.fillStyle = "#18202b";
  for (let y = 0; y < TEX_H; y += STEP_Y) {
    g.fillRect(0, y + WIN_H + 2, TEX_W, STEP_Y - WIN_H - 2);
    // Spandrel metal trim line
    g.fillStyle = "#2c384a";
    g.fillRect(0, y + WIN_H + 2, TEX_W, 1.5);
    g.fillStyle = "#18202b";
  }

  // Windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const wx = PAD_X + col * STEP_X;
      const wy = PAD_Y + row * STEP_Y;
      const { isLit, tone, hasBlinds, blindLevel } = getWindowState(row, col);

      // Dark recessed window frame
      g.fillStyle = "#0a0e14";
      g.fillRect(wx - 2, wy - 2, WIN_W + 4, WIN_H + 4);

      if (isLit) {
        g.fillStyle = tone;
        g.fillRect(wx, wy, WIN_W, WIN_H);

        // Interior depth / ceiling gradient
        g.fillStyle = "rgba(0, 0, 0, 0.3)";
        g.fillRect(wx, wy, WIN_W, 3);

        // Window blinds
        if (hasBlinds) {
          g.fillStyle = "rgba(0, 0, 0, 0.65)";
          const blindH = Math.min(WIN_H - 2, 3 + blindLevel * 2.5);
          g.fillRect(wx, wy, WIN_W, blindH);
        }
      } else {
        // Dark reflective glass
        g.fillStyle = "#0c121a";
        g.fillRect(wx, wy, WIN_W, WIN_H);

        // Subtle diagonal sky reflection
        g.fillStyle = "rgba(80, 110, 145, 0.15)";
        g.fillRect(wx + 1, wy + 1, WIN_W - 2, (WIN_H - 2) / 2);
      }

      // Top and left shadow inside frame
      g.fillStyle = "rgba(0, 0, 0, 0.65)";
      g.fillRect(wx, wy, WIN_W, 1.5);
      g.fillRect(wx, wy, 1.5, WIN_H);

      // Bottom sill highlight
      g.fillStyle = "rgba(255, 255, 255, 0.14)";
      g.fillRect(wx, wy + WIN_H - 1, WIN_W, 1);
    }
  }

  // Vertical AO gradient
  const grad = g.createLinearGradient(0, 0, 0, TEX_H);
  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.8, "rgba(0, 0, 0, 0.05)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  g.fillStyle = grad;
  g.fillRect(0, 0, TEX_W, TEX_H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function buildTowerEmissiveMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  // Pure black base: walls do NOT glow
  g.fillStyle = "#000000";
  g.fillRect(0, 0, TEX_W, TEX_H);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const wx = PAD_X + col * STEP_X;
      const wy = PAD_Y + row * STEP_Y;
      const { isLit, tone, hasBlinds, blindLevel } = getWindowState(row, col);

      if (isLit) {
        g.fillStyle = tone;
        g.fillRect(wx, wy, WIN_W, WIN_H);

        // Ceiling shadow inside room
        g.fillStyle = "rgba(0, 0, 0, 0.4)";
        g.fillRect(wx, wy, WIN_W, 3);

        if (hasBlinds) {
          g.fillStyle = "rgba(0, 0, 0, 0.8)";
          const blindH = Math.min(WIN_H - 2, 3 + blindLevel * 2.5);
          g.fillRect(wx, wy, WIN_W, blindH);
        }
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function buildTowerNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  // Flat normal vector: (128, 128, 255)
  g.fillStyle = "#8080ff";
  g.fillRect(0, 0, TEX_W, TEX_H);

  // Vertical structural column seams (indent groove)
  for (let x = 0; x < TEX_W; x += STEP_X) {
    g.fillStyle = "#5555ba";
    g.fillRect(x, 0, 2, TEX_H);
    g.fillStyle = "#aaaafe";
    g.fillRect(x + 2, 0, 2, TEX_H);
  }

  // Horizontal floor spandrel relief
  for (let y = 0; y < TEX_H; y += STEP_Y) {
    g.fillStyle = "#4444a0";
    g.fillRect(0, y + WIN_H + 2, TEX_W, 2);
    g.fillStyle = "#b5b5ff";
    g.fillRect(0, y + WIN_H + 4, TEX_W, 2);
  }

  // Windows deep recessed bevels
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const wx = PAD_X + col * STEP_X;
      const wy = PAD_Y + row * STEP_Y;

      // Recessed glass bed
      g.fillStyle = "#6d6dd5";
      g.fillRect(wx, wy, WIN_W, WIN_H);

      // Top bevel (slopes down)
      g.fillStyle = "#303080";
      g.fillRect(wx, wy, WIN_W, 2.5);

      // Bottom bevel (slopes up)
      g.fillStyle = "#b8b8ff";
      g.fillRect(wx, wy + WIN_H - 2.5, WIN_W, 2.5);

      // Left bevel
      g.fillStyle = "#4444a0";
      g.fillRect(wx, wy, 2.5, WIN_H);

      // Right bevel
      g.fillStyle = "#a8a8ff";
      g.fillRect(wx + WIN_W - 2.5, wy, 2.5, WIN_H);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function buildTowerRoughnessMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  // Facade panels: high roughness (0.76 -> ~195 gray)
  g.fillStyle = "#c3c3c3";
  g.fillRect(0, 0, TEX_W, TEX_H);

  // Concrete columns and spandrels: slightly rougher (0.84 -> ~215 gray)
  g.fillStyle = "#d8d8d8";
  for (let x = 0; x < TEX_W; x += STEP_X) {
    g.fillRect(x, 0, 8, TEX_H);
  }
  for (let y = 0; y < TEX_H; y += STEP_Y) {
    g.fillRect(0, y + WIN_H + 2, TEX_W, STEP_Y - WIN_H - 2);
  }

  // Window glass: highly smooth, glossy (0.12 -> ~30 gray)
  g.fillStyle = "#1e1e1e";
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const wx = PAD_X + col * STEP_X;
      const wy = PAD_Y + row * STEP_Y;
      g.fillRect(wx, wy, WIN_W, WIN_H);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

const ROAD_W = 512;
const ROAD_H = 2048;
const Z_MIN = -27;
const Z_MAX = 27;
const Z_SPAN = Z_MAX - Z_MIN;
const DISTRICT_Z = [-12.5, -7.5, -2.5, 2.5, 7.5, 12.5];

function zToY(z: number): number {
  return Math.round(((z - Z_MIN) / Z_SPAN) * ROAD_H);
}

export function buildRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = ROAD_W;
  canvas.height = ROAD_H;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  // 1. Dark wet asphalt base
  g.fillStyle = "#090d13";
  g.fillRect(0, 0, ROAD_W, ROAD_H);

  // Subtle asphalt grain
  for (let i = 0; i < 4000; i++) {
    const gx = Math.random() * ROAD_W;
    const gy = Math.random() * ROAD_H;
    g.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.15)";
    g.fillRect(gx, gy, 2, 2);
  }

  // 2. Darker wet tire ruts (reflective water accumulation)
  g.fillStyle = "#06080d";
  g.fillRect(115, 0, 95, ROAD_H);
  g.fillRect(302, 0, 95, ROAD_H);

  // 3. Solid white edge boundary lines
  g.fillStyle = "#a8bacb";
  g.fillRect(32, 0, 8, ROAD_H);
  g.fillRect(472, 0, 8, ROAD_H);

  // Zebra cross zones along Y
  const crosswalkZones = DISTRICT_Z.map((dz) => {
    const cy = zToY(dz);
    return { top: cy - 42, bottom: cy + 42 };
  });

  function inCrosswalk(y: number): boolean {
    return crosswalkZones.some((z) => y >= z.top - 20 && y <= z.bottom + 20);
  }

  // 4. Center dashed yellow line
  const dashLen = 38;
  const gapLen = 32;
  const step = dashLen + gapLen;
  for (let y = 10; y < ROAD_H; y += step) {
    if (!inCrosswalk(y)) {
      g.fillStyle = "#ffca36";
      g.fillRect(ROAD_W / 2 - 5, y, 10, dashLen);
    }
  }

  // 5. District Pedestrian Zebra Crossings & Stop Lines
  DISTRICT_Z.forEach((dz) => {
    const cy = zToY(dz);

    // Solid stop lines ahead of crosswalk
    g.fillStyle = "#cbd8e8";
    g.fillRect(48, cy - 54, ROAD_W - 96, 7);
    g.fillRect(48, cy + 48, ROAD_W - 96, 7);

    // Zebra crossing stripes (10 stripes across the street)
    const stripeCount = 10;
    const stripeW = 24;
    const stripeGap = 16;
    const totalW = stripeCount * stripeW + (stripeCount - 1) * stripeGap;
    const startX = (ROAD_W - totalW) / 2;

    for (let s = 0; s < stripeCount; s++) {
      const sx = startX + s * (stripeW + stripeGap);
      g.fillStyle = "#e4edf7";
      g.fillRect(sx, cy - 36, stripeW, 72);

      // Subtle asphalt abrasion inside stripes
      g.fillStyle = "rgba(10, 14, 20, 0.12)";
      g.fillRect(sx + 3, cy - 25, stripeW - 6, 15);
      g.fillRect(sx + 3, cy + 10, stripeW - 6, 15);
    }
  });

  // 6. Storm drain grates along curbs
  g.fillStyle = "#121720";
  for (let y = 60; y < ROAD_H; y += 180) {
    g.fillRect(44, y, 20, 36);
    g.fillRect(448, y, 20, 36);

    g.fillStyle = "#040609";
    for (let s = 0; s < 5; s++) {
      g.fillRect(47, y + 4 + s * 6, 14, 3);
      g.fillRect(451, y + 4 + s * 6, 14, 3);
    }
    g.fillStyle = "#121720";
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function buildRoadRoughnessMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = ROAD_W;
  canvas.height = ROAD_H;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  // Standard asphalt: matte roughness (~160 -> 0.62)
  g.fillStyle = "#a0a0a0";
  g.fillRect(0, 0, ROAD_W, ROAD_H);

  // Wet puddles / wheel ruts: very smooth & reflective (~35 -> 0.14)
  g.fillStyle = "#242424";
  g.fillRect(115, 0, 95, ROAD_H);
  g.fillRect(302, 0, 95, ROAD_H);

  // Painted road markings (smooth reflective paint: ~65 -> 0.25)
  g.fillStyle = "#424242";
  g.fillRect(32, 0, 8, ROAD_H);
  g.fillRect(472, 0, 8, ROAD_H);

  // Zebra stripes
  DISTRICT_Z.forEach((dz) => {
    const cy = zToY(dz);
    g.fillRect(48, cy - 54, ROAD_W - 96, 7);
    g.fillRect(48, cy + 48, ROAD_W - 96, 7);

    const stripeCount = 10;
    const stripeW = 24;
    const stripeGap = 16;
    const totalW = stripeCount * stripeW + (stripeCount - 1) * stripeGap;
    const startX = (ROAD_W - totalW) / 2;

    for (let s = 0; s < stripeCount; s++) {
      const sx = startX + s * (stripeW + stripeGap);
      g.fillRect(sx, cy - 36, stripeW, 72);
    }
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

// ═══════════════════════════════════════════════════════════════
// INTERIOR ZONE TEXTURES
// ═══════════════════════════════════════════════════════════════

/** Dark marble tile floor for the lobby zone */
export function buildTileFloorTexture(): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  g.fillStyle = "#0e1218";
  g.fillRect(0, 0, S, S);

  const tileSize = 64;
  for (let ty = 0; ty < S; ty += tileSize) {
    for (let tx = 0; tx < S; tx += tileSize) {
      const hash = Math.sin(tx * 13.7 + ty * 27.3) * 43758.5;
      const v = 14 + (hash - Math.floor(hash)) * 12;
      g.fillStyle = `rgb(${v}, ${v + 2}, ${v + 5})`;
      g.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);

      // Subtle marble veining
      g.strokeStyle = `rgba(255,255,255,${0.02 + (hash % 1) * 0.03})`;
      g.lineWidth = 0.5;
      g.beginPath();
      g.moveTo(tx + 5, ty + tileSize * 0.3);
      g.quadraticCurveTo(tx + tileSize * 0.5, ty + tileSize * 0.6, tx + tileSize - 5, ty + tileSize * 0.4);
      g.stroke();
    }
    // Grout lines
    g.fillStyle = "#060810";
    g.fillRect(0, ty, S, 1);
  }
  for (let tx = 0; tx < S; tx += tileSize) {
    g.fillStyle = "#060810";
    g.fillRect(tx, 0, 1, S);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Server rack front panel with LED indicators and vent holes */
export function buildServerRackTexture(): THREE.CanvasTexture {
  const W = 256, H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  g.fillStyle = "#08090c";
  g.fillRect(0, 0, W, H);

  const unitH = H / 21;
  for (let u = 0; u < 21; u++) {
    const uy = u * unitH;
    g.fillStyle = "#0e1116";
    g.fillRect(4, uy + 1, W - 8, unitH - 2);
    g.fillStyle = "#040608";
    for (let vx = 12; vx < W - 12; vx += 8) {
      g.fillRect(vx, uy + unitH * 0.3, 3, 2);
      g.fillRect(vx, uy + unitH * 0.6, 3, 2);
    }
    const hash = Math.sin(u * 47.3) * 12345.6;
    const r = hash - Math.floor(hash);
    if (r < 0.7) {
      g.fillStyle = r < 0.3 ? "#00ff55" : r < 0.5 ? "#00ccff" : "#ff4400";
      g.fillRect(8, uy + unitH * 0.4, 3, 3);
      if (r < 0.4) g.fillRect(14, uy + unitH * 0.4, 3, 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Clean gallery wall with subtle grain */
export function buildGalleryWallTexture(): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  g.fillStyle = "#e8e4df";
  g.fillRect(0, 0, S, S);

  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    g.fillStyle = Math.random() < 0.5 ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";
    g.fillRect(x, y, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Metal grid raised-access floor for server room */
export function buildMetalGridFloorTexture(): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  g.fillStyle = "#0a0d12";
  g.fillRect(0, 0, S, S);

  const gridSize = 32;
  for (let y = 0; y < S; y += gridSize) {
    for (let x = 0; x < S; x += gridSize) {
      g.fillStyle = "#12161d";
      g.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
      g.fillStyle = "#060810";
      for (let hx = x + 6; hx < x + gridSize - 4; hx += 6) {
        for (let hy = y + 6; hy < y + gridSize - 4; hy += 6) {
          g.beginPath();
          g.arc(hx, hy, 1.5, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.fillStyle = "rgba(255,255,255,0.06)";
      g.fillRect(x + 2, y + 2, gridSize - 4, 1);
      g.fillRect(x + 2, y + 2, 1, gridSize - 4);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Weathered concrete rooftop surface */
export function buildRooftopTexture(): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  g.fillStyle = "#1a1e24";
  g.fillRect(0, 0, S, S);

  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const v = 26 + Math.random() * 14;
    g.fillStyle = `rgba(${v}, ${v}, ${v + 3}, 0.3)`;
    g.fillRect(x, y, 2 + Math.random() * 3, 1 + Math.random() * 2);
  }

  for (let i = 0; i < 8; i++) {
    const cx = Math.random() * S;
    const cy = Math.random() * S;
    const r = 15 + Math.random() * 30;
    const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, "rgba(10, 14, 20, 0.2)");
    grad.addColorStop(1, "rgba(10, 14, 20, 0)");
    g.fillStyle = grad;
    g.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  g.fillStyle = "#0e1116";
  g.fillRect(S / 2 - 1, 0, 2, S);
  g.fillRect(0, S / 2 - 1, S, 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
