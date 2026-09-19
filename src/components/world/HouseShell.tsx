"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore } from "@/lib/walk-store";
import { CourtyardZone } from "../canvas/zones/CourtyardZone";
import { LobbyZone } from "../canvas/zones/LobbyZone";
import { SkybridgeZone } from "../canvas/zones/SkybridgeZone";
import { GalleryZone } from "../canvas/zones/GalleryZone";
import { StudioZone } from "../canvas/zones/StudioZone";
import { RooftopZone } from "../canvas/zones/RooftopZone";

/**
 * Continuous Architectural Residence Shell.
 * Houses all 6 physical zones connected seamlessly along the Z axis (Z: 21.0 to Z: -65.0).
 * Employs distance-aware zone visibility to sustain locked 60fps.
 */

// Per-zone atmosphere lighting profiles
const ZONE_ATMOSPHERE = [
  { fogColor: "#141c2b", fogDensity: 0.003, ambientColor: "#607a9c", ambientIntensity: 1.5 },  // Zone 0: Courtyard Blue Hour
  { fogColor: "#1c1a18", fogDensity: 0.0018, ambientColor: "#d8cca8", ambientIntensity: 2.1 }, // Zone 1: The Foyer Warm Oak
  { fogColor: "#161e26", fogDensity: 0.0022, ambientColor: "#7e96ac", ambientIntensity: 1.7 }, // Zone 2: Garden Breezeway
  { fogColor: "#1e1d1b", fogDensity: 0.0014, ambientColor: "#e2dacb", ambientIntensity: 2.2 }, // Zone 3: Project Gallery
  { fogColor: "#1a1918", fogDensity: 0.0018, ambientColor: "#cab89e", ambientIntensity: 1.9 }, // Zone 4: Developer Studio
  { fogColor: "#121926", fogDensity: 0.0026, ambientColor: "#687e9c", ambientIntensity: 1.8 }, // Zone 5: Rooftop Dusk Sky
];

const _fogColor = new THREE.Color();
const _ambColor = new THREE.Color();

function DynamicAtmosphere() {
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame(({ scene }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { currentZone } = useWalkStore.getState();
    const cfg = ZONE_ATMOSPHERE[currentZone] || ZONE_ATMOSPHERE[0];

    // Smooth fog transition
    if (scene.fog instanceof THREE.FogExp2) {
      _fogColor.set(cfg.fogColor);
      scene.fog.color.lerp(_fogColor, 2.5 * delta);
      scene.fog.density = THREE.MathUtils.damp(scene.fog.density, cfg.fogDensity, 2.5, delta);
    }

    // Smooth ambient light transition
    if (ambientRef.current) {
      _ambColor.set(cfg.ambientColor);
      ambientRef.current.color.lerp(_ambColor, 2.5 * delta);
      ambientRef.current.intensity = THREE.MathUtils.damp(
        ambientRef.current.intensity,
        cfg.ambientIntensity,
        2.5,
        delta
      );
    }
  });

  return <ambientLight ref={ambientRef} color="#607a9c" intensity={1.6} />;
}

function ZoneCulling({
  children,
  minZ,
  maxZ,
}: {
  children: React.ReactNode;
  minZ: number;
  maxZ: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const { mode, playerPosition } = useWalkStore.getState();

    // In intro mode, ensure courtyard and foyer are visible for arrival depth
    if (mode === "intro") {
      groupRef.current.visible = maxZ >= -10.0;
      return;
    }

    const pz = playerPosition[2];
    // Visible if player is within range or looking through portal
    const isVisible = pz >= minZ - 12.0 && pz <= maxZ + 12.0;
    groupRef.current.visible = isVisible;
  });

  return <group ref={groupRef}>{children}</group>;
}

export function HouseShell() {
  return (
    <group dispose={null}>
      <DynamicAtmosphere />

      {/* Global directional moonlight with soft architectural shadows */}
      <directionalLight
        position={[14, 28, 18]}
        color="#dae6f8"
        intensity={1.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.03}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />

      {/* ── Zone 01: Courtyard Entry (Z: 21.0 to 3.56) ── */}
      <ZoneCulling minZ={0.0} maxZ={25.0}>
        <CourtyardZone />
      </ZoneCulling>

      {/* ── Zone 02: The Foyer (Z: 3.56 to -14.5) ── */}
      <ZoneCulling minZ={-16.0} maxZ={5.0}>
        <LobbyZone />
      </ZoneCulling>

      {/* ── Zone 03: Garden Corridor (Z: -14.5 to -27.0) ── */}
      <ZoneCulling minZ={-29.0} maxZ={-12.0}>
        <SkybridgeZone />
      </ZoneCulling>

      {/* ── Zone 04: Project Gallery (Z: -27.0 to -39.0) ── */}
      <ZoneCulling minZ={-41.0} maxZ={-24.0}>
        <GalleryZone />
      </ZoneCulling>

      {/* ── Zone 05: Developer Studio (Z: -39.0 to -51.0) ── */}
      <ZoneCulling minZ={-53.0} maxZ={-36.0}>
        <StudioZone />
      </ZoneCulling>

      {/* ── Zone 06: Rooftop Terrace (Z: -51.0 to -66.0) ── */}
      <ZoneCulling minZ={-68.0} maxZ={-48.0}>
        <RooftopZone />
      </ZoneCulling>
    </group>
  );
}
