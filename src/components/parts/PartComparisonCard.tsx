"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ModelViewer } from "@/components/model3d/ModelViewer";

interface PartComparisonProps {
  partId: "a" | "b";
  title: string;
  subtitle: string;
  specs: string[];
  drawingUrl: string;
  modelUrl: string;
}

export function PartComparisonCard({
  title,
  subtitle,
  specs,
  drawingUrl,
  modelUrl,
}: PartComparisonProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((p) => Math.min(100, p + 5));
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-vx-400/50 bg-vx-900 shadow-xl overflow-hidden transition-all hover:border-vx-400">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-vx-600/60 bg-vx-800/90 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="mono text-xs font-semibold uppercase tracking-wider text-dim">
              {title}
            </span>
            <span className="text-vx-500">·</span>
            <span className="text-small text-vx-200 font-medium font-heading">
              {subtitle}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {specs.map((spec, i) => (
            <span
              key={i}
              className="mono text-[11px] rounded-xs border border-vx-600 bg-vx-900/80 px-2 py-0.5 text-vx-300"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Wipe Viewport */}
      <div
        ref={containerRef}
        className="relative h-[340px] sm:h-[400px] w-full overflow-hidden bg-vx-950 select-none cursor-ew-resize"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        tabIndex={0}
        role="slider"
        aria-label={`${title} drawing to 3D model comparison slider`}
        aria-valuenow={sliderPos}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={handleKeyDown}
      >
        {/* Layer 1 (Underneath): 3D Solid Model */}
        <div className="absolute inset-0">
          <ModelViewer modelUrl={modelUrl} interactive={true} autoRotate={false} />
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-2xs bg-vx-900/80 border border-vx-600/60 px-2 py-1 mono text-[10px] text-vx-300 backdrop-blur-xs">
            3D SOLID (STEP)
          </div>
        </div>

        {/* Layer 2 (Top Wipe): 2D Vector Drawing clipped to sliderPos */}
        <div
          className="absolute inset-0 overflow-hidden border-r border-dim"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="relative h-full w-[800px] max-w-none">
            <Image
              src={drawingUrl}
              alt={`${title} 2D engineering drawing`}
              fill
              className="object-contain object-left pointer-events-none p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-2xs bg-vx-900/80 border border-vx-600/60 px-2 py-1 mono text-[10px] text-dim backdrop-blur-xs">
            2D DRAWING (REDACTED)
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 flex flex-col items-center justify-center"
          style={{ left: `calc(${sliderPos}% - 12px)` }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-dim text-vx-900 shadow-md border border-vx-100/30">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 3.5L2 8l3.5 4.5V9h5v3.5L14 8l-3.5-4.5V7h-5V3.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Instruction hint */}
      <div className="flex items-center justify-between border-t border-vx-600/40 bg-vx-800/50 px-4 py-2 text-micro mono text-vx-400">
        <span>← DRAG TO WIPE →</span>
        <span className="text-dim">ORBIT 3D ON RIGHT</span>
      </div>
    </div>
  );
}

export function TwoPartsSection() {
  return (
    <section className="rule section" id="parts">
      <div className="container">
        <div className="max-w-[64ch] mb-12">
          <div className="mono text-micro uppercase tracking-wider text-vx-600 mb-3">
            Deterministic Solid Reconstruction
          </div>
          <h2 className="text-h2 font-heading text-vx-900 leading-[1.08] tracking-[-0.02em]">
            Two real parts. Zero guessed dimensions.
          </h2>
          <p className="mt-4 text-body text-vx-600 leading-relaxed">
            Drag across each part to wipe between the original engineering drawing and FLIP&apos;s generated 3D solid model. Click and drag the 3D side to inspect geometry and verified faces.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <PartComparisonCard
            partId="a"
            title="Part A"
            subtitle="Machined Hex Flange Body"
            specs={["B-Rep STEP", "140 mm section", "Verified"]}
            drawingUrl="/drawings/part-a.svg"
            modelUrl="/models/part-a.glb"
          />
          <PartComparisonCard
            partId="b"
            title="Part B"
            subtitle="Precision Cylindrical Coupling"
            specs={["B-Rep STEP", "160 mm span", "Verified"]}
            drawingUrl="/drawings/part-b.svg"
            modelUrl="/models/part-b.glb"
          />
        </div>
      </div>
    </section>
  );
}
