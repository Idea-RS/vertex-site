"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Bracket, StepScene, useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";
import { Dim } from "@/components/Dim";
import { archive } from "@/content/site";
import archiveImages from "@/content/archive-images.json";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Find, as a search you watch happen. Left, pinned: a column of real patent
 * drawing sheets racing upward as the user scrolls: a small set tiled twice so
 * it reads as endless, with a vertical blur scaled to scroll velocity. As step
 * two lands, the column decelerates to rest (500ms ease-out) on the frame that
 * holds the matches, the blur clears, the three matches lift with a bracket and
 * everything else steps back. Steps three and four are unchanged. Phones and
 * reduced motion get the still 6 × 6 wall.
 */

type ArchiveImage = { src: string; w: number; h: number; patent: string; title: string; year: number };
const IMAGES = archiveImages as ArchiveImage[];
const QUERY = "flanged housing Ø160";
const MATCHES = ["US 2,271,336", "US 2,015,233", "US 1,689,856"]; // bearing housings in the archive
const COLS = 6;
const REST_ROWS = 6; // the frame the search stops on
const LOOP_ROWS = 9; // the looping set: three rows of passers-by, then the resting six
const GAP = 8;
const REST_START = COLS * (LOOP_ROWS - REST_ROWS);
const LOOP = (() => {
  const hits = MATCHES.map((n) => IMAGES.find((i) => i.patent === n)).filter(Boolean) as ArchiveImage[];
  const rest = IMAGES.filter((i) => !hits.includes(i));
  const resting: ArchiveImage[] = rest.slice(0, COLS * REST_ROWS - hits.length);
  // the three hits sit at cells 8, 16 and 27 of the resting frame, so they read as found, not arranged
  resting.splice(8, 0, hits[0]);
  resting.splice(16, 0, hits[1]);
  resting.splice(27, 0, hits[2]);
  const passers = rest.slice(COLS * REST_ROWS - hits.length, COLS * REST_ROWS - hits.length + REST_START);
  return [...passers, ...resting.slice(0, COLS * REST_ROWS)];
})();
const TRAVEL_LOOPS = 5; // loops of the set that pass before the search lands
const UNREADABLE = 2;
const UNREADABLE_CELLS = [5, 30]; // indices within the resting frame

const steps: Step[] = [
  { key: "query", title: "Ask in your own words", what: "A number, a name, a dimension, or a file. The query is typed the way a draughtsman would say it out loud.", vertex: "Vertex reads it as three constraints: a part family, a feature, and a size." },
  { key: "match", title: "Three sheets answer", what: "Every sheet in the archive is compared on exact values where they exist and inferred values where they don't.", vertex: "The matches lift; everything else steps back. Nothing is hidden, so you can see what didn't match." },
  { key: "result", title: "Each hit says why", what: "A result is not a thumbnail. It is the drawing number, the name, and the chips that matched: the diameter, the feature, the hole count.", vertex: `The family came back in ${archive.familyMs} ms.` },
  { key: "honest", title: "And what it couldn't read", what: `${UNREADABLE} of the 36 sheets it stopped on have no readable geometry: scans below the resolution floor.`, vertex: "We say so on the result, every time. Nothing inferred is ever presented as exact." },
];

export default function Find() {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const blurEl = useRef<SVGFEGaussianBlurElement>(null);
  const isStatic = useStaticLayout();
  const active = useActiveStep(root, !isStatic);
  const idx = steps.findIndex((s) => s.key === active);
  const [settled, setSettled] = useState(false);
  const landed = idx >= 1;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = root.current!;
        const stripEl = strip.current!;
        const queryStep = el.querySelector<HTMLElement>('[data-step="query"]')!;
        const matchStep = el.querySelector<HTMLElement>('[data-step="match"]')!;
        const typed = el.querySelector<HTMLElement>("[data-typed]")!;
        const b = box.current!;
        // the set is rendered twice; a row pitch is one tile plus the gap
        const pitch = () => (stripEl.scrollHeight + GAP) / (LOOP_ROWS * 2);
        const state = { travel: 0, extra: 0 };
        const blur = { v: 0 }; // its own object, so the landing tween never overwrites it
        const apply = () => {
          const p = pitch();
          const loopH = p * LOOP_ROWS;
          const y = -(((REST_START / COLS) * p + state.travel + state.extra) % loopH);
          stripEl.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        };
        const blurTo = gsap.quickTo(blur, "v", {
          duration: 0.35,
          ease: "power2.out",
          onUpdate: () => {
            const v = blur.v;
            blurEl.current?.setAttribute("stdDeviation", `0 ${v.toFixed(2)}`);
            stripEl.style.filter = v > 0.15 ? "url(#find-vblur)" : "none";
          },
        });
        let idle = 0;
        apply();

        // The column, driven by scroll from the section's pin to the second step.
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 90px",
          endTrigger: matchStep,
          end: "center center",
          scrub: 1,
          onUpdate: (self) => {
            state.travel = self.progress * TRAVEL_LOOPS * pitch() * LOOP_ROWS;
            apply();
            blurTo(Math.min(4, Math.abs(self.getVelocity()) / 350));
            clearTimeout(idle);
            idle = window.setTimeout(() => blurTo(0), 160);
          },
          onToggle: (self) => {
            stripEl.style.willChange = self.isActive ? "transform, filter" : "auto";
          },
        });

        // The query types itself over step one and finishes as the column lands.
        const typing = { n: 0 };
        gsap.to(typing, {
          n: QUERY.length,
          ease: "none",
          scrollTrigger: { trigger: queryStep, start: "top 80%", endTrigger: matchStep, end: "top 70%", scrub: 1 },
          onUpdate: () => {
            typed.textContent = QUERY.slice(0, Math.round(typing.n));
          },
        });

        // Landing: the column decelerates onto the next resting frame. Release: it picks up again.
        const land = () => {
          st.disable(false);
          const loopH = pitch() * LOOP_ROWS;
          const target = Math.ceil((state.travel + 1) / loopH) * loopH;
          gsap.to(state, { extra: target - state.travel, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: apply, onComplete: () => setSettled(true) });
          blurTo(0);
        };
        const release = () => {
          setSettled(false);
          gsap.to(state, { extra: 0, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: apply, onComplete: () => st.enable() });
        };
        b.addEventListener("vx:land", land);
        b.addEventListener("vx:release", release);
        return () => {
          clearTimeout(idle);
          b.removeEventListener("vx:land", land);
          b.removeEventListener("vx:release", release);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Phase → the wall; landing and release → the column.
  const wasLanded = useRef(false);
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    b.dataset.phase = isStatic ? "honest" : idx < 1 ? "wall" : idx < 3 ? "result" : "honest";
    if (isStatic) return;
    if (landed && !wasLanded.current) b.dispatchEvent(new Event("vx:land"));
    if (!landed && wasLanded.current) b.dispatchEvent(new Event("vx:release"));
    wasLanded.current = landed;
  }, [idx, isStatic, landed]);

  const showHonest = isStatic || idx >= 3;

  /** One tile. `rest` is the tile's index within the resting frame, or -1 for a passer-by. `primary` marks the copy the bracket measures. */
  const tile = (img: ArchiveImage, rest: number, primary: boolean, key: string) => {
    const hit = rest >= 0 && MATCHES.includes(img.patent);
    const unreadable = rest >= 0 && UNREADABLE_CELLS.includes(rest);
    return (
      <figure
        key={key}
        className="wall-sheet m-0 overflow-hidden rounded-xs border border-vx-600 bg-vx-800"
        style={{ aspectRatio: "1 / 1" }}
        data-hit={hit ? "true" : undefined}
        data-match={hit && primary ? MATCHES.indexOf(img.patent) : undefined}
        data-unreadable={unreadable && primary ? UNREADABLE_CELLS.indexOf(rest) : undefined}
        title={`${img.patent} · ${img.title} · ${img.year}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} width={img.w} height={img.h} alt="" loading="lazy" decoding="async" className="block h-full w-full object-cover object-top" />
      </figure>
    );
  };

  const visual = (
    <div ref={box} className="relative overflow-hidden rounded-lg bg-vx-800 p-3" data-phase="honest">
      {isStatic ? (
        <div className="grid grid-cols-6 gap-2" role="img" aria-label="36 drawing sheets from the archive">
          {LOOP.slice(REST_START).map((img, i) => tile(img, i, true, `s${i}`))}
        </div>
      ) : (
        <div className="relative overflow-hidden" style={{ aspectRatio: "1 / 1" }} role="img" aria-label="Drawing sheets from the archive, passing until the search lands on 36 of them">
          <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
            <filter id="find-vblur" x="0" y="-10%" width="100%" height="120%" colorInterpolationFilters="sRGB">
              <feGaussianBlur ref={blurEl} stdDeviation="0 0" edgeMode="duplicate" />
            </filter>
          </svg>
          <div ref={strip} className="grid grid-cols-6 gap-2" data-strip>
            {[0, 1].map((copy) => LOOP.map((img, i) => tile(img, i >= REST_START ? i - REST_START : -1, copy === 0, `${copy}-${i}`)))}
          </div>
        </div>
      )}
      {(isStatic || settled) && landed && <Bracket box={box} selector={showHonest ? '[data-unreadable="0"]' : '[data-match="0"]'} active={active ?? "static"} side="left" inset={0} />}
    </div>
  );

  const intro = (
    <div>
      <h2 className="max-w-[16ch] text-h2">Find any part in milliseconds.</h2>
      <p className="mt-4 text-body text-vx-600">
        By drawing number, by words, by dimensions, or by dropping a file. Measured on one manufacturer&apos;s archive of about 7,000 drawings: precision at one of {archive.searchP1}.
      </p>
    </div>
  );

  return (
    <div ref={root} data-find>
      <StepScene
        id="find"
        label="Find"
        steps={steps}
        active={active}
        isStatic={isStatic}
        intro={intro}
        visual={visual}
        renderStep={(s, i, lit) => (
          <div className="w-full max-w-[44ch]">
            <div className="flex items-baseline gap-4">
              <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-h3 text-vx-900">{s.title}</h3>
            </div>
            {s.key === "query" && (
              <div className="mono mt-4 flex h-11 items-center rounded-sm border border-vx-400 bg-vx-100 px-3 text-body text-vx-900" role="textbox" aria-readonly="true" aria-label="Search query">
                <span data-typed>{isStatic ? QUERY : ""}</span>
                <span className={`ml-px inline-block h-5 w-px bg-vx-900 ${lit ? "" : "opacity-0"}`} aria-hidden="true" />
              </div>
            )}
            {s.key === "result" && (
              <div className="mt-4">
                <Dim label={`${archive.familyMs} ms`} tone="light" />
                <ul className="mt-2 divide-y divide-vx-400 border-y border-vx-400">
                  {[
                    ["US 2,271,336", "Bearing mounting, 1942", ["Ø160", "flange", "8 holes"]],
                    ["US 2,015,233", "Seal for bearing housings, 1935", ["Ø160", "flange", "6 holes"]],
                    ["US 1,689,856", "Bearing mounting, 1928", ["Ø158", "flange", "8 holes"]],
                  ].map(([no, name, chips]) => (
                    <li key={no as string} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2 text-small">
                      <span className="mono text-vx-600">{no as string}</span>
                      <span className="text-vx-900">{name as string}</span>
                      <span className="ml-auto flex gap-1">
                        {(chips as string[]).map((c) => (
                          <span key={c} className="mono rounded-xs border border-vx-400 px-1.5 text-micro text-vx-600">
                            {c}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-3 text-body text-vx-600">{s.what}</p>
            {s.vertex && <p className="mt-2 text-body text-vx-900">{s.vertex}</p>}
          </div>
        )}
      />
    </div>
  );
}
