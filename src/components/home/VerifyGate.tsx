"use client";

import { useState } from "react";
import { RuleDiagram, type RuleId } from "@/components/drawing/RuleDiagrams";
import { Dim } from "@/components/Dim";
import { PulseOrb } from "@/components/PulseOrb";

type Rule = {
  id: RuleId;
  title: string;
  what: string;
  verdict: string;
  advisory?: boolean;
};

const rules: Rule[] = [
  {
    id: "number",
    title: "Sheet states its own number",
    what: "The title block carries a drawing number, matching the archive record.",
    verdict: "PASS · Exact match",
  },
  {
    id: "rows",
    title: "Every table row has an indicator",
    what: "Each row of the variant table names an exact size the sheet resolves to.",
    verdict: "PASS · Row S4 resolved",
  },
  {
    id: "placeholder",
    title: "Placeholder resolved",
    what: "Dimension placeholder d maps to row value: Ø31.77 H7 becomes Ø38.10 H7.",
    verdict: "PASS · Variable d=38.10",
  },
  {
    id: "holes",
    title: "Hole count matches parts list",
    what: "This sheet has no separate parts list; rule reports unconfirmed, never a false pass.",
    verdict: "ADVISORY · Unverified",
    advisory: true,
  },
  {
    id: "chain",
    title: "Dimension chain closes",
    what: "Overall length equals the sum of its segments: 24 + 28 + 16 + 16 = 84 mm.",
    verdict: "PASS · Delta = 0.00 mm",
  },
];

export default function VerifyGate() {
  const [activeIdx, setActiveIdx] = useState(2); // start on placeholder resolved
  const activeRule = rules[activeIdx];

  return (
    <section className="relative my-16 overflow-hidden rounded-lg bg-vx-800 p-8 text-vx-100 shadow-2xl lg:p-14" aria-label="Verification and Gating">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left column: Rule Engine & Coverage */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2.5 rounded-xs border border-vx-600 bg-vx-900/80 px-2.5 py-1">
            <PulseOrb size="sm" />
            <span className="mono text-micro text-dim font-medium uppercase tracking-wider">
              03 · DETERMINISTIC VERIFICATION & SIGN-OFF
            </span>
          </div>

          <h2 className="mt-4 text-h2 text-vx-100 tracking-[-0.015em]">
            Deterministic checks. Honest coverage. Human sign-off.
          </h2>

          <p className="mt-4 text-body text-vx-400 leading-relaxed">
            Vertex evaluates structured drawing records against versioned rules—never asking an LLM
            whether a drawing is correct. Every check returns pass, fail, or unverified with an explicit reason.
          </p>

          {/* Interactive Rule Selector */}
          <div className="mt-8 space-y-2" role="tablist" aria-label="Inspection Rules">
            {rules.map((r, i) => {
              const on = i === activeIdx;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveIdx(i)}
                  className={`flex w-full items-baseline justify-between rounded-sm border p-3 text-left transition-all duration-150 ${
                    on
                      ? "border-dim/90 bg-vx-900/90 text-vx-100 shadow-sm"
                      : "border-vx-600/50 bg-vx-900/30 text-vx-400 hover:border-vx-600 hover:text-vx-100"
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="mono text-micro text-vx-400">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-small font-medium">{r.title}</span>
                  </div>
                  <span
                    className={`mono text-micro ${
                      r.advisory ? "text-amber-400/90" : on ? "text-dim" : "text-vx-400"
                    }`}
                  >
                    {r.verdict.split(" · ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Honest Coverage Tray */}
          <div className="mt-8 rounded-sm border border-vx-600 bg-vx-900/70 p-4">
            <div className="flex items-center justify-between text-small">
              <span className="text-vx-400 font-medium">Archive Coverage Ratio</span>
              <span className="mono text-dim font-semibold">6 of 44,800 fields</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-vx-800">
              <div className="h-full bg-dim" style={{ width: "87%" }} />
            </div>
            <p className="mt-2 text-micro text-vx-400">
              87% verified deterministically · 13% routed to visual inspection tray. Nothing inferred ever yields a silent pass.
            </p>
          </div>
        </div>

        {/* Right column: Active Inspection Diagram & Sign-off Stamp */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative rounded-md border border-vx-600/80 bg-vx-900 p-6 shadow-inner">
            <div className="flex items-center justify-between border-b border-vx-600/60 pb-3">
              <div className="mono text-micro text-vx-400">
                INSPECTION VIEWPORT · RULE {String(activeIdx + 1).padStart(2, "0")}: {activeRule.id.toUpperCase()}
              </div>
              <span className={`mono rounded-xs px-2 py-0.5 text-micro font-medium ${
                activeRule.advisory ? "border border-amber-400/40 text-amber-300 bg-amber-950/40" : "border border-dim/50 text-dim bg-dim/10"
              }`}>
                {activeRule.verdict}
              </span>
            </div>

            {/* Rule Diagram Graphic */}
            <div className="my-6 flex items-center justify-center p-4">
              <RuleDiagram id={activeRule.id} />
            </div>

            <p className="border-t border-vx-600/60 pt-4 text-small text-vx-400">
              <strong className="text-vx-100 font-medium">Evaluation Detail:</strong> {activeRule.what}
            </p>
          </div>

          {/* Cryptographic Human Authentication Box */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md border border-vx-600/60 bg-vx-900/50 p-4">
            <div>
              <div className="mono text-micro text-vx-400">LEGAL COMPLIANCE GATE</div>
              <p className="mt-0.5 text-small text-vx-100">
                Watermark removed only upon cryptographic sign-off by an authorized engineer.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="mono rounded-xs border border-vx-600 px-2 py-1 text-micro text-vx-400">
                CHD. BY: <span className="text-vx-100 font-medium">R.D.</span>
              </div>
              <div className="mono rounded-xs border border-dim/80 bg-dim/10 px-2 py-1 text-micro text-dim">
                APO. BY: <span className="font-semibold">S.M. (CHIEF ENG)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
