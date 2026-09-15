"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Dim } from "@/components/Dim";
import { SectionHeader } from "@/components/SectionHeader";
import { archive } from "@/content/site";
import { gsap, ScrollTrigger, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * The impact graph: which drawings contain which. Edges draw on as the section
 * enters. The BOM bar is measured by a dimension line at exactly 28%.
 */

const ink = "#E0E1DD";
const dimInk = "#778DA9";
const hair = "#415A77";
const mono = { fontFamily: "var(--font-mono)" } as const;
const sans = { fontFamily: "var(--font-sans)" } as const;

type Node = { id: string; x: number; y: number; label: string; kind?: "focus" | "superseded" | "isolated" };
const nodes: Node[] = [
  { id: "asm", x: 300, y: 40, label: "EEI-3000" },
  { id: "a", x: 120, y: 160, label: "EEI-3057", kind: "focus" },
  { id: "b", x: 300, y: 160, label: "EEI-3061" },
  { id: "c", x: 480, y: 160, label: "EEI-3102" },
  { id: "a1", x: 40, y: 290, label: "EEI-2210" },
  { id: "a2", x: 200, y: 290, label: "EEI-2214" },
  { id: "c1", x: 480, y: 290, label: "EEI-2988 A", kind: "superseded" },
  { id: "c1b", x: 620, y: 290, label: "EEI-2988 B" },
];
const edges: [string, string, "solid" | "stale"][] = [
  ["asm", "a", "solid"],
  ["asm", "b", "solid"],
  ["asm", "c", "solid"],
  ["a", "a1", "solid"],
  ["a", "a2", "solid"],
  ["b", "a2", "solid"],
  ["c", "c1", "stale"],
];
const isolated = [
  [640, 60], [680, 110], [620, 150], [700, 170], [660, 210], [710, 240], [640, 400], [700, 380], [600, 420],
];

export default function Understand() {
  const section = useRef<HTMLElement>(null);
  const seg = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const root = section.current!;
      const lines = root.querySelectorAll<SVGElement>("[data-edge]");
      const marks = root.querySelectorAll<SVGElement>("[data-node]");
      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(marks, { opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 75%", end: "top 20%", scrub: 1 },
      });
      tl.to(marks, { opacity: 1, duration: 0.3, stagger: 0.04 }, 0);
      tl.to(lines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.06, ease: "none" }, 0.1);
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.vars.trigger === root && t.kill());
      };
    },
    { scope: section },
  );

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <section ref={section} className="rule section">
      <div className="container grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeader
            title="Understand what depends on what."
            lede={
              <>
                Every drawing that contains another becomes an edge in a graph. On the design partner&apos;s archive
                there were {archive.containmentEdgesLabel} of them. The graph is where the expensive surprises live.
              </>
            }
          />
          <dl className="mt-10 divide-y divide-vx-600 border-y border-vx-600">
            <div className="grid grid-cols-[7rem_1fr] items-baseline gap-4 py-4">
              <dt className="mono text-h3 text-vx-100">{archive.containmentEdgesLabel}</dt>
              <dd className="text-small text-vx-400">containment edges in one archive</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] items-baseline gap-4 py-4">
              <dt className="mono text-h3 text-vx-100">{archive.isolatedLabel}</dt>
              <dd className="text-small text-vx-400">of drawings connected to nothing</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] items-baseline gap-4 py-4">
              <dt className="mono text-h3 text-vx-100">{archive.bomSupersededLabel}</dt>
              <dd className="text-small text-vx-400">of BOM references point at a superseded drawing</dd>
            </div>
          </dl>

          <div className="mt-10">
            <p className="text-small text-vx-400">Bill-of-material references</p>
            <div className="relative mt-8">
              <div className="absolute left-0 top-[-28px]" style={{ width: `${archive.bomSuperseded * 100}%` }}>
                <Dim label={archive.bomSupersededLabel} />
              </div>
              <div className="h-3 w-full border border-vx-600">
                <div ref={seg} className="h-full bg-vx-400" style={{ width: `${archive.bomSuperseded * 100}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-micro text-vx-400">
                <span>point at a superseded revision</span>
                <span>current</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <svg
            viewBox="0 0 760 460"
            className="block h-auto w-full"
            role="img"
            aria-label="A containment graph. Assembly EEI-3000 contains EEI-3057, EEI-3061 and EEI-3102. EEI-3057 contains EEI-2210 and EEI-2214. EEI-3102 still references EEI-2988 revision A, which has been superseded by revision B. A cluster of drawings at the right connect to nothing."
            fill="none"
          >
            {edges.map(([f, t, kind]) => {
              const a = byId[f];
              const b = byId[t];
              return (
                <line
                  key={f + t}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={kind === "stale" ? dimInk : hair}
                  strokeWidth="1"
                  strokeDasharray={kind === "stale" ? "4 4" : undefined}
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  data-edge
                />
              );
            })}
            {/* the newer revision, not referenced by anything */}
            <line x1={byId.c1.x + 42} y1={byId.c1.y} x2={byId.c1b.x - 42} y2={byId.c1b.y} stroke={hair} strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" pathLength={1} data-edge />

            {nodes.map((n) => {
              const focus = n.kind === "focus";
              const stale = n.kind === "superseded";
              return (
                <g key={n.id} data-node>
                  <rect
                    x={n.x - 42}
                    y={n.y - 13}
                    width={84}
                    height={26}
                    fill="#0D1B2A"
                    stroke={focus ? ink : stale ? dimInk : hair}
                    strokeWidth={focus ? 1.5 : 1}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fill={focus ? ink : stale ? dimInk : ink} fontSize="12" style={mono}>
                    {n.label}
                  </text>
                </g>
              );
            })}
            <text x={byId.c1.x} y={byId.c1.y + 30} textAnchor="middle" fill={dimInk} fontSize="11" style={sans} data-node>
              superseded, still referenced
            </text>
            <text x={byId.asm.x} y={byId.asm.y - 22} textAnchor="middle" fill={dimInk} fontSize="11" style={sans} data-node>
              assembly
            </text>

            {isolated.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" fill={hair} data-node />
            ))}
            <text x="660" y="450" textAnchor="middle" fill={dimInk} fontSize="11" style={sans} data-node>
              connected to nothing
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
