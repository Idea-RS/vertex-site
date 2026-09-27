import React from "react";

export function ProblemEditorial() {
  return (
    <section className="rule section py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="max-w-[70ch]">
          <div className="mono text-micro uppercase tracking-wider text-[#EFC07B] mb-4 font-semibold">
            Meet our first product: FLIP
          </div>

          <h2 className="text-h2 font-heading text-vx-100 leading-[1.12] tracking-[-0.02em]">
            Redrawing 2D engineering sheets into 3D CAD takes days — and silently buries guesses.
          </h2>

          <p className="mt-6 text-body text-vx-300 leading-relaxed font-sans">
            FLIP reads views, sections, and dimension chains to build exact solid models in minutes. When a drawing leaves a dimension unstated, FLIP never hides a guess: it names every assumption as an explicit choice and verifies the solid against the sheet.
          </p>
        </div>
      </div>
    </section>
  );
}
