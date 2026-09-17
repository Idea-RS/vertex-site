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
 * drawing sheets, still while the reader takes in the section heading. Once
 * that heading has scrolled up past the top of the viewport, the column races
 * upward on its own, at a constant rate with the vertical blur at
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
const BLUR_MAX = 6; // px, vertical, at full speed
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const domGridRef = useRef<HTMLDivElement>(null);
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
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

  // Preload images for canvas
  useEffect(() => {
    imagesRef.current = LOOP.map((item) => {
      const img = new Image();
      img.src = item.src;
      return img;
    });
  }, []);

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

  // The column: hardware-accelerated GPU canvas while racing/decelerating, exact DOM when landed.
  useEffect(() => {
    if (isStatic) return;
    const el = root.current, canvas = canvasRef.current, domGrid = domGridRef.current;
    if (!el || !canvas || !domGrid) return;
    type Mode = "idle" | "racing" | "decel" | "landed";
    const st = {
      mode: "idle" as Mode,
      pos: 0, // rows travelled; a multiple of LOOP_ROWS is the resting frame
      v: 0, // rows per second
      ramp: 0, // seconds into the start-up ramp
      want: false, // step two (or later) is the reader's position
      park: false, // the heading came back into view while racing: come to rest, lift nothing
      inView: false,
      raf: 0,
      last: 0,
      d: { from: 0, dist: 0, dur: 0, k: 2, t: 0 },
    };
    const heading = el.querySelector("h2");
    let headingDocBottom = 0;
    const measure = () => {
      if (heading) {
        const r = heading.getBoundingClientRect();
        headingDocBottom = r.bottom + window.scrollY;
      }
    };
    measure();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;
    ro?.observe(canvas);
    if (heading) ro?.observe(heading);

    // the reader is inside the section: the heading has gone up past the top of the viewport
    const pastHeading = () => !heading || (headingDocBottom > 0 ? window.scrollY >= headingDocBottom : heading.getBoundingClientRect().bottom <= 0);

    const render = (rawB: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      const pxW = Math.round(width * dpr);
      const pxH = Math.round(height * dpr);
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW;
        canvas.height = pxH;
      }

      if (!scratchCanvasRef.current) {
        scratchCanvasRef.current = document.createElement("canvas");
      }
      const scratch = scratchCanvasRef.current;
      if (scratch.width !== pxW || scratch.height !== pxH) {
        scratch.width = pxW;
        scratch.height = pxH;
      }
      const sctx = scratch.getContext("2d");
      if (!sctx) return;

      sctx.save();
      sctx.scale(dpr, dpr);
      sctx.clearRect(0, 0, width, height);

      const tileSize = (width - (COLS - 1) * GAP) / COLS;
      const pitch = tileSize + GAP;

      const floatRow = (((REST_START / COLS + st.pos) % LOOP_ROWS) + LOOP_ROWS) % LOOP_ROWS;
      const topRow = Math.floor(floatRow);
      const rowOffset = (floatRow - topRow) * pitch;

      for (let r = -1; r <= 6; r++) {
        const loopRow = ((topRow + r) % LOOP_ROWS + LOOP_ROWS) % LOOP_ROWS;
        const y = r * pitch - rowOffset;
        if (y + tileSize < 0 || y > height) continue;

        for (let c = 0; c < COLS; c++) {
          const x = c * pitch;
          const imgIndex = loopRow * COLS + c;
          const img = imagesRef.current[imgIndex];

          sctx.fillStyle = "#ffffff";
          sctx.fillRect(x, y, tileSize, tileSize);

          if (img && img.complete && img.naturalWidth > 0) {
            sctx.save();
            sctx.beginPath();
            if (typeof sctx.roundRect === "function") {
              sctx.roundRect(x, y, tileSize, tileSize, 2);
            } else {
              sctx.rect(x, y, tileSize, tileSize);
            }
            sctx.clip();
            const srcSize = Math.min(img.naturalWidth, img.naturalHeight);
            sctx.drawImage(img, 0, 0, srcSize, srcSize, x, y, tileSize, tileSize);
            sctx.restore();
          }

          sctx.strokeStyle = "#415a77";
          sctx.lineWidth = 1;
          sctx.beginPath();
          if (typeof sctx.roundRect === "function") {
            sctx.roundRect(x + 0.5, y + 0.5, tileSize - 1, tileSize - 1, 2);
          } else {
            sctx.strokeRect(x + 0.5, y + 0.5, tileSize - 1, tileSize - 1);
          }
          sctx.stroke();
        }
      }
      sctx.restore();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const b = rawB * dpr;
      if (b > 0.4) {
        // Uniform camera shutter motion blur along Y axis.
        // Progressive fractional blending (1 / (i + 1)) guarantees the cumulative
        // alpha stays strictly at 1.0 (100% opaque), completely eliminating any dark/grey
        // background bleed-through and keeping the drawing paper pure, crisp, solid white.
        const SAMPLES = 7;
        for (let i = 0; i < SAMPLES; i++) {
          const t = (i / (SAMPLES - 1)) * 2 - 1; // from -1 to +1
          ctx.globalAlpha = 1 / (i + 1);
          ctx.drawImage(scratch, 0, t * b);
        }
        ctx.globalAlpha = 1.0;
      } else {
        ctx.drawImage(scratch, 0, 0);
      }
    };

    const draw = () => {
      const rawB = BLUR_MAX * Math.min(1, st.v / SPEED);
      render(rawB);
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
    const rest = () => {
      st.mode = "idle";
      st.park = false;
      st.pos = 0;
      st.v = 0;
      canvas.style.opacity = "0";
      domGrid.style.opacity = "1";
      domGrid.style.pointerEvents = "auto";
    };
    const settle = () => {
      st.mode = "landed";
      st.pos = 0;
      st.v = 0;
      canvas.style.opacity = "0";
      domGrid.style.opacity = "1";
      domGrid.style.pointerEvents = "auto";
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
        if ((st.want || st.park) && tryLand()) st.last = now;
      } else if (st.mode === "decel") {
        const d = st.d;
        d.t += dt;
        const u = Math.min(1, d.t / d.dur);
        const h = d.k * u + (3 - 2 * d.k) * u * u + (d.k - 2) * u * u * u;
        const h1 = d.k + 2 * (3 - 2 * d.k) * u + 3 * (d.k - 2) * u * u;
        st.pos = d.from + d.dist * h;
        st.v = Math.max(0, (d.dist * h1) / d.dur);
        if (u >= 1) return st.want ? settle() : rest();
      }
      draw();
      if (st.mode === "racing" || st.mode === "decel") st.raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (st.raf || !st.inView) return;
      st.last = 0;
      st.raf = requestAnimationFrame(frame);
    };
    const race = () => {
      st.park = false;
      if (st.mode === "racing") return;
      // from rest, ramp up; from a deceleration, carry the speed it had
      st.ramp = st.mode === "decel" ? RAMP * Math.sqrt(Math.min(1, st.v / SPEED)) : 0;
      st.mode = "racing";
      setSettled(false);
      canvas.style.opacity = "1";
      domGrid.style.opacity = "0";
      domGrid.style.pointerEvents = "none";
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
          if (st.inView && pastHeading()) race();
          else if (st.inView && st.mode === "decel") st.park = true; // already slowing: let it come to rest
          else {
            // landed with the heading back in view, or off screen: the column simply waits, still
            st.mode = "idle";
            setSettled(false);
          }
        }
      },
    };
    const onScroll = () => {
      if (!st.inView || st.want) return;
      if (st.mode === "idle") {
        if (pastHeading()) race();
      } else if (st.mode === "racing" && !st.park && !pastHeading()) {
        st.park = true; // scrolled back up to the heading: the column slows onto its frame and waits
        run();
      } else if (st.park && pastHeading()) {
        race(); // changed their mind before it stopped
      }
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro?.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
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
        className="wall-sheet m-0 overflow-hidden rounded-xs border border-vx-600 bg-white"
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
    <div ref={box} className="relative overflow-hidden rounded-lg bg-vx-800 p-3" style={{ contain: "paint" }} data-phase={phase}>
      {isStatic ? (
        <div className="grid grid-cols-6 gap-2" role="img" aria-label="36 drawing sheets from the archive">
          {LOOP.slice(REST_START).map((img, i) => tile(img, i, true, `s${i}`))}
        </div>
      ) : (
        <div className="relative overflow-hidden" style={{ aspectRatio: "1 / 1", contain: "paint" }} role="img" aria-label="Drawing sheets from the archive, passing until the search lands on 36 of them">
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: 0, willChange: "opacity" }}
            aria-hidden="true"
          />
          <div ref={domGridRef} className="grid grid-cols-6 gap-2" style={{ opacity: 1, willChange: "opacity" }}>
            {LOOP.slice(REST_START).map((img, i) => tile(img, i, true, `r-${i}`))}
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
