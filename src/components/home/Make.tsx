"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { DemoFrame } from "@/components/DemoFrame";
import { Dim } from "@/components/Dim";
import { SectionHeader } from "@/components/SectionHeader";
import { Sheet, VARIANT_ROWS } from "@/components/drawing/Sheet";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * The variant loop, scrubbed by scroll: the table marker moves to a new row,
 * the dimension text updates, the verdict reads PASS, the watermark lifts,
 * initials appear in the title block. The static render is the final frame.
 */

const FROM = 1; // S2
const TO = 3; // S4
const ROW_H = 32;

const steps = [
  { title: "Pick a row", body: "The variant table on your own drawing is the spec. Choose the row you need." },
  { title: "Generate", body: "Vertex regenerates the sheet from your template. Every dimension follows the row." },
  { title: "Gate", body: "Deterministic checks run. The verdict says what passed and what it couldn’t check." },
  { title: "Sign", body: "A named person signs. Until then the sheet says so on its face." },
];

export default function Make() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const root = section.current!;
      const marker = root.querySelector<SVGGElement>("[data-row-marker]")!;
      const cur = root.querySelector<SVGGElement>("[data-dim-current-group]")!;
      const prev = root.querySelector<SVGGElement>("[data-dim-prev-group]")!;
      const watermark = root.querySelector<SVGGElement>("[data-watermark]")!;
      const checked = root.querySelector<SVGTextElement>("[data-cell='checkedBy']")!;
      const verdictPending = root.querySelector<HTMLElement>("[data-verdict='pending']")!;
      const verdictPass = root.querySelector<HTMLElement>("[data-verdict='pass']")!;
      const stepEls = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));

      // Start state.
      gsap.set(marker, { y: ROW_H * FROM });
      gsap.set(cur, { opacity: 0 });
      gsap.set(prev, { opacity: 1 });
      gsap.set(watermark, { opacity: 1, y: 0 });
      gsap.set(checked, { opacity: 0 });
      gsap.set(verdictPass, { opacity: 0 });
      gsap.set(verdictPending, { opacity: 1 });
      gsap.set(stepEls, { color: "#778DA9" });
      gsap.set(stepEls[0], { color: "#E0E1DD" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=220%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      const activate = (i: number, at: number) => {
        stepEls.forEach((el, k) => tl.to(el, { color: k === i ? "#E0E1DD" : "#778DA9", duration: 0.04 }, at));
      };
      // 1. pick a row
      tl.to(marker, { y: ROW_H * TO, duration: 0.16, ease: "power2.inOut" }, 0.04);
      // 2. generate
      activate(1, 0.22);
      tl.to(prev, { opacity: 0, duration: 0.08 }, 0.26);
      tl.to(cur, { opacity: 1, duration: 0.1 }, 0.34);
      // 3. gate
      activate(2, 0.48);
      tl.to(verdictPending, { opacity: 0, duration: 0.06 }, 0.56);
      tl.to(verdictPass, { opacity: 1, duration: 0.08 }, 0.6);
      // 4. sign
      activate(3, 0.72);
      tl.to(watermark, { opacity: 0, y: -40, duration: 0.14, ease: "power2.in" }, 0.76);
      tl.to(checked, { opacity: 1, duration: 0.08 }, 0.88);

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.vars.trigger === root && t.kill());
      };
    },
    { scope: section },
  );

  return (
    <section ref={section} className="rule flex min-h-[100svh] flex-col justify-start pb-8 pt-24 lg:pt-36" data-make>
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            title="Make the variant. Gate it. Sign it."
            lede="Pick a row from your own variant table. Vertex regenerates the sheet from your template, runs the checks, and holds it as not approved until a named person signs."
          />
          <ol className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:w-[46%]">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-vx-600 pt-3">
                <div className="flex items-baseline gap-2" data-step>
                  <span className="mono text-micro">{i + 1}</span>
                  <span className="text-small font-medium">{s.title}</span>
                </div>
                <p className="mt-1 hidden text-micro text-vx-400 xl:block">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <DemoFrame label="Make" className="mt-8" frameRef={frame} fitHeight="calc(100svh - 24.5rem)">
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
            <div className="relative h-full" style={{ aspectRatio: "1400 / 990", maxWidth: "100%" }}>
              <Sheet
                id="make"
                row={TO}
                prevRow={FROM}
                checkedBy="A.M.P."
                watermark
                label={`Generated variant of drawing EEI-3057 at row ${VARIANT_ROWS[TO].size}: outer diameter ${VARIANT_ROWS[TO].a}, PCD ${VARIANT_ROWS[TO].b}, bore ${VARIANT_ROWS[TO].d}, ${VARIANT_ROWS[TO].n} holes. Checked by A.M.P.`}
              />
            </div>
          </div>
          {/* verdict */}
          <div className="absolute bottom-3 left-3 rounded-sm border border-vx-600 bg-vx-900 px-3 py-2 sm:bottom-6 sm:left-6 sm:px-4 sm:py-3">
            <div className="relative">
              <div className="flex items-baseline gap-3 sm:gap-4" data-verdict="pass">
                <span className="mono text-body text-vx-100 sm:text-h3">PASS</span>
                <span className="text-micro text-vx-400 sm:text-small">7 checked · 2 couldn&apos;t be checked</span>
              </div>
              <div className="absolute inset-0 flex items-baseline gap-3 sm:gap-4" data-verdict="pending" style={{ opacity: 0 }}>
                <span className="mono text-body text-vx-400 sm:text-h3">Gate</span>
                <span className="text-micro text-vx-400 sm:text-small">9 checks queued</span>
              </div>
            </div>
          </div>
        </DemoFrame>
        <Dim measure={frame} className="mt-3" />
      </div>
    </section>
  );
}
