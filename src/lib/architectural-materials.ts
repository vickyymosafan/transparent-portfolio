"use client";

import * as THREE from "three";
import {
  getBoardFormedConcreteTexture,
  getTravertineTexture,
  getWoodPlankTexture,
  getBasaltTexture,
  getNeroMarquinaTexture,
  getTerrazzoTexture,
  getPebblesTexture,
  getWaterTexture,
} from "./architectural-textures";

/**
 * UNIFIED ARCHITECTURAL MATERIAL SYSTEM
 * Physically based, memoized material library matching the 5 reference photographs.
 * Guaranteed zero recreation inside useFrame or render cycles.
 */

// ─── 1. CONCRETE & STONE ───
let _concreteMat: THREE.MeshStandardMaterial | null = null;
export function getBoardFormedConcreteMat(): THREE.MeshStandardMaterial {
  if (!_concreteMat) {
    const tex = getBoardFormedConcreteTexture();
    _concreteMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: "#888e96",
      roughness: 0.82,
      metalness: 0.06,
    });
  }
  return _concreteMat;
}

let _darkConcreteMat: THREE.MeshStandardMaterial | null = null;
export function getDarkConcreteMat(): THREE.MeshStandardMaterial {
  if (!_darkConcreteMat) {
    const tex = getBoardFormedConcreteTexture();
    _darkConcreteMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: "#35383f",
      roughness: 0.85,
      metalness: 0.1,
    });
  }
  return _darkConcreteMat;
}

let _travertineMat: THREE.MeshStandardMaterial | null = null;
export function getTravertineMat(): THREE.MeshStandardMaterial {
  if (!_travertineMat) {
    const tex = getTravertineTexture();
    _travertineMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.68,
      metalness: 0.04,
    });
  }
  return _travertineMat;
}

let _honedBasaltMat: THREE.MeshStandardMaterial | null = null;
export function getHonedBasaltMat(): THREE.MeshStandardMaterial {
  if (!_honedBasaltMat) {
    const tex = getBasaltTexture();
    _honedBasaltMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: "#282a30",
      roughness: 0.38, // Satin honed basalt with soft specular highlights
      metalness: 0.22,
    });
  }
  return _honedBasaltMat;
}

let _terrazzoFloorMat: THREE.MeshStandardMaterial | null = null;
export function getTerrazzoFloorMat(): THREE.MeshStandardMaterial {
  if (!_terrazzoFloorMat) {
    const tex = getTerrazzoTexture();
    _terrazzoFloorMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: "#22252b",
      roughness: 0.16, // High gloss polished gallery floor
      metalness: 0.36,
    });
  }
  return _terrazzoFloorMat;
}

let _neroMarquinaMat: THREE.MeshStandardMaterial | null = null;
export function getNeroMarquinaMat(): THREE.MeshStandardMaterial {
  if (!_neroMarquinaMat) {
    const tex = getNeroMarquinaTexture();
    _neroMarquinaMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.2, // Polished black marble with soft reflections
      metalness: 0.35,
    });
  }
  return _neroMarquinaMat;
}

// ─── 2. TIMBER & WOODWORK ───
let _darkWalnutMat: THREE.MeshStandardMaterial | null = null;
export function getDarkWalnutMat(): THREE.MeshStandardMaterial {
  if (!_darkWalnutMat) {
    const tex = getWoodPlankTexture("walnut");
    _darkWalnutMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: "#3a251a",
      roughness: 0.52,
      metalness: 0.04,
    });
  }
  return _darkWalnutMat;
}

let _europeanOakMat: THREE.MeshStandardMaterial | null = null;
export function getEuropeanOakMat(): THREE.MeshStandardMaterial {
  if (!_europeanOakMat) {
    const tex = getWoodPlankTexture("oak");
    _europeanOakMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.44, // Smooth satin oak sheen
      metalness: 0.06,
    });
  }
  return _europeanOakMat;
}

let _teakDeckMat: THREE.MeshStandardMaterial | null = null;
export function getTeakDeckMat(): THREE.MeshStandardMaterial {
  if (!_teakDeckMat) {
    const tex = getWoodPlankTexture("teak");
    _teakDeckMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.5, // Natural outdoor teak deck finish
      metalness: 0.05,
    });
  }
  return _teakDeckMat;
}

// ─── 3. METALS & GLASS ───
export const matteBlackMetalMat = new THREE.MeshStandardMaterial({
  color: "#16181b",
  roughness: 0.3,
  metalness: 0.88,
});

export const architecturalGlassMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: 0.22,
  roughness: 0.03,
  metalness: 0.94,
  side: THREE.DoubleSide,
});

export const brushedBrassMat = new THREE.MeshStandardMaterial({
  color: "#c29d50",
  roughness: 0.32,
  metalness: 0.84,
});

// ─── 4. LIGHTING & EMISSIVES ───
/** Continuous 2800K architectural warm cove light / edge runner */
export const warmCoveLedMat = new THREE.MeshStandardMaterial({
  color: "#fff8ec",
  emissive: new THREE.Color("#ffdca0"),
  emissiveIntensity: 5.0,
  toneMapped: false,
});

/** Subtle warm downlight source */
export const warmDownlightMat = new THREE.MeshStandardMaterial({
  color: "#fff8eb",
  emissive: new THREE.Color("#ffcca0"),
  emissiveIntensity: 4.2,
  toneMapped: false,
});

/** Warm interior ambient fill for background glass windows */
export const interiorWarmFillMat = new THREE.MeshStandardMaterial({
  color: "#ecd8b8",
  emissive: new THREE.Color("#8a6840"),
  emissiveIntensity: 0.65,
  roughness: 0.85,
});

// ─── 5. LANDSCAPE & NATURE ───
let _pebblesMat: THREE.MeshStandardMaterial | null = null;
export function getPebblesMat(): THREE.MeshStandardMaterial {
  if (!_pebblesMat) {
    const tex = getPebblesTexture();
    _pebblesMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.85,
      metalness: 0.16,
    });
  }
  return _pebblesMat;
}

let _poolWaterMat: THREE.MeshStandardMaterial | null = null;
export function getPoolWaterMat(): THREE.MeshStandardMaterial {
  if (!_poolWaterMat) {
    const tex = getWaterTexture();
    _poolWaterMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: "#0a1828",
      roughness: 0.04,
      metalness: 0.75,
      transparent: true,
      opacity: 0.94,
    });
  }
  return _poolWaterMat;
}

export const pineTrunkMat = new THREE.MeshStandardMaterial({
  color: "#35261c",
  roughness: 0.9,
  metalness: 0.04,
});

export const cloudPineFoliageMat = new THREE.MeshStandardMaterial({
  color: "#1a361e",
  roughness: 0.82,
  metalness: 0.04,
});

export const bambooStalkMat = new THREE.MeshStandardMaterial({
  color: "#52753e",
  roughness: 0.52,
  metalness: 0.06,
});

export const bambooLeafMat = new THREE.MeshStandardMaterial({
  color: "#274e20",
  roughness: 0.72,
  metalness: 0.04,
});
