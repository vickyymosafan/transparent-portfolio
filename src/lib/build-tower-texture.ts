import * as THREE from "three";

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
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 3; col++) {
      const wx = 12 + col * 36;
      const wy = 14 + row * 22;
      const roll = Math.random();
      if (roll < 0.34) {
        g.fillStyle = roll < 0.1 ? "#ffd7b0" : "#f2ede4";
      } else {
        g.fillStyle = "#0a0f16";
      }
      g.fillRect(wx, wy, 20, 12);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}
