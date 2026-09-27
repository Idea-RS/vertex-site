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
            <span className="mono text-micro uppercase tracking-wider font-semibold text-vx-400">
              FLIP BY VERTEX
            </span>
            <span className="text-[rgba(30,58,95,0.8)]">·</span>
            <CountdownChip />
          </div>

          <h1 className="text-display font-heading text-vx-100 leading-[1.0] tracking-[-0.025em]">
            Drawings in.
            <br />
            Solid models out.
          </h1>

          <p className="mt-6 text-body text-vx-400 leading-relaxed max-w-[50ch]">
            FLIP turns 2D engineering drawings into checked 3D models with named choices and verified dimensions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#join"
              className="inline-flex items-center justify-center rounded-sm bg-[#EFC07B] px-6 py-3 font-heading text-small font-semibold text-[#080C14] transition-all hover:bg-[#EFC07B]/90 hover:shadow-lg hover:shadow-[#EFC07B]/10 active:scale-[0.99] shadow-md"
            >
              Join the waitlist
            </Link>
            <Link
              href="#workflow"
              className="inline-flex items-center justify-center rounded-sm border border-[rgba(45,78,120,0.5)] bg-[#0F1726]/90 px-5 py-3 font-heading text-small font-medium text-vx-100 transition-colors hover:border-[#EFC07B] hover:text-[#EFC07B]"
            >
              See how it works ↓
            </Link>
          </div>

          {/* Minimal CAD standard badge */}
          <div className="mt-10 flex items-center gap-4 border-t border-[rgba(45,78,120,0.35)] pt-4 mono text-micro text-vx-400">
            <span>INPUT: DXF · DWG · PDF · IMAGE</span>
            <span aria-hidden="true" className="text-[rgba(45,78,120,0.7)]">·</span>
            <span>OUTPUT: STEP B-REP</span>
          </div>
        </div>

        {/* Right Column: Rotating 3D Model (Part A) in Dark Viewport */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] w-full rounded-2xl border border-[rgba(45,78,120,0.5)] bg-[#0F1726]/90 p-2 sm:p-3 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden backdrop-blur-md">
            {/* Dark Viewport Top Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-micro mono text-vx-400 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#EFC07B] animate-pulse" />
                <span className="text-[#EFC07B] font-semibold tracking-wider">PART A · LIVE ROTATION</span>
              </div>
              <span className="rounded-2xs border border-[rgba(45,78,120,0.5)] bg-[#080C14]/90 px-2 py-0.5 text-vx-300">
                DRAG TO ORBIT
              </span>
            </div>

            {/* Three.js 3D Viewer */}
            <div className="h-full w-full rounded-xl overflow-hidden bg-[#05080E] border border-[rgba(45,78,120,0.35)]">
              <ModelViewer
                modelUrl="/models/part-a.glb"
                autoRotate={true}
                interactive={true}
              />
            </div>

            {/* Dark Viewport Bottom Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-micro mono text-vx-400 pointer-events-none">
              <span>MEASURED: 14 DIMENSIONS</span>
              <span className="text-emerald-400 font-semibold">VERIFIED ✓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
