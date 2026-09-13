"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildTowerTexture,
  buildTowerNormalMap,
  buildTowerEmissiveMap,
  buildTowerRoughnessMap,
  buildRoadTexture,
  buildRoadRoughnessMap,
} from "@/lib/build-tower-texture";

const NORMAL_SCALE = new THREE.Vector2(1.2, 1.2);

const DISTRICT_COLORS = [
  "#ff547b",
  "#51baff",
  "#6affb0",
  "#ffb65c",
  "#b68aff",
  "#49eadb",
];

type Shape = "exoskeleton" | "stepped" | "mullion" | "twins" | "spire";

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
  hasWaterTower: boolean;
  hasAntenna: boolean;
  hasHvac: boolean;
  hasSign: boolean;
  hasHelipad: boolean;
}

const GROUND_Y = -0.8;
const CLEAR_HALF_WIDTH = 2.6;

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildBuildings(): Building[] {
  const buildings: Building[] = [];
  const random = seededRandom(8192);
  const range = (min: number, max: number) => min + random() * (max - min);

  const landmarkShapes: Shape[] = [
    "exoskeleton",
    "stepped",
    "twins",
    "mullion",
    "spire",
    "exoskeleton",
  ];

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

  // 1. Primary landmark towers per district flanking the street
  for (let district = 0; district < 6; district++) {
    const z = -12.5 + district * 5;
    const centrality = Math.exp(-Math.pow(z / 9, 2));

    add({
      x: (district % 2 === 0 ? -1 : 1) * range(5.2, 6.0),
      z: z + range(-0.3, 0.3),
      w: range(3.0, 3.6),
      h: range(8.5, 11.5) + centrality * 5.0,
      depth: range(2.8, 3.6),
      rotation: range(-0.05, 0.05),
      district,
      color: new THREE.Color(DISTRICT_COLORS[district]),
      shape: landmarkShapes[district],
      landmark: true,
      hasWaterTower: district === 1 || district === 4,
      hasAntenna: true,
      hasHvac: true,
      hasSign: true,
      hasHelipad: district === 0 || district === 3 || district === 5,
    });
  }

  // 2. Secondary urban skyscrapers along the street and behind
  for (let district = 0; district < 6; district++) {
    let placed = 0;
    for (let attempt = 0; attempt < 180 && placed < 6; attempt++) {
      const side = random() < 0.5 ? -1 : 1;
      const x = side * range(4.4, 11.5);
      const z = -12.5 + district * 5 + range(-3.6, 3.6);
      const centrality = Math.exp(
        -Math.pow(z / 11, 2) - Math.pow((Math.abs(x) - 5) / 7, 2)
      );

      const roll = random();
      const shape: Shape =
        roll < 0.28
          ? "exoskeleton"
          : roll < 0.56
          ? "stepped"
          : roll < 0.8
          ? "mullion"
          : "spire";

      const added = add({
        x,
        z,
        w: range(1.8, 3.0),
        h: range(3.5, 6.0) + centrality * range(2.0, 7.5),
        depth: range(2.0, 3.2),
        rotation: range(-0.12, 0.12),
        district,
        color: new THREE.Color(DISTRICT_COLORS[district]),
        shape,
        landmark: false,
        hasWaterTower: random() < 0.3,
        hasAntenna: random() < 0.5,
        hasHvac: random() < 0.8,
        hasSign: random() < 0.65,
        hasHelipad: false,
      });

      if (added) placed++;
    }
  }

  return buildings;
}

/** Pulsing aviation obstruction light on towers */
function BeaconLight({ position }: { position: [number, number, number] }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      const t = clock.getElapsedTime();
      const flash = Math.pow(Math.max(0, Math.sin(t * 2.5 + position[0])), 6);
      matRef.current.opacity = 0.25 + flash * 0.75;
    }
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ff2233"
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

/** Cyberpunk streetlamp casting downward pool of light */
function StreetLamp({
  position,
  side,
}: {
  position: [number, number, number];
  side: number;
}) {
  return (
    <group position={position}>
      {/* Heavy base collar */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 8]} />
        <meshStandardMaterial color="#18202a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Vertical pole */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.065, 2.5, 8]} />
        <meshStandardMaterial color="#1a222e" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Angled cantilever arm */}
      <mesh position={[-side * 0.32, 2.5, 0]} rotation={[0, 0, side * 0.3]}>
        <boxGeometry args={[0.7, 0.05, 0.06]} />
        <meshStandardMaterial color="#18202a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Luminaire head */}
      <mesh position={[-side * 0.62, 2.38, 0]}>
        <boxGeometry args={[0.26, 0.07, 0.14]} />
        <meshStandardMaterial color="#1f2836" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Glowing lens */}
      <mesh position={[-side * 0.62, 2.34, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.1]} />
        <meshStandardMaterial
          color="#ffebc2"
          emissive="#ffebc2"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>
      {/* Local pool light */}
      <pointLight
        position={[-side * 0.62, 2.2, 0]}
        color="#ffe2b0"
        intensity={1.6}
        distance={6.0}
        decay={2}
      />
    </group>
  );
}

/** Vending machine prop on sidewalk outside towers */
function VendingMachine({
  position,
  color,
}: {
  position: [number, number, number];
  color: THREE.Color;
}) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 1.1, 0.45]} />
        <meshStandardMaterial color="#161c24" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Glowing illuminated display */}
      <mesh position={[0, 0.65, 0.23]}>
        <boxGeometry args={[0.55, 0.6, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      {/* Dispenser slot */}
      <mesh position={[0, 0.2, 0.23]}>
        <boxGeometry args={[0.45, 0.15, 0.02]} />
        <meshStandardMaterial color="#080b0f" roughness={0.8} />
      </mesh>
    </group>
  );
}

interface StreetEnvironmentProps {
  roadTexture: THREE.Texture;
  roadRoughness: THREE.Texture;
}

/** Road, wide concrete sidewalks, urban ground terrain, markings, and props */
function StreetEnvironment({ roadTexture, roadRoughness }: StreetEnvironmentProps) {
  const streetlamps: React.ReactNode[] = [];
  const zPoints = [-14, -8, -2, 4, 10, 15];

  zPoints.forEach((z, i) => {
    streetlamps.push(
      <StreetLamp key={`lamp-l-${i}`} position={[-2.9, GROUND_Y + 0.14, z]} side={-1} />,
      <StreetLamp key={`lamp-r-${i}`} position={[2.9, GROUND_Y + 0.14, z]} side={1} />
    );
  });

  // Traffic bollards along curb
  const bollards: React.ReactNode[] = [];
  for (let z = -18; z <= 18; z += 4.5) {
    for (const side of [-1, 1]) {
      bollards.push(
        <group key={`bollard-${side}-${z}`} position={[side * 2.62, GROUND_Y + 0.14, z]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
            <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.05, 8]} />
            <meshStandardMaterial
              color="#49eadb"
              emissive="#49eadb"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      );
    }
  }

  return (
    <group>
      {/* 1. Vast dark urban ground foundation (Eliminates all empty void!) */}
      <mesh
        receiveShadow
        position={[0, GROUND_Y - 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial
          color="#090d13"
          roughness={0.9}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Wet asphalt road surface WITH integrated markings & zebra crossings */}
      <mesh
        receiveShadow
        position={[0, GROUND_Y + 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[5.2, 54]} />
        <meshStandardMaterial
          map={roadTexture}
          roughnessMap={roadRoughness}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>

      {/* 3. Left Wide Concrete Sidewalk / Plaza */}
      <mesh receiveShadow position={[-9.65, GROUND_Y + 0.07, 0]}>
        <boxGeometry args={[14.0, 0.14, 54]} />
        <meshStandardMaterial color="#19202a" roughness={0.78} metalness={0.2} />
      </mesh>
      {/* Left Curb bevel */}
      <mesh position={[-2.65, GROUND_Y + 0.08, 0]}>
        <boxGeometry args={[0.1, 0.16, 54]} />
        <meshStandardMaterial color="#2c3746" roughness={0.65} metalness={0.3} />
      </mesh>

      {/* 4. Right Wide Concrete Sidewalk / Plaza */}
      <mesh receiveShadow position={[9.65, GROUND_Y + 0.07, 0]}>
        <boxGeometry args={[14.0, 0.14, 54]} />
        <meshStandardMaterial color="#19202a" roughness={0.78} metalness={0.2} />
      </mesh>
      {/* Right Curb bevel */}
      <mesh position={[2.65, GROUND_Y + 0.08, 0]}>
        <boxGeometry args={[0.1, 0.16, 54]} />
        <meshStandardMaterial color="#2c3746" roughness={0.65} metalness={0.3} />
      </mesh>

      {streetlamps}
      {bollards}

      {/* Sidewalk vending machines */}
      <VendingMachine
        position={[-3.8, GROUND_Y + 0.14, -6.5]}
        color={new THREE.Color("#ff547b")}
      />
      <VendingMachine
        position={[3.8, GROUND_Y + 0.14, 3.5]}
        color={new THREE.Color("#49eadb")}
      />
      <VendingMachine
        position={[-3.8, GROUND_Y + 0.14, 8.5]}
        color={new THREE.Color("#ffb65c")}
      />
    </group>
  );
}

interface TowerProps {
  building: Building;
  texture: THREE.Texture;
  normalMap: THREE.Texture;
  emissiveMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}

function Tower({
  building: b,
  texture,
  normalMap,
  emissiveMap,
  roughnessMap,
}: TowerProps) {
  const facadeMat = (
    <meshStandardMaterial
      map={texture}
      normalMap={normalMap}
      normalScale={NORMAL_SCALE}
      roughnessMap={roughnessMap}
      roughness={0.72}
      metalness={0.35}
      emissive="#ffffff"
      emissiveMap={emissiveMap}
      emissiveIntensity={1.4}
    />
  );

  const neonMat = (
    <meshStandardMaterial
      color={b.color}
      emissive={b.color}
      emissiveIntensity={3.2}
      roughness={0.25}
      toneMapped={false}
    />
  );

  const darkMetalMat = (
    <meshStandardMaterial
      color="#151b24"
      metalness={0.85}
      roughness={0.3}
    />
  );

  const steelTrussMat = (
    <meshStandardMaterial
      color="#1d2633"
      metalness={0.88}
      roughness={0.28}
    />
  );

  const stonePlinthMat = (
    <meshStandardMaterial
      color="#141a22"
      metalness={0.4}
      roughness={0.7}
    />
  );

  const storefrontGlassMat = (
    <meshStandardMaterial
      color="#0a1017"
      emissive="#1a2533"
      emissiveIntensity={0.6}
      roughness={0.12}
      metalness={0.6}
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
    mat: "facade" | "neon" | "metal" | "truss" | "plinth" | "storefront" = "facade",
    castShadow = true,
    receiveShadow = true
  ) {
    let materialNode = facadeMat;
    if (mat === "neon") materialNode = neonMat;
    else if (mat === "metal") materialNode = darkMetalMat;
    else if (mat === "truss") materialNode = steelTrussMat;
    else if (mat === "plinth") materialNode = stonePlinthMat;
    else if (mat === "storefront") materialNode = storefrontGlassMat;

    return (
      <mesh
        key={key}
        position={[x, y, z]}
        castShadow={mat !== "neon" && castShadow}
        receiveShadow={mat !== "neon" && receiveShadow}
      >
        <boxGeometry args={[w, h, depth]} />
        {materialNode}
      </mesh>
    );
  }

  const parts: React.ReactNode[] = [];

  // =========================================================================
  // 1. SOLID GROUNDED STOREFRONT PLINTH (NO stilts! NO floating beige boxes!)
  // =========================================================================
  const plinthH = 1.35;
  // Heavy solid stone plinth sitting directly on the sidewalk
  parts.push(
    box("plinth-base", 0, plinthH / 2, 0, b.w, plinthH, b.depth, "plinth")
  );

  // Recessed dark storefront display window on street-facing side
  const streetZ = b.z > 0 ? -b.depth / 2 : b.depth / 2;
  const streetFacingDir = b.z > 0 ? -1 : 1;

  parts.push(
    box(
      "storefront-window",
      0,
      plinthH * 0.52,
      streetZ + streetFacingDir * 0.02,
      b.w * 0.74,
      plinthH * 0.72,
      0.12,
      "storefront",
      false,
      true
    ),
    // Storefront mullion frame
    box(
      "storefront-frame-top",
      0,
      plinthH * 0.9,
      streetZ + streetFacingDir * 0.06,
      b.w * 0.76,
      0.06,
      0.08,
      "metal"
    ),
    box(
      "storefront-frame-mid",
      0,
      plinthH * 0.52,
      streetZ + streetFacingDir * 0.06,
      0.06,
      plinthH * 0.72,
      0.08,
      "metal"
    )
  );

  // Structural corner pilasters on plinth
  for (const cx of [-1, 1]) {
    for (const cz of [-1, 1]) {
      parts.push(
        box(
          `plinth-col-${cx}-${cz}`,
          (cx * b.w * 0.98) / 2,
          plinthH / 2,
          (cz * b.depth * 0.98) / 2,
          0.16,
          plinthH,
          0.16,
          "metal"
        )
      );
    }
  }

  // Cantilevered entrance marquee with neon accent strip
  parts.push(
    box(
      "canopy",
      0,
      plinthH + 0.04,
      streetZ + streetFacingDir * 0.35,
      b.w * 0.7,
      0.08,
      0.75,
      "metal"
    ),
    box(
      "canopy-neon",
      0,
      plinthH + 0.01,
      streetZ + streetFacingDir * 0.72,
      b.w * 0.7,
      0.03,
      0.03,
      "neon"
    )
  );

  // =========================================================================
  // 2. MODULAR 3D ARCHITECTURAL SHAPES & EXOSKELETONS
  // =========================================================================
  const bodyBottom = plinthH;
  const bodyH = b.h - plinthH;
  let topY = b.h;

  if (b.shape === "exoskeleton") {
    // -----------------------------------------------------------------------
    // Style 1: High-Tech Exoskeleton Cyber Skyscraper (External Steel X-Braces)
    // -----------------------------------------------------------------------
    const tiers = 3;
    const tierH = bodyH / tiers;

    // Recessed core curtain wall
    parts.push(
      box(
        "exo-core",
        0,
        bodyBottom + bodyH / 2,
        0,
        b.w * 0.92,
        bodyH,
        b.depth * 0.92,
        "facade"
      )
    );

    // Heavy external corner columns running full height
    for (const cx of [-1, 1]) {
      for (const cz of [-1, 1]) {
        parts.push(
          box(
            `exo-col-${cx}-${cz}`,
            (cx * b.w) / 2,
            bodyBottom + bodyH / 2,
            (cz * b.depth) / 2,
            0.14,
            bodyH,
            0.14,
            "truss"
          )
        );
      }
    }

    // External diagonal X-trusses per tier
    for (let t = 0; t < tiers; t++) {
      const tierY = bodyBottom + t * tierH;
      const midY = tierY + tierH / 2;

      // Floor boundary band
      parts.push(
        box(
          `exo-band-${t}`,
          0,
          tierY,
          0,
          b.w + 0.08,
          0.12,
          b.depth + 0.08,
          "metal"
        )
      );

      // Front & back face diagonal X-trusses
      const diagLFront = Math.hypot(b.w, tierH);
      const angleFront = Math.atan2(tierH, b.w);

      for (const zSide of [-1, 1]) {
        const fz = (zSide * (b.depth + 0.08)) / 2;
        parts.push(
          <mesh
            key={`x-fb-1-${t}-${zSide}`}
            position={[0, midY, fz]}
            rotation={[0, 0, angleFront]}
            castShadow
          >
            <boxGeometry args={[diagLFront, 0.09, 0.08]} />
            {steelTrussMat}
          </mesh>,
          <mesh
            key={`x-fb-2-${t}-${zSide}`}
            position={[0, midY, fz]}
            rotation={[0, 0, -angleFront]}
            castShadow
          >
            <boxGeometry args={[diagLFront, 0.09, 0.08]} />
            {steelTrussMat}
          </mesh>
        );
      }

      // Left & right face diagonal X-trusses
      const diagLSide = Math.hypot(b.depth, tierH);
      const angleSide = Math.atan2(tierH, b.depth);

      for (const xSide of [-1, 1]) {
        const fx = (xSide * (b.w + 0.08)) / 2;
        parts.push(
          <mesh
            key={`x-lr-1-${t}-${xSide}`}
            position={[fx, midY, 0]}
            rotation={[angleSide, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.09, diagLSide]} />
            {steelTrussMat}
          </mesh>,
          <mesh
            key={`x-lr-2-${t}-${xSide}`}
            position={[fx, midY, 0]}
            rotation={[-angleSide, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.09, diagLSide]} />
            {steelTrussMat}
          </mesh>
        );
      }
    }
  } else if (b.shape === "stepped" || b.shape === "spire") {
    // -----------------------------------------------------------------------
    // Style 2: Stepped Art-Deco Cyber Megalith with Real Balcony Terraces
    // -----------------------------------------------------------------------
    const levels = b.shape === "spire" ? 4 : 3;
    let currBottom = bodyBottom;

    for (let level = 0; level < levels; level++) {
      const scale = Math.pow(0.78, level);
      const levelHeight = bodyH / levels;
      const width = b.w * scale;
      const depth = b.depth * scale;

      // Tier body
      parts.push(
        box(
          `step-tier-${level}`,
          0,
          currBottom + levelHeight / 2,
          0,
          width,
          levelHeight,
          depth,
          "facade"
        ),
        // Floor cornice band
        box(
          `step-cornice-${level}`,
          0,
          currBottom + levelHeight - 0.05,
          0,
          width + 0.12,
          0.1,
          depth + 0.12,
          "metal"
        ),
        // Neon accent belt
        box(
          `step-neon-${level}`,
          0,
          currBottom + levelHeight,
          0,
          width + 0.14,
          0.04,
          depth + 0.14,
          "neon"
        )
      );

      // Physical 3D balcony terrace on setbacks
      if (level > 0) {
        const prevWidth = b.w * Math.pow(0.78, level - 1);
        const prevDepth = b.depth * Math.pow(0.78, level - 1);
        // Front & back railings
        for (const side of [-1, 1]) {
          parts.push(
            box(
              `rail-fb-${level}-${side}`,
              0,
              currBottom + 0.18,
              (side * (prevDepth + depth)) / 4,
              prevWidth,
              0.36,
              0.04,
              "metal"
            ),
            box(
              `rail-lr-${level}-${side}`,
              (side * (prevWidth + width)) / 4,
              currBottom + 0.18,
              0,
              0.04,
              0.36,
              prevDepth,
              "metal"
            )
          );
        }
      }

      // Vertical fluting fins up the face
      for (const side of [-1, 1]) {
        parts.push(
          box(
            `flute-${level}-${side}`,
            side * width * 0.28,
            currBottom + levelHeight / 2,
            depth / 2 + 0.05,
            0.08,
            levelHeight,
            0.1,
            "metal"
          )
        );
      }

      currBottom += levelHeight;
    }
    topY = currBottom;

    if (b.shape === "spire") {
      // Stepped pyramid pinnacle & mast
      parts.push(
        <mesh
          key="spire-cone"
          position={[0, topY + 1.2, 0]}
          castShadow
        >
          <coneGeometry args={[b.w * 0.18, 2.4, 4]} />
          {darkMetalMat}
        </mesh>,
        box("spire-neon-ring", 0, topY + 0.8, 0, b.w * 0.22, 0.06, b.depth * 0.22, "neon")
      );
      topY += 2.4;
    }
  } else if (b.shape === "twins") {
    // -----------------------------------------------------------------------
    // Style 3: Twin Towers with 2-Story Skybridge
    // -----------------------------------------------------------------------
    const towerW = b.w * 0.38;
    const leftX = -b.w * 0.28;
    const rightX = b.w * 0.28;

    parts.push(
      // Left tower shaft
      box("twin-l", leftX, bodyBottom + bodyH / 2, 0, towerW, bodyH, b.depth * 0.78),
      // Right tower shaft
      box("twin-r", rightX, bodyBottom + (bodyH * 0.85) / 2, 0, towerW, bodyH * 0.85, b.depth * 0.78),
      // Enclosed 2-story glass skybridge
      box(
        "skybridge-glass",
        0,
        bodyBottom + bodyH * 0.65,
        0,
        b.w * 0.56,
        0.65,
        b.depth * 0.42,
        "storefront"
      ),
      box(
        "skybridge-roof",
        0,
        bodyBottom + bodyH * 0.65 + 0.35,
        0,
        b.w * 0.58,
        0.08,
        b.depth * 0.44,
        "metal"
      ),
      box(
        "skybridge-neon-f",
        0,
        bodyBottom + bodyH * 0.65,
        b.depth * 0.22,
        b.w * 0.56,
        0.05,
        0.03,
        "neon"
      )
    );

    // Corner columns on both twin towers
    for (const tx of [leftX, rightX]) {
      for (const cx of [-1, 1]) {
        for (const cz of [-1, 1]) {
          parts.push(
            box(
              `twin-col-${tx.toFixed(2)}-${cx}-${cz}`,
              tx + (cx * towerW) / 2,
              bodyBottom + bodyH / 2,
              (cz * b.depth * 0.78) / 2,
              0.08,
              bodyH,
              0.08,
              "metal"
            )
          );
        }
      }
    }
  } else {
    // -----------------------------------------------------------------------
    // Style 4: Corporate Monolith with High-Density 3D Mullion Blades
    // -----------------------------------------------------------------------
    parts.push(
      box("mono-core", 0, bodyBottom + bodyH / 2, 0, b.w, bodyH, b.depth, "facade")
    );

    // Heavy 3D corner piers
    for (const cx of [-1, 1]) {
      for (const cz of [-1, 1]) {
        parts.push(
          box(
            `mono-col-${cx}-${cz}`,
            (cx * b.w) / 2,
            bodyBottom + bodyH / 2,
            (cz * b.depth) / 2,
            0.14,
            bodyH,
            0.14,
            "metal"
          )
        );
      }
    }

    // 6 to 8 extruded vertical mullion blades (Protruding 0.12 units outside the windows!)
    const mullionCount = Math.max(4, Math.floor(b.w * 2.2));
    for (let m = 1; m <= mullionCount; m++) {
      const mx = -b.w * 0.44 + m * (b.w * 0.88 / (mullionCount + 1));
      parts.push(
        box(
          `mullion-front-${m}`,
          mx,
          bodyBottom + bodyH / 2,
          b.depth / 2 + 0.06,
          0.06,
          bodyH,
          0.12,
          "metal"
        ),
        box(
          `mullion-back-${m}`,
          mx,
          bodyBottom + bodyH / 2,
          -b.depth / 2 - 0.06,
          0.06,
          bodyH,
          0.12,
          "metal"
        )
      );
    }

    // Floor spandrel bands every 2.4 units of height
    for (let fy = bodyBottom + 2.4; fy < b.h; fy += 2.4) {
      parts.push(
        box(
          `spandrel-band-${fy.toFixed(1)}`,
          0,
          fy,
          0,
          b.w + 0.08,
          0.1,
          b.depth + 0.08,
          "metal"
        )
      );
    }
  }

  // =========================================================================
  // 3. ROOFTOP ARCHITECTURE & MECHANICAL INFRASTRUCTURE
  // =========================================================================
  const roofW = b.w * 0.75;
  const roofD = b.depth * 0.75;

  // Solid parapet perimeter wall
  parts.push(
    box("parapet-f", 0, topY + 0.16, roofD / 2 - 0.05, roofW, 0.32, 0.1, "metal"),
    box("parapet-b", 0, topY + 0.16, -roofD / 2 + 0.05, roofW, 0.32, 0.1, "metal"),
    box("parapet-l", -roofW / 2 + 0.05, topY + 0.16, 0, 0.1, 0.32, roofD, "metal"),
    box("parapet-r", roofW / 2 - 0.05, topY + 0.16, 0, 0.1, 0.32, roofD, "metal")
  );

  // Mechanical penthouse (elevator machine room)
  if (b.h > 3.2) {
    parts.push(
      box(
        "penthouse",
        0,
        topY + 0.45,
        0,
        roofW * 0.52,
        0.9,
        roofD * 0.52,
        "metal"
      )
    );
  }

  // Industrial HVAC chillers with dark metal grilles and fan cowls
  if (b.hasHvac && b.h > 2.8) {
    const hx = roofW * 0.22;
    const hz = -roofD * 0.2;
    parts.push(
      box("hvac-unit", hx, topY + 0.24, hz, 0.55, 0.45, 0.48, "metal"),
      <mesh key="hvac-fan-mesh" position={[hx, topY + 0.48, hz]}>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
        <meshStandardMaterial color="#0b0e14" metalness={0.95} roughness={0.2} />
      </mesh>
    );
  }

  // Elevated water tank on 4 steel truss legs
  if (b.hasWaterTower && b.h > 4.2) {
    const wtx = -roofW * 0.22;
    const wtz = roofD * 0.18;
    const legH = 0.65;
    for (const lx of [-1, 1]) {
      for (const lz of [-1, 1]) {
        parts.push(
          box(
            `wt-leg-${lx}-${lz}`,
            wtx + lx * 0.16,
            topY + legH / 2,
            wtz + lz * 0.16,
            0.04,
            legH,
            0.04,
            "truss"
          )
        );
      }
    }
    parts.push(
      <mesh key="wt-cylinder" position={[wtx, topY + legH + 0.32, wtz]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.62, 14]} />
        <meshStandardMaterial color="#2d3745" metalness={0.75} roughness={0.35} />
      </mesh>,
      <mesh key="wt-roof-cone" position={[wtx, topY + legH + 0.74, wtz]} castShadow>
        <coneGeometry args={[0.38, 0.24, 14]} />
        <meshStandardMaterial color="#1a222e" metalness={0.8} roughness={0.3} />
      </mesh>
    );
  }

  // Communication antenna mast with flashing red aviation obstruction light
  if (b.hasAntenna && b.h > 4.5 && b.shape !== "spire") {
    const antH = 2.4;
    parts.push(
      <mesh key="antenna-mast" position={[0, topY + antH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.06, antH, 8]} />
        <meshStandardMaterial color="#364253" metalness={0.9} roughness={0.2} />
      </mesh>,
      <BeaconLight key="antenna-beacon" position={[0, topY + antH + 0.05, 0]} />
    );
  }

  // Landmark helipad deck
  if (b.hasHelipad) {
    parts.push(
      <mesh key="helipad-base" position={[0, topY + 0.18, 0]} receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.1, 24]} />
        <meshStandardMaterial color="#131922" roughness={0.8} metalness={0.3} />
      </mesh>,
      <mesh key="helipad-neon-ring" position={[0, topY + 0.24, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.02, 24]} />
        {neonMat}
      </mesh>
    );
  }

  // =========================================================================
  // 4. 3D CANTILEVERED CYBERPUNK NEON BILLBOARDS (PROJECTING INTO THE STREET)
  // =========================================================================
  if (b.hasSign && b.h > 3.2) {
    const signSideX = b.x > 0 ? -b.w / 2 : b.w / 2;
    const signDir = b.x > 0 ? -1 : 1;
    const signY = plinthH + Math.min(3.4, bodyH * 0.4);

    parts.push(
      // Steel support strut
      box(
        "sign-strut-top",
        signSideX + signDir * 0.32,
        signY + 0.5,
        0,
        0.65,
        0.05,
        0.05,
        "metal"
      ),
      box(
        "sign-strut-bot",
        signSideX + signDir * 0.32,
        signY - 0.5,
        0,
        0.65,
        0.05,
        0.05,
        "metal"
      ),
      // 3D sign casing
      box(
        "sign-casing",
        signSideX + signDir * 0.65,
        signY,
        0,
        0.1,
        1.5,
        0.55,
        "metal"
      ),
      // Glowing neon front/back faces
      box(
        "sign-glow-face",
        signSideX + signDir * 0.65,
        signY,
        0,
        0.11,
        1.38,
        0.45,
        "neon"
      )
    );
  }

  return (
    <group
      position={[b.x, GROUND_Y + 0.14, b.z]}
      rotation={[0, b.rotation, 0]}
    >
      {parts}
    </group>
  );
}

export function CityGenerator() {
  const texture = useMemo(() => buildTowerTexture(), []);
  const normalMap = useMemo(() => buildTowerNormalMap(), []);
  const emissiveMap = useMemo(() => buildTowerEmissiveMap(), []);
  const roughnessMap = useMemo(() => buildTowerRoughnessMap(), []);
  const roadTexture = useMemo(() => buildRoadTexture(), []);
  const roadRoughness = useMemo(() => buildRoadRoughnessMap(), []);
  const buildings = useMemo(() => buildBuildings(), []);

  useEffect(() => {
    return () => {
      texture.dispose();
      normalMap.dispose();
      emissiveMap.dispose();
      roughnessMap.dispose();
      roadTexture.dispose();
      roadRoughness.dispose();
    };
  }, [texture, normalMap, emissiveMap, roughnessMap, roadTexture, roadRoughness]);

  return (
    <group>
      {/* 1. Atmospheric Ambient & Sky Fill */}
      <hemisphereLight args={["#7a9cc6", "#0a0e16", 0.75]} />

      {/* 2. Main Key Directional Light with Crisp Soft Shadows */}
      <directionalLight
        castShadow
        position={[18, 30, 14]}
        color="#d6e8ff"
        intensity={2.6}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-bias={-0.0006}
      />

      {/* 3. Dramatic Rim / Backlight for Silhouette Separation */}
      <directionalLight
        position={[-18, 16, -16]}
        color="#705cff"
        intensity={1.3}
      />

      {/* 4. Complete Urban Terrain, Wet Street with Integrated Markings, Sidewalks, and Streetlamps */}
      <StreetEnvironment roadTexture={roadTexture} roadRoughness={roadRoughness} />

      {/* 5. Procedural 3D Skyscraper Cityscape */}
      {buildings.map((building, index) => (
        <Tower
          key={index}
          building={building}
          texture={texture}
          normalMap={normalMap}
          emissiveMap={emissiveMap}
          roughnessMap={roughnessMap}
        />
      ))}
    </group>
  );
}


