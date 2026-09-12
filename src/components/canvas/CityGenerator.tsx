"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { buildTowerTexture } from "@/lib/build-tower-texture";

const DISTRICT_COLORS = [
  "#ff547b",
  "#51baff",
  "#6affb0",
  "#ffb65c",
  "#b68aff",
  "#49eadb",
];

type Shape =
  | "block"
  | "terraced"
  | "spire"
  | "twins"
  | "round"
  | "crown"
  | "offset";

interface Building {
  x: number;
  z: number;
  w: number;
  h: number;
  depth: number;
  rotation: number;
  district: number;
  color: THREE.Color;
  shape: Shape;
  landmark: boolean;
}

const GROUND_Y = -0.8;
const CLEAR_HALF_WIDTH = 1.8;

function seededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildBuildings(): Building[] {
  const buildings: Building[] = [];
  const random = seededRandom(2048);
  const range = (min: number, max: number) =>
    min + random() * (max - min);

  const landmarks: Shape[] = [
    "terraced",
    "spire",
    "twins",
    "round",
    "crown",
    "offset",
  ];

  // Footprint AABB includes rotation, keeping the central path clear.
  function footprint(b: Building) {
    const cos = Math.abs(Math.cos(b.rotation));
    const sin = Math.abs(Math.sin(b.rotation));

    return {
      x: (b.w * cos + b.depth * sin) / 2,
      z: (b.w * sin + b.depth * cos) / 2,
    };
  }

  function add(b: Building) {
    const bounds = footprint(b);

    if (Math.abs(b.x) - bounds.x < CLEAR_HALF_WIDTH) return false;

    for (const other of buildings) {
      const otherBounds = footprint(other);
      const gap = b.landmark || other.landmark ? 0.7 : 0.4;

      if (
        Math.abs(b.x - other.x) < bounds.x + otherBounds.x + gap &&
        Math.abs(b.z - other.z) < bounds.z + otherBounds.z + gap
      ) {
        return false;
      }
    }

    buildings.push(b);
    return true;
  }

  // Place landmarks first so ordinary buildings cannot crowd them out.
  for (let district = 0; district < 6; district++) {
    const z = -12.5 + district * 5;
    const centrality = Math.exp(-Math.pow(z / 9, 2));

    add({
      x: (district % 2 === 0 ? -1 : 1) * range(5.3, 6.4),
      z: z + range(-0.5, 0.5),
      w: range(2.4, 3.2),
      h: range(7, 10) + centrality * 6,
      depth: range(2.3, 3.2),
      rotation: range(-0.12, 0.12),
      district,
      color: new THREE.Color(DISTRICT_COLORS[district]),
      shape: landmarks[district],
      landmark: true,
    });
  }

  // Overlapping district ranges avoid six visibly separated rows.
  for (let district = 0; district < 6; district++) {
    let placed = 0;

    for (let attempt = 0; attempt < 180 && placed < 7; attempt++) {
      const side = random() < 0.53 ? -1 : 1;
      const x = side * range(3.5, 12.5);
      const z = -12.5 + district * 5 + range(-3.8, 3.8);
      const centrality = Math.exp(
        -Math.pow(z / 11, 2) - Math.pow((Math.abs(x) - 5) / 7, 2),
      );

      const added = add({
        x,
        z,
        w: range(1.1, 2.7),
        h: range(1.5, 3.8) + centrality * range(1, 6.5),
        depth: range(1.5, 3.3),
        rotation: range(-0.2, 0.2),
        district,
        color: new THREE.Color(DISTRICT_COLORS[district]),
        shape: random() < 0.3 ? "terraced" : "block",
        landmark: false,
      });

      if (added) placed++;
    }
  }

  return buildings;
}

interface TowerProps {
  building: Building;
  texture: THREE.Texture;
}

function Tower({ building: b, texture }: TowerProps) {
  const facade = (
    <meshStandardMaterial
      map={texture}
      color="#8796ad"
      roughness={0.62}
      metalness={0.3}
      emissive={b.color}
      emissiveMap={texture}
      emissiveIntensity={b.landmark ? 0.32 : 0.17}
    />
  );

  const neon = (
    <meshStandardMaterial
      color={b.color}
      emissive={b.color}
      emissiveIntensity={2.2}
      roughness={0.35}
      toneMapped={false}
    />
  );

  function box(
    key: string,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    depth: number,
    glowing = false,
  ) {
    return (
      <mesh
        key={key}
        position={[x, y, z]}
        castShadow={!glowing}
        receiveShadow={!glowing}
      >
        <boxGeometry args={[w, h, depth]} />
        {glowing ? neon : facade}
      </mesh>
    );
  }

  const parts: React.ReactNode[] = [];

  // Podium grounds every tower and gives it a readable footprint.
  parts.push(box("podium", 0, 0.2, 0, b.w, 0.4, b.depth));

  if (b.shape === "round") {
    parts.push(
      <mesh key="round" position={[0, b.h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[b.w * 0.3, b.w * 0.43, b.h, 16]}
        />
        {facade}
      </mesh>,
    );

    for (let i = 1; i <= 4; i++) {
      const t = i / 4;
      const radius = b.w * (0.43 - 0.13 * t) + 0.025;

      parts.push(
        <mesh key={`ring-${i}`} position={[0, b.h * t, 0]}>
          <cylinderGeometry args={[radius, radius, 0.055, 32]} />
          {neon}
        </mesh>,
      );
    }
  } else if (b.shape === "twins") {
    const width = b.w * 0.34;

    parts.push(
      box("left", -b.w * 0.27, b.h / 2, 0, width, b.h, b.depth * 0.7),
      box(
        "right",
        b.w * 0.27,
        b.h * 0.42,
        0,
        width,
        b.h * 0.84,
        b.depth * 0.7,
      ),
      box("bridge", 0, b.h * 0.66, 0, b.w * 0.6, 0.35, b.depth * 0.4),
      box(
        "bridge-light",
        0,
        b.h * 0.66,
        b.depth * 0.205,
        b.w * 0.6,
        0.065,
        0.04,
        true,
      ),
    );
  } else {
    const tiered =
      b.shape === "terraced" ||
      b.shape === "offset" ||
      b.shape === "spire";

    const levels = tiered ? (b.shape === "spire" ? 4 : 3) : 1;
    let bottom = 0;

    for (let level = 0; level < levels; level++) {
      const scale = Math.pow(0.76, level);
      const height = b.h / levels;
      const offset = b.shape === "offset" ? level * b.w * 0.09 : 0;
      const width = b.w * 0.9 * scale;
      const depth = b.depth * 0.9 * scale;

      parts.push(
        box(
          `tier-${level}`,
          offset,
          bottom + height / 2,
          0,
          width,
          height,
          depth,
        ),
        box(
          `rim-${level}`,
          offset,
          bottom + height - 0.08,
          0,
          width + 0.025,
          0.055,
          depth + 0.025,
          true,
        ),
      );

      bottom += height;
    }

    // Vertical trim on two different faces emphasizes actual depth.
    for (const side of [-1, 1]) {
      parts.push(
        box(
          `edge-${side}`,
          side * b.w * 0.451,
          b.h * 0.22,
          side * b.depth * 0.451,
          0.045,
          b.h * 0.4,
          0.045,
          true,
        ),
      );
    }
  }

  if (b.shape === "spire") {
    parts.push(
      <mesh key="spire" position={[0, b.h + 0.9, 0]} castShadow>
        <coneGeometry args={[b.w * 0.17, 1.8, 4]} />
        {facade}
      </mesh>,
      box("beacon", 0, b.h + 1.85, 0, 0.08, 0.2, 0.08, true),
    );
  }

  if (b.shape === "crown") {
    for (let i = 0; i < 4; i++) {
      const x = (i % 2 === 0 ? -1 : 1) * b.w * 0.34;
      const z = (i < 2 ? -1 : 1) * b.depth * 0.34;

      parts.push(
        box(`crown-${i}`, x, b.h + 0.5, z, 0.16, 1, 0.16, true),
      );
    }
  }

  return (
    <group
      position={[b.x, GROUND_Y, b.z]}
      rotation={[0, b.rotation, 0]}
    >
      {parts}
    </group>
  );
}

export function CityGenerator() {
  const texture = useMemo(() => buildTowerTexture(), []);
  const buildings = useMemo(() => buildBuildings(), []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <group>
      {/* Local lighting makes StandardMaterial readable without scene lights. */}
      <hemisphereLight args={["#b8d5ff", "#161225", 0.75]} />
      <directionalLight
        position={[9, 18, 7]}
        color="#d6e7ff"
        intensity={2}
      />
      <directionalLight
        position={[-10, 7, -12]}
        color="#8674ff"
        intensity={0.85}
      />

      {buildings.map((building, index) => (
        <Tower key={index} building={building} texture={texture} />
      ))}
    </group>
  );
}
