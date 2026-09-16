"use client";

import { useRef } from "react";
import { Dim } from "@/components/Dim";
import { problemStats } from "@/content/site";

export default function Problem() {
  const stat = useRef<HTMLDivElement>(null);
  return (
    <section className="rule section">
      <div className="container">
        <blockquote>
          <p className="max-w-[24ch] text-h2">“It’s faster to draw a new part than to find the old one.”</p>
          <footer className="mt-5 text-small text-vx-600">
            An engineering manager at a manufacturer we work with. Their archive: about 7,000 drawings, three decades of revisions.
          </footer>
        </blockquote>

        <div className="mt-16 grid gap-10 sm:grid-cols-3 lg:mt-24 lg:gap-8">
          {problemStats.map((s, i) => (
            <div key={s.label} className="relative flex items-stretch gap-6">
              <div ref={i === 2 ? stat : undefined} className="min-w-0 flex-1 border-l border-vx-400 pl-6">
                <div className="mono text-[clamp(2.5rem,4.2vw,3.5rem)] leading-none text-vx-900">{s.value}</div>
                <p className="mt-3 max-w-[22ch] text-small text-vx-600">{s.label}</p>
              </div>
              {i === 2 && <Dim axis="y" measure={stat} className="shrink-0" />}
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-[60ch] text-small text-vx-600">
          All three measured on one real archive during a two-week diagnostic. Nothing on this site is estimated.
        </p>
      </div>
    </section>
  );
}
