"use client";

import React from "react";
import Link from "next/link";
import { CountdownChip } from "@/components/countdown/Countdown";
import { ModelViewer } from "@/components/model3d/ModelViewer";

export function FlipHero() {
  return (
    <section className="container pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
        {/* Left Column: Headlines & Actions */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-6">
            <span className="mono text-micro uppercase tracking-wider font-semibold text-vx-600">
              FLIP BY VERTEX
            </span>
            <span className="text-vx-400">·</span>
            <CountdownChip />
          </div>

          <h1 className="text-display font-heading text-vx-900 leading-[1.0] tracking-[-0.025em]">
            Drawings in.
            <br />
            Solid models out.
          </h1>

          <p className="mt-6 text-body text-vx-600 leading-relaxed max-w-[50ch]">
            FLIP turns 2D engineering drawings into checked 3D models with named choices and verified dimensions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/flip#join"
              className="inline-flex items-center justify-center rounded-sm bg-vx-900 px-6 py-3 font-heading text-small font-semibold text-vx-100 transition-all hover:bg-vx-800 shadow-sm"
            >
              Join the waitlist
            </Link>
            <Link
              href="#workflow"
              className="inline-flex items-center justify-center rounded-sm border border-vx-400/80 bg-white/60 px-5 py-3 font-heading text-small font-medium text-vx-900 transition-colors hover:border-vx-600"
            >
              See how it works ↓
            </Link>
          </div>

          {/* Minimal CAD standard badge */}
          <div className="mt-10 flex items-center gap-4 border-t border-vx-400/40 pt-4 mono text-micro text-vx-500">
            <span>INPUT: DXF · DWG · PDF · IMAGE</span>
            <span aria-hidden="true">·</span>
            <span>OUTPUT: STEP B-REP</span>
          </div>
        </div>

        {/* Right Column: Rotating 3D Model (Part A) in Dark Viewport */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] w-full rounded-2xl border border-vx-600/70 bg-vx-900 p-2 sm:p-3 shadow-2xl overflow-hidden">
            {/* Dark Viewport Top Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-micro mono text-vx-400 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-dim animate-pulse" />
                <span className="text-dim font-medium">PART A · LIVE ROTATION</span>
              </div>
              <span className="rounded-2xs border border-vx-700 bg-vx-800/80 px-2 py-0.5 text-vx-300">
                DRAG TO ORBIT
              </span>
            </div>

            {/* Three.js 3D Viewer */}
            <div className="h-full w-full rounded-xl overflow-hidden bg-vx-950">
              <ModelViewer
                modelUrl="/models/part-a.glb"
                autoRotate={true}
                interactive={true}
              />
            </div>

            {/* Dark Viewport Bottom Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-micro mono text-vx-500 pointer-events-none">
              <span>MEASURED: 14 DIMENSIONS</span>
              <span className="text-emerald-400">VERIFIED ✓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
