import type { CardView } from "@/lib/scene-state";

export interface LiveView {
  el: HTMLElement;
  view: CardView;
  hover: boolean;
}

const views = new Map<HTMLElement, LiveView>();

export function registerLiveView(el: HTMLElement, view: CardView): () => void {
  views.set(el, { el, view, hover: false });
  return () => {
    views.delete(el);
  };
}

export function setLiveViewHover(el: HTMLElement, hover: boolean): void {
  const v = views.get(el);
  if (v) v.hover = hover;
}

export function getLiveViews(): LiveView[] {
  return Array.from(views.values());
}
