"use client";

import React, { useEffect, useState, useMemo } from "react";
import { LAUNCH_AT } from "@/config/countdown";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  totalMs: number;
}

export function useCountdown(targetDate: string = LAUNCH_AT): TimeLeft & { mounted: boolean } {
  const [mounted, setMounted] = useState(false);
  const targetTime = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const diff = Math.max(0, targetTime - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isLive: diff <= 0,
      totalMs: diff,
    };
  });

  useEffect(() => {
    setMounted(true);

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isLive: diff <= 0,
        totalMs: diff,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return { ...timeLeft, mounted };
}

/**
 * Compact dimension callout chip for hero sections.
 * e.g. |← 07d 12h 45m 18s →|
 */
export function CountdownChip({ className = "" }: { className?: string }) {
  const { days, hours, minutes, seconds, isLive, mounted } = useCountdown();

  if (!mounted) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-xs border border-[#0F3460] bg-[#16213E]/90 px-3 py-1 text-micro mono text-vx-400 ${className}`}>
        <span className="text-[#EFC07B]">|←</span>
        <span>--d --h --m --s</span>
        <span className="text-[#EFC07B]">→|</span>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-xs border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-micro mono text-emerald-400 font-medium ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>FLIP IS LIVE</span>
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div
      className={`group relative inline-flex items-center gap-1.5 rounded-xs border border-[#0F3460] bg-[#16213E]/90 px-3 py-1 text-micro mono text-vx-100 shadow-sm backdrop-blur-xs select-none transition-colors hover:border-[#EFC07B] ${className}`}
      title="Time until FLIP launch"
    >
      <span className="text-[#EFC07B] font-semibold">|←</span>
      <span className="tabular-nums font-medium text-vx-100">{pad(days)}d</span>
      <span className="text-vx-500">:</span>
      <span className="tabular-nums font-medium text-vx-100">{pad(hours)}h</span>
      <span className="text-vx-500">:</span>
      <span className="tabular-nums font-medium text-vx-100">{pad(minutes)}m</span>
      <span className="text-vx-500">:</span>
      <span className="tabular-nums font-medium text-[#EFC07B]">{pad(seconds)}s</span>
      <span className="text-[#EFC07B] font-semibold">→|</span>
      <span className="ml-1 text-[10px] text-vx-400 group-hover:text-[#EFC07B]">
        ±0s
      </span>
    </div>
  );
}

interface UnitBlockProps {
  val: number;
  unit: string;
  label: string;
  tolerance: string;
  isSecond?: boolean;
}

function UnitBlock({ val, unit, label, tolerance, isSecond }: UnitBlockProps) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col items-center cursor-crosshair"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tolerance tag hovering above */}
      <div
        className={`pointer-events-none absolute -top-7 transition-all duration-150 mono text-[11px] px-1.5 py-0.5 rounded-2xs border ${
          hovered
            ? "opacity-100 translate-y-0 bg-[#16213E] text-[#EFC07B] border-[#0F3460] shadow-md"
            : "opacity-0 translate-y-1 bg-transparent text-transparent border-transparent"
        }`}
      >
        {tolerance}
      </div>

      {/* Main Dimension Block: |← [digits] unit →| */}
      <div className="flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 rounded-sm bg-[#1A1A2E] border border-[#0F3460] shadow-inner">
        {/* Left extension line & arrowhead */}
        <div className="flex items-center text-[#EFC07B] select-none">
          <span className="text-[#0F3460] font-light">|</span>
          <span className="text-xs sm:text-sm -ml-0.5 font-bold">←</span>
        </div>

        {/* Digits & Unit */}
        <div className="flex items-baseline gap-1 px-1">
          <span className="mono text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-vx-100 tabular-nums">
            {pad(val)}
          </span>
          <span className="mono text-xs sm:text-sm font-semibold uppercase text-[#EFC07B]">
            {unit}
          </span>
        </div>

        {/* Right arrowhead & extension line */}
        <div className="flex items-center text-[#EFC07B] select-none">
          <span className="text-xs sm:text-sm -mr-0.5 font-bold">→</span>
          <span className="text-[#0F3460] font-light">|</span>
        </div>
      </div>

      {/* Descriptor & ticking measuring indicator */}
      <div className="mt-2 flex flex-col items-center gap-1 w-full max-w-[120px]">
        <span className="mono text-[11px] sm:text-xs uppercase tracking-wider text-vx-400 font-medium">
          {label}
        </span>
        {isSecond && (
          <div className="w-full h-1 bg-[#1A1A2E] rounded-full overflow-hidden mt-0.5 border border-[#0F3460]">
            <div
              key={val}
              className="h-full bg-[#EFC07B] rounded-full transition-all duration-1000 ease-linear motion-reduce:transition-none"
              style={{ width: `${((val % 60) / 60) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Full interactive engineering readout countdown component.
 */
export function EngineeringCountdown({ className = "" }: { className?: string }) {
  const { days, hours, minutes, seconds, isLive, mounted } = useCountdown();

  if (!mounted) {
    return (
      <div className={`rounded-xl border border-[#0F3460] bg-[#16213E] p-8 sm:p-10 text-center shadow-xl ${className}`}>
        <div className="mono text-xs text-vx-400 tracking-wider uppercase mb-4">
          ENGINEERING READOUT · T-MINUS TO LAUNCH
        </div>
        <div className="mono text-2xl text-vx-300">INITIALIZING CLOCK...</div>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className={`rounded-xl border border-emerald-500/50 bg-[#16213E] p-8 sm:p-10 text-center shadow-2xl ${className}`}>
        <div className="inline-flex items-center gap-2 rounded-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 mono text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          SYSTEM STATUS: ONLINE
        </div>
        <h2 className="text-h2 font-heading text-vx-100">FLIP is live.</h2>
        <p className="mt-3 text-body text-vx-300 max-w-[44ch] mx-auto">
          Drawing intelligence is now active. Upload your DXF, DWG, or PDF engineering sheets to generate verified 3D solids.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="#join"
            className="rounded-sm bg-[#EFC07B] text-[#1A1A2E] px-6 py-2.5 font-heading text-small font-semibold hover:bg-[#EFC07B]/90 transition-colors shadow-md"
          >
            Launch FLIP
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl border border-[#0F3460] bg-[#16213E] p-6 sm:p-10 text-vx-100 shadow-2xl overflow-hidden ${className}`}>
      {/* CAD Grid Background Accents */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#0f3460_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header Readout Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#0F3460] pb-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#EFC07B] animate-pulse motion-reduce:animate-none" />
          <span className="mono text-micro font-semibold uppercase tracking-widest text-[#EFC07B]">
            CALIBRATED COUNTDOWN · UTC+05:30
          </span>
        </div>
        <div className="mono text-micro text-vx-400">
          TOLERANCE: <span className="text-vx-200">±0s (ABSOLUTE)</span>
        </div>
      </div>

      {/* Dimension Units Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 justify-center">
        <UnitBlock val={days} unit="d" label="Days" tolerance="±0 d" />
        <UnitBlock val={hours} unit="h" label="Hours" tolerance="±0 h" />
        <UnitBlock val={minutes} unit="m" label="Minutes" tolerance="±0 m" />
        <UnitBlock val={seconds} unit="s" label="Seconds" tolerance="±0 s" isSecond={true} />
      </div>

      {/* Footer Dimension Note */}
      <div className="relative z-10 mt-8 pt-4 border-t border-[#0F3460] flex flex-wrap items-center justify-between text-micro mono text-vx-400">
        <span>TARGET SPEC: {LAUNCH_AT}</span>
        <span className="text-[#EFC07B]">HOVER FOR TOLERANCES</span>
      </div>
    </div>
  );
}
