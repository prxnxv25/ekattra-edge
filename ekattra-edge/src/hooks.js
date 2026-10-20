import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, sceneState } from "./three/store.js";

let lenis = null;

export function useSmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
      let raf = requestAnimationFrame(function loop(time) { lenis.raf(time); raf = requestAnimationFrame(loop); });
      jumpToPath();
      return () => { cancelAnimationFrame(raf); lenis.destroy(); lenis = null; };
    }
    jumpToPath();
    return undefined;
  }, []);
}

function jumpToPath() {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (!slug) return;
  document.fonts.ready.then(() => requestAnimationFrame(() => scrollToId(slug, true)));
}

export function scrollToId(id, immediate = false) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;
  const top = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY;
  if (lenis) { lenis.resize(); lenis.scrollTo(top, { immediate, force: true, duration: 1.4 }); }
  else window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  window.history.replaceState(null, "", id === "top" ? "/" : `/${id}`);
}

export const setScrollLocked = (locked) => lenis?.[locked ? "stop" : "start"]();

export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function useDarkSection(ref) {
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      const dark = e.isIntersecting;
      sceneState.dark = dark;
      document.documentElement.classList.toggle("is-dark", dark);
    }, { rootMargin: "0px 0px -45% 0px" });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
}

export function useActiveIndex(refs) {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      const idx = refs.current.findIndex((el) => el && seen.get(el));
      setActive(idx);
    }, { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [refs]);
  return active;
}

export function useScrub(ref, start = 0.85, end = 0.35) {
  const [p, setP] = useState(0);
  const last = useRef(-1);
  useEffect(() => {
    let raf;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect(), vh = window.innerHeight;
        const a = vh * start - r.top, b = vh * start - vh * end + r.height * 0.6;
        const v = Math.min(1, Math.max(0, a / b));
        if (Math.abs(v - last.current) > 0.004) { last.current = v; setP(v); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, start, end]);
  return prefersReducedMotion() ? 1 : p;
}

export function useNavState() {
  const [state, setState] = useState({ hidden: false, scrolled: false });
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setState({ hidden: y > lastY && y > 240, scrolled: y > 24 });
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}