"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { PATENT_PLANES, PATENT_PLANE_LABELS, PatentSheet, type PatentPlane } from "@/components/drawing/PatentSheet";
import { planeDescriptions } from "@/content/planes";
import { Dim } from "@/components/Dim";
import { Button } from "@/components/Button";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Hero and explainer, one pinned scene on desktop.
 *
 *  0.00–0.30  scan → CAD: the vector sheet draws itself over the 1937 patent
 *             drawing (geometry first, dimensions ~300 ms behind) while the
 *             scan desaturates to vx-400 and fades out.
 *  0.30–0.55  handoff: the sheet scales and travels into the left column of
 *             the explainer; hero copy leaves, explainer copy slides in.
 *  0.55–0.80  explode: six planes separate in z with 80 ms lag, back planes
 *             blur, labels name each; then it holds. Scrolling back collapses.
 *
 * Below 1024px and under reduced motion there is no choreography: the hero is
 * the still scan with its caption, and the explainer is a two-column block
 * with the sheet already exploded and the six planes as a plain list.
 */

/** The six plane layers, memoised: hover state lives on the parent and is applied to these imperatively. */
const Layers = memo(function Layers({ onEnter, onLeave, onToggle }: { onEnter: (p: PatentPlane) => void; onLeave: (p: PatentPlane) => void; onToggle: (p: PatentPlane) => void }) {
  return (
    <>
      {PATENT_PLANES.map((p, i) => (
        <div
          key={p}
          className="plane-layer absolute inset-0"
          data-layer={p}
          data-layer-index={i}
          style={{ transformStyle: "preserve-3d" }}
          onMouseEnter={() => onEnter(p)}
          onMouseLeave={() => onLeave(p)}
          onClick={() => onToggle(p)}
        >
          <div className="plane-lift h-full w-full">
            <PatentSheet planes={[p]} id={`hero-${p}`} decorative />
          </div>
        </div>
      ))}
    </>
  );
});

const SCAN = { src: "/hero/sketch.webp", w: 1800, h: 2196 };
const CAPTION = "US Patent 2,090,719 · 1937 · public domain";

export default function HeroExplainer() {
  const root = useRef<HTMLDivElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState<PatentPlane | null>(null);
  const activeRef = useRef<PatentPlane | null>(null);
  const explodedRef = useRef(true); // the static markup is the exploded still; GSAP flips this on desktop
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const enter = useCallback((p: PatentPlane) => {
    if (explodedRef.current) setActive(p);
  }, []);
  const leave = useCallback((p: PatentPlane) => {
    setActive((a) => (a === p ? null : a));
  }, []);
  const toggle = useCallback((p: PatentPlane) => {
    if (explodedRef.current) setActive((a) => (a === p ? null : p));
  }, []);

  // Hover, tap and focus all set the same state; the layers are styled imperatively
  // so the SVG trees are not re-rendered on every hover.
  useEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
    if (!stage) return;
    stage.dataset.active = active ?? "";
    PATENT_PLANES.forEach((p) => {
      const layer = stage.querySelector<HTMLElement>(`[data-layer="${p}"]`);
      if (!layer) return;
      layer.dataset.state = active ? (active === p ? "lifted" : "dimmed") : "";
    });
  }, [active]);

  useEffect(() => {
    const stack = root.current?.querySelector<HTMLElement>("[data-stack]");
    if (!stack) return;
    if (prefersReducedMotion() || !window.matchMedia("(min-width: 1024px)").matches) stack.removeAttribute("data-drawing");
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = root.current!;
        const stage = el.querySelector<HTMLElement>("[data-stage]")!;
        const stack = el.querySelector<HTMLElement>("[data-stack]")!;
        const scan = el.querySelector<HTMLElement>("[data-scan]")!;
        const caption = el.querySelector<HTMLElement>("[data-caption]")!;
        const heroCopy = el.querySelector<HTMLElement>("[data-hero-copy]")!;
        const expCopy = el.querySelector<HTMLElement>("[data-explainer-copy]")!;
        const heroSlot = el.querySelector<HTMLElement>("[data-hero-slot]")!;
        const expSlot = el.querySelector<HTMLElement>("[data-explainer-slot]")!;
        const labels = el.querySelector<HTMLElement>("[data-labels]")!;
        const labelItems = Array.from(labels.querySelectorAll<HTMLElement>("[data-label]"));
        const layers = PATENT_PLANES.map((p) => el.querySelector<HTMLElement>(`[data-layer="${p}"]`)!);
        const strokesOf = (p: PatentPlane) => layers[PATENT_PLANES.indexOf(p)].querySelectorAll(".draw");
        const fadesOf = (p: PatentPlane) => layers[PATENT_PLANES.indexOf(p)].querySelectorAll(".fade");

        // Place the stage over the hero slot; the timeline moves it to the explainer slot.
        const place = () => {
          // offsets are relative to the stage's containing block (the explainer section), not the scene
          const base = (stage.offsetParent as HTMLElement | null)?.getBoundingClientRect() ?? el.getBoundingClientRect();
          const h = heroSlot.getBoundingClientRect();
          // only the resting box; the travel tween owns x/y/scale (resetting them here would
          // freeze a restored mid-scroll position until the next scroll event)
          gsap.set(stage, { left: h.left - base.left, top: h.top - base.top, width: h.width });
        };
        const travel = () => {
          const h = heroSlot.getBoundingClientRect();
          const e = expSlot.getBoundingClientRect();
          return { x: e.left - h.left, y: e.top - h.top, scale: e.width / h.width };
        };
        place();
        gsap.set(stage, { x: 0, y: 0, scale: 1 });
        stage.style.transformOrigin = "top left";

        // Start state: scan visible, vector undrawn, explainer copy off to the right.
        PATENT_PLANES.forEach((p) => {
          gsap.set(strokesOf(p), { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(fadesOf(p), { opacity: 0 });
        });
        stack.removeAttribute("data-drawing");
        gsap.set(scan, { opacity: 1, filter: "grayscale(0) brightness(1)" });
        explodedRef.current = false;
        stage.dataset.exploded = "";
        gsap.set(expCopy, { autoAlpha: 0, x: 48, pointerEvents: "none" });
        gsap.set(labels, { opacity: 0 });
        gsap.set(layers, { z: 0, filter: "blur(0px)", opacity: 1 });
        gsap.set(stack, { rotateX: 0, rotateZ: 0, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 90px",
            end: "+=320%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: place,
            onUpdate: (self) => {
              const ex = self.progress >= 0.78;
              if (ex !== explodedRef.current) {
                explodedRef.current = ex;
                stage.dataset.exploded = ex ? "true" : "";
                if (!ex && activeRef.current) setActive(null);
              }
            },
            onToggle: (self) => {
              const wc = self.isActive ? "transform, filter" : "auto";
              layers.forEach((l) => (l.style.willChange = wc));
              stage.style.willChange = self.isActive ? "transform" : "auto";
            },
          },
        });

        /* ---- 0 → 0.30: scan to CAD ---- */
        const draw = (p: PatentPlane, at: number, dur: number) => {
          tl.to(strokesOf(p), { strokeDashoffset: 0, duration: dur, ease: "power2.out" }, at);
          tl.to(fadesOf(p), { opacity: 1, duration: dur * 0.35 }, at + dur * 0.55);
        };
        draw("border-zones", 0.0, 0.16);
        draw("geometry", 0.02, 0.2);
        draw("dimensions", 0.08, 0.2); // ~300 ms behind the geometry at a normal scroll pace
        draw("tables-notes", 0.11, 0.16);
        draw("title-block", 0.12, 0.16);
        draw("revision", 0.13, 0.16);
        tl.to(scan, { filter: "grayscale(1) brightness(0.62)", duration: 0.14, ease: "none" }, 0.06);
        tl.to(scan, { opacity: 0, duration: 0.1, ease: "none" }, 0.2);
        tl.to(caption, { opacity: 0, duration: 0.08 }, 0.12);

        /* ---- 0.30 → 0.55: handoff ---- */
        tl.to(heroCopy, { opacity: 0, y: -24, duration: 0.1, ease: "power2.in" }, 0.3);
        tl.to(stage, { x: () => travel().x, y: () => travel().y, scale: () => travel().scale, duration: 0.25, ease: "power2.inOut" }, 0.3);
        tl.to(expCopy, { autoAlpha: 1, x: 0, pointerEvents: "auto", duration: 0.13, ease: "power2.out" }, 0.42);

        /* ---- 0.55 → 0.80: explode, then hold ---- */
        const spread = 72;
        const lag = 0.02; // 80 ms at the scrub's natural pace
        tl.to(stack, { rotateX: 40, rotateZ: -8, scale: 0.6, x: "-6%", y: "-10%", duration: 0.2, ease: "power2.out" }, 0.55);
        layers.forEach((layer, i) => {
          tl.to(layer, { z: (i - 2.5) * spread, filter: i === 0 ? "blur(1px)" : i === 1 ? "blur(0.5px)" : "blur(0px)", opacity: i === 0 ? 0.82 : 1, duration: 0.2, ease: "power2.out" }, 0.55 + i * lag);
        });
        tl.to(labels, { opacity: 1, duration: 0.05 }, 0.76);
        tl.from(labelItems, { x: 10, duration: 0.06, stagger: 0.012, ease: "power2.out" }, 0.76);
        tl.to({}, { duration: 0.2 }, 0.8);

        // Label each plane beside its projected anchor at full separation.
        const placeLabels = () => {
          const p = tl.progress();
          tl.progress(0.8);
          const sr = stage.getBoundingClientRect();
          const scaleNow = sr.width / stage.offsetWidth;
          const tops = layers.map((l) => {
            const r = (l.querySelector("[data-anchor]") ?? l).getBoundingClientRect();
            return (r.top + r.height / 2 - sr.top) / scaleNow;
          });
          tl.progress(p);
          const order = tops.map((t, i) => ({ t, i })).sort((a, b) => a.t - b.t);
          for (let k = 1; k < order.length; k++) if (order[k].t - order[k - 1].t < 34) order[k].t = order[k - 1].t + 34;
          order.forEach(({ t, i }) => {
            labelItems[i].style.top = `${Math.round(t)}px`;
          });
        };
        placeLabels();
        ScrollTrigger.addEventListener("refresh", placeLabels);
        return () => ScrollTrigger.removeEventListener("refresh", placeLabels);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const desc = active ? planeDescriptions[active] : null;

  return (
    <div ref={root} className="relative lg:h-[calc(100svh-90px)] lg:overflow-hidden" data-scene>
      {/* ---------------- hero ---------------- */}
      <section className="relative pb-12 pt-20 lg:absolute lg:inset-0 lg:pb-0 lg:pt-0" data-hero>
        <div className="container grid items-center gap-10 lg:h-full lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-hero-copy>
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

          {/* mobile: the still scan */}
          <figure className="lg:hidden">
            <div className="overflow-hidden rounded-lg bg-vx-800 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SCAN.src} width={SCAN.w} height={SCAN.h} alt="Sheet 1 of US patent 2,090,719, a tapered pipe coupling drawn by Karl Alt in 1935" className="block h-auto w-full rounded-xs" />
            </div>
            <figcaption className="mono mt-3 text-micro text-vx-600">{CAPTION}</figcaption>
          </figure>

          {/* desktop: the slot the stage starts in (height-fit so the whole sheet is on screen) */}
          <div className="hidden lg:col-span-7 lg:flex lg:h-full lg:items-center lg:justify-end">
            <div data-hero-slot style={{ height: "calc(100svh - 90px - 9rem)", aspectRatio: `${SCAN.w} / ${SCAN.h}`, maxWidth: "100%" }} />
          </div>
        </div>
      </section>

      {/* ---------------- explainer ---------------- */}
      <section className="relative py-16 lg:absolute lg:inset-0 lg:py-0" data-explainer aria-label="What a drawing sheet is made of">
        <div className="rule absolute inset-x-0 top-0 lg:hidden" aria-hidden="true" />
        <div className="container grid gap-10 lg:h-full lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* left: the landing slot on desktop; on mobile the stage lives here in flow */}
          <div className="lg:col-span-7 lg:flex lg:h-full lg:items-center">
            <div data-explainer-slot className="w-full max-w-full lg:pointer-events-none lg:h-[calc(100svh-90px-5rem)] lg:w-auto lg:aspect-[1800/2196]">
              {/* The stage. Desktop: absolutely positioned by GSAP and pinned. Mobile: in flow, an exploded still. */}
              <div className="relative w-full lg:absolute lg:pointer-events-auto" style={{ aspectRatio: `${SCAN.w} / ${SCAN.h}` }} data-stage data-exploded="true">
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-vx-800 p-3 sm:p-4" style={{ perspective: "1400px" }}>
                  <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }} data-stack data-drawing="pending">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={SCAN.src} width={SCAN.w} height={SCAN.h} alt="" aria-hidden="true" className="absolute inset-0 hidden h-full w-full rounded-xs object-contain object-top lg:block" data-scan fetchPriority="high" />
                    <Layers onEnter={enter} onLeave={leave} onToggle={toggle} />
                  </div>
                  <ul className="pointer-events-none absolute inset-y-0 right-3 hidden lg:block" data-labels aria-hidden="true">
                    {PATENT_PLANES.map((p) => (
                      <li key={p} className="absolute right-0 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap text-micro text-muted-raised" data-label={p}>
                        <span className="block h-px w-6 bg-vx-600" />
                        {PATENT_PLANE_LABELS[p]}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="sr-only">
                  A CAD re-draft of the 1937 patent drawing, separated into six planes: border and zones, geometry, dimensions, tables and notes, title block, revision table.
                </p>
                <p className="mono absolute left-0 top-full mt-3 hidden text-micro text-vx-600 lg:block lg:whitespace-nowrap" data-caption>
                  {CAPTION}
                </p>
              </div>
            </div>
          </div>

          {/* right: copy and the six planes */}
          <div className="lg:col-span-5" data-explainer-copy>
            <h2 className="max-w-[18ch] text-h2">Every sheet is six drawings in one.</h2>
            <div className="mt-5 min-h-[9.5rem] max-w-[46ch]" aria-live="polite">
              {desc ? (
                <>
                  <h3 className="text-h3 text-vx-900">{desc.title}</h3>
                  <p className="mt-2 text-body text-vx-600">{desc.what}</p>
                  <p className="mt-2 text-body text-vx-900">{desc.vertex}</p>
                </>
              ) : (
                <p className="text-body text-vx-600">
                  Vertex reads each plane on its own terms and reports what it found by zone. Hover a plane, or pick one below, to see what it is and what Vertex does with it.
                </p>
              )}
            </div>
            <ul className="mt-8 divide-y divide-vx-400 border-y border-vx-400" role="list">
              {PATENT_PLANES.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    className={`flex w-full items-baseline justify-between gap-4 py-3 text-left text-small transition-colors duration-150 ${active === p ? "text-vx-900" : "text-vx-600 hover:text-vx-900"}`}
                    onMouseEnter={() => setActive(p)}
                    onMouseLeave={() => setActive((a) => (a === p ? null : a))}
                    onFocus={() => setActive(p)}
                    onBlur={() => setActive((a) => (a === p ? null : a))}
                    onClick={() => setActive((a) => (a === p ? null : p))}
                    aria-pressed={active === p}
                  >
                    <span>{PATENT_PLANE_LABELS[p]}</span>
                    <span className="mono text-micro text-vx-600">{String(PATENT_PLANES.indexOf(p) + 1).padStart(2, "0")}</span>
                  </button>
                  {/* mobile and reduced motion: the descriptions are always in the list */}
                  <div className="pb-4 lg:hidden">
                    <p className="text-small text-vx-600">{planeDescriptions[p].what}</p>
                    <p className="mt-1 text-small text-vx-900">{planeDescriptions[p].vertex}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
