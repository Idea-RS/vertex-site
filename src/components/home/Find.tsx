"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Bracket, StepScene, useActiveStep, useStaticLayout, type Step } from "@/components/steps/StepScene";
import { Dim } from "@/components/Dim";
import { archive } from "@/content/site";
import archiveImages from "@/content/archive-images.json";
import { gsap, setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Find, as a search you watch happen. Left, pinned: a wall of 36 real patent
 * drawing sheets. Right, four steps: the query types itself as step one
 * scrolls; as it completes, non-matching sheets drop to 25% and the three
 * matches lift with a bracket; a result row appears under the field; then the
 * honest line. Same vocabulary as the explainer, nothing else moves.
 */

type ArchiveImage = { src: string; w: number; h: number; patent: string; title: string; year: number };
const IMAGES = archiveImages as ArchiveImage[];
const QUERY = "flanged housing Ø160";
const MATCHES = ["US 2,271,336", "US 2,015,233", "US 1,689,856"]; // bearing housings in the archive
const WALL = (() => {
  const hits = MATCHES.map((n) => IMAGES.find((i) => i.patent === n)).filter(Boolean) as ArchiveImage[];
  const rest = IMAGES.filter((i) => !hits.includes(i)).slice(0, 36 - hits.length);
  // place the three hits at cells 8, 16 and 27 so they read as found, not arranged
  const cells: ArchiveImage[] = [...rest];
  cells.splice(8, 0, hits[0]);
  cells.splice(16, 0, hits[1]);
  cells.splice(27, 0, hits[2]);
  return cells.slice(0, 36);
})();
const UNREADABLE = 2; // sheets in this wall with no readable geometry: scans below the floor
const UNREADABLE_CELLS = [5, 30];

const steps: Step[] = [
  { key: "query", title: "Ask in your own words", what: "A number, a name, a dimension, or a file. The query is typed the way a draughtsman would say it out loud.", vertex: "Vertex reads it as three constraints: a part family, a feature, and a size." },
  { key: "match", title: "Three sheets answer", what: "Every sheet in the archive is compared on exact values where they exist and inferred values where they don't.", vertex: "The matches lift; everything else steps back. Nothing is hidden, so you can see what didn't match." },
  { key: "result", title: "Each hit says why", what: "A result is not a thumbnail. It is the drawing number, the name, and the chips that matched: the diameter, the feature, the hole count.", vertex: `The family came back in ${archive.familyMs} ms.` },
  { key: "honest", title: "And what it couldn't read", what: `${UNREADABLE} of 36 sheets on this wall have no readable geometry: scans below the resolution floor.`, vertex: "We say so on the result, every time. Nothing inferred is ever presented as exact." },
];

export default function Find() {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const isStatic = useStaticLayout();
  const active = useActiveStep(root, !isStatic);
  const idx = steps.findIndex((s) => s.key === active);

  // The query types itself as step one scrolls through the centre band.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      setupGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const step = root.current!.querySelector<HTMLElement>('[data-step="query"]')!;
        const text = root.current!.querySelector<HTMLElement>("[data-typed]")!;
        const state = { n: 0 };
        gsap.to(state, {
          n: QUERY.length,
          ease: "none",
          scrollTrigger: { trigger: step, start: "top 80%", end: "top 45%", scrub: 1 },
          onUpdate: () => {
            text.textContent = QUERY.slice(0, Math.round(state.n));
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Apply the lit state to the wall.
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    b.dataset.phase = isStatic ? "honest" : idx < 1 ? "wall" : idx < 3 ? "result" : "honest";
  }, [idx, isStatic]);

  const showMatches = isStatic || idx >= 1;
  const showHonest = isStatic || idx >= 3;

  const visual = (
    <div className="relative">
      <div ref={box} className="relative overflow-hidden rounded-lg bg-vx-800 p-3" data-phase="result">
        <div className="grid grid-cols-6 gap-2" aria-label="36 drawing sheets from the archive" role="img">
          {WALL.map((img, i) => {
            const hit = MATCHES.includes(img.patent);
            return (
              <figure
                key={img.patent + i}
                className="wall-sheet m-0 overflow-hidden rounded-xs border border-vx-600 bg-vx-800"
                style={{ aspectRatio: "1 / 1" }}
                data-hit={hit ? "true" : undefined}
                data-match={hit ? MATCHES.indexOf(img.patent) : undefined}
                data-unreadable={UNREADABLE_CELLS.includes(i) ? UNREADABLE_CELLS.indexOf(i) : undefined}
                title={`${img.patent} · ${img.title} · ${img.year}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} width={img.w} height={img.h} alt="" loading="lazy" decoding="async" className="block h-full w-full object-cover object-top" />
              </figure>
            );
          })}
        </div>
        {showMatches && <Bracket box={box} selector={showHonest ? '[data-unreadable="0"]' : '[data-match="0"]'} active={active ?? "static"} side="left" inset={0} />}
      </div>
    </div>
  );

  const intro = (
    <div>
      <h2 className="max-w-[16ch] text-h2">Find any part in milliseconds.</h2>
      <p className="mt-4 text-body text-vx-600">
        By drawing number, by words, by dimensions, or by dropping a file. Measured on one manufacturer&apos;s archive of about 7,000 drawings: precision at one of {archive.searchP1}.
      </p>
    </div>
  );

  return (
    <div ref={root} data-find>
      <StepScene
        id="find"
        label="Find"
        steps={steps}
        active={active}
        isStatic={isStatic}
        intro={intro}
        visual={visual}
        renderStep={(s, i, lit) => (
          <div className="w-full max-w-[44ch]">
            <div className="flex items-baseline gap-4">
              <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-h3 text-vx-900">{s.title}</h3>
            </div>
            {s.key === "query" && (
              <div className="mono mt-4 flex h-11 items-center rounded-sm border border-vx-400 bg-vx-100 px-3 text-body text-vx-900" role="textbox" aria-readonly="true" aria-label="Search query">
                <span data-typed>{isStatic ? QUERY : ""}</span>
                <span className={`ml-px inline-block h-5 w-px bg-vx-900 ${lit ? "" : "opacity-0"}`} aria-hidden="true" />
              </div>
            )}
            {s.key === "result" && (
              <div className="mt-4">
                <Dim label={`${archive.familyMs} ms`} tone="light" />
                <ul className="mt-2 divide-y divide-vx-400 border-y border-vx-400">
                  {[
                    ["US 2,271,336", "Bearing mounting, 1942", ["Ø160", "flange", "8 holes"]],
                    ["US 2,015,233", "Seal for bearing housings, 1935", ["Ø160", "flange", "6 holes"]],
                    ["US 1,689,856", "Bearing mounting, 1928", ["Ø158", "flange", "8 holes"]],
                  ].map(([no, name, chips]) => (
                    <li key={no as string} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2 text-small">
                      <span className="mono text-vx-600">{no as string}</span>
                      <span className="text-vx-900">{name as string}</span>
                      <span className="ml-auto flex gap-1">
                        {(chips as string[]).map((c) => (
                          <span key={c} className="mono rounded-xs border border-vx-400 px-1.5 text-micro text-vx-600">
                            {c}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-3 text-body text-vx-600">{s.what}</p>
            {s.vertex && <p className="mt-2 text-body text-vx-900">{s.vertex}</p>}
          </div>
        )}
      />
    </div>
  );
}

