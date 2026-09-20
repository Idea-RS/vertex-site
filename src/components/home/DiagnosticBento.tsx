"use client";

import { Button } from "@/components/Button";
import { PulseOrb } from "@/components/PulseOrb";
import { diagnostic, archive } from "@/content/site";

export default function DiagnosticBento() {
  return (
    <section className="my-16 rounded-lg border border-vx-400/70 surface-inset cad-dot-grid p-8 lg:p-14" aria-label="Archive Diagnostic">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-[54ch]">
          <div className="inline-flex items-center gap-2.5 rounded-xs border border-vx-400 bg-white px-2.5 py-1">
            <PulseOrb size="sm" />
            <span className="mono text-micro text-dim-deep font-semibold uppercase tracking-wider">
              05 · THE TWO-WEEK ARCHIVE AUDIT
            </span>
          </div>

          <h2 className="mt-4 text-h2 text-vx-900 tracking-[-0.015em]">
            Start with the archive diagnostic.
          </h2>

          <p className="mt-4 text-body text-vx-600 leading-relaxed">
            Two weeks. Fixed fee, quoted before we start. We ingest your drawings on-prem or in the cloud,
            identify duplicate parts across decades of history, and deliver six permanent assets you
            keep—whether you subscribe or not. The audit fee credits 100% toward your annual contract.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button href="/diagnostic/">Book the diagnostic</Button>
            <span className="mono text-small text-vx-600 font-medium">Fixed fee · Zero IT disruption</span>
          </div>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Duplicate Part Register (2 cols) */}
          <div className="rounded-md border border-vx-400/80 bg-white p-6 shadow-sm sm:col-span-2 transition-all duration-200 hover:border-vx-600">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-vx-600 font-semibold">01 · LEAD DELIVERABLE</span>
              <span className="mono rounded-xs border border-dim-deep/40 bg-dim/15 px-2 py-0.5 text-micro font-medium text-dim-deep">
                {archive.duplicateCandidatesLabel} CANDIDATES FOUND
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-900 font-semibold">
              {diagnostic.deliverables[0].title}
            </h3>
            <p className="mt-2 text-small text-vx-600 max-w-[62ch]">
              {diagnostic.deliverables[0].body} Verified by your own engineers, converted into estimated
              re-tooling and raw inventory savings.
            </p>
          </div>

          {/* Card 2: Superseded BOM References */}
          <div className="rounded-md border border-vx-400/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-vx-600">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-vx-600 font-semibold">02</span>
              <span className="mono rounded-xs border border-vx-400 bg-vx-100 px-2 py-0.5 text-micro font-medium text-vx-900">
                {archive.bomSupersededLabel} OF BOMS
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-900 font-semibold">
              {diagnostic.deliverables[1].title}
            </h3>
            <p className="mt-2 text-small text-vx-600">
              {diagnostic.deliverables[1].body}
            </p>
          </div>

          {/* Card 3: Isolated Drawing Census */}
          <div className="rounded-md border border-vx-400/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-vx-600">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-vx-600 font-semibold">03</span>
              <span className="mono rounded-xs border border-vx-400 bg-vx-100 px-2 py-0.5 text-micro font-medium text-vx-900">
                {archive.isolatedLabel} ORPHANS
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-900 font-semibold">
              {diagnostic.deliverables[2].title}
            </h3>
            <p className="mt-2 text-small text-vx-600">
              {diagnostic.deliverables[2].body}
            </p>
          </div>

          {/* Card 4: Missing Drawing Ledger */}
          <div className="rounded-md border border-vx-400/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-vx-600">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-vx-600 font-semibold">04</span>
              <span className="mono rounded-xs border border-vx-400 bg-vx-100 px-2 py-0.5 text-micro font-medium text-vx-900">
                AUDIT LOG
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-900 font-semibold">
              {diagnostic.deliverables[3].title}
            </h3>
            <p className="mt-2 text-small text-vx-600">
              {diagnostic.deliverables[3].body}
            </p>
          </div>

          {/* Card 5: Part-Coding Review */}
          <div className="rounded-md border border-vx-400/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-vx-600">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-vx-600 font-semibold">05</span>
              <span className="mono rounded-xs border border-vx-400 bg-vx-100 px-2 py-0.5 text-micro font-medium text-vx-900">
                TAXONOMY
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-900 font-semibold">
              {diagnostic.deliverables[4].title}
            </h3>
            <p className="mt-2 text-small text-vx-600">
              {diagnostic.deliverables[4].body}
            </p>
          </div>

          {/* Card 6: Permanent Self-Hosted Search Index (2 cols) */}
          <div className="rounded-md border border-vx-600 bg-vx-900 text-vx-100 p-6 shadow-md sm:col-span-2 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-vx-400 font-semibold">06 · PERMANENT SHOP ASSET</span>
              <span className="mono rounded-xs border border-dim/50 bg-dim/10 px-2 py-0.5 text-micro font-semibold text-dim">
                YOURS TO KEEP
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-100 font-semibold">
              {diagnostic.deliverables[5].title}
            </h3>
            <p className="mt-2 text-small text-vx-400 max-w-[62ch]">
              {diagnostic.deliverables[5].body} A fast local query server stays active on your network,
              enabling your draughtsmen and estimators to find parts in milliseconds forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
