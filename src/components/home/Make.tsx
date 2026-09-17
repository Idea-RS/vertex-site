"use client";

import { useEffect, useRef } from "react";
import { Sheet, VARIANT_ROWS } from "@/components/drawing/Sheet";
import { Bracket, StepScene, useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";

/**
 * Make: the scene that worked, re-expressed in the page's one vocabulary. Left,
 * pinned: the variant sheet. Right, four steps; each step lands one beat on the
 * sheet — the row marker moves, the dimensions update, the verdict reads PASS,
 * the watermark lifts and the initials appear — with 350ms transitions and a
 * bracket on the element that changed. Nothing scrubs.
 */

const FROM = 1; // S2
const TO = 3; // S4
const ROW_H = 32;

type Beat = Step & { anchor: string; side?: "right" | "left" | "above" | "below" | "inside-right" };
const steps: Beat[] = [
  { key: "pick", title: "Pick a row", what: "The variant table on your own drawing is the spec. Choose the row you need; nothing is typed in twice.", vertex: `Row ${VARIANT_ROWS[TO].size}: A ${VARIANT_ROWS[TO].a}, B ${VARIANT_ROWS[TO].b}, d ${VARIANT_ROWS[TO].d}, ${VARIANT_ROWS[TO].n} holes.`, anchor: "[data-row-marker]", side: "left" },
  { key: "dims", title: "The dimensions follow", what: "Vertex regenerates the sheet from your template, not ours. Every dimension that reads from the table takes the row's value.", vertex: `Ø${VARIANT_ROWS[FROM].d} H7 becomes Ø${VARIANT_ROWS[TO].d} H7; the PCD and the hole count follow.`, anchor: '[data-dim="bore"]', side: "right" },
  { key: "gate", title: "The gate runs", what: "The same deterministic checks run on the new sheet. The verdict says what passed and what it couldn't check.", vertex: "PASS · 7 checked · 2 couldn't be checked. Nothing can be downloaded before this line.", anchor: "[data-verdict-box]", side: "below" },
  { key: "sign", title: "A named person signs", what: "Until then the sheet says GENERATED — NOT APPROVED on its face, drawn into the drawing. It lifts only when someone signs.", vertex: "Checked: S.M. The signature is recorded against the checks they saw.", anchor: '[data-cell="checkedBy"]', side: "below" },
];

export default function Make() {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const isStatic = useStaticLayout();
  const active = useActiveStep(root, !isStatic);
  const idx = isStatic ? steps.length - 1 : steps.findIndex((s) => s.key === active);
  const beat = idx >= 0 ? steps[idx] : null;

  // Apply the beats to the sheet. Each is a 350ms transition on the element that changes.
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const marker = b.querySelector<SVGGElement>("[data-row-marker]");
    const cur = b.querySelector<SVGGElement>("[data-dim-current-group]");
    const prev = b.querySelector<SVGGElement>("[data-dim-prev-group]");
    const watermark = b.querySelector<SVGGElement>("[data-watermark]");
    const checked = b.querySelector<SVGTextElement>("[data-cell='checkedBy']");
    const picked = idx >= 0;
    const regenerated = idx >= 1;
    const passed = idx >= 2;
    const signed = idx >= 3;
    if (marker) marker.style.transform = `translateY(${ROW_H * (picked ? TO : FROM)}px)`;
    if (cur) cur.style.opacity = regenerated ? "1" : "0";
    if (prev) prev.style.opacity = regenerated ? "0" : "1";
    if (watermark) {
      watermark.style.opacity = signed ? "0" : "1";
      watermark.style.transform = signed ? "translateY(-4px)" : "translateY(0)";
    }
    if (checked) checked.style.opacity = signed ? "1" : "0";
    b.dataset.passed = passed ? "true" : "";
  }, [idx]);

  const visual = (
    <div ref={box} className="relative overflow-hidden rounded-lg bg-vx-800 p-3 make-box" data-make-box>
      <div className="relative" style={{ aspectRatio: "1400 / 990" }}>
        <Sheet id="make" row={TO} prevRow={FROM} checkedBy="S.M." watermark label={`Generated variant of drawing DRG-4120 at row ${VARIANT_ROWS[TO].size}: outer diameter ${VARIANT_ROWS[TO].a}, PCD ${VARIANT_ROWS[TO].b}, bore ${VARIANT_ROWS[TO].d}, ${VARIANT_ROWS[TO].n} holes. Checked by S.M.`} />
      </div>
      {/* verdict */}
      <div className="absolute left-5 top-5 rounded-md border border-vx-600 bg-vx-900 px-3 py-2" data-verdict-box>
        <div className="flex items-baseline gap-3">
          <span className="mono text-body text-vx-100 transition-opacity duration-[350ms]" data-pass>
            PASS
          </span>
          <span className="text-micro text-vx-400" data-pass-note>
            7 checked · 2 couldn&apos;t be checked
          </span>
        </div>
      </div>
      {!isStatic && beat && <Bracket box={box} selector={beat.anchor} active={active} side={beat.side} inset={0} />}
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
      <StepScene id="make" label="Make" steps={steps} active={active} isStatic={isStatic} intro={intro} visual={visual} caption="DRG-4120 · variant S4 · generated from the customer's template" />
    </div>
  );
}
