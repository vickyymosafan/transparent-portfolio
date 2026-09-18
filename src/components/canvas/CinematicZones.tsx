"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";
import { CourtyardZone } from "./zones/CourtyardZone";
import { LobbyZone } from "./zones/LobbyZone";
import { SkybridgeZone } from "./zones/SkybridgeZone";
import { GalleryZone } from "./zones/GalleryZone";
import { StudioZone } from "./zones/StudioZone";
import { RooftopZone } from "./zones/RooftopZone";

/**
 * Per-zone fog & ambient configuration.
 * Low densities preserve interior clarity while providing soft depth separation.
 */
const ZONE_FOG: { color: string; density: number; ambientColor: string; ambientIntensity: number }[] = [
  { color: "#141c2b", density: 0.003, ambientColor: "#607a9c", ambientIntensity: 1.6 },  // Zone 0: Courtyard Entry (twilight courtyard)
  { color: "#1c1a18", density: 0.0018, ambientColor: "#d8cca8", ambientIntensity: 2.0 }, // Zone 1: The Foyer (warm oak & travertine)
  { color: "#161e26", density: 0.0022, ambientColor: "#7e96ac", ambientIntensity: 1.6 }, // Zone 2: Garden Corridor (bamboo & basalt)
  { color: "#1e1d1b", density: 0.0014, ambientColor: "#e2dacb", ambientIntensity: 2.2 }, // Zone 3: Project Gallery (gallery white & terrazzo)
  { color: "#1a1918", density: 0.0018, ambientColor: "#cab89e", ambientIntensity: 1.9 }, // Zone 4: Developer Studio (focused walnut studio)
  { color: "#121926", density: 0.0026, ambientColor: "#687e9c", ambientIntensity: 1.8 }, // Zone 5: Rooftop Terrace (twilight sky)
];

const _fogColor = new THREE.Color();
const _blendColor = new THREE.Color();
const _nextAmbColor = new THREE.Color();

/**
 * Visibility controller: keeps active zone and adjacent transition zones visible
 * to eliminate geometry popping during camera progression.
 */
function ZoneVisibility({
  children,
  zoneIndex,
}: {
  children: React.ReactNode;
  zoneIndex: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = useWalkStore.getState().progress;

    let visible = false;
    if (zoneIndex === 0) {
      visible = progress < 0.28;
    } else if (zoneIndex === 1) {
      visible = progress < 0.46; // Visible from entrance approach to allow seamless interior look-through
    } else if (zoneIndex === 2) {
      visible = progress > 0.16 && progress < 0.62;
    } else if (zoneIndex === 3) {
      visible = progress > 0.42 && progress < 0.76;
    } else if (zoneIndex === 4) {
      visible = progress > 0.56 && progress < 0.90;
    } else {
      visible = progress > 0.72;
    }

    groupRef.current.visible = visible;
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Dynamic fog & ambient light controller.
 */
function ZoneAtmosphere() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const _ambColor = useRef(new THREE.Color());

  useFrame(({ scene }, delta) => {
    const dt = Math.min(delta, 0.05);
    const { zone, zoneProgress } = useWalkStore.getState();
    const cfg = ZONE_FOG[zone];
    const nextCfg = ZONE_FOG[Math.min(5, zone + 1)];

    // Blend factor near zone boundaries
    const blend = zoneProgress > 0.7 ? (zoneProgress - 0.7) / 0.3 : 0;

    // Fog
    const fog = scene.fog;
    if (fog instanceof THREE.FogExp2 && cfg) {
      _fogColor.set(cfg.color);
      if (blend > 0 && nextCfg) {
        _blendColor.set(nextCfg.color);
        _fogColor.lerp(_blendColor, blend);
      }
      fog.color.lerp(_fogColor, 1 - Math.exp(-3 * dt));

      const targetDensity = THREE.MathUtils.lerp(
        cfg.density,
        nextCfg?.density ?? cfg.density,
        blend
      );
      fog.density = THREE.MathUtils.damp(fog.density, targetDensity, 3, dt);
    }

    // Ambient light
    if (ambientRef.current && cfg) {
      _ambColor.current.set(cfg.ambientColor);
      if (blend > 0 && nextCfg) {
        _nextAmbColor.set(nextCfg.ambientColor);
        _ambColor.current.lerp(_nextAmbColor, blend);
      }
      ambientRef.current.color.lerp(_ambColor.current, 1 - Math.exp(-3 * dt));

      const targetIntensity = THREE.MathUtils.lerp(
        cfg.ambientIntensity,
        nextCfg?.ambientIntensity ?? cfg.ambientIntensity,
        blend
      );
      ambientRef.current.intensity = THREE.MathUtils.damp(
        ambientRef.current.intensity,
        targetIntensity,
        3,
        dt
      );
    }
  });

  return <ambientLight ref={ambientRef} color="#607a9c" intensity={1.6} />;
}

/**
 * CinematicZones — Master orchestrator for the 6 architectural zones.
 */
export function CinematicZones() {
  return (
    <group>
      <ZoneAtmosphere />

      {/* Global directional moonlight with soft shadow map */}
      <directionalLight
        position={[14, 28, 18]}
        color="#dae6f8"
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      />

      {/* Zone 0: Courtyard Entry (outdoor pavilion & reflection pool) */}
      <ZoneVisibility zoneIndex={0}>
        <CourtyardZone />
      </ZoneVisibility>

      {/* Zone 1: The Foyer (interior oak & travertine with floating stairs) */}
      <ZoneVisibility zoneIndex={1}>
        <LobbyZone />
      </ZoneVisibility>

      {/* Zone 2: Garden Corridor (glass breezeway & bamboo courtyards) */}
      <ZoneVisibility zoneIndex={2}>
        <SkybridgeZone />
      </ZoneVisibility>

      {/* Zone 3: Project Gallery (exhibition of production projects) */}
      <ZoneVisibility zoneIndex={3}>
        <GalleryZone />
      </ZoneVisibility>

      {/* Zone 4: Developer Studio (solid walnut workstation & triple monitors) */}
      <ZoneVisibility zoneIndex={4}>
        <StudioZone />
      </ZoneVisibility>

      {/* Zone 5: Rooftop Terrace (open-air teak sky lounge & fire table) */}
      <ZoneVisibility zoneIndex={5}>
        <RooftopZone />
      </ZoneVisibility>
    </group>
  );
}
