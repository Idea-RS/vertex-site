"use client";

import { useState } from "react";
import { PartIcon } from "@/components/drawing/PartIcons";
import { industries } from "@/content/industries";

/**
 * Built for the shops that keep the lights on. Eight segments on the left,
 * labelled by drawing zone; one part drawn in our linework on the right that
 * swaps on hover, tap or focus. From the Tandem study: the row is the hover
 * target, its label goes to full colour and a square marker appears; the
 * illustration crossfades in 250ms. Nothing else moves. Below 1024px the rows
 * stack with their part above each.
 */
export default function Industries() {
  const [active, setActive] = useState(0);
  const a = industries[active];
  return (
    <section className="rule section" aria-label="Who Vertex is built for">
      <div className="container">
        <h2 className="max-w-[22ch] text-h2">Built for the shops that keep the lights on.</h2>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-8">
          <ul className="lg:col-span-5" role="list">
            {industries.map((ind, i) => {
              const on = i === active;
              return (
                <li key={ind.zone} className="border-t border-vx-400 last:border-b">
                  <button
                    type="button"
                    className={`flex w-full items-baseline gap-4 py-4 text-left transition-colors duration-200 ${on ? "text-vx-900" : "text-vx-600 hover:text-vx-900"}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                  >
                    <span className="mono w-7 shrink-0 text-micro text-vx-600">{ind.zone}</span>
                    <span className={`block h-2 w-2 shrink-0 self-center bg-vx-900 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                    <span className="text-body">{ind.name}</span>
                  </button>
                  {/* below lg: the part above each row's line, no hover needed */}
                  <div className="pb-5 lg:hidden">
                    <div className="overflow-hidden rounded-md bg-vx-800 p-3">
                      <PartIcon id={ind.part} className="block h-auto w-full" />
                    </div>
                    <p className="mt-3 text-small text-vx-600">{ind.line}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="hidden lg:col-span-7 lg:block">
            <div className="lg:sticky" style={{ top: 120 }}>
              <div className="relative overflow-hidden rounded-lg bg-vx-800 p-6" style={{ aspectRatio: "240 / 160" }}>
                {industries.map((ind, i) => (
                  <div key={ind.zone} className="absolute inset-6 transition-opacity duration-[250ms] ease-out" style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
                    <PartIcon id={ind.part} className="block h-full w-full" />
                  </div>
                ))}
                <span className="mono absolute bottom-4 left-6 text-micro text-muted-raised">{a.zone}</span>
              </div>
              <p className="mt-4 max-w-[52ch] text-body text-vx-600" aria-live="polite">{a.line}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
