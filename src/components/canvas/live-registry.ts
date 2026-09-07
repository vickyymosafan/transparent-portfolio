export interface LiveView {
  el: HTMLElement;
  camOffsetX: number;
}

const views = new Map<HTMLElement, LiveView>();

export function registerLiveView(el: HTMLElement, camOffsetX: number): () => void {
  views.set(el, { el, camOffsetX });
  return () => {
    views.delete(el);
  };
}

export function getLiveViews(): LiveView[] {
  return Array.from(views.values());
}
