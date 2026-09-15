"use client";

import { useRef } from "react";
import { Dim } from "./Dim";

/**
 * The gap between two sections, measured. The spacer is the gap; the dimension
 * line reads its live height.
 */
export function SectionGap() {
  const gap = useRef<HTMLDivElement>(null);
  return (
    <div className="container">
      <div ref={gap} className="relative h-24 lg:h-32" aria-hidden="true">
        <Dim axis="y" measure={gap} className="absolute left-0 top-0" />
      </div>
    </div>
  );
}
