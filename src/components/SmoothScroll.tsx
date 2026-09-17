"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion, setLenis } from "@/lib/motion";

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis; ScrollTrigger listens to Lenis.
 * Under prefers-reduced-motion nothing is initialised and the page scrolls natively.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    setupGsap();

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    setLenis(lenis);
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links go through Lenis so they stay smooth.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return; // a component already handled its own anchor
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    // Fonts change layout; refresh trigger positions once they settle.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
