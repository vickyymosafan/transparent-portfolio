/**
 * Adaptive Hardware Quality Tier Detection
 * Balances visual archviz fidelity with rock-solid framerate across devices.
 */

export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  tier: QualityTier;
  dpr: number;
  shadows: boolean;
  shadowMapSize: number;
  bloom: boolean;
  vegetationDensity: number;
  maxDrawDistance: number;
  isMobile: boolean;
}

export function detectQualityTier(): QualitySettings {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      tier: "high",
      dpr: 1.5,
      shadows: true,
      shadowMapSize: 1024,
      bloom: true,
      vegetationDensity: 1.0,
      maxDrawDistance: 80,
      isMobile: false,
    };
  }

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768;

  const isTablet = !isMobile && window.innerWidth < 1024;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

  let tier: QualityTier = "high";

  if (isMobile || cores <= 2 || memory <= 2) {
    tier = "low";
  } else if (isTablet || cores <= 4 || memory <= 4) {
    tier = "medium";
  }

  switch (tier) {
    case "low":
      return {
        tier: "low",
        dpr: 1.0,
        shadows: false,
        shadowMapSize: 256,
        bloom: false,
        vegetationDensity: 0.35,
        maxDrawDistance: 45,
        isMobile: true,
      };
    case "medium":
      return {
        tier: "medium",
        dpr: Math.min(window.devicePixelRatio || 1, 1.25),
        shadows: true,
        shadowMapSize: 512,
        bloom: true,
        vegetationDensity: 0.7,
        maxDrawDistance: 65,
        isMobile: isTablet,
      };
    case "high":
    default:
      return {
        tier: "high",
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        shadows: true,
        shadowMapSize: 1024,
        bloom: true,
        vegetationDensity: 1.0,
        maxDrawDistance: 90,
        isMobile: false,
      };
  }
}
