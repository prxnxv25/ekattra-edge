export const sceneState = { active: -1, dark: false };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function readStage() {
  const els = document.querySelectorAll("[data-stage]");
  const line = window.innerHeight * 0.55;
  let stage = 0;
  els.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.top <= line) {
      const frac = Math.min(1, (line - r.top) / Math.max(1, r.height));
      const t = Math.min(1, Math.max(0, (frac - 0.62) / 0.38));
      stage = i + (i < els.length - 1 ? t * t * (3 - 2 * t) : 0);
    }
  });
  return stage;
}