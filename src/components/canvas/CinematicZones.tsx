"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";
import { CityGenerator } from "./CityGenerator";
import { LobbyZone } from "./zones/LobbyZone";
import { SkybridgeZone } from "./zones/SkybridgeZone";
import { ServerRoomZone } from "./zones/ServerRoomZone";
import { GalleryZone } from "./zones/GalleryZone";
import { RooftopZone } from "./zones/RooftopZone";

/**
 * Per-zone fog & ambient configuration.
 * Fog densities are kept LOW so interiors stay visible.
 */
const ZONE_FOG: { color: string; density: number; ambientColor: string; ambientIntensity: number }[] = [
  { color: "#05070a", density: 0.018, ambientColor: "#1a2233", ambientIntensity: 0.6 },   // Zone 0: City
  { color: "#0e1218", density: 0.012, ambientColor: "#2a2030", ambientIntensity: 1.2 },   // Zone 1: Lobby — warm
  { color: "#0a1020", density: 0.010, ambientColor: "#1a2540", ambientIntensity: 0.9 },   // Zone 2: Skybridge
  { color: "#040610", density: 0.015, ambientColor: "#0a1530", ambientIntensity: 0.5 },   // Zone 3: Server — dark mood
  { color: "#1a1816", density: 0.008, ambientColor: "#f5f0e8", ambientIntensity: 1.8 },   // Zone 4: Gallery — bright!
  { color: "#060a14", density: 0.006, ambientColor: "#2a3550", ambientIntensity: 1.0 },   // Zone 5: Rooftop — clear sky
];

const _fogColor = new THREE.Color();
const _blendColor = new THREE.Color();

/**
 * Visibility controller: shows zone group only when camera is nearby.
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
    const currentZone = useWalkStore.getState().zone;
    const distance = Math.abs(currentZone - zoneIndex);
    groupRef.current.visible = distance <= 1;
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
        _ambColor.current.lerp(new THREE.Color(nextCfg.ambientColor), blend);
      }
      ambientRef.current.color.lerp(_ambColor.current, 1 - Math.exp(-3 * dt));

      const targetIntensity = THREE.MathUtils.lerp(
        cfg.ambientIntensity,
        nextCfg?.ambientIntensity ?? cfg.ambientIntensity,
        blend
      );
      ambientRef.current.intensity = THREE.MathUtils.damp(
        ambientRef.current.intensity, targetIntensity, 3, dt
      );
    }
  });

  return <ambientLight ref={ambientRef} color="#1a2233" intensity={0.6} />;
}

/**
 * CinematicZones — Master orchestrator for the 6-zone cinematic walkthrough.
 */
export function CinematicZones() {
  return (
    <group>
      <ZoneAtmosphere />

      {/* Global directional light (moonlight / sky fill) */}
      <directionalLight
        position={[5, 15, 10]}
        color="#3a4a6a"
        intensity={0.4}
      />

      {/* Zone 0: City Approach (outdoor) */}
      <ZoneVisibility zoneIndex={0}>
        <CityGenerator />
      </ZoneVisibility>

      {/* Zone 1: Building Lobby (interior) */}
      <ZoneVisibility zoneIndex={1}>
        <LobbyZone />
      </ZoneVisibility>

      {/* Zone 2: Glass Skybridge (elevated) */}
      <ZoneVisibility zoneIndex={2}>
        <SkybridgeZone />
      </ZoneVisibility>

      {/* Zone 3: Server / Data Room (dark) */}
      <ZoneVisibility zoneIndex={3}>
        <ServerRoomZone />
      </ZoneVisibility>

      {/* Zone 4: Exhibition Gallery (bright) */}
      <ZoneVisibility zoneIndex={4}>
        <GalleryZone />
      </ZoneVisibility>

      {/* Zone 5: Rooftop Finale (outdoor) */}
      <ZoneVisibility zoneIndex={5}>
        <RooftopZone />
      </ZoneVisibility>
    </group>
  );
}
