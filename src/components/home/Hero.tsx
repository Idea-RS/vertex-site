"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ALL_PLANES, PLANE_LABELS, Sheet } from "@/components/drawing/Sheet";
import { Dim } from "@/components/Dim";
import { Button } from "@/components/Button";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * The exploded sheet.
 *
 * First paint: the linework draws itself (geometry first, dimensions 300ms behind).
 * Scroll: the sheet separates into five planes in z, each 80ms behind the last,
 * back planes blur 1px, labels name the planes, then everything collapses back
 * into one flat sheet. Under reduced motion the flat sheet is the whole story.
 */
export default function Hero() {
  const h1 = useRef<HTMLHeadingElement>(null);
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const root = section.current!;
      const stack = root.querySelector<HTMLElement>("[data-hero-stack]")!;
      const layers = ALL_PLANES.map((p) => root.querySelector<HTMLElement>(`[data-layer="${p}"]`)!);
      const labels = root.querySelector<HTMLElement>("[data-hero-labels]")!;
      const labelItems = Array.from(labels.querySelectorAll<HTMLElement>("[data-label]"));

      /* ---- draw-on at first paint ---- */
      const drawTl = gsap.timeline({ defaults: { ease: "power2.out" } });
      const drawPlane = (plane: string, at: number, dur: number) => {
        const el = layers[ALL_PLANES.indexOf(plane as (typeof ALL_PLANES)[number])];
        const strokes = el.querySelectorAll(".draw");
        const fades = el.querySelectorAll(".fade");
        gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(fades, { opacity: 0 });
        drawTl.to(strokes, { strokeDashoffset: 0, duration: dur }, at);
        drawTl.to(fades, { opacity: 1, duration: 0.4 }, at + dur * 0.6);
      };
      drawPlane("border", 0, 0.8);
      drawPlane("geometry", 0.05, 1.2);
      drawPlane("dimensions", 0.35, 1.2);
      drawPlane("tables", 0.5, 1.0);
      drawPlane("titleblock", 0.6, 1.0);
      // GSAP's inline styles now own the strokes; release the CSS hold.
      stack.removeAttribute("data-drawing");
      drawTl.set([...layers.flatMap((l) => Array.from(l.querySelectorAll(".draw")))], { clearProps: "strokeDasharray,strokeDashoffset" });

      /* ---- exploded sheet on scroll (desktop only; on phones the sheet sits below the copy) ---- */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
      const spread = 130; // px between planes in z; front planes come toward the viewer
      const lag = 0.08;
      const PEAK = 1.3; // timeline seconds at full separation
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=190%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onToggle: (self) => {
            const wc = self.isActive ? "transform, filter" : "auto";
            layers.forEach((l) => (l.style.willChange = wc));
            stack.style.willChange = self.isActive ? "transform" : "auto";
          },
        },
      });

      // 0 → 1: tilt and separate, each plane 80ms behind the last
      tl.to(stack, { rotateX: 42, rotateZ: -8, scale: 0.8, x: "-7%", duration: 1, ease: "power2.out" }, 0);
      layers.forEach((layer, i) => {
        tl.to(
          layer,
          {
            z: (i - 2) * spread,
            filter: i === 0 ? "blur(1px)" : i === 1 ? "blur(0.5px)" : "blur(0px)",
            opacity: i === 0 ? 0.8 : 1,
            duration: 1,
            ease: "power2.out",
          },
          i * lag,
        );
      });
      tl.to(labels, { opacity: 1, duration: 0.2 }, PEAK - 0.2);
      tl.from(labelItems, { x: 10, duration: 0.25, stagger: 0.05, ease: "power2.out" }, PEAK - 0.2);
      // hold
      tl.to({}, { duration: 0.5 }, PEAK);
      // collapse back into one flat sheet, front planes first
      const BACK = PEAK + 0.5;
      tl.to(labels, { opacity: 0, duration: 0.15 }, BACK);
      layers.forEach((layer, i) => {
        tl.to(layer, { z: 0, filter: "blur(0px)", opacity: 1, duration: 1, ease: "power2.inOut" }, BACK + (4 - i) * lag);
      });
      tl.to(stack, { rotateX: 0, rotateZ: 0, scale: 1, x: "0%", duration: 1, ease: "power2.inOut" }, BACK + 0.2);

      // Put each label beside its plane's projected position at full separation.
      const placeLabels = () => {
        const stage = root.querySelector<HTMLElement>("[data-hero-stage]")!;
        const p = tl.progress();
        tl.progress(PEAK / tl.duration());
        const stageRect = stage.getBoundingClientRect();
        // Key each label to the projected centre of the plane's anchor element, not the full layer.
        const tops = layers.map((l) => {
          const r = (l.querySelector("[data-anchor]") ?? l.querySelector("g[data-plane]") ?? l).getBoundingClientRect();
          return r.top + r.height / 2 - stageRect.top;
        });
        tl.progress(p);
        // Keep labels from colliding: walk top to bottom and enforce a minimum gap.
        const order = tops.map((t, i) => ({ t, i })).sort((a, b) => a.t - b.t);
        const minGap = 30;
        for (let k = 1; k < order.length; k++) {
          if (order[k].t - order[k - 1].t < minGap) order[k].t = order[k - 1].t + minGap;
        }
        order.forEach(({ t, i }) => {
          const item = labelItems[i];
          item.style.top = `${Math.round(t)}px`;
          item.style.transform = "translateY(-50%)";
        });
      };
      placeLabels();
      ScrollTrigger.addEventListener("refresh", placeLabels);

      return () => {
        ScrollTrigger.removeEventListener("refresh", placeLabels);
      };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative flex items-center overflow-hidden pb-12 pt-20 lg:min-h-[100svh] lg:pb-16 lg:pt-28" data-hero>
      <div className="container grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h1 ref={h1} className="w-fit max-w-[14ch] text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.02] tracking-[-0.025em]">
            Your drawings already know the answer.
          </h1>
          <Dim measure={h1} className="mt-3" />
          <p className="mt-6 max-w-[46ch] text-body text-vx-400">
            Vertex reads every drawing in your archive exactly, finds any part in milliseconds,
            checks what can be checked, and says what it couldn&apos;t. Cloud, or fully offline
            behind your firewall.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/diagnostic/">Book a diagnostic</Button>
            <Link href="/how-it-works/" className="link text-body">
              Read how it works
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-7" data-hero-stage style={{ perspective: "1600px" }}>
          <p className="sr-only">
            An engineering drawing of a flanged bearing housing: front view, section A–A, a variant
            table, and an anonymised title block. As you scroll, the sheet separates into its
            planes—border, geometry, dimension chains, tables, title block—and comes back together.
          </p>
          <div className="relative w-full" style={{ aspectRatio: "1400 / 990", transformStyle: "preserve-3d" }} data-hero-stack data-drawing="pending">
            {ALL_PLANES.map((p, i) => (
              <div
                key={p}
                className="absolute inset-0"
                data-layer={p}
                data-layer-index={i}
                style={{ transformStyle: "preserve-3d" }}
                aria-hidden="true"
              >
                <Sheet planes={[p]} id={`hero-${p}`} decorative />
              </div>
            ))}
          </div>
          <ul
            className="pointer-events-none absolute inset-y-0 right-0 hidden opacity-0 lg:block"
            data-hero-labels
            aria-hidden="true"
          >
            {ALL_PLANES.map((p) => (
              <li key={p} className="absolute right-0 flex items-center gap-3 whitespace-nowrap text-small text-vx-400" data-label={p}>
                <span className="block h-px w-10 bg-vx-600" />
                {PLANE_LABELS[p]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
