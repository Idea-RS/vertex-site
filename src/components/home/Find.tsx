"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { DemoFrame } from "@/components/DemoFrame";
import { Dim } from "@/components/Dim";
import { SectionHeader } from "@/components/SectionHeader";
import { mulberry32 } from "@/lib/seed";
import { archive } from "@/content/site";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Archive depth. Six layers of sheet thumbnails recede into the canvas; scroll
 * drives the camera forward. At 0.6 the ten hits light up and everything else
 * dims, and the result panel fills: 10 hits in 9 ms.
 *
 * The static render is the final frame.
 */

const PERSPECTIVE = 900;
const TRAVEL = 1500;
const LAYER_Z = [-520, -1100, -1800, -2600, -3500, -4600];
const HIT_LAYER = 2;
const HITS = archive.familyHits;

type Thumb = { x: number; y: number; hit: boolean; r: number; s: number };

function buildLayers(): Thumb[][] {
  const rand = mulberry32(6926);
  return LAYER_Z.map((_, li) => {
    const count = li === 0 ? 16 : 30 + li * 6;
    const thumbs: Thumb[] = [];
    for (let i = 0; i < count; i++) {
      // bias toward the centre so the field reads as a volume, not a ring
      const u = rand() - 0.5;
      const v = rand() - 0.5;
      const x = Math.sign(u) * Math.pow(Math.abs(u) * 2, 1.4) * (1100 + li * 300);
      const y = Math.sign(v) * Math.pow(Math.abs(v) * 2, 1.4) * (700 + li * 180);
      thumbs.push({ x: Math.round(x), y: Math.round(y), hit: false, r: rand(), s: 0.75 + rand() * 0.6 });
    }
    if (li === HIT_LAYER) {
      // the family: a loose cluster, centre-right, clear of the result panel
      for (let i = 0; i < HITS; i++) {
        thumbs.push({
          x: Math.round(-60 + (i % 5) * 170 + (rand() - 0.5) * 60),
          y: Math.round(-260 + Math.floor(i / 5) * 200 + (rand() - 0.5) * 60),
          hit: true,
          r: rand(),
          s: 0.95 + rand() * 0.2,
        });
      }
    }
    return thumbs;
  });
}

function layerStyle(z: number, progress: number) {
  const zNow = z + TRAVEL * progress;
  const opacity = zNow > -140 ? 0 : Math.max(0.4, Math.min(1, 1.05 - -zNow / 4200));
  return { z: zNow, opacity };
}

export default function Find() {
  const section = useRef<HTMLElement>(null);
  const layers = useMemo(() => buildLayers(), []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const root = section.current!;
      const layerEls = Array.from(root.querySelectorAll<HTMLElement>("[data-depth-layer]"));
      const hits = root.querySelectorAll<SVGElement>("[data-thumb='hit']");
      const misses = root.querySelectorAll<SVGElement>("[data-thumb='miss']");
      const results = root.querySelector<HTMLElement>("[data-results]")!;
      const rows = results.querySelectorAll("[data-row]");

      // Start state (the static markup is the final frame).
      const state = { p: 0 };
      const apply = () => {
        layerEls.forEach((el, i) => {
          const s = layerStyle(LAYER_Z[i], state.p);
          el.style.transform = `translate3d(-50%, -50%, ${s.z}px)`;
          el.style.opacity = String(s.opacity);
        });
      };
      apply();
      gsap.set(hits, { stroke: "#415A77", opacity: 1 });
      gsap.set(misses, { opacity: 1 });
      gsap.set(results, { opacity: 0 });
      gsap.set(rows, { opacity: 0, y: 6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=160%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onToggle: (self) => {
            layerEls.forEach((l) => (l.style.willChange = self.isActive ? "transform, opacity" : "auto"));
          },
        },
      });
      tl.to(state, { p: 1, duration: 1, ease: "none", onUpdate: apply }, 0);
      tl.to(misses, { opacity: 0.22, duration: 0.12, ease: "power2.out" }, 0.6);
      tl.to(hits, { stroke: "#E0E1DD", duration: 0.12, ease: "power2.out" }, 0.6);
      tl.to(results, { opacity: 1, duration: 0.08 }, 0.62);
      tl.to(rows, { opacity: 1, y: 0, duration: 0.1, stagger: 0.03, ease: "power2.out" }, 0.64);

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.vars.trigger === root && t.kill());
      };
    },
    { scope: section },
  );

  return (
    <section ref={section} className="rule flex min-h-[100svh] flex-col justify-start pb-8 pt-24 lg:pt-36" data-find>
      <div className="container">
        <SectionHeader
          title="Find any part in milliseconds."
          lede={
            <>
              By drawing number, by words, by dimensions, or by dropping a file. Vertex searched the design partner&apos;s
              6,926-drawing archive with a precision at one of {archive.searchP1}. It finds a family in {archive.familyMs} ms.
            </>
          }
        />
        <DemoFrame label="Find" className="mt-8" fitHeight="calc(100svh - 22rem)">
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0" style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "55% 45%" }}>
              <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
                {layers.map((thumbs, li) => {
                  const s = layerStyle(LAYER_Z[li], 1);
                  return (
                    <div
                      key={li}
                      data-depth-layer
                      className="absolute left-0 top-0"
                      style={{
                        transform: `translate3d(-50%, -50%, ${s.z}px)`,
                        opacity: s.opacity,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {thumbs.map((t, ti) => (
                        <ThumbSheet key={ti} x={t.x} y={t.y} hit={t.hit} scale={t.s} variant={Math.floor(t.r * 4)} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* the query and its answer */}
          <div className="absolute bottom-4 left-4 w-[min(360px,calc(100%-2rem))] rounded-sm border border-vx-600 bg-vx-900 p-4 sm:bottom-6 sm:left-6">
            <div className="flex items-baseline justify-between gap-4" data-query>
              <span className="mono text-body text-vx-100">Ø31.77 flange housing</span>
              <span className="text-micro text-vx-400">query</span>
            </div>
            <div className="mt-3">
              <Dim label={`${archive.familyMs} ms`} />
            </div>
            <div className="mt-3" data-results>
              <div className="flex items-baseline justify-between">
                <span className="mono text-body text-vx-100">{HITS} hits</span>
                <span className="text-micro text-vx-400">one family</span>
              </div>
              <ul className="mt-2 divide-y divide-vx-600/60 border-t border-vx-600/60">
                {[
                  ["EEI-3057", "Bearing housing, flanged"],
                  ["EEI-3061", "Bearing housing, flanged, long hub"],
                  ["EEI-3104", "Bearing housing, flanged, sealed"],
                ].map(([no, name]) => (
                  <li key={no} className="flex items-baseline gap-3 py-2 text-small" data-row>
                    <span className="mono shrink-0 text-vx-400">{no}</span>
                    <span className="truncate text-vx-100">{name}</span>
                  </li>
                ))}
                <li className="py-2 text-micro text-vx-400" data-row>
                  and {HITS - 3} more
                </li>
              </ul>
            </div>
          </div>
        </DemoFrame>
      </div>
    </section>
  );
}

/** A tiny sheet: border, a view, a title-block cell. Four variants so the field isn't a grid of clones. */
function ThumbSheet({ x, y, hit, scale, variant }: { x: number; y: number; hit: boolean; scale: number; variant: number }) {
  const stroke = hit ? "#E0E1DD" : "#415A77";
  return (
    <svg
      className="absolute"
      style={{ left: x, top: y, width: 96, height: 68, transform: `translate(-50%, -50%) scale(${scale.toFixed(2)})` }}
      viewBox="0 0 96 68"
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      data-thumb={hit ? "hit" : "miss"}
    >
      <rect x="0.5" y="0.5" width="95" height="67" />
      <rect x="62" y="52" width="33" height="15" />
      {variant === 0 && (
        <>
          <circle cx="34" cy="30" r="16" />
          <circle cx="34" cy="30" r="5" />
        </>
      )}
      {variant === 1 && (
        <>
          <rect x="16" y="16" width="36" height="26" />
          <line x1="16" y1="29" x2="52" y2="29" />
        </>
      )}
      {variant === 2 && (
        <>
          <circle cx="30" cy="30" r="14" />
          <rect x="56" y="18" width="22" height="24" />
        </>
      )}
      {variant === 3 && (
        <>
          <path d="M14 42 L14 18 L38 18 L38 30 L54 30 L54 42 Z" />
          <line x1="20" y1="48" x2="50" y2="48" />
        </>
      )}
    </svg>
  );
}
