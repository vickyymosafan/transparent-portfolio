import * as THREE from "three";

export const moonState = {
  pos: new THREE.Vector3(-3.2, 3.8, -14),
  scale: 1,
  intensity: 1,
};

export const emberState = {
  energy: 0,
};

export const cardCam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 100);

export const tmpColor = new THREE.Color();

export const REDUCED =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
