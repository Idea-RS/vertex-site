import React from "react";

interface PulseOrbProps {
  className?: string;
  size?: "sm" | "md";
}

/**
 * Solid signature-orange pulsating indicator orb.
 * Uses Vertex's signature orange (#f0a868) with a solid core,
 * breathing glow effect, and an expanding radar ping pulse ring.
 */
export function PulseOrb({ className = "", size = "sm" }: PulseOrbProps) {
  const isSm = size === "sm";
  const containerSize = isSm ? "h-2 w-2" : "h-2.5 w-2.5";
  const coreSize = isSm ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <span className={`relative flex ${containerSize} items-center justify-center shrink-0 ${className}`} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-dim animate-orb-ping" />
      <span className={`relative inline-flex ${coreSize} rounded-full bg-dim animate-orb-glow`} />
    </span>
  );
}
