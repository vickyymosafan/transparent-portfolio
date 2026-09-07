import * as THREE from "three";

export const moonState = {
  pos: new THREE.Vector3(3.4, 3.6, -14),
  scale: 1,
  intensity: 1,
};

export const mistState = {
  stream: 0,
  drift: 1,
};

export const cardCam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 100);

export const tmpColor = new THREE.Color();

export const REDUCED =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
