"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Bracket, StepScene, useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";
import { Dim } from "@/components/Dim";
import { archive } from "@/content/site";
import archiveImages from "@/content/archive-images.json";
import { gsap, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Find, as a search you watch happen. Left, pinned: a column of real patent
 * drawing sheets. Once the section is on screen and the reader scrolls, the
 * column races upward on its own, at a constant rate with the vertical blur at
 * full strength: a separate rAF loop, independent of scroll speed, so a slow
 * scroll never reads as lag. When step two reaches the centre band the column
 * decelerates onto the frame that holds the matches (about 600ms, ease-out,
 * the blur falling with the speed), and only then do the three matches lift.
 * Steps three and four stay scroll-driven. The loop pauses off screen; phones
 * and reduced motion keep the still 6 × 6 wall.
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
const SPEED = 14; // rows per second while racing
const RAMP = 0.25; // seconds to reach full speed
const BLUR_MAX = 4; // px, vertical, at full speed
const DECEL = { ideal: 0.6, min: 0.5, max: 0.68 }; // seconds; the landing picks the frame that fits
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
  const stripInner = useRef<HTMLDivElement>(null);
  const blurEl = useRef<SVGFEGaussianBlurElement>(null);
  const control = useRef<{ land: (want: boolean) => void } | null>(null);
  const isStatic = useStaticLayout();
  const active = useActiveStep(root, !isStatic);
  const idx = steps.findIndex((s) => s.key === active);
  // Between steps (and past the last one) nothing is in the band; hold the last step rather than reverting.
  const [lastIdx, setLastIdx] = useState(-1);
  if (idx !== -1 && idx !== lastIdx) setLastIdx(idx);
  const shown = idx === -1 ? lastIdx : idx;
  const [settled, setSettled] = useState(false);
  const lifted = isStatic || (settled && shown >= 1);

  // The query types itself over step one, driven by scroll as before, and finishes before step two.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = root.current!;
        const queryStep = el.querySelector<HTMLElement>('[data-step="query"]')!;
        const matchStep = el.querySelector<HTMLElement>('[data-step="match"]')!;
        const typed = el.querySelector<HTMLElement>("[data-typed]")!;
        const typing = { n: 0 };
        gsap.to(typing, {
          n: QUERY.length,
          ease: "none",
          scrollTrigger: { trigger: queryStep, start: "top 80%", endTrigger: matchStep, end: "top 70%", scrub: 1 },
          onUpdate: () => {
            typed.textContent = QUERY.slice(0, Math.round(typing.n));
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // The column: its own rAF loop. Positions are in rows so a resize never tears the frame.
  useEffect(() => {
    if (isStatic) return;
    const el = root.current, outer = strip.current, inner = stripInner.current;
    if (!el || !outer || !inner) return;
    type Mode = "idle" | "racing" | "decel" | "landed";
    const st = {
      mode: "idle" as Mode,
      pos: 0, // rows travelled; a multiple of LOOP_ROWS is the resting frame
      v: 0, // rows per second
      ramp: 0, // seconds into the start-up ramp
      want: false, // step two (or later) is the reader's position
      inView: false,
      blur: -1,
      raf: 0,
      last: 0,
      d: { from: 0, dist: 0, dur: 0, k: 2, t: 0 },
    };
    const pitch = () => (outer.offsetHeight + GAP) / (LOOP_ROWS * 2);
    const draw = () => {
      const rows = (((REST_START / COLS + st.pos) % LOOP_ROWS) + LOOP_ROWS) % LOOP_ROWS;
      outer.style.transform = `translate3d(0, ${(-rows * pitch()).toFixed(2)}px, 0)`;
      const b = Math.round(BLUR_MAX * Math.min(1, st.v / SPEED) * 20) / 20;
      if (b !== st.blur) {
        st.blur = b;
        blurEl.current?.setAttribute("stdDeviation", `0 ${b}`);
        inner.style.filter = b > 0.15 ? "url(#find-vblur)" : "none";
      }
    };
    // Can the column land from here? Cubic Hermite from the current speed to rest, exactly on a resting frame.
    const tryLand = () => {
      if (st.v <= 0) return false;
      const d = (LOOP_ROWS - (st.pos % LOOP_ROWS)) % LOOP_ROWS || LOOP_ROWS;
      const lo = Math.max(DECEL.min, (1.5 * d) / st.v); // k ≥ 1.5: slowing from the first frame
      const hi = Math.min(DECEL.max, (3 * d) / st.v); // k ≤ 3: never overshoots
      if (lo > hi) return false;
      const dur = Math.min(hi, Math.max(lo, DECEL.ideal));
      st.d = { from: st.pos, dist: d, dur, k: (st.v * dur) / d, t: 0 };
      st.mode = "decel";
      return true;
    };
    const settle = () => {
      st.mode = "landed";
      st.pos = 0;
      st.v = 0;
      draw();
      outer.style.willChange = "auto";
      setSettled(true);
    };
    const frame = (now: number) => {
      st.raf = 0;
      if (!st.inView) return;
      const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 0;
      st.last = now;
      if (st.mode === "racing") {
        st.ramp = Math.min(RAMP, st.ramp + dt);
        st.v = SPEED * Math.pow(st.ramp / RAMP, 2);
        st.pos += st.v * dt;
        if (st.want && tryLand()) st.last = now;
      } else if (st.mode === "decel") {
        const d = st.d;
        d.t += dt;
        const u = Math.min(1, d.t / d.dur);
        const h = d.k * u + (3 - 2 * d.k) * u * u + (d.k - 2) * u * u * u;
        const h1 = d.k + 2 * (3 - 2 * d.k) * u + 3 * (d.k - 2) * u * u;
        st.pos = d.from + d.dist * h;
        st.v = Math.max(0, (d.dist * h1) / d.dur);
        if (u >= 1) return settle();
      }
      draw();
      if (st.mode === "racing" || st.mode === "decel") st.raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (st.raf || !st.inView) return;
      st.last = 0;
      outer.style.willChange = "transform";
      st.raf = requestAnimationFrame(frame);
    };
    const race = () => {
      if (st.mode === "racing") return;
      // from rest, ramp up; from a deceleration, carry the speed it had
      st.ramp = st.mode === "decel" ? RAMP * Math.sqrt(Math.min(1, st.v / SPEED)) : 0;
      st.mode = "racing";
      setSettled(false);
      run();
    };
    control.current = {
      land: (want) => {
        st.want = want;
        if (want) {
          if (st.mode === "idle") return settle(); // never raced: it is already on the resting frame
          if (!st.inView && st.mode !== "landed") return settle(); // nobody is watching; arrive
          run();
        } else if (st.mode === "landed" || st.mode === "decel") {
          if (st.inView) race();
          else {
            st.mode = "idle";
            setSettled(false);
          }
        }
      },
    };
    const onScroll = () => {
      if (st.inView && st.mode === "idle" && !st.want) race();
    };
    const io = new IntersectionObserver(([e]) => {
      st.inView = e.isIntersecting;
      if (!st.inView) {
        cancelAnimationFrame(st.raf);
        st.raf = 0;
        if (st.want && st.mode !== "landed") settle();
        return;
      }
      if (st.want && st.mode !== "landed" && st.mode !== "idle") return settle(); // came back from below
      if (st.mode === "racing" || st.mode === "decel") run();
    });
    io.observe(el);
    // Load the column's sheets while the reader is still a screen or so away: an image decoding into the
    // blurred layer mid-race forces that layer to repaint, which is the one thing that costs frames.
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        inner.querySelectorAll("img").forEach((img) => {
          img.loading = "eager";
          img.decode().catch(() => {});
        });
        near.disconnect();
      },
      { rootMargin: "150% 0px" },
    );
    near.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    draw();
    return () => {
      io.disconnect();
      near.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(st.raf);
      control.current = null;
    };
  }, [isStatic]);

  // Tell the loop where the reader is.
  useEffect(() => {
    control.current?.land(shown >= 1);
  }, [shown, isStatic]);

  const phase = isStatic ? "honest" : !lifted ? "wall" : shown < 3 ? "result" : "honest";
  const showHonest = isStatic || shown >= 3;

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
    <div ref={box} className="relative overflow-hidden rounded-lg bg-vx-800 p-3" data-phase={phase}>
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
          <div ref={strip} data-strip>
            <div ref={stripInner} className="grid grid-cols-6 gap-2">
              {[0, 1].map((copy) => LOOP.map((img, i) => tile(img, i >= REST_START ? i - REST_START : -1, copy === 0, `${copy}-${i}`)))}
            </div>
          </div>
        </div>
      )}
      {lifted && <Bracket box={box} selector={showHonest ? '[data-unreadable="0"]' : '[data-match="0"]'} active={active ?? "static"} side="left" inset={0} />}
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
