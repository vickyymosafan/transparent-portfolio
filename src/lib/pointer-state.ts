export const pointerState = { x: 0, y: 0 };

export function initPointerState(): () => void {
  const onMove = (e: PointerEvent) => {
    pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => window.removeEventListener("pointermove", onMove);
}
