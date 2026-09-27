"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";
import { ModelViewer } from "@/components/model3d/ModelViewer";

const WORKFLOW_STEPS: Step[] = [
  {
    key: "01-read",
    title: "Read",
    what: "Part A's drawing is parsed vector by vector. Views, projection angles, sections, and dimension chains are indexed deterministically.",
    vertex: "Extracts orthographic projections (front, top, section B-B) without OCR hallucinations.",
  },
  {
    key: "02-build",
    title: "Build",
    what: "The 3D model rises out of the drawing planes. Exact B-rep topology is generated with sketch, extrude, revolve, and pattern operations.",
    vertex: "Produces real solid geometry, not an unstructured polygonal mesh.",
  },
  {
    key: "03-check",
    title: "Check",
    what: "The model's outline overlays the drawing views. Stated dimensions are measured directly against the solid; dimension ticks turn from grey to green.",
    vertex: "Every measurement is cryptographically audited against the source sheet.",
  },
  {
    key: "04-assumptions",
    title: "Assumptions",
    what: "FLIP never hides a guess. Anything the drawing doesn't state, it explicitly names as a choice and explains.",
    vertex: "Leaves zero unstated decisions hidden inside the CAD tree.",
  },
  {
    key: "05-deliver",
    title: "Deliver",
    what: "A production-grade STEP file, inspection drawing overlays, and an uncompromised audit report. Typically minutes, not days.",
    vertex: "Complete with an immutable verdict badge: Verified or Needs review.",
  },
];

export function HowItWorksSequence() {
  const rootRef = useRef<HTMLElement>(null);
  const isStatic = useStaticLayout();
  const activeStep = useActiveStep(rootRef, !isStatic);
  const active = activeStep || "01-read";

  // Dimension tick simulation state for Step 03
  const [ticksVerified, setTicksVerified] = useState<number>(0);
  useEffect(() => {
    if (active === "03-check") {
      setTicksVerified(0);
      const timers = [
        setTimeout(() => setTicksVerified(1), 300),
        setTimeout(() => setTicksVerified(2), 700),
        setTimeout(() => setTicksVerified(3), 1100),
        setTimeout(() => setTicksVerified(4), 1500),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setTicksVerified(0);
    }
  }, [active]);

  return (
    <section
      ref={rootRef}
      className="rule relative"
      id="workflow"
      aria-label="How FLIP works"
      data-static={isStatic ? "true" : undefined}
    >
      <div className="container lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Sticky Visual Stage (Left ~58%) */}
        <div className="pt-12 lg:col-span-7 lg:pt-0">
          <div
            className={isStatic ? "" : "lg:sticky"}
            style={isStatic ? undefined : { top: 96, height: "calc(100svh - 120px)" }}
          >
            <div className={isStatic ? "" : "flex h-full flex-col justify-center py-6"}>
              <div className="my-auto w-full rounded-xl border border-vx-600/70 bg-vx-900 p-4 sm:p-6 shadow-2xl relative overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-between">
                {/* Header readout bar on dark viewport */}
                <div className="flex items-center justify-between border-b border-vx-600/50 pb-3 mb-4 text-micro mono">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-dim animate-pulse" />
                    <span className="text-dim uppercase tracking-wider font-semibold">
                      ENGINE PIPELINE · STAGE {active.slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-vx-400 uppercase tracking-widest">PART A INSPECTION</span>
                </div>

                {/* Stage Visual Container */}
                <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-lg bg-vx-950 p-2">
                  {/* STAGE 01: Read (2D Vector linework drawing itself with highlighted views) */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 flex items-center justify-center p-4 ${
                      active === "01-read"
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src="/drawings/part-a.svg"
                        alt="Part A 2D engineering drawing views"
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      {/* Floating View Badges */}
                      <div className="absolute top-6 left-6 rounded-2xs border border-dim/60 bg-vx-900/90 px-2 py-1 mono text-[10px] text-dim shadow-sm">
                        VIEW A: FRONT [ORTHO]
                      </div>
                      <div className="absolute top-6 right-6 rounded-2xs border border-dim/60 bg-vx-900/90 px-2 py-1 mono text-[10px] text-dim shadow-sm">
                        SECTION B-B [CUT PLANE]
                      </div>
                      <div className="absolute bottom-6 left-6 rounded-2xs border border-vx-400 bg-vx-900/90 px-2 py-1 mono text-[10px] text-vx-200 shadow-sm">
                        VIEW C: TOP [PROJECTION]
                      </div>
                    </div>
                  </div>

                  {/* STAGE 02: Build (Drawing tilts back, 3D model rises out and rotates) */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 flex items-center justify-center ${
                      active === "02-build"
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    {/* Background drawing tilted back */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-700"
                      style={{
                        transform: "perspective(800px) rotateX(55deg) translateY(40px) scale(0.9)",
                      }}
                    >
                      <Image
                        src="/drawings/part-a.svg"
                        alt="Tilted reference sheet"
                        fill
                        className="object-contain"
                      />
                    </div>
                    {/* 3D solid rising out */}
                    <div className="relative h-full w-full z-10">
                      <ModelViewer modelUrl="/models/part-a.glb" interactive={true} autoRotate={true} />
                      <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xs bg-vx-900/90 border border-dim/40 px-2.5 py-1 mono text-[11px] text-dim">
                        ↑ SOLID EXTRUDED FROM PROJECTION
                      </div>
                    </div>
                  </div>

                  {/* STAGE 03: Check (Overlay with green dimension check ticks) */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 flex flex-col items-center justify-center p-4 ${
                      active === "03-check"
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="w-full max-w-md space-y-3">
                      <div className="mono text-xs text-vx-400 uppercase tracking-wider mb-2">
                        Geometric Dimension Verification
                      </div>
                      {[
                        { label: "Outer Hex Flange Span", val: "160.00 mm", tol: "±0.05 mm" },
                        { label: "Internal Stepped Bore Depth", val: "80.00 mm", tol: "±0.10 mm" },
                        { label: "Centerline Cylindrical Boss", val: "Ø 45.00 mm", tol: "±0.02 mm" },
                        { label: "Threaded Relief Recess", val: "140.00 mm", tol: "±0.05 mm" },
                      ].map((dim, idx) => {
                        const verified = ticksVerified > idx;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between rounded-sm border px-3.5 py-2.5 transition-all duration-300 ${
                              verified
                                ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"
                                : "border-vx-700 bg-vx-900/60 text-vx-400"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                                  verified ? "bg-emerald-500 text-vx-950" : "bg-vx-700 text-vx-400"
                                }`}
                              >
                                {verified ? "✓" : idx + 1}
                              </span>
                              <span className="text-xs font-medium">{dim.label}</span>
                            </div>
                            <div className="flex items-center gap-2 mono text-xs">
                              <span className={verified ? "text-emerald-300 font-semibold" : ""}>
                                {dim.val}
                              </span>
                              <span className="text-[10px] text-vx-500">{dim.tol}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STAGE 04: Assumptions (Choice cards slide in) */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 flex flex-col justify-center p-6 ${
                      active === "04-assumptions"
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="mono text-xs text-dim uppercase tracking-wider mb-3">
                      Named Choices (Zero Guesses Hidden)
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-sm border border-amber-500/40 bg-vx-900/90 p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 text-micro mono text-amber-400 font-semibold">
                          <span>CHOICE 01 · SECTION B-B</span>
                        </div>
                        <p className="mt-1 text-xs text-vx-200 leading-relaxed">
                          &ldquo;Pocket depth isn&apos;t stated on sheet; we used 8.0 mm to clear internal bore without breaking witness line.&rdquo;
                        </p>
                      </div>

                      <div className="rounded-sm border border-amber-500/40 bg-vx-900/90 p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 text-micro mono text-amber-400 font-semibold">
                          <span>CHOICE 02 · HEX FLANGE</span>
                        </div>
                        <p className="mt-1 text-xs text-vx-200 leading-relaxed">
                          &ldquo;Rear hex chamfer angle is unspecified; modeled at standard 45° × 1.5 mm per ASME general shop notes.&rdquo;
                        </p>
                      </div>

                      <div className="rounded-sm border border-amber-500/40 bg-vx-900/90 p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 text-micro mono text-amber-400 font-semibold">
                          <span>CHOICE 03 · BLIND DRILL</span>
                        </div>
                        <p className="mt-1 text-xs text-vx-200 leading-relaxed">
                          &ldquo;Blind tap bottom angle resolved to 118° drill point conical termination.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* STAGE 05: Deliver (STEP file card with verdict badge) */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 flex items-center justify-center p-6 ${
                      active === "05-deliver"
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="w-full max-w-sm rounded-lg border border-vx-600 bg-vx-900/90 p-6 shadow-xl">
                      <div className="flex items-center justify-between border-b border-vx-700 pb-3 mb-4">
                        <div className="mono text-xs text-vx-400">OUTPUT PACKAGE</div>
                        <span className="rounded-xs bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 mono text-[10px] text-emerald-300 font-semibold">
                          VERIFIED
                        </span>
                      </div>

                      <div className="flex items-center gap-3 py-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-vx-800 border border-vx-600 mono text-xs font-bold text-dim">
                          STEP
                        </div>
                        <div>
                          <div className="text-small font-semibold text-vx-100 mono">part-a.step</div>
                          <div className="text-[11px] text-vx-400 mono">ISO 10303-21 · AP242 B-Rep</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-vx-700/60 space-y-1.5 text-micro mono text-vx-300">
                        <div className="flex justify-between">
                          <span className="text-vx-500">Dimensions Checked:</span>
                          <span className="text-emerald-400">14 / 14 Verified</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-vx-500">Named Choices:</span>
                          <span className="text-amber-300">3 Documented</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-vx-500">Generation Time:</span>
                          <span className="text-vx-200">2 min 14 sec</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer status readout */}
                <div className="mt-3 flex items-center justify-between text-[11px] mono text-vx-500">
                  <span>SCROLL TO ADVANCE PIPELINE</span>
                  <span className="text-dim">ISO 10303 / ASME Y14.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepping Text Column (Right ~42%) */}
        <div className="lg:col-span-5">
          <div className={`max-w-[44ch] pb-10 pt-12 ${isStatic ? "" : "lg:pb-[16svh] lg:pt-10"}`}>
            <div className="mono text-micro uppercase tracking-wider text-vx-600 mb-2">
              The Engine
            </div>
            <h2 className="text-h2 font-heading text-vx-900 leading-[1.08] tracking-[-0.02em]">
              From drawing to checked solid.
            </h2>
            <p className="mt-4 text-body text-vx-600 leading-relaxed">
              How FLIP turns 2D sheets into fully verified 3D models with named choices and mathematical dimension checks.
            </p>
          </div>

          <ol className={isStatic ? "pb-12" : "pt-10 lg:pb-[30svh]"}>
            {WORKFLOW_STEPS.map((s, i) => {
              const lit = active === s.key;
              return (
                <li
                  key={s.key}
                  data-step={s.key}
                  className={`step border-t border-vx-400 py-8 ${
                    isStatic ? "" : "lg:flex lg:min-h-[65svh] lg:items-center lg:border-0 lg:py-0"
                  }`}
                  data-lit={lit ? "true" : undefined}
                >
                  <div
                    className={`max-w-[44ch] transition-opacity duration-300 ${
                      lit ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="mono text-micro font-semibold text-dim-deep">
                        0{i + 1}
                      </span>
                      <h3 className="text-h3 font-heading text-vx-900">{s.title}</h3>
                    </div>
                    <p className="text-body text-vx-900 leading-relaxed">{s.what}</p>
                    {s.vertex && (
                      <p className="mt-2 text-small text-vx-600 leading-relaxed font-sans">
                        {s.vertex}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
