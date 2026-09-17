"use client";

import { useEffect, useRef } from "react";
import { Sheet, VARIANT_ROWS } from "@/components/drawing/Sheet";
import { Bracket, StepScene, useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";
import { gsap, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Make, with a camera. Each of the four beats happens at the scale where it can
 * be seen: for a step the sheet scales and translates so the relevant region
 * fills the frame, then the change plays there. One transform on the sheet
 * wrapper (scale + translate, origin fixed top-left, 700ms ease-in-out), driven
 * by the same centre-band steps as the rest of the page. The sheet never
 * rotates or blurs and stays in the DOM throughout, so text is crisp at 4×.
 * Each step's framing comes from the element's own bbox, not from coordinates.
 *
 * Below 1024px and under reduced motion there is no camera: each step carries
 * a static crop of its region, computed the same way, with the beat applied.
 */

const FROM = 1; // S2
const TO = 3; // S4
const ROW_H = 32;

type Beat = Step & { anchor: string; zoom: number; region: string[]; side?: "right" | "left" | "above" | "below" | "inside-right" };
const steps: Beat[] = [
  { key: "pick", title: "Pick a row", what: "The variant table on your own drawing is the spec. Choose the row you need; nothing is typed in twice.", vertex: `Row ${VARIANT_ROWS[TO].size}: A ${VARIANT_ROWS[TO].a}, B ${VARIANT_ROWS[TO].b}, d ${VARIANT_ROWS[TO].d}, ${VARIANT_ROWS[TO].n} holes.`, anchor: "[data-row-marker]", region: ['[data-plane="tables"] [data-anchor]'], zoom: 3, side: "left" },
  { key: "dims", title: "The dimensions follow", what: "Vertex regenerates the sheet from your template, not ours. Every dimension that reads from the table takes the row's value.", vertex: `Ø${VARIANT_ROWS[FROM].d} H7 becomes Ø${VARIANT_ROWS[TO].d} H7; the PCD and the hole count follow.`, anchor: '[data-dim="bore"]', region: ['[data-plane="dimensions"] [data-anchor]', '[data-dim="bore"]', '[data-dim="holes"]'], zoom: 1.8, side: "right" },
  { key: "gate", title: "The gate runs", what: "The same deterministic checks run on the new sheet, and the verdict is about the whole drawing, so the whole drawing is what you see.", vertex: "PASS · 7 checked · 2 couldn't be checked. Nothing can be downloaded before this line.", anchor: "[data-verdict-box]", region: [], zoom: 1, side: "below" },
  { key: "sign", title: "A named person signs", what: "Until then the sheet says GENERATED — NOT APPROVED on its face, drawn into the drawing. It lifts only when someone signs.", vertex: "Checked: S.M. The signature is recorded against the checks they saw.", anchor: '[data-cell="checkedBy"]', region: ['[data-plane="titleblock"] [data-anchor]'], zoom: 4, side: "below" },
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

/**
 * The camera transform that centres the union of `regions` (SVG elements) at
 * `zoom` inside a frame of size fw × fh, for a sheet wrapper of size W × H at
 * scale 1. Origin is the wrapper's top-left; the result is clamped so the
 * frame never shows past the sheet's edge.
 */
function cameraFor(wrapper: HTMLElement, frame: HTMLElement, regions: SVGGraphicsElement[], zoom: number) {
  const W = wrapper.offsetWidth, H = wrapper.offsetHeight;
  const fw = frame.offsetWidth, fh = frame.offsetHeight;
  if (!regions.length || zoom === 1) return { scale: 1, x: 0, y: 0 };
  const svg = regions[0].ownerSVGElement!;
  const vb = svg.viewBox.baseVal;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  regions.forEach((r) => {
    const bb = r.getBBox();
    x0 = Math.min(x0, bb.x); y0 = Math.min(y0, bb.y); x1 = Math.max(x1, bb.x + bb.width); y1 = Math.max(y1, bb.y + bb.height);
  });
  const k = W / vb.width; // px per user unit
  const cx = ((x0 + x1) / 2 - vb.x) * k;
  const cy = ((y0 + y1) / 2 - vb.y) * k;
  const x = Math.min(0, Math.max(fw - zoom * W, fw / 2 - zoom * cx));
  const y = Math.min(0, Math.max(fh - zoom * H, fh / 2 - zoom * cy));
  return { scale: zoom, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

const find = (root: ParentNode, selectors: string[]) => selectors.map((s) => root.querySelector<SVGGraphicsElement>(s)).filter(Boolean) as SVGGraphicsElement[];

export default function Make() {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const isStatic = useStaticLayout();
  const active = useActiveStep(root, !isStatic);
  const idx = steps.findIndex((s) => s.key === active);
  const beat = idx >= 0 ? steps[idx] : null;

  useEffect(() => {
    if (box.current && !isStatic) applyBeat(box.current, idx);
  }, [idx, isStatic]);

  // The camera: one tween on the wrapper per step change.
  useEffect(() => {
    const wrapper = cam.current, fr = frame.current;
    if (!wrapper || !fr || isStatic || prefersReducedMotion()) return;
    setupGsap();
    const t = cameraFor(wrapper, fr, beat ? find(wrapper, beat.region) : [], beat?.zoom ?? 1);
    wrapper.style.willChange = "transform";
    gsap.to(wrapper, { scale: t.scale, x: t.x, y: t.y, duration: 0.7, ease: "power2.inOut", transformOrigin: "0 0", overwrite: true, onComplete: () => (wrapper.style.willChange = "auto") });
  }, [beat, isStatic]);

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
      {beat && <Bracket box={box} selector={beat.anchor} active={active} side={beat.side} inset={0} delay={720} />}
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
      <figcaption className="mono mt-3 text-micro text-muted-raised">DRG-4120 · {whole ? "the whole sheet" : `${beat.zoom}× into the ${beatIndex === 0 ? "variant table" : beatIndex === 1 ? "dimension chains" : "title block"}`}</figcaption>
    </figure>
  );
}
