"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import {
  getTeakDeckMat,
  getPebblesMat,
  getBoardFormedConcreteMat,
  getDarkWalnutMat,
  architecturalGlassMat,
  matteBlackMetalMat,
  warmCoveLedMat,
  pineTrunkMat,
  cloudPineFoliageMat,
} from "@/lib/architectural-materials";

// Preload master glTF model
useGLTF.preload("/models/rooftop_master.glb");

// Calibrated architectural materials matching Reference 5 (Rooftop Terrace at Dusk)
const sofaFabricMat = new THREE.MeshStandardMaterial({
  color: "#b6aa99",
  roughness: 0.88,
  metalness: 0.02,
});

const pillowFabricMat = new THREE.MeshStandardMaterial({
  color: "#4e4438",
  roughness: 0.90,
  metalness: 0.02,
});

const fireTableMat = new THREE.MeshStandardMaterial({
  color: "#141518",
  roughness: 0.28,
  metalness: 0.72,
});

const flameGlowMat = new THREE.MeshStandardMaterial({
  color: "#ff8214",
  emissive: new THREE.Color("#ff9922"),
  emissiveIntensity: 4.2,
  toneMapped: false,
});

const distantMountainMat1 = new THREE.MeshStandardMaterial({
  color: "#182030",
  roughness: 0.95,
  metalness: 0.05,
});

const distantMountainMat2 = new THREE.MeshStandardMaterial({
  color: "#101622",
  roughness: 0.98,
  metalness: 0.02,
});

function createHorizonGradientTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0.0, "#d88a4e");  // Warm golden peach horizon glow
  grad.addColorStop(0.20, "#7a586a"); // Mauve dusk transition
  grad.addColorStop(0.48, "#28324a"); // Deep twilight slate-blue
  grad.addColorStop(1.0, "#0e1422");  // Deep indigo night sky
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export function RooftopZone() {
  const { scene } = useGLTF("/models/rooftop_master.glb");
  const fireLightRef = useRef<THREE.PointLight>(null);
  const flameMeshRef = useRef<THREE.Mesh | null>(null);

  // Material instances
  const teakDeckMat = useMemo(() => getTeakDeckMat(), []);
  const lavaBedMat = useMemo(() => getPebblesMat(), []);
  const concreteMat = useMemo(() => getBoardFormedConcreteMat(), []);
  const walnutMat = useMemo(() => getDarkWalnutMat(), []);

  // Horizon sky backdrop texture
  const horizonTex = useMemo(() => createHorizonGradientTexture(), []);
  const horizonMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: horizonTex,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [horizonTex]
  );

  // Distant mountain silhouette geometry along the horizon
  const { mountainGeo1, mountainGeo2 } = useMemo(() => {
    // Mountain Ridge 1 (Far background)
    const m1Pts = [
      -75, 0, 0,   -60, 5.8, 0,  -45, 9.4, 0,  -30, 7.2, 0,
      -15, 11.8, 0,  0, 8.5, 0,   15, 12.6, 0,  30, 9.1, 0,
       45, 6.8, 0,   60, 10.5, 0,  75, 0, 0
    ];
    const geo1 = new THREE.BufferGeometry();
    const pos1: number[] = [];
    for (let i = 0; i < m1Pts.length / 3 - 1; i++) {
      const x1 = m1Pts[i * 3], y1 = m1Pts[i * 3 + 1], z1 = m1Pts[i * 3 + 2];
      const x2 = m1Pts[(i + 1) * 3], y2 = m1Pts[(i + 1) * 3 + 1], z2 = m1Pts[(i + 1) * 3 + 2];
      pos1.push(x1, y1, z1,  x1, -2, z1,  x2, y2, z2);
      pos1.push(x2, y2, z2,  x1, -2, z1,  x2, -2, z2);
    }
    geo1.setAttribute("position", new THREE.Float32BufferAttribute(pos1, 3));
    geo1.computeVertexNormals();

    // Mountain Ridge 2 (Mid foreground ridge)
    const m2Pts = [
      -70, 0, 0,   -52, 4.2, 0,  -35, 6.5, 0,  -18, 4.6, 0,
       -2, 7.8, 0,  12, 5.4, 0,   26, 8.2, 0,   40, 5.8, 0,
       55, 3.8, 0,  70, 0, 0
    ];
    const geo2 = new THREE.BufferGeometry();
    const pos2: number[] = [];
    for (let i = 0; i < m2Pts.length / 3 - 1; i++) {
      const x1 = m2Pts[i * 3], y1 = m2Pts[i * 3 + 1], z1 = m2Pts[i * 3 + 2];
      const x2 = m2Pts[(i + 1) * 3], y2 = m2Pts[(i + 1) * 3 + 1], z2 = m2Pts[(i + 1) * 3 + 2];
      pos2.push(x1, y1, z1,  x1, -2, z1,  x2, y2, z2);
      pos2.push(x2, y2, z2,  x1, -2, z1,  x2, -2, z2);
    }
    geo2.setAttribute("position", new THREE.Float32BufferAttribute(pos2, 3));
    geo2.computeVertexNormals();

    return { mountainGeo1: geo1, mountainGeo2: geo2 };
  }, []);

  // Dense twinkling city lights nestled in the valley between terrace and mountains
  const { cityLightPositions, cityLightColors } = useMemo(() => {
    const count = 380;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const warmPalette = [
      new THREE.Color("#ffe8b0"),
      new THREE.Color("#ffc878"),
      new THREE.Color("#e2f0ff"),
      new THREE.Color("#ffd488"),
      new THREE.Color("#ff4040"), // Skyscraper beacon red
      new THREE.Color("#ffffff"),
    ];

    for (let i = 0; i < count; i++) {
      const pseudoX = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const fracX = pseudoX - Math.floor(pseudoX);
      const pseudoY = Math.sin(i * 39.346 + 11.135) * 23421.631;
      const fracY = pseudoY - Math.floor(pseudoY);
      const pseudoZ = Math.sin(i * 71.182 + 93.411) * 31254.819;
      const fracZ = pseudoZ - Math.floor(pseudoZ);

      // Valley floor spanning north beyond the balustrade (Z in [-71, -115], X in [-40, 40])
      positions[i * 3] = -40.0 + fracX * 80.0;
      positions[i * 3 + 1] = 0.2 + Math.pow(fracY, 2.0) * 7.5;
      positions[i * 3 + 2] = -71.0 - fracZ * 44.0;

      const col = warmPalette[Math.floor(fracZ * warmPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return { cityLightPositions: positions, cityLightColors: colors };
  }, []);

  // Traverse glTF and map calibrated architectural materials
  const clonedScene = useMemo(() => {
    const cl = scene.clone(true);
    cl.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const name = child.name;

        if (
          name.includes("Deck") ||
          name.includes("Pit_Floor") ||
          name.includes("Pit_Rim") ||
          name.includes("Plinth") ||
          name.includes("Pavilion_Floor")
        ) {
          child.material = teakDeckMat;
        } else if (name.includes("Sofa_Seat") || name.includes("Sofa_Back")) {
          child.material = sofaFabricMat;
        } else if (name.includes("Pillow")) {
          child.material = pillowFabricMat;
        } else if (name.includes("Fire_Table_Base")) {
          child.material = fireTableMat;
        } else if (name.includes("Fire_Trough_Bed") || name.includes("Soil")) {
          child.material = lavaBedMat;
        } else if (name.includes("Flame_Ribbon")) {
          child.material = flameGlowMat;
          child.castShadow = false;
          flameMeshRef.current = child;
        } else if (name.includes("Glass") || name.includes("Pavilion_Door")) {
          child.material = architecturalGlassMat;
        } else if (
          name.includes("Cap") ||
          name.includes("Kick") ||
          name.includes("Frame") ||
          name.includes("Handle") ||
          name.includes("Mullion")
        ) {
          child.material = matteBlackMetalMat;
        } else if (name.includes("LED")) {
          child.material = warmCoveLedMat;
          child.castShadow = false;
        } else if (
          name.includes("Planter") ||
          name.includes("Pavilion_South_Wall") ||
          name.includes("Pavilion_Back_Wall") ||
          name.includes("Pavilion_Roof_Slab")
        ) {
          child.material = concreteMat;
        } else if (name.includes("Soffit")) {
          child.material = walnutMat;
        } else if (name.includes("Trunk")) {
          child.material = pineTrunkMat;
        } else if (name.includes("Cloud_Pad")) {
          child.material = cloudPineFoliageMat;
        }
      }
    });
    return cl;
  }, [scene, teakDeckMat, lavaBedMat, concreteMat, walnutMat]);

  // Dynamic multi-frequency flame flicker and sofa illumination
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fireLightRef.current) {
      const flicker =
        Math.sin(t * 11.7) * 0.32 +
        Math.sin(t * 23.4) * 0.20 +
        Math.sin(t * 7.1) * 0.38 +
        (Math.random() - 0.5) * 0.15;
      fireLightRef.current.intensity = 4.2 + flicker;
    }
    if (flameMeshRef.current) {
      flameMeshRef.current.scale.y = 1.0 + Math.sin(t * 14.5) * 0.14;
      flameMeshRef.current.scale.x = 1.0 + Math.cos(t * 9.8) * 0.08;
    }
  });

  return (
    <group position={[-1.75, 0, 3.56]}>
      {/* ═══ 1. MASTER 3D ARCHITECTURAL MODEL FROM BLENDER ═══ */}
      <primitive object={clonedScene} />

      {/* ═══ 2. LINEAR FIRE TABLE DYNAMIC FLAME ILLUMINATION ═══ */}
      {/* Pit center: Xb = 2.35, Yb = 61.00 -> X_local = 2.35, Z_local = -61.00 */}
      <pointLight
        ref={fireLightRef}
        position={[2.35, 0.38, -61.00]}
        color="#ff9a33"
        intensity={4.2}
        distance={8.5}
        decay={2}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      {/* Warm ambient fill for seating cushions */}
      <pointLight
        position={[2.35, 0.80, -61.00]}
        color="#ffd8a4"
        intensity={1.4}
        distance={6.0}
        decay={2}
      />

      {/* ═══ 3. WARM LINEAR LED UNDER-RIM GLOW (SUNKEN PIT) ═══ */}
      <pointLight
        position={[2.35, -0.15, -58.45]}
        color="#ffd48a"
        intensity={1.6}
        distance={4.2}
        decay={2}
      />
      <pointLight
        position={[2.35, -0.15, -63.55]}
        color="#ffd48a"
        intensity={1.6}
        distance={4.2}
        decay={2}
      />

      {/* ═══ 4. PERIMETER BALUSTRADE KICKPLATE WARM GLOW ═══ */}
      {/* North balustrade (Yb = 69.50 -> Z_local = -69.50) */}
      {[-2.0, 2.0, 6.0].map((kx, idx) => (
        <pointLight
          key={`balustrade-n-${idx}`}
          position={[kx, 0.18, -69.25]}
          color="#ffc67a"
          intensity={2.0}
          distance={5.0}
          decay={2}
        />
      ))}
      {/* East balustrade (Xb = 9.50 -> X_local = 9.50) */}
      {[-58.0, -62.0, -66.0].map((kz, idx) => (
        <pointLight
          key={`balustrade-e-${idx}`}
          position={[9.25, 0.18, kz]}
          color="#ffc67a"
          intensity={1.9}
          distance={5.0}
          decay={2}
        />
      ))}
      {/* South balustrade (Yb = 53.50 -> Z_local = -53.50) */}
      {[2.0, 6.0].map((kx, idx) => (
        <pointLight
          key={`balustrade-s-${idx}`}
          position={[kx, 0.18, -53.75]}
          color="#ffc67a"
          intensity={1.7}
          distance={4.5}
          decay={2}
        />
      ))}

      {/* ═══ 5. PENTHOUSE PAVILION WARM INTERIOR GLOW & SOFFIT WASH ═══ */}
      {/* Warm ambient spilling from interior pavilion through glass doors onto deck */}
      <pointLight
        position={[-3.65, 2.20, -57.65]}
        color="#ffe6ba"
        intensity={4.5}
        distance={10.5}
        decay={2}
      />
      {/* Exterior soffit wash under walnut overhang */}
      <pointLight
        position={[-1.80, 3.40, -57.65]}
        color="#ffd899"
        intensity={2.6}
        distance={6.5}
        decay={2}
      />

      {/* ═══ 6. SCULPTURAL NIWAKI CLOUD PINE UPLIGHTS ═══ */}
      {/* Planter 1 (Right Foreground: Xb = 6.60, Yb = 58.20 -> Z_local = -58.20) */}
      <pointLight
        position={[6.60, 0.95, -58.20]}
        color="#ffe8ba"
        intensity={3.0}
        distance={5.5}
        decay={2}
      />
      {/* Planter 2 (North Corner: Xb = -0.50, Yb = 67.50 -> Z_local = -67.50) */}
      <pointLight
        position={[-0.50, 0.85, -67.50]}
        color="#ffe8ba"
        intensity={2.4}
        distance={4.8}
        decay={2}
      />

      {/* ═══ 7. TWILIGHT HORIZON BACKDROP SKY & MOUNTAIN SILHOUETTES ═══ */}
      {/* Twilight Horizon Sky Gradient Band */}
      <mesh
        material={horizonMat}
        position={[2.0, 12.0, -96.0]}
      >
        <planeGeometry args={[160, 36]} />
      </mesh>

      {/* Far mountain ridge */}
      <mesh
        geometry={mountainGeo1}
        material={distantMountainMat1}
        position={[6.0, -0.5, -92.0]}
      />
      {/* Mid mountain ridge */}
      <mesh
        geometry={mountainGeo2}
        material={distantMountainMat2}
        position={[2.0, -0.5, -82.0]}
      />

      {/* ═══ 8. DISTANT TWINKLING METROPOLITAN SKYLINE VALLEY ═══ */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cityLightPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[cityLightColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          vertexColors
          transparent
          opacity={0.94}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
