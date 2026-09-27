import React from "react";

interface DeliverableItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  metric: string;
}

const DELIVERABLES: DeliverableItem[] = [
  {
    id: "step",
    tag: "01 · SOLID GEOMETRY",
    title: "Production STEP model",
    description: "Standard ISO 10303-21 (AP242) B-rep solid ready for immediate CAM toolpath generation, FEA, or parametric CAD import.",
    metric: "Exact B-Rep",
  },
  {
    id: "overlays",
    tag: "02 · VISUAL INSPECTION",
    title: "Drawing overlays",
    description: "Silhouettes projected from the generated 3D solid mapped directly over the source 2D orthographic sheet.",
    metric: "View-by-view",
  },
  {
    id: "verdict",
    tag: "03 · AUDIT ENGINE",
    title: "Verdict with reasons",
    description: "Every file receives a definitive status: Verified, Needs review (with exact discrepancies noted), or Refused.",
    metric: "3 Verdicts",
  },
  {
    id: "choices",
    tag: "04 · TRANSPARENCY",
    title: "Named choices",
    description: "FLIP never buries an assumption. Anything the sheet omits is documented as a choice and explained in plain English.",
    metric: "Zero guesses",
  },
  {
    id: "report",
    tag: "05 · COMPLIANCE",
    title: "Short audit report",
    description: "A compact verification ledger comparing stated drawing dimensions against measurements taken on the finished solid.",
    metric: "Full ledger",
  },
];

export function DeliverablesGrid() {
  return (
    <section className="rule section py-16 sm:py-20 lg:py-24" id="deliverables">
      <div className="container">
        <div className="max-w-[64ch] mb-12">
          <div className="mono text-micro uppercase tracking-wider text-[#EFC07B] font-semibold mb-3">
            Deliverables
          </div>
          <h2 className="text-h2 font-heading text-vx-100 leading-[1.08] tracking-[-0.02em]">
            What you get.
          </h2>
          <p className="mt-4 text-body text-vx-400 leading-relaxed">
            Every drawing processed through FLIP delivers five verified artefacts. No ambiguous geometry, no uninspected tolerances.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((item, idx) => (
            <div
              key={item.id}
              className={`rounded-xl border border-[#0F3460] bg-[#16213E] p-6 shadow-xl transition-all hover:border-[#EFC07B]/70 ${
                idx === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#0F3460] pb-3 mb-4">
                <span className="mono text-micro text-[#EFC07B] font-semibold">
                  {item.tag}
                </span>
                <span className="mono text-[11px] rounded-xs bg-[#1A1A2E] border border-[#0F3460] px-2 py-0.5 text-vx-300 font-medium">
                  {item.metric}
                </span>
              </div>
              <h3 className="text-h3 font-heading text-vx-100 leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 text-small text-vx-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
