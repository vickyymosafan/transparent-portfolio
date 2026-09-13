import * as THREE from "three";

const COLS = 3;
const ROWS = 11;
const WIN_W = 20;
const WIN_H = 12;
const PAD_X = 12;
const PAD_Y = 14;
const STEP_X = 36;
const STEP_Y = 22;

export function buildTowerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  g.fillStyle = "#05080c";
  g.fillRect(0, 0, 128, 256);

  g.strokeStyle = "rgba(10, 16, 22, 0.9)";
  for (let x = 0; x <= 128; x += 32) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 256);
    g.stroke();
  }

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const wx = PAD_X + col * STEP_X;
      const wy = PAD_Y + row * STEP_Y;
      const roll = Math.random();
      const lit = roll < 0.34;

      if (lit) {
        g.fillStyle = roll < 0.1 ? "#ffd7b0" : "#f2ede4";
        g.fillRect(wx, wy, WIN_W, WIN_H);
        g.fillStyle = "rgba(255, 215, 176, 0.12)";
        g.fillRect(wx - 2, wy - 2, WIN_W + 4, WIN_H + 4);
      } else {
        g.fillStyle = "#0a0f16";
        g.fillRect(wx, wy, WIN_W, WIN_H);
      }

      // Recessed window depth: shadow top, faint highlight bottom, side shade.
      g.fillStyle = "rgba(0, 0, 0, 0.55)";
      g.fillRect(wx, wy, WIN_W, 2);
      g.fillStyle = "rgba(255, 255, 255, 0.08)";
      g.fillRect(wx, wy + WIN_H - 2, WIN_W, 2);
      g.fillStyle = "rgba(0, 0, 0, 0.3)";
      g.fillRect(wx, wy, 2, WIN_H);
    }
  }

  // Vertical AO — darker toward the base grounds the facade.
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

export function buildTowerNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const g = canvas.getContext("2d");
  if (!g) return new THREE.CanvasTexture(canvas);

  // Flat surface encodes as (128, 128, 255).
  g.fillStyle = "#8080ff";
  g.fillRect(0, 0, 128, 256);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const wx = PAD_X + col * STEP_X;
      const wy = PAD_Y + row * STEP_Y;

      g.fillStyle = "#6a6ad0";
      g.fillRect(wx, wy, WIN_W, WIN_H);
      g.fillStyle = "#3c3c8a";
      g.fillRect(wx, wy, WIN_W, 3);
      g.fillStyle = "#9c9cff";
      g.fillRect(wx, wy + WIN_H - 2, WIN_W, 2);
      g.fillStyle = "#5454a8";
      g.fillRect(wx, wy, 2, WIN_H);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}
