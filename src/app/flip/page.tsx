import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { DraftingTableVisual } from "@/components/flip/DraftingTableVisual";
import {
  PipelineDiagramSvg,
  VerificationDiagramSvg,
  FeatureTreeDiagramSvg,
  DivergenceDiagramSvg,
  ModelToDrawingDiagramSvg,
  DeploymentDiagramSvg,
} from "@/components/flip/FlipDiagrams";

export const metadata: Metadata = {
  title: "FLIP — Parametric 3D from 2D Drawings | Vertex",
  description:
    "2D engineering drawings rebuilt as 3D models with full feature trees, with every dimension verified against the sheet.",
};

export default function FlipPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="container pt-12 pb-8 lg:pt-20 lg:pb-12">
        <div className="max-w-[72ch]">
          <h1 className="text-display text-vx-900 leading-[1.0] tracking-[-0.025em]">
            Drawings in. Parametric models out.
          </h1>
          <p className="mt-6 text-body text-vx-600 leading-relaxed max-w-[62ch]">
            2D engineering drawings rebuilt as 3D models with full feature trees, with every
            dimension verified against the sheet.
          </p>
          <div className="mt-8">
            <Button href="/diagnostic/" variant="primary">
              Request access
            </Button>
          </div>
        </div>

        {/* Hero Visual: Drafting Table ⇄ 3D CAD Render with Moving T-Square */}
        <DraftingTableVisual />
      </section>

      {/* ─── 01 — Drawing to model ─────────────────────────────────── */}
      <section className="border-t border-vx-400/40 py-16 lg:py-24">
        <div className="container">
          <div className="max-w-[72ch]">
            <div className="mono text-micro font-medium uppercase tracking-wider text-vx-600 mb-3">
              01 — Drawing to model
            </div>
            <h2 className="text-h2 text-vx-900 leading-[1.08] tracking-[-0.02em]">
              Built the way an engineer would.
            </h2>
            <p className="mt-4 text-body text-vx-600 leading-relaxed">
              Sketch, extrude, revolve, pattern, fillet. Exact B-rep geometry, not a mesh.
            </p>

            {/* Pipeline Strip: Read → Trace → Plan → Build → Verify */}
            <div className="mt-8 overflow-x-auto pb-2">
              <div className="inline-flex min-w-full sm:min-w-0 items-center rounded-sm border border-vx-400/80 bg-white/70 p-2 shadow-xs">
                {(["Read", "Trace", "Plan", "Build", "Verify"] as const).map((step, idx, arr) => (
                  <div key={step} className="flex items-center">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-vx-100 border border-vx-400/40">
                      <span className="mono text-micro text-dim-deep font-semibold">
                        0{idx + 1}
                      </span>
                      <span className="mono text-small font-medium text-vx-900">
                        {step}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="px-2 text-vx-400 font-mono text-small select-none">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Pipeline SVG Diagram */}
          <div className="mt-8">
            <PipelineDiagramSvg />
          </div>
        </div>
      </section>

      {/* ─── Verification ─────────────────────────────────────────── */}
      <section className="border-t border-vx-400/40 py-16 lg:py-24">
        <div className="container">
          <div className="max-w-[72ch]">
            <h2 className="text-h2 text-vx-900 leading-[1.08] tracking-[-0.02em]">
              Every model states what it proved.
            </h2>
            <p className="mt-4 text-body text-vx-600 leading-relaxed">
              Dimensions, views, sections and called-out features, all checked against the
              drawing.
            </p>

            {/* Three Verdict Chips Side by Side */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* Verified: emerald tint, checkmark icon, bold weight */}
              <div className="inline-flex items-center gap-2 rounded-xs border border-emerald-600/40 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-900 font-bold">
                <span className="text-sm font-bold text-emerald-700 select-none" aria-hidden="true">
                  ✓
                </span>
                <span className="mono text-small">Verified</span>
              </div>

              {/* Needs review: amber tint, warning icon, medium weight */}
              <div className="inline-flex items-center gap-2 rounded-xs border border-amber-600/40 bg-amber-500/10 px-3.5 py-1.5 text-amber-900 font-medium">
                <span className="text-sm font-semibold text-amber-700 select-none" aria-hidden="true">
                  ⚠
                </span>
                <span className="mono text-small">Needs review</span>
              </div>

              {/* Refused: rose tint, cross icon, regular weight */}
              <div className="inline-flex items-center gap-2 rounded-xs border border-rose-600/40 bg-rose-500/10 px-3.5 py-1.5 text-rose-900 font-normal">
                <span className="text-sm text-rose-700 select-none" aria-hidden="true">
                  ✕
                </span>
                <span className="mono text-small">Refused</span>
              </div>
            </div>

            <p className="mt-4 text-small text-vx-600">
              Nothing ships silently.
            </p>
          </div>

          {/* Technical Verification SVG Diagram */}
          <div className="mt-8">
            <VerificationDiagramSvg />
          </div>
        </div>
      </section>

      {/* ─── The feature tree ─────────────────────────────────────── */}
      <section className="border-t border-vx-400/40 py-16 lg:py-24">
        <div className="container">
          <div className="max-w-[72ch]">
            <h2 className="text-h2 text-vx-900 leading-[1.08] tracking-[-0.02em]">
              A feature tree, not a shape.
            </h2>

            {/* Tag row */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {[
                "Constrained sketches",
                "Driving dimensions",
                "Patterns",
                "Draft and fillets",
                "Parametric regeneration",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs border border-vx-400/70 bg-white/80 px-3 py-1 text-small text-vx-900"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-6 text-body text-vx-600 leading-relaxed">
              Every parameter is marked Read, Inferred or Chosen.
            </p>

            {/* Provenance Line Style Demonstration */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-small text-vx-900">
              <div className="inline-flex items-center gap-2 rounded-xs border border-solid border-vx-900 px-3 py-1.5 bg-white/60">
                <span className="mono font-semibold">Read</span>
                <span className="text-micro text-vx-600">(solid border)</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xs border border-dashed border-vx-900 px-3 py-1.5 bg-white/60">
                <span className="mono font-semibold">Inferred</span>
                <span className="text-micro text-vx-600">(dashed border)</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xs border border-dotted border-vx-900 px-3 py-1.5 bg-white/60">
                <span className="mono font-semibold">Chosen</span>
                <span className="text-micro text-vx-600">(dotted border)</span>
              </div>
            </div>
          </div>

          {/* Technical Feature Tree SVG Diagram */}
          <div className="mt-8">
            <FeatureTreeDiagramSvg />
          </div>
        </div>
      </section>

      {/* ─── Divergence detection ─────────────────────────────────── */}
      <section className="border-t border-vx-400/40 py-16 lg:py-24">
        <div className="container">
          <div className="max-w-[72ch]">
            <h2 className="text-h2 text-vx-900 leading-[1.08] tracking-[-0.02em]">
              Drawings contradict themselves. FLIP notices.
            </h2>
            <p className="mt-4 text-body text-vx-600 leading-relaxed">
              FLIP builds to the stated dimension and reports every place the geometry
              disagrees with it.
            </p>
          </div>

          {/* Technical Divergence Detection SVG Diagram */}
          <div className="mt-8">
            <DivergenceDiagramSvg />
          </div>
        </div>
      </section>

      {/* ─── Specs (Two-row table) ────────────────────────────────── */}
      <section className="border-t border-vx-400/40 py-16 lg:py-20">
        <div className="container">
          <div className="max-w-[72ch]">
            <div className="overflow-hidden rounded-sm border border-vx-400/80 bg-white/70 shadow-xs">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-vx-400/40">
                    <th
                      scope="row"
                      className="w-32 py-3.5 px-4 mono text-small font-semibold text-vx-900 bg-vx-100/60"
                    >
                      Inputs
                    </th>
                    <td className="py-3.5 px-4 text-body text-vx-900 font-mono text-small">
                      DWG · DXF · Vector PDF
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="w-32 py-3.5 px-4 mono text-small font-semibold text-vx-900 bg-vx-100/60"
                    >
                      Outputs
                    </th>
                    <td className="py-3.5 px-4 text-body text-vx-900 font-mono text-small">
                      STEP · FreeCAD (parametric) · Verification report
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 — Model to drawing (badge: Coming) ─────────────────── */}
      <section className="border-t border-vx-400/40 py-16 lg:py-24">
        <div className="container">
          <div className="max-w-[72ch]">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="mono text-micro font-medium uppercase tracking-wider text-vx-600">
                02 — Model to drawing
              </span>
              <span className="rounded-xs border border-dim-deep/40 bg-dim/15 px-2 py-0.5 mono text-micro font-semibold text-dim-deep">
                Coming
              </span>
            </div>
            <h2 className="text-h2 text-vx-900 leading-[1.08] tracking-[-0.02em]">
              And back again.
            </h2>
            <p className="mt-4 text-body text-vx-600 leading-relaxed">
              Production drawings generated from 3D: projected views, sections and dimensions,
              verified against the model.
            </p>
            <div className="mt-8">
              <Button href="/diagnostic/" variant="outline">
                Join the waitlist
              </Button>
            </div>
          </div>

          {/* Technical Model-to-Drawing SVG Diagram */}
          <div className="mt-8">
            <ModelToDrawingDiagramSvg />
          </div>
        </div>
      </section>

      {/* ─── Deployment ───────────────────────────────────────────── */}
      <section className="border-t border-vx-400/40 py-16 lg:py-24">
        <div className="container">
          <div className="max-w-[72ch]">
            <h2 className="text-h2 text-vx-900 leading-[1.08] tracking-[-0.02em]">
              Runs where your drawings live.
            </h2>
            <p className="mt-4 text-body text-vx-600 leading-relaxed">
              Self-hosted, with no outbound connections by default.
            </p>
          </div>

          {/* Technical Deployment Topology SVG Diagram */}
          <div className="mt-8">
            <DeploymentDiagramSvg />
          </div>
        </div>
      </section>

      {/* ─── Closing ──────────────────────────────────────────────── */}
      <section className="border-t border-vx-400/40 py-20 lg:py-32">
        <div className="container">
          <div className="max-w-[72ch]">
            <h2 className="text-h2 text-vx-900 leading-[1.08] tracking-[-0.02em]">
              Send us a drawing.
            </h2>
            <p className="mt-4 text-body text-vx-600 leading-relaxed">
              You get the model and the report, including what we couldn't prove.
            </p>
            <div className="mt-8">
              <Button href="/diagnostic/" variant="primary">
                Request access
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
