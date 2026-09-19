import { create } from "zustand";
import { ZONES, PLAYER_CONFIG } from "./constants";
import { detectQualityTier, QualitySettings } from "./quality";

export type AppMode = "intro" | "walk" | "paused";

export interface ActiveInteraction {
  id: string;
  title: string;
  prompt: string;
  type: "door" | "project" | "cv-identity" | "cv-experience" | "skills" | "contact";
  payload?: unknown;
}

interface WalkState {
  mode: AppMode;
  currentZone: number;
  playerPosition: [number, number, number];
  playerRotation: number;
  isSprinting: boolean;
  hasMoved: boolean;
  activeInteraction: ActiveInteraction | null;
  activeModal: string | null;
  modalPayload: unknown | null;
  quality: QualitySettings;
  mobileMove: [number, number]; // [x, z] normalized (-1 to 1)
  mobileLookDelta: [number, number]; // [yaw, pitch] deltas
  doorOpen: boolean;

  // Actions
  setMode: (mode: AppMode) => void;
  setPlayerPosition: (pos: [number, number, number], rot?: number) => void;
  setCurrentZone: (zone: number) => void;
  setIsSprinting: (sprinting: boolean) => void;
  setHasMoved: (moved: boolean) => void;
  setActiveInteraction: (interaction: ActiveInteraction | null) => void;
  openModal: (modalId: string, payload?: unknown) => void;
  closeModal: () => void;
  setMobileMove: (x: number, z: number) => void;
  consumeMobileLook: () => [number, number];
  addMobileLook: (yawDelta: number, pitchDelta: number) => void;
  toggleDoor: () => void;
  teleportToZone: (zoneIndex: number) => void;
}

export const useWalkStore = create<WalkState>((set, get) => ({
  mode: "intro",
  currentZone: 0,
  playerPosition: [...PLAYER_CONFIG.initialPosition],
  playerRotation: PLAYER_CONFIG.initialYaw,
  isSprinting: false,
  hasMoved: false,
  activeInteraction: null,
  activeModal: null,
  modalPayload: null,
  quality: detectQualityTier(),
  mobileMove: [0, 0],
  mobileLookDelta: [0, 0],
  doorOpen: false,

  setMode: (mode) => set({ mode }),

  setPlayerPosition: (pos, rot) =>
    set((state) => {
      // Determine active zone from z coordinate
      const z = pos[2];
      let foundZone = 0;
      for (let i = 0; i < ZONES.length; i++) {
        if (z <= ZONES[i].zStart && z >= ZONES[i].zEnd) {
          foundZone = i;
          break;
        } else if (z > ZONES[0].zStart) {
          foundZone = 0;
        } else if (z < ZONES[ZONES.length - 1].zEnd) {
          foundZone = ZONES.length - 1;
        }
      }

      return {
        playerPosition: pos,
        playerRotation: rot !== undefined ? rot : state.playerRotation,
        currentZone: foundZone,
      };
    }),

  setCurrentZone: (zone) => set({ currentZone: zone }),

  setIsSprinting: (isSprinting) => set({ isSprinting }),

  setHasMoved: (hasMoved) => set({ hasMoved }),

  setActiveInteraction: (activeInteraction) => set({ activeInteraction }),

  openModal: (activeModal, modalPayload = null) =>
    set({ activeModal, modalPayload, mode: "paused" }),

  closeModal: () => set({ activeModal: null, modalPayload: null, mode: "walk" }),

  setMobileMove: (x, z) => set({ mobileMove: [x, z] }),

  addMobileLook: (yawDelta, pitchDelta) =>
    set((state) => ({
      mobileLookDelta: [
        state.mobileLookDelta[0] + yawDelta,
        state.mobileLookDelta[1] + pitchDelta,
      ],
    })),

  consumeMobileLook: () => {
    const delta = get().mobileLookDelta;
    if (delta[0] !== 0 || delta[1] !== 0) {
      set({ mobileLookDelta: [0, 0] });
    }
    return delta;
  },

  toggleDoor: () => set((state) => ({ doorOpen: !state.doorOpen })),

  teleportToZone: (zoneIndex: number) => {
    const target = ZONES[zoneIndex];
    if (target) {
      set({
        playerPosition: [...target.spawnPoint],
        currentZone: zoneIndex,
        mode: "walk",
      });
    }
  },
}));

if (typeof window !== "undefined") {
  (window as unknown as { __walkStore: typeof useWalkStore }).__walkStore = useWalkStore;
}
