"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { DemoFrame } from "@/components/DemoFrame";
import { Dim } from "@/components/Dim";
import { SectionHeader } from "@/components/SectionHeader";
import { mulberry32 } from "@/lib/seed";
import { archive } from "@/content/site";
import archiveImages from "@/content/archive-images.json";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Archive depth. Six layers of real drawing sheets (public archive of US patent
 * drawings, see docs/archive-images.md) recede into the canvas; scroll drives
 * the camera forward. At 0.6 the ten hits light up and everything else dims,
 * and the result panel fills: 10 hits in 9 ms.
 *
 * public/archive/*.webp is the only integration point: the manifest in
 * src/content/archive-images.json lists each file with its size so every
 * <img> reserves its aspect ratio and the layers cause no layout shift.
 *
 * The static render is the final frame.
 */

type ArchiveImage = { src: string; w: number; h: number; patent: string; title: string; year: number };
const IMAGES = archiveImages as ArchiveImage[];
const THUMB_W = 240;
// the family the query finds: the pipe couplings in the archive, the 1937 hero sheet among them
const HIT_PATENTS = ["US 2,090,719", "US 2,442,034", "US 2,529,098", "US 2,508,716", "US 2,459,389", "US 1,910,706", "US 2,677,558", "US 2,278,074", "US 2,916,305", "US 2,805,872"];

const PERSPECTIVE = 900;
const TRAVEL = 1500;
const LAYER_Z = [-520, -1100, -1800, -2600, -3500, -4600];
const HIT_LAYER = 2;
const HITS = archive.familyHits;

type Thumb = { x: number; y: number; hit: boolean; s: number; img: ArchiveImage };

function buildLayers(): Thumb[][] {
  const rand = mulberry32(4120);
  const hits = HIT_PATENTS.map((n) => IMAGES.find((i) => i.patent === n)).filter(Boolean) as ArchiveImage[];
  const rest = IMAGES.filter((i) => !hits.includes(i));
  // deal the remaining sheets across the layers, far layers taking more
  const share = [4, 6, 8, 10, 12, 14];
  const total = share.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return LAYER_Z.map((_, li) => {
    const count = Math.round((share[li] / total) * rest.length);
    const thumbs: Thumb[] = [];
    for (let i = 0; i < count && cursor < rest.length; i++) {
      // bias toward the centre so the field reads as a volume, not a ring
      const u = rand() - 0.5;
      const v = rand() - 0.5;
      const x = Math.sign(u) * Math.pow(Math.abs(u) * 2, 1.4) * (1100 + li * 300);
      const y = Math.sign(v) * Math.pow(Math.abs(v) * 2, 1.4) * (700 + li * 180);
      thumbs.push({ x: Math.round(x), y: Math.round(y), hit: false, s: 0.8 + rand() * 0.5, img: rest[cursor++] });
    }
    if (li === HIT_LAYER) {
      // the family: a loose cluster, centre-right, clear of the result panel
      hits.forEach((img, i) => {
        thumbs.push({
          x: Math.round(60 + (i % 5) * 260 + (rand() - 0.5) * 40),
          y: Math.round(-330 + Math.floor(i / 5) * 400 + (rand() - 0.5) * 40),
          hit: true,
          s: 1,
          img,
        });
      });
    }
    return thumbs;
  });
}

/** Swap data-src → src once the section is within 800px of the viewport, so the field costs nothing on first load. */
function loadWhenNear(root: HTMLElement) {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>("img[data-src]"));
  if (!imgs.length) return;
  const load = () => imgs.forEach((im) => { const src = im.dataset.src; if (src) { im.src = src; delete im.dataset.src; } });
  if (!("IntersectionObserver" in window)) return load();
  const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: "800px 0px" });
  io.observe(root);
}

function layerStyle(z: number, progress: number) {
  const zNow = z + TRAVEL * progress;
  const opacity = zNow > -140 ? 0 : Math.max(0.4, Math.min(1, 1.05 - -zNow / 4200));
  return { z: zNow, opacity };
}

export default function Find() {
  const section = useRef<HTMLElement>(null);
  const layers = useMemo(() => buildLayers(), []);

  useEffect(() => {
    if (prefersReducedMotion() && section.current) loadWhenNear(section.current);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const root = section.current!;
      const layerEls = Array.from(root.querySelectorAll<HTMLElement>("[data-depth-layer]"));
      const hits = root.querySelectorAll<HTMLElement>("[data-thumb='hit']");
      const misses = root.querySelectorAll<HTMLElement>("[data-thumb='miss']");
      const results = root.querySelector<HTMLElement>("[data-results]")!;
      const rows = results.querySelectorAll("[data-row]");
      loadWhenNear(root);

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
      // before the reveal the family looks like every other sheet
      gsap.set(hits, { borderColor: "#415A77", filter: "grayscale(1) brightness(0.8)", opacity: 1 });
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
      tl.to(hits, { borderColor: "#E0E1DD", filter: "grayscale(0) brightness(1)", duration: 0.12, ease: "power2.out" }, 0.6);
      tl.to(results, { opacity: 1, duration: 0.08 }, 0.62);
      tl.to(rows, { opacity: 1, y: 0, duration: 0.1, stagger: 0.03, ease: "power2.out" }, 0.64);

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.vars.trigger === root && t.kill());
      };
    },
    { scope: section },
  );

  return (
    <section ref={section} className="rule flex min-h-[100svh] flex-col justify-start pb-8 pt-24 lg:pt-28" data-find>
      <div className="container">
        <SectionHeader
          title="Find any part in milliseconds."
          lede={
            <>
              By drawing number, by words, by dimensions, or by dropping a file. Vertex searched one manufacturer&apos;s
              archive of about 7,000 drawings with a precision at one of {archive.searchP1}. It finds a family in {archive.familyMs} ms.
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
                        <ThumbSheet key={ti} thumb={t} far={li >= 3} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* the query and its answer */}
          <div className="absolute bottom-4 left-4 w-[min(360px,calc(100%-2rem))] rounded-md border border-vx-600 bg-vx-900 p-4 sm:bottom-6 sm:left-6">
            <div className="flex items-baseline justify-between gap-4" data-query>
              <span className="mono text-body text-vx-100">tapered pipe coupling</span>
              <span className="text-micro text-vx-400">query</span>
            </div>
            <div className="mt-3">
              <Dim label={`${archive.familyMs} ms`} tone="dark" />
            </div>
            <div className="mt-3" data-results>
              <div className="flex items-baseline justify-between">
                <span className="mono text-body text-vx-100">{HITS} hits</span>
                <span className="text-micro text-vx-400">one family</span>
              </div>
              <ul className="mt-2 divide-y divide-vx-600/60 border-t border-vx-600/60">
                {[
                  ["US 2,090,719", "Form of pipe coupling, 1937"],
                  ["US 2,442,034", "Pipe coupling, 1948"],
                  ["US 2,529,098", "Pipe coupling, 1950"],
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

/**
 * One real sheet in the field: a vx-800 frame around a lazily loaded image whose
 * aspect ratio is reserved from the manifest. Far layers are desaturated toward
 * vx-400; hits are lit at full contrast by the timeline.
 */
function ThumbSheet({ thumb, far }: { thumb: Thumb; far: boolean }) {
  const { img, x, y, hit, s } = thumb;
  const w = Math.round(THUMB_W * s);
  const h = Math.round((w * img.h) / img.w);
  return (
    <figure
      className="absolute m-0 overflow-hidden rounded-xs border bg-vx-800"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        transform: "translate(-50%, -50%)",
        borderColor: hit ? "#E0E1DD" : "#415A77",
        filter: hit ? "none" : far ? "grayscale(1) brightness(0.55)" : "grayscale(1) brightness(0.8)",
      }}
      data-thumb={hit ? "hit" : "miss"}
      title={`${img.patent} · ${img.title} · ${img.year}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-src={img.src} width={img.w} height={img.h} alt="" loading="lazy" decoding="async" className="block h-full w-full object-cover" />
    </figure>
  );
}
