export const scrollProgress = { value: 0 };

export function initScrollProgress(): () => void {
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    scrollProgress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    scrollProgress.value = 0;
  };
}
