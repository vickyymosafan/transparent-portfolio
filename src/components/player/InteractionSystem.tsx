"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWalkStore, ActiveInteraction } from "@/lib/walk-store";
import { PROJECTS } from "@/lib/projects";
import { INTERACTION_RADIUS } from "@/lib/constants";

/**
 * Proximity-based In-World Interaction System.
 * Detects nearby architectural objects, displays [E] context prompt,
 * and triggers modal drawers or architectural door animations.
 */

interface InteractableObject {
  id: string;
  title: string;
  prompt: string;
  type: ActiveInteraction["type"];
  position: [number, number, number];
  radius: number;
  payload?: unknown;
}

const INTERACTABLES: InteractableObject[] = [
  // Zone 01: Courtyard Front Pivot Door
  {
    id: "front-door",
    title: "Residence Entrance",
    prompt: "Open / Close Pivot Door",
    type: "door",
    position: [0.0, 1.2, 3.6],
    radius: 2.5,
  },

  // Zone 02: Foyer Console Table
  {
    id: "foyer-console",
    title: "M. Vicky Mosafan",
    prompt: "Discover Identity & Profile",
    type: "cv-identity",
    position: [2.2, 0.9, -9.5],
    radius: 2.2,
  },

  // Zone 03: Garden Corridor Experience Plinth
  {
    id: "corridor-experience",
    title: "Education & Leadership",
    prompt: "Explore Academic & Organization History",
    type: "cv-experience",
    position: [-1.4, 0.8, -22.5],
    radius: 2.4,
  },

  // Zone 04: Project Gallery Exhibition Slabs
  {
    id: "project-intellichat",
    title: PROJECTS[0].title,
    prompt: "Inspect Project Details",
    type: "project",
    position: [-1.8, 1.8, -29.5],
    radius: 2.2,
    payload: PROJECTS[0],
  },
  {
    id: "project-smartkost",
    title: PROJECTS[1].title,
    prompt: "Inspect Project Details",
    type: "project",
    position: [-1.8, 1.8, -32.0],
    radius: 2.2,
    payload: PROJECTS[1],
  },
  {
    id: "project-gaming",
    title: PROJECTS[2].title,
    prompt: "Inspect Project Details",
    type: "project",
    position: [-1.8, 1.8, -34.5],
    radius: 2.2,
    payload: PROJECTS[2],
  },
  {
    id: "project-webgl",
    title: PROJECTS[3].title,
    prompt: "Inspect Project Details",
    type: "project",
    position: [-1.8, 1.8, -37.0],
    radius: 2.2,
    payload: PROJECTS[3],
  },
  {
    id: "project-aiauto",
    title: PROJECTS[4].title,
    prompt: "Inspect Project Details",
    type: "project",
    position: [1.8, 1.8, -33.5],
    radius: 2.2,
    payload: PROJECTS[4],
  },

  // Zone 05: Developer Studio Workstation
  {
    id: "studio-desk",
    title: "Developer Workstation",
    prompt: "View Skills & Technology Stack",
    type: "skills",
    position: [0.4, 1.1, -45.2],
    radius: 2.4,
  },

  // Zone 06: Rooftop Fire Table & Sky Lounge
  {
    id: "rooftop-contact",
    title: "Sky Lounge Dialogue",
    prompt: "Connect with M. Vicky Mosafan",
    type: "contact",
    position: [0.5, 0.6, -57.5],
    radius: 2.8,
  },
];

export function InteractionSystem() {
  const activeObjRef = useRef<InteractableObject | null>(null);

  // Keyboard handler for 'E' key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE") {
        const state = useWalkStore.getState();
        if (state.mode === "walk" && activeObjRef.current) {
          triggerInteraction(activeObjRef.current);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useFrame(() => {
    const state = useWalkStore.getState();
    if (state.mode !== "walk") {
      if (activeObjRef.current) {
        activeObjRef.current = null;
        state.setActiveInteraction(null);
      }
      return;
    }

    const [px, py, pz] = state.playerPosition;

    // Find closest interactable object within its trigger radius
    let closest: InteractableObject | null = null;
    let minDistance = Infinity;

    for (let i = 0; i < INTERACTABLES.length; i++) {
      const obj = INTERACTABLES[i];
      const dx = px - obj.position[0];
      const dy = py - obj.position[1];
      const dz = pz - obj.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= obj.radius && dist < minDistance) {
        minDistance = dist;
        closest = obj;
      }
    }

    if (closest !== activeObjRef.current) {
      activeObjRef.current = closest;
      if (closest) {
        state.setActiveInteraction({
          id: closest.id,
          title: closest.title,
          prompt: closest.prompt,
          type: closest.type,
          payload: closest.payload,
        });
      } else {
        state.setActiveInteraction(null);
      }
    }
  });

  return null;
}

export function triggerInteraction(obj: { type: string; payload?: unknown }) {
  const store = useWalkStore.getState();

  switch (obj.type) {
    case "door":
      store.toggleDoor();
      break;
    case "project":
      store.openModal("project", obj.payload);
      break;
    case "cv-identity":
      store.openModal("cv-identity");
      break;
    case "cv-experience":
      store.openModal("cv-experience");
      break;
    case "skills":
      store.openModal("skills");
      break;
    case "contact":
      store.openModal("contact");
      break;
  }
}
