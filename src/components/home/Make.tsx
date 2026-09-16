"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Dim } from "@/components/Dim";
import { Sheet, VARIANT_ROWS } from "@/components/drawing/Sheet";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * The variant loop, scrubbed by scroll:
 * - Left side: Header + Lede shown first, then steps 1 -> 2 -> 3 -> 4 arrive smoothly one by one as you scroll.
 * - Right side: Enlarged CAD drawing sheet responding synchronously: table marker moves,
 *   dimension text updates, verdict reads PASS, watermark lifts, initials appear in title block.
 */

const FROM = 1; // S2
const TO = 3; // S4
const ROW_H = 32;

const steps = [
  {
    num: "1",
    title: "Pick a row",
    body: "The variant table on your own drawing is the spec. Choose the row you need.",
  },
  {
    num: "2",
    title: "Generate",
    body: "Vertex regenerates the sheet from your template. Every dimension follows the row.",
  },
  {
    num: "3",
    title: "Gate",
    body: "Deterministic checks run. The verdict says what passed and what it couldn’t check.",
  },
  {
    num: "4",
    title: "Sign",
    body: "A named person signs. Until then the sheet says so on its face.",
  },
];

export default function Make() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = section.current!;
      const marker = root.querySelector<SVGGElement>("[data-row-marker]")!;
      const cur = root.querySelector<SVGGElement>("[data-dim-current-group]")!;
      const prev = root.querySelector<SVGGElement>("[data-dim-prev-group]")!;
      const watermark = root.querySelector<SVGGElement>("[data-watermark]")!;
      const checked = root.querySelector<SVGTextElement>("[data-cell='checkedBy']")!;
      const verdictPending = root.querySelector<HTMLElement>("[data-verdict='pending']")!;
      const verdictPass = root.querySelector<HTMLElement>("[data-verdict='pass']")!;
      const stepItems = Array.from(root.querySelectorAll<HTMLElement>("[data-step-item]"));

      if (prefersReducedMotion()) {
        stepItems.forEach((el) => gsap.set(el, { opacity: 1, y: 0, scale: 1 }));
        gsap.set(marker, { y: ROW_H * TO });
        gsap.set(cur, { opacity: 1 });
        gsap.set(prev, { opacity: 0 });
        gsap.set(watermark, { opacity: 0 });
        gsap.set(checked, { opacity: 1 });
        gsap.set(verdictPass, { opacity: 1 });
        gsap.set(verdictPending, { opacity: 0 });
        return;
      }

      setupGsap();

      // Initial resting state
      gsap.set(marker, { y: ROW_H * FROM });
      gsap.set(cur, { opacity: 0 });
      gsap.set(prev, { opacity: 1 });
      gsap.set(watermark, { opacity: 1, y: 0 });
      gsap.set(checked, { opacity: 0 });
      gsap.set(verdictPass, { opacity: 0 });
      gsap.set(verdictPending, { opacity: 1 });

      // Steps initially hidden, ready to arrive smoothly on scroll
      stepItems.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 22, scale: 0.97 });
      });

      const mm = gsap.matchMedia();

      // Desktop: Pinned scrollytelling timeline
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=260%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // 1. Step 1 arrives & table row marker moves to S4
        tl.to(stepItems[0], { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" }, 0.08);
        tl.to(marker, { y: ROW_H * TO, duration: 0.18, ease: "power2.inOut" }, 0.10);

        // 2. Step 2 arrives & sheet dimensions regenerate
        tl.to(stepItems[1], { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" }, 0.32);
        tl.to(prev, { opacity: 0, duration: 0.08 }, 0.35);
        tl.to(cur, { opacity: 1, duration: 0.12 }, 0.41);

        // 3. Step 3 arrives & gate checks verify to PASS
        tl.to(stepItems[2], { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" }, 0.56);
        tl.to(verdictPending, { opacity: 0, duration: 0.08 }, 0.60);
        tl.to(verdictPass, { opacity: 1, duration: 0.10 }, 0.66);

        // 4. Step 4 arrives & watermark lifts and signature signs
        tl.to(stepItems[3], { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" }, 0.78);
        tl.to(watermark, { opacity: 0, y: -40, duration: 0.14, ease: "power2.in" }, 0.82);
        tl.to(checked, { opacity: 1, duration: 0.10 }, 0.90);
      });

      // Mobile/Tablet: Flow layout with staggered scroll reveals
      mm.add("(max-width: 1023px)", () => {
        stepItems.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          });
        });

        const mtl = gsap.timeline({
          scrollTrigger: {
            trigger: root.querySelector("[data-sheet-stage]"),
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        });
        mtl.to(marker, { y: ROW_H * TO, duration: 0.25 });
        mtl.to(prev, { opacity: 0, duration: 0.15 }, 0.25);
        mtl.to(cur, { opacity: 1, duration: 0.15 }, 0.35);
        mtl.to(verdictPending, { opacity: 0, duration: 0.1 }, 0.5);
        mtl.to(verdictPass, { opacity: 1, duration: 0.15 }, 0.55);
        mtl.to(watermark, { opacity: 0, y: -30, duration: 0.2 }, 0.7);
        mtl.to(checked, { opacity: 1, duration: 0.15 }, 0.85);
      });

      return () => {
        mm.revert();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="rule relative flex min-h-[100svh] items-center overflow-hidden pb-12 pt-20 lg:pb-16 lg:pt-28"
      data-make
    >
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column (5 cols): Header + Step-by-Step scrollytelling */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <div data-intro>
              <h2 className="text-h2">Make the variant. Gate it. Sign it.</h2>
              <p className="mt-4 text-body text-vx-600">
                Pick a row from your own variant table. Vertex regenerates the sheet from your template, runs the checks, and holds it as not approved until a named person signs.
              </p>
            </div>

            <ol className="mt-8 flex flex-col gap-3.5 sm:gap-4" data-steps-list>
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  data-step-item={i}
                  className="relative flex items-start gap-4 rounded-lg border border-vx-400/40 bg-vx-100/70 p-3 sm:p-3.5 shadow-xs transition-colors"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-vx-400 bg-vx-100 mono text-micro font-semibold text-vx-900 shadow-xs"
                    data-step-num
                  >
                    {s.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-small font-heading font-medium text-vx-900">{s.title}</h3>
                    <p className="mt-0.5 text-small text-vx-600 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right Column (7 cols): Enlarged Picture Container with Technical Dimension Framing */}
          <div className="flex flex-col justify-center lg:col-span-7" data-sheet-stage>
            <div className="flex w-full items-start gap-2.5 sm:gap-3">
              <div
                ref={frame}
                className="relative flex-1 overflow-hidden rounded-xl border border-vx-400/60 bg-vx-800 p-3 sm:p-5 lg:p-6 shadow-2xl shadow-vx-900/20"
                style={{ aspectRatio: "1400 / 990" }}
              >
                <Sheet
                  id="make"
                  row={TO}
                  prevRow={FROM}
                  checkedBy="S.M."
                  watermark
                  label={`Generated variant of drawing DRG-4120 at row ${VARIANT_ROWS[TO].size}: outer diameter ${VARIANT_ROWS[TO].a}, PCD ${VARIANT_ROWS[TO].b}, bore ${VARIANT_ROWS[TO].d}, ${VARIANT_ROWS[TO].n} holes. Checked by S.M.`}
                />
                {/* verdict overlay */}
                <div className="absolute bottom-3 left-3 rounded-md border border-vx-600 bg-vx-900/95 px-3 py-2 sm:bottom-5 sm:left-5 sm:px-4 sm:py-3 shadow-lg backdrop-blur-xs">
                  <div className="relative">
                    <div className="flex items-baseline gap-3 sm:gap-4" data-verdict="pass">
                      <span className="mono text-body text-vx-100 sm:text-h3 font-semibold">PASS</span>
                      <span className="text-micro text-vx-400 sm:text-small">7 checked · 2 couldn&apos;t be checked</span>
                    </div>
                    <div className="absolute inset-0 flex items-baseline gap-3 sm:gap-4" data-verdict="pending" style={{ opacity: 0 }}>
                      <span className="mono text-body text-vx-400 sm:text-h3 font-semibold">Gate</span>
                      <span className="text-micro text-vx-400 sm:text-small">9 checks queued</span>
                    </div>
                  </div>
                </div>
              </div>
              <Dim axis="y" measure={frame} className="shrink-0" />
            </div>
            <div className="flex w-full justify-start">
              <Dim axis="x" measure={frame} className="mt-2.5 sm:mt-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
