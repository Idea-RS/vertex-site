"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet, VARIANT_ROWS } from "@/components/drawing/Sheet";
import { StepScene, useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";
import { Dim } from "@/components/Dim";
import { gsap, setupGsap } from "@/lib/motion";

/**
 * Make, with a camera. Each step runs in a fixed order: the mark from the last
 * step fades out at once (150ms), the camera frames the step's region (one
 * scale + translate on the sheet wrapper, 700ms ease-in-out, origin fixed
 * top-left), the frame holds for 150ms, then the change plays (350ms), and
 * only then does the step's mark appear. A change never happens mid-zoom.
 *
 * Marks follow the site's rule: a line for a distance, a box for a region.
 * The dimensions step measures something, so it gets the dimension line.
 * Picking a row, the gate and the signature each concern a region, so they
 * get a dotted box around it. One mark on screen at a time.
 *
 * Below 1024px and under reduced motion there is no camera: each step carries
 * a static crop of its region, computed the same way, with the beat applied.
 */

const FROM = 1; // S2
const TO = 3; // S4
const ROW_H = 32;
const CAMERA = 0.7;
const HOLD = 0.15;
const CHANGE = 0.35;

type Mark = { kind: "line"; anchor: string } | { kind: "box"; region: string[] };
type Beat = Step & { region: string[]; zoom: number; mark: Mark; crop: string };
const steps: Beat[] = [
  {
    key: "pick",
    title: "Pick a row",
    what: "The variant table on your own drawing is the spec. Choose the row you need; nothing is typed in twice.",
    vertex: `Row ${VARIANT_ROWS[TO].size}: A ${VARIANT_ROWS[TO].a}, B ${VARIANT_ROWS[TO].b}, d ${VARIANT_ROWS[TO].d}, ${VARIANT_ROWS[TO].n} holes.`,
    region: ['[data-plane="tables"] [data-anchor]'],
    zoom: 3,
    mark: { kind: "box", region: [`[data-row-box="${TO}"]`] },
    crop: "variant table",
  },
  {
    key: "dims",
    title: "The dimensions follow",
    what: "Vertex regenerates the sheet from your template, not ours. Every dimension that reads from the table takes the row's value.",
    vertex: `Ø${VARIANT_ROWS[FROM].d} H7 becomes Ø${VARIANT_ROWS[TO].d} H7; the PCD and the hole count follow.`,
    region: ['[data-plane="dimensions"] [data-anchor]', '[data-dim="bore"]', '[data-dim="holes"]'],
    zoom: 1.8,
    mark: { kind: "line", anchor: '[data-dim="bore"]' },
    crop: "dimension chains",
  },
  {
    key: "gate",
    title: "The gate runs",
    what: "The same deterministic checks run on the new sheet. The verdict is about the whole drawing, so the whole drawing is what you see.",
    vertex: "PASS · 7 checked · 2 couldn't be checked. Nothing can be downloaded before this line.",
    region: [],
    zoom: 1,
    mark: { kind: "box", region: ['[data-plane="geometry"]', '[data-plane="dimensions"]'] },
    crop: "whole sheet",
  },
  {
    key: "sign",
    title: "A named person signs",
    what: "Until then the sheet says GENERATED — NOT APPROVED on its face, drawn into the drawing. It lifts only when someone signs.",
    vertex: "Checked: S.M. The signature is recorded against the checks they saw.",
    region: ["[data-signature]"],
    zoom: 4,
    mark: { kind: "box", region: ["[data-signature]"] },
    crop: "signature cells",
  },
];

/** Apply beat `idx` to a sheet box: the marker, the dimension text, the watermark, the initials, the chosen row. */
function applyBeat(root: HTMLElement, idx: number) {
  const q = <T extends Element>(s: string) => root.querySelector<T>(s);
  const picked = idx >= 0, regenerated = idx >= 1, passed = idx >= 2, signed = idx >= 3;
  const marker = q<SVGGElement>("[data-row-marker]");
  if (marker) marker.style.transform = `translateY(${ROW_H * (picked ? TO : FROM)}px)`;
  const cur = q<SVGGElement>("[data-dim-current-group]");
  const prev = q<SVGGElement>("[data-dim-prev-group]");
  if (cur) cur.style.opacity = regenerated ? "1" : "0";
  if (prev) prev.style.opacity = regenerated ? "0" : "1";
  const wm = q<SVGGElement>("[data-watermark]");
  if (wm) {
    wm.style.opacity = signed ? "0" : "1";
    wm.style.transform = signed ? "translateY(-4px)" : "translateY(0)";
  }
  const checked = q<SVGTextElement>("[data-cell='checkedBy']");
  if (checked) checked.style.opacity = signed ? "1" : "0";
  root.querySelectorAll<SVGGElement>("[data-row]").forEach((row) => {
    const chosen = Number(row.dataset.row) === (picked ? TO : FROM);
    row.querySelectorAll("text").forEach((t) => {
      t.style.fill = picked ? (chosen ? "var(--color-vx-100)" : "var(--color-vx-600)") : "";
    });
  });
  root.dataset.passed = passed ? "true" : "";
}

const find = (root: ParentNode, selectors: string[]) => selectors.flatMap((s) => Array.from(root.querySelectorAll<SVGGraphicsElement>(s)));

/**
 * The camera transform that centres the union of `regions` inside `frame`, at
 * `zoom` or less: never so close that the region spills out of the frame.
 * Measured with getBBox in sheet units, so the current transform doesn't
 * matter. Clamped so the frame never shows past the sheet's edge.
 */
function cameraFor(wrapper: HTMLElement, frame: HTMLElement, regions: SVGGraphicsElement[], zoom: number) {
  const W = wrapper.offsetWidth, H = wrapper.offsetHeight;
  const fw = frame.offsetWidth, fh = frame.offsetHeight;
  if (!regions.length || zoom === 1) return { scale: 1, x: 0, y: 0 };
  const vb = regions[0].ownerSVGElement!.viewBox.baseVal;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  regions.forEach((r) => {
    const bb = r.getBBox();
    x0 = Math.min(x0, bb.x); y0 = Math.min(y0, bb.y); x1 = Math.max(x1, bb.x + bb.width); y1 = Math.max(y1, bb.y + bb.height);
  });
  const k = W / vb.width; // px per sheet unit at scale 1
  const s = Math.min(zoom, (0.84 * fw) / ((x1 - x0) * k), (0.84 * fh) / ((y1 - y0) * k));
  const cx = ((x0 + x1) / 2 - vb.x) * k;
  const cy = ((y0 + y1) / 2 - vb.y) * k;
  const x = Math.min(0, Math.max(fw - s * W, fw / 2 - s * cx));
  const y = Math.min(0, Math.max(fh - s * H, fh / 2 - s * cy));
  return { scale: Math.round(s * 100) / 100, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

type MarkGeom = { kind: "line" | "box"; left: number; top: number; width: number; height: number; key: number };

/** Where a step's mark goes, in px relative to `box`, clamped inside `frame`. */
function measureMark(box: HTMLElement, frame: HTMLElement, mark: Mark, key: number): MarkGeom | null {
  const b = box.getBoundingClientRect();
  const f = frame.getBoundingClientRect();
  const rel = (r: DOMRect) => ({ l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, btm: r.bottom - b.top });
  const fr = rel(f);
  if (mark.kind === "line") {
    const a = box.querySelector(mark.anchor);
    if (!a) return null;
    const r = rel(a.getBoundingClientRect());
    return { kind: "line", left: Math.min(r.r + 8, fr.r - 24), top: r.t, width: 24, height: r.btm - r.t, key };
  }
  const els = find(box, mark.region);
  if (!els.length) return null;
  const rs = els.map((e) => rel(e.getBoundingClientRect()));
  const pad = 6;
  // snap each edge to a whole device pixel on the page (the box itself may sit at a fractional offset)
  const snapX = (x: number) => Math.round(x + b.left) - b.left;
  const snapY = (y: number) => Math.round(y + b.top) - b.top;
  const l = snapX(Math.max(fr.l + 1, Math.min(...rs.map((r) => r.l)) - pad));
  const t = snapY(Math.max(fr.t + 1, Math.min(...rs.map((r) => r.t)) - pad));
  const r = snapX(Math.min(fr.r - 1, Math.max(...rs.map((r) => r.r)) + pad));
  const btm = snapY(Math.min(fr.btm - 1, Math.max(...rs.map((r) => r.btm)) + pad));
  return { kind: "box", left: l, top: t, width: Math.round(r - l), height: Math.round(btm - t), key };
}

export default function Make() {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const markLayer = useRef<HTMLDivElement>(null);
  const isStatic = useStaticLayout();
  const active = useActiveStep(root, !isStatic);
  const idx = steps.findIndex((s) => s.key === active);
  // Past the last step nothing is in the band: hold that step. Above the first: nothing is picked yet.
  const [lastIdx, setLastIdx] = useState(-1);
  if (idx !== -1 && idx !== lastIdx) setLastIdx(idx);
  const shown = idx !== -1 ? idx : lastIdx > 0 ? lastIdx : -1;
  const activeKey = useRef<string | null>(null);
  const started = useRef(false);
  const [mark, setMark] = useState<MarkGeom | null>(null);

  // The mark leaves the moment its step leaves the centre band: 150ms, no delay.
  useEffect(() => {
    activeKey.current = active;
    if (markLayer.current) markLayer.current.style.opacity = "0";
  }, [active]);

  // Frame, hold, change, mark: one timeline per step, killed if the reader moves on.
  useEffect(() => {
    const b = box.current, fr = frame.current, wrapper = cam.current;
    if (!b || !fr || !wrapper || isStatic) return;
    setupGsap();
    const beat = shown >= 0 ? steps[shown] : null;
    const t = cameraFor(wrapper, fr, beat ? find(wrapper, beat.region) : [], beat?.zoom ?? 1);
    if (!started.current) {
      // first frame on mount: no motion, just the state for where the reader is
      started.current = true;
      gsap.set(wrapper, { scale: t.scale, x: t.x, y: t.y, transformOrigin: "0 0" });
      applyBeat(b, shown);
      return;
    }
    const tl = gsap.timeline();
    tl.to(wrapper, {
      scale: t.scale,
      x: t.x,
      y: t.y,
      duration: CAMERA,
      ease: "power2.inOut",
      transformOrigin: "0 0",
      onStart: () => void (wrapper.style.willChange = "transform"),
      onComplete: () => void (wrapper.style.willChange = "auto"),
    });
    tl.call(() => applyBeat(b, shown), [], `+=${HOLD}`);
    if (beat) {
      tl.call(
        () => {
          if (activeKey.current !== beat.key) return; // the step already left the band
          setMark(measureMark(b, fr, beat.mark, Date.now()));
          requestAnimationFrame(() => {
            if (markLayer.current && activeKey.current === beat.key) markLayer.current.style.opacity = "1";
          });
        },
        [],
        `+=${CHANGE}`,
      );
    }
    return () => {
      tl.kill();
    };
  }, [shown, isStatic]);

  const verdict = (
    <div className="absolute left-5 top-5 rounded-md border border-vx-600 bg-vx-900 px-3 py-2" data-verdict-box>
      <div className="flex items-baseline gap-3">
        <span className="mono text-body text-vx-100" data-pass>PASS</span>
        <span className="text-micro text-vx-400" data-pass-note>7 checked · 2 couldn&apos;t be checked</span>
      </div>
    </div>
  );

  const visual = (
    <div ref={box} className="relative overflow-hidden rounded-lg bg-vx-800 p-3 make-box" data-make-box>
      <div ref={frame} className="relative overflow-hidden" style={{ aspectRatio: "1400 / 990" }}>
        <div ref={cam} className="absolute inset-0" style={{ transformOrigin: "0 0" }}>
          <Sheet id="make" row={TO} prevRow={FROM} checkedBy="S.M." watermark label={`Generated variant of drawing DRG-4120 at row ${VARIANT_ROWS[TO].size}: outer diameter ${VARIANT_ROWS[TO].a}, PCD ${VARIANT_ROWS[TO].b}, bore ${VARIANT_ROWS[TO].d}, ${VARIANT_ROWS[TO].n} holes. Checked by S.M.`} />
        </div>
      </div>
      {verdict}
      <div ref={markLayer} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 ease-out" aria-hidden="true">
        <MarkShape geom={mark} />
      </div>
    </div>
  );

  const intro = (
    <div>
      <h2 className="max-w-[18ch] text-h2">Make the variant. Gate it. Sign it.</h2>
      <p className="mt-4 text-body text-vx-600">
        Pick a row from your own variant table. Vertex regenerates the sheet from your template, runs the checks, and holds it as not approved until a named person signs.
      </p>
    </div>
  );

  return (
    <div ref={root} data-make>
      <StepScene
        id="make"
        label="Make"
        steps={steps}
        active={active}
        isStatic={isStatic}
        intro={intro}
        visual={isStatic ? null : visual}
        caption={isStatic ? undefined : "DRG-4120 · variant S4 · generated from the customer's template"}
        renderStep={(s, i) => {
          const b = s as Beat;
          return (
            <div className={`w-full ${isStatic ? "max-w-[40rem]" : "max-w-[44ch]"}`}>
              <div className="flex items-baseline gap-4">
                <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-h3 text-vx-900">{b.title}</h3>
              </div>
              {isStatic && (
                <div className="mt-4">
                  <StaticCrop beatIndex={i} beat={b} verdict={b.zoom === 1 ? verdict : null} />
                </div>
              )}
              <p className="mt-3 max-w-[44ch] text-body text-vx-600">{b.what}</p>
              {b.vertex && <p className="mt-2 max-w-[44ch] text-body text-vx-900">{b.vertex}</p>}
            </div>
          );
        }}
      />
    </div>
  );
}

/** The mark: an orange dimension line for a distance, a dotted orange rectangle for a region. */
function MarkShape({ geom }: { geom: MarkGeom | null }) {
  const target = useRef<HTMLDivElement>(null);
  if (!geom) return null;
  if (geom.kind === "box") {
    // the same dotted stroke as the dimension line; measureMark snapped the edges to whole page pixels
    const w = geom.width, h = geom.height;
    return (
      <svg key={geom.key} className="absolute overflow-visible" style={{ left: geom.left, top: geom.top }} width={w} height={h} data-mark="box">
        {/* four edges, each starting on a whole pixel along its length so every dot lands on one pixel */}
        <path d={`M0 0.5H${w}M0 ${h - 0.5}H${w}M0.5 0V${h}M${w - 0.5} 0V${h}`} fill="none" stroke="#F0A868" strokeWidth="1" strokeDasharray="1 2" />
      </svg>
    );
  }
  return (
    <div key={geom.key} className="absolute" style={{ left: geom.left, top: geom.top, width: geom.width, height: geom.height }} data-mark="line">
      <div ref={target} className="absolute inset-y-0 left-0 w-px" />
      <Dim axis="y" measure={target} tone="dark" className="absolute left-0 top-0" />
    </div>
  );
}

/** A static crop of the sheet at one beat: the same camera, computed once, no motion. */
function StaticCrop({ beatIndex, beat, verdict }: { beatIndex: number; beat: Beat; verdict: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const whole = beat.zoom === 1;
  useEffect(() => {
    const b = box.current, fr = frame.current, w = cam.current;
    if (!b || !fr || !w) return;
    applyBeat(b, beatIndex);
    const place = () => {
      const t = cameraFor(w, fr, find(w, beat.region), beat.zoom);
      w.style.transform = t.scale === 1 ? "" : `translate(${t.x}px, ${t.y}px) scale(${t.scale})`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(b);
    return () => ro.disconnect();
  }, [beatIndex, beat]);
  return (
    <figure ref={box} className="relative m-0 overflow-hidden rounded-lg bg-vx-800 p-3 make-box">
      <div ref={frame} className="relative overflow-hidden" style={{ aspectRatio: whole ? "1400 / 990" : "3 / 2" }}>
        <div ref={cam} className="absolute left-0 top-0 w-full" style={{ aspectRatio: "1400 / 990", transformOrigin: "0 0" }}>
          <Sheet id={`crop-${beatIndex}`} row={TO} prevRow={FROM} checkedBy="S.M." watermark decorative />
        </div>
      </div>
      {verdict}
      <figcaption className="mono mt-3 text-micro text-muted-raised">DRG-4120 · {whole ? "the whole sheet" : `into the ${beat.crop}`}</figcaption>
    </figure>
  );
}
