import * as THREE from "three";

const WAYPOINTS = [
  new THREE.Vector3(0, 1.6, -15),
  new THREE.Vector3(0, 1.6, -10),
  new THREE.Vector3(0, 1.6, -5),
  new THREE.Vector3(0, 1.6, 0),
  new THREE.Vector3(0, 1.6, 5),
  new THREE.Vector3(0, 1.6, 10),
  new THREE.Vector3(0, 1.6, 15),
];

export const cityPath = new THREE.CatmullRomCurve3(WAYPOINTS);
