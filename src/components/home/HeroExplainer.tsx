"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { PATENT_PLANES, PATENT_PLANE_LABELS, PATENT_W, PATENT_H, PatentSheet, type PatentPlane } from "@/components/drawing/PatentSheet";
import { planeDescriptions } from "@/content/planes";
import { Dim } from "@/components/Dim";
import { Button } from "@/components/Button";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Hero and explainer.
 *
 * The sheet lives in one sticky layer that spans both. Hero: the 1950 patent
 * scan at rest with its provenance caption; over the first 30% of the hero's
 * scroll the vector re-draft draws itself over the scan (geometry first,
 * dimensions ~300 ms behind) while the scan fades; over the rest of the hero
 * the sheet travels into the left column — one scale-and-translate, nothing
 * else. Then the explainer, in the page's one vocabulary: the sheet stays
 * pinned left, five steps scroll on the right, and the step in the centre band
 * lights its plane — full vx-100 strokes, a 4px lift, every other plane at 25%,
 * an orange bracket beside it measuring it — with 350 ms ease-out transitions.
 * Hover, tap or focus on a plane jumps to its step. Nothing else moves.
 *
 * Below 1024px and under reduced motion: the still scan with its caption, then
 * the vector sheet as a still above the five steps as a plain list.
 */

const SCAN = { src: "/hero/sketch.webp", w: PATENT_W, h: PATENT_H };
const CAPTION = "US Patent 2,529,098 · 1950 · public domain";
const NAV = 90; // px: inset + nav bar; the sticky layer sits under it

export default function HeroExplainer() {
  const root = useRef<HTMLDivElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const bracketTarget = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<PatentPlane | null>(null);
  const [bracket, setBracket] = useState<{ top: number; left: number; height?: number; width?: number; axis: "x" | "y" } | null>(null);
  // Reduced motion gets the static layout (same as below 1024px). Read after mount so the
  // server markup and the first client render agree.
  const [staticLayout, setStaticLayout] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStaticLayout(mq.matches);
    mq.addEventListener("change", sync);
    const id = requestAnimationFrame(sync);
    return () => {
      mq.removeEventListener("change", sync);
      cancelAnimationFrame(id);
    };
  }, []);

  // Which step is in the centre band → which plane is lit.
  useEffect(() => {
    const el = root.current;
    if (!el || staticLayout) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const p = e.target.getAttribute("data-step") as PatentPlane;
          if (e.isIntersecting) setActive(p);
          else setActive((a) => (a === p ? null : a));
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [staticLayout]);

  // Apply the lit plane and place the bracket beside its anchor.
  useEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
    if (!stage) return;
    stage.dataset.active = active ?? "";
    PATENT_PLANES.forEach((p) => {
      const layer = stage.querySelector<HTMLElement>(`[data-layer="${p}"]`);
      if (layer) layer.dataset.state = active === p ? "active" : active ? "dim" : "";
    });
    // Measure after the plane's 350ms lift so the bracket lands where the anchor ends up.
    const anchor = active ? stage.querySelector<SVGElement>(`[data-layer="${active}"] [data-anchor]`) : null;
    const box = stage.querySelector<HTMLElement>("[data-box]");
    const id = requestAnimationFrame(() => {
    if (!anchor || !box) return setBracket(null);
    const a = anchor.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const scale = b.width / box.offsetWidth; // the stage may be scaled by the handoff
    const r = { left: (a.left - b.left) / scale, top: (a.top - b.top) / scale, w: a.width / scale, h: a.height / scale };
    const side = anchor.getAttribute("data-bracket") ?? "right";
    const T = 24; // the dimension line's thickness
    if (side === "below") setBracket({ axis: "x", left: r.left, top: r.top + r.h + 8, width: r.w });
    else if (side === "above") setBracket({ axis: "x", left: r.left, top: r.top - 8 - T, width: r.w });
    else if (side === "left") setBracket({ axis: "y", left: r.left - 8 - T, top: r.top, height: r.h });
    else if (side === "inside-right") setBracket({ axis: "y", left: r.left + r.w - 8 - T, top: r.top, height: r.h });
    else setBracket({ axis: "y", left: r.left + r.w + 8, top: r.top, height: r.h });
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  // Hover, tap or focus on a plane jumps to its step.
  const jump = useCallback((p: PatentPlane) => {
    const step = root.current?.querySelector<HTMLElement>(`[data-step="${p}"]`);
    if (!step) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: { offset: number }) => void } }).__lenis;
    const offset = -(window.innerHeight / 2 - step.offsetHeight / 2);
    if (lenis) lenis.scrollTo(step, { offset });
    else window.scrollTo({ top: step.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = root.current!;
        const layer = el.querySelector<HTMLElement>("[data-sticky]")!;
        const stage = el.querySelector<HTMLElement>("[data-stage]")!;
        const stack = el.querySelector<HTMLElement>("[data-stack]")!;
        const scan = el.querySelector<HTMLElement>("[data-scan]")!;
        const caption = el.querySelector<HTMLElement>("[data-caption]")!;
        const heroSlot = el.querySelector<HTMLElement>("[data-hero-slot]")!;
        const hero = el.querySelector<HTMLElement>("[data-hero]")!;
        const landSlot = el.querySelector<HTMLElement>("[data-land-slot]")!;
        const strokes = (p: PatentPlane) => el.querySelectorAll(`[data-layer="${p}"] .draw`);
        const fades = (p: PatentPlane) => el.querySelectorAll(`[data-layer="${p}"] .fade`);

        // Rest position: over the hero slot. Landing: the explainer's left column, both measured
        // relative to the sticky layer (which is at its resting place while the hero is on screen).
        const place = () => {
          // Rest position measured against the scene, not the sticky layer: the layer moves with
          // the viewport, so a refresh mid-scroll would otherwise put the sheet in the wrong place.
          const L = (stage.offsetParent as HTMLElement | null)?.getBoundingClientRect() ?? layer.getBoundingClientRect();
          const S = el.getBoundingClientRect();
          const h = heroSlot.getBoundingClientRect();
          gsap.set(stage, { left: h.left - L.left, top: h.top - S.top, width: h.width });
        };
        // The stage lives in a viewport-fixed layer, so the landing box's page position is taken
        // at the moment the hero has scrolled away: one hero height above where it sits at rest.
        // Landing: the explainer's left column for x and width; vertically centred in the layer.
        const travel = () => {
          const h = heroSlot.getBoundingClientRect();
          const l = landSlot.getBoundingClientRect();
          const S = el.getBoundingClientRect();
          const Lh = layer.getBoundingClientRect().height;
          const scale = l.width / h.width;
          const restTop = h.top - S.top;
          const targetTop = (Lh - h.height * scale) / 2;
          return { x: l.left - h.left, y: targetTop - restTop, scale };
        };
        place();
        gsap.set(stage, { x: 0, y: 0, scale: 1, transformOrigin: "top left" });
        layer.dataset.placed = "true";

        // Start state: scan visible, vector undrawn.
        PATENT_PLANES.forEach((p) => {
          gsap.set(strokes(p), { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(fades(p), { opacity: 0 });
        });
        stack.removeAttribute("data-drawing");
        gsap.set(scan, { opacity: 1, filter: "grayscale(0) brightness(1)" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: `top ${NAV}px`,
            end: `bottom ${NAV}px`,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: place,
          },
        });
        // 0 → 0.30: scan to CAD
        const draw = (p: PatentPlane, at: number, dur: number) => {
          tl.to(strokes(p), { strokeDashoffset: 0, duration: dur, ease: "power2.out" }, at);
          tl.to(fades(p), { opacity: 1, duration: dur * 0.4 }, at + dur * 0.5);
        };
        draw("border-zones", 0.0, 0.16);
        draw("geometry", 0.02, 0.2);
        draw("dimensions", 0.08, 0.2);
        draw("tables-notes", 0.1, 0.16);
        draw("title-block", 0.12, 0.16);
        tl.to(scan, { filter: "grayscale(1) brightness(0.62)", duration: 0.14, ease: "none" }, 0.06);
        tl.to(scan, { opacity: 0, duration: 0.1, ease: "none" }, 0.2);
        tl.to(caption, { opacity: 0, duration: 0.08 }, 0.14);
        // 0.30 → 1: settle into the left column
        tl.to(stage, { x: () => travel().x, y: () => travel().y, scale: () => travel().scale, duration: 0.7, ease: "power2.inOut" }, 0.3);
        return () => {};
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const desc = active ? planeDescriptions[active] : null;

  return (
    <div ref={root} className="relative" data-scene data-static={staticLayout ? "true" : undefined}>
      {/* ---------- the sticky sheet (desktop) ---------- */}
      <div className="pointer-events-none sticky z-10 hidden lg:block [[data-static]_&]:hidden" style={{ top: NAV, height: `calc(100svh - ${NAV}px)` }} data-sticky role="group" aria-label="The sheet, plane by plane">
        <div className="container relative h-full">
          <div className="pointer-events-auto absolute invisible [[data-placed]_&]:visible" style={{ aspectRatio: `${SCAN.w} / ${SCAN.h}`, width: "58%" }} data-stage>
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-vx-800 p-3" data-box>
              <div className="relative h-full w-full" data-stack data-drawing="pending">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SCAN.src} width={SCAN.w} height={SCAN.h} alt="" className="absolute inset-0 h-full w-full rounded-xs object-contain object-top" data-scan fetchPriority="high" />
                {PATENT_PLANES.map((p) => (
                  <div
                    key={p}
                    className="plane-layer absolute inset-0"
                    data-layer={p}
                    role="button"
                    tabIndex={0}
                    aria-label={`${PATENT_PLANE_LABELS[p]}: jump to its step`}
                    onMouseEnter={() => active && jump(p)}
                    onClick={() => jump(p)}
                    onFocus={() => jump(p)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") jump(p);
                    }}
                  >
                    <PatentSheet planes={[p]} id={`hero-${p}`} decorative />
                  </div>
                ))}
              </div>
              {/* the bracket: an orange dimension line beside the lit element, measuring it */}
              {bracket && (
                <div className="absolute" style={{ top: 12 + bracket.top, left: 12 + bracket.left, height: bracket.height ?? 24, width: bracket.width ?? 24 }} key={active ?? "none"}>
                  <div ref={bracketTarget} className={bracket.axis === "y" ? "absolute inset-y-0 left-0 w-px" : "absolute inset-x-0 top-0 h-px"} />
                  <Dim axis={bracket.axis} measure={bracketTarget} tone="dark" className="absolute left-0 top-0" />
                </div>
              )}
            </div>
            <p className="mono absolute left-0 top-full mt-3 whitespace-nowrap text-micro text-vx-600" data-caption>
              {CAPTION}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- hero ---------- */}
      <section className="relative pb-12 pt-20 lg:-mt-[calc(100svh-90px)] lg:flex lg:items-center lg:pb-0 lg:pt-0 [[data-static]_&]:mt-0" style={{ minHeight: `calc(100svh - ${NAV}px)` }} data-hero>
        <div className="container grid items-center gap-10 lg:grid-cols-12 lg:gap-8 lg:[[data-static]_&]:grid-cols-1">
          <div className="lg:col-span-5">
            <h1 ref={h1} className="w-fit max-w-[14ch] text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.02] tracking-[-0.025em]">
              Your drawings already know the answer.
            </h1>
            <Dim measure={h1} className="mt-3" />
            <p className="mt-6 max-w-[46ch] text-body text-vx-600">
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
          {/* the still scan: phones and reduced motion */}
          <figure className="lg:hidden [[data-static]_&]:block lg:[[data-static]_&]:col-span-7">
            <div className="overflow-hidden rounded-lg bg-vx-800 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SCAN.src} width={SCAN.w} height={SCAN.h} alt="Sheet 1 of US patent 2,529,098, a pipe coupling drawn in 1946 by George A. Noll: an end view of the sealing ring beside a longitudinal section" className="block h-auto w-full rounded-xs" />
            </div>
            <figcaption className="mono mt-3 text-micro text-vx-600">{CAPTION}</figcaption>
          </figure>
          {/* where the sheet rests on desktop (the sticky stage is placed over this) */}
          <div className="hidden lg:col-span-7 lg:block [[data-static]_&]:hidden">
            <div data-hero-slot className="w-full" style={{ aspectRatio: `${SCAN.w} / ${SCAN.h}` }} />
          </div>
        </div>
      </section>

      {/* ---------- explainer: sheet left, steps right ---------- */}
      <section className="relative" data-explainer aria-label="What a drawing sheet is made of">
        <div className="rule absolute inset-x-0 top-0 lg:hidden" aria-hidden="true" />
        <div className="container lg:grid lg:grid-cols-12 lg:gap-8">
          {/* left: the landing box (measurement only on desktop); the still sheet on phones */}
          <div className="pt-16 lg:col-span-7 lg:pt-0">
            <div data-land-slot className="w-full lg:mt-[calc(50svh-45px-21vw)] lg:w-[92%]" style={{ aspectRatio: `${SCAN.w} / ${SCAN.h}` }} aria-hidden="true">
              <div className="overflow-hidden rounded-lg bg-vx-800 p-3 lg:hidden [[data-static]_&]:block">
                <PatentSheet id="still" />
              </div>
            </div>
            <p className="mono mt-3 text-micro text-vx-600 lg:hidden">CAD re-draft of the sheet above: five planes.</p>
          </div>
          {/* right: five steps */}
          <div className="lg:col-span-5">
            <div className="max-w-[44ch] pb-10 pt-16 lg:pb-[30svh] lg:pt-[36svh]" data-intro>
              <p className="mono text-small text-vx-600">US 2,529,098 · Pipe coupling · 1950 · public domain</p>
              <p className="mt-4 text-body text-vx-900">
                On screen: George A. Noll&apos;s coupling as a CAD sheet — the sealing ring in end view beside the section through the sleeve, dimensioned, tabulated and titled.
              </p>
              <p className="mt-3 text-body text-vx-600">Five layers make up this sheet. Each one is something Vertex reads.</p>
            </div>
            <ol className="lg:pb-[35svh]">
              {PATENT_PLANES.map((p, i) => {
                const d = planeDescriptions[p];
                const lit = active === p;
                return (
                  <li key={p} data-step={p} className="step border-t border-vx-400 py-8 lg:flex lg:min-h-[70svh] lg:items-center lg:border-0 lg:py-0" data-lit={lit ? "true" : undefined}>
                    <div className="max-w-[44ch]">
                      <div className="flex items-baseline gap-4">
                        <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                        <h2 className="text-h3 text-vx-900">{d.title}</h2>
                      </div>
                      <p className="mt-3 text-body text-vx-600">{d.what}</p>
                      <p className="mt-2 text-body text-vx-900">{d.vertex}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
      <p className="sr-only" aria-live="polite">{desc ? `${desc.title}: ${desc.vertex}` : ""}</p>
    </div>
  );
}
