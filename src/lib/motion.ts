import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

let registered = false;

/** Register GSAP plugins once, client-side only. */
export function setupGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** True when the user asked for reduced motion. Scenes render their final frame. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* The page's one Lenis instance, set by <SmoothScroll>. Null under reduced motion. */
let lenis: Lenis | null = null;
export function setLenis(l: Lenis | null) {
  lenis = l;
}
export function getLenis() {
  return lenis;
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Scroll the page so `el` sits `offset` px below the top of the viewport:
 * through Lenis when it's running, natively otherwise (reduced motion, where
 * the jump is instant because nothing should glide).
 */
export function scrollToElement(el: HTMLElement, { offset = 0, duration = 0.6 }: { offset?: number; duration?: number } = {}) {
  // a page position, not the element: Lenis would add the element's scroll-margin on top of the offset
  const y = Math.round(el.getBoundingClientRect().top + window.scrollY - offset);
  if (lenis) {
    lenis.scrollTo(y, { duration, easing: easeInOutCubic });
    return;
  }
  window.scrollTo({ top: y, behavior: "auto" });
}

export { gsap, ScrollTrigger };
