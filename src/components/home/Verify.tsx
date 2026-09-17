"use client";

import { useRef } from "react";
import { PatentSheet, PATENT_PLANES } from "@/components/drawing/PatentSheet";
import { Bracket, StepScene, useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";

/**
 * Verify, as rules running. Left, pinned: the vector sheet, smaller. Right:
 * one rule per step; each lands the bracket on the feature it checks and the
 * rule row ticks with its verdict. The final step is the coverage bar — checks
 * that ran against fields that exist — which is the section's point.
 */

type Rule = Step & { verdict: "checked" | "advisory"; note: string; anchor: string; side?: "right" | "left" | "above" | "below" | "inside-right" };

const CHECKS_RAN = 6;
const FIELDS = 44800;

const rules: Rule[] = [
  { key: "number", title: "Sheet states its own number", what: "The title block carries a drawing number, and it is the number the archive filed the sheet under.", vertex: "DRG-4120 on the sheet; DRG-4120 in the index.", verdict: "checked", note: "checked", anchor: '[data-layer="title-block"] [data-anchor]', side: "above" },
  { key: "rows", title: "Every table row has an indicator", what: "Each row of the variant table names a size that the sheet's dimensions can be resolved to.", vertex: "S1, S2, S3: three rows, three sets of values.", verdict: "checked", note: "checked", anchor: '[data-layer="tables-notes"] [data-anchor]', side: "below" },
  { key: "placeholder", title: "Placeholder resolved", what: "A dimension that reads from the table (Ø97.2 H9, note 3) resolves to a value in the selected row.", vertex: "d = 97.2 in row S1.", verdict: "checked", note: "checked", anchor: '[data-layer="dimensions"] [data-anchor]', side: "right" },
  { key: "chain", title: "Dimension chain closes", what: "The overall length is the sum of the parts along it: sleeve, beads and flange.", vertex: "84 = 24 + 28 + 16 + 16, within the stated tolerance.", verdict: "checked", note: "checked", anchor: '[data-layer="dimensions"] [data-anchor]', side: "right" },
  { key: "holes", title: "Hole count matches parts list", what: "This sheet has no parts list, and its only holes are the bores the section shows.", vertex: "Couldn't confirm. Advisory, not a fail: the rule had nothing exact to check against.", verdict: "advisory", note: "advisory: couldn't confirm", anchor: '[data-layer="geometry"] [data-anchor]', side: "left" },
  { key: "coverage", title: "What wasn't checked", what: `${CHECKS_RAN} checks ran. ${FIELDS.toLocaleString("en-US")} fields exist. Here's what wasn't checked.`, vertex: "The bar is the verdict. A PASS is only as good as the segment it covers.", verdict: "checked", note: "", anchor: "", side: "right" },
];

export default function Verify() {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const isStatic = useStaticLayout();
  const active = useActiveStep(root, !isStatic);
  const idx = rules.findIndex((r) => r.key === active);
  const rule = idx >= 0 ? rules[idx] : null;
  const litPlane = rule?.anchor ? PATENT_PLANES.find((p) => rule.anchor.includes(`"${p}"`)) ?? null : null;

  const visual = (
    <div ref={box} className="relative overflow-hidden rounded-lg bg-vx-800 p-3" data-verify-box>
      <div className="relative" style={{ aspectRatio: "1800 / 1229" }}>
        {PATENT_PLANES.map((p) => (
          <div key={p} className="plane-layer absolute inset-0" data-layer={p} data-state={isStatic ? "" : litPlane ? (litPlane === p ? "active" : "dim") : ""}>
            <PatentSheet planes={[p]} id={`verify-${p}`} decorative />
          </div>
        ))}
      </div>
      {!isStatic && rule?.anchor && <Bracket box={box} selector={rule.anchor} active={active} side={rule.side} inset={0} />}
    </div>
  );

  const intro = (
    <div>
      <h2 className="max-w-[18ch] text-h2">Verify what can be verified. Say the rest.</h2>
      <p className="mt-4 text-body text-vx-600">
        The checks are rules, not guesses: they pass, they fail, or they couldn&apos;t run. Every verdict lists all three, so a PASS means exactly what it says.
      </p>
    </div>
  );

  return (
    <div ref={root} data-verify>
      <StepScene
        id="verify"
        label="Verify"
        steps={rules}
        active={active}
        isStatic={isStatic}
        intro={intro}
        visual={visual}
        caption="DRG-4120 · R2 · re-draft of US 2,529,098"
        renderStep={(s, i) => {
          const r = s as Rule;
          const done = isStatic || idx >= i;
          if (r.key === "coverage") {
            return (
              <div className="w-full max-w-[44ch]">
                <div className="flex items-baseline gap-4">
                  <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-h3 text-vx-900">{r.title}</h3>
                </div>
                <p className="mt-3 text-body text-vx-900">{r.what}</p>
                <div className="mt-5" role="img" aria-label={`${CHECKS_RAN} checks ran against ${FIELDS.toLocaleString("en-US")} fields`}>
                  <div className="flex h-4 w-full overflow-hidden rounded-xs border border-vx-400">
                    <div className="h-full bg-vx-800 transition-[width] duration-[350ms] ease-out" style={{ width: done ? `max(2px, ${((100 * CHECKS_RAN) / FIELDS).toFixed(4)}%)` : "0%" }} />
                    <div className="h-full flex-1 bg-vx-400" />
                  </div>
                  <div className="mt-2 flex justify-between text-micro text-vx-600">
                    <span className="mono">{CHECKS_RAN} checked</span>
                    <span className="mono">{FIELDS.toLocaleString("en-US")} fields</span>
                  </div>
                </div>
                <p className="mt-3 text-body text-vx-600">{r.vertex}</p>
              </div>
            );
          }
          return (
            <div className="w-full max-w-[44ch]">
              <div className="flex items-baseline gap-4">
                <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-h3 text-vx-900">{r.title}</h3>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-y border-vx-400 py-2">
                <span className="text-small text-vx-600">Verdict</span>
                <span className={`mono text-small ${r.verdict === "checked" ? "text-vx-900" : "text-vx-600"}`}>{done ? r.note : "…"}</span>
              </div>
              <p className="mt-3 text-body text-vx-600">{r.what}</p>
              {r.vertex && <p className="mt-2 text-body text-vx-900">{r.vertex}</p>}
            </div>
          );
        }}
      />
    </div>
  );
}
