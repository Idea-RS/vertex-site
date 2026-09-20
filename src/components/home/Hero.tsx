"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Dim } from "@/components/Dim";
import { PatentSheet } from "@/components/drawing/PatentSheet";
import { PulseOrb } from "@/components/PulseOrb";
import { archive } from "@/content/site";

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="relative pb-16 pt-24 lg:pb-24 lg:pt-32" aria-label="Hero">
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left column: Value Proposition & Evidence */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2.5 rounded-xs border border-vx-400/70 bg-vx-100 px-2.5 py-1">
            <PulseOrb size="sm" />
            <span className="mono text-micro text-vx-900 font-medium tracking-tight">
              DRAWING INTELLIGENCE FOR DISCRETE MANUFACTURING
            </span>
          </div>

          <h1 className="mt-6 max-w-[14ch] text-display text-vx-900 tracking-[-0.02em]">
            Find, verify, and reconstruct 3D parts from your drawings.
          </h1>

          <p className="mt-6 max-w-[48ch] text-body text-vx-600 leading-relaxed">
            Vertex turns your 2D CAD prints and legacy scans into structured data and verified 3D solids.
            Find duplicate designs across decades of history, verify revision changes deterministically,
            and generate production-ready STEP models. Runs in the cloud or 100% offline on your shop network.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/diagnostic/">Book an archive diagnostic</Button>
            <Link href="/#reconstruct" className="link text-body font-medium">
              Explore 2D to 3D →
            </Link>
          </div>

          {/* Precision Proof Badges */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-vx-400/60 pt-6">
            <div>
              <div className="mono text-h3 text-vx-900 font-medium">{archive.searchP1}</div>
              <p className="mt-1 text-micro text-vx-600">Precision at one on 7,000 prints</p>
            </div>
            <div>
              <div className="mono text-h3 text-vx-900 font-medium">B-Rep STEP</div>
              <p className="mt-1 text-micro text-vx-600">Verified solid reconstruction</p>
            </div>
            <div>
              <div className="mono text-h3 text-vx-900 font-medium">Air-Gapped</div>
              <p className="mt-1 text-micro text-vx-600">100% offline local container</p>
            </div>
          </div>
        </div>

        {/* Right column: Interactive CAD Blueprint Spotlight Viewport */}
        <div className="lg:col-span-6">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="spotlight-card relative overflow-hidden rounded-lg border border-vx-600/80 p-4 shadow-xl"
            style={{ aspectRatio: "480 / 380" }}
          >
            {/* Corner CAD Registration Marks */}
            <div className="absolute top-2 left-2 mono text-micro text-vx-400/60 select-none">ZONE: A1</div>
            <div className="absolute top-2 right-2 mono text-micro text-vx-400/60 select-none">ASME Y14.5</div>
            <div className="absolute bottom-2 left-2 mono text-micro text-vx-400/60 select-none">SCALE: N.T.S.</div>
            <div className="absolute bottom-2 right-2 mono text-micro text-dim/80 select-none">[PASS: 7/7 GATES]</div>

            {/* Drawing Preview */}
            <div className="relative h-full w-full overflow-hidden rounded-xs bg-vx-900/60 p-2">
              <PatentSheet id="hero-interactive" className="h-full w-full object-contain" />
            </div>

            {/* Floating Live Dimension Annotation */}
            <div className="pointer-events-none absolute bottom-8 left-8 hidden sm:block">
              <Dim label="Ø160.00 ±0.05" tone="dark" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
