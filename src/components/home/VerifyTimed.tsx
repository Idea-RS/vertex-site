"use client";

import { useEffect, useRef, useState } from "react";
import { RuleDiagram, type RuleId } from "@/components/drawing/RuleDiagrams";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Verify, as a timed loop that fits one screen. Five rule headings stacked on
 * the left; a thin orange line under the active one fills over 4s and is gone
 * the moment its rule completes, so only the active rule ever carries a line.
 * The next heading takes over, and after the fifth it rolls back to the first,
 * for as long as the section is in view. The right pane shows a small figure
 * of what the active rule checks, with its description and verdict, replaced
 * by crossfade. Off screen it pauses and resumes where it was; a click on a
 * heading jumps there and restarts its line. The coverage bar is the summary,
 * always resolved under the list, not a sixth step.
 *
 * Sized for a 900px-tall viewport: nothing in the section needs a scroll.
 * Reduced motion: no timer and no line; a click or focus picks the rule.
 */

const DURATION = 4000;
const CHECKS_RAN = 6;
const FIELDS = 44800;

type Rule = { id: RuleId; title: string; what: string; verdict: string; advisory?: boolean };
const rules: Rule[] = [
  { id: "number", title: "Sheet states its own number", what: "The title block carries a drawing number, and it is the number the archive filed the sheet under.", verdict: "checked" },
  { id: "rows", title: "Every table row has an indicator", what: "Each row of the variant table names a size that the sheet's dimensions can be resolved to.", verdict: "checked" },
  { id: "placeholder", title: "Placeholder resolved", what: "A dimension that reads from the table resolves to a value in the selected row: d becomes 97.2.", verdict: "checked" },
  { id: "holes", title: "Hole count matches parts list", what: "This sheet has no parts list, so the rule had nothing exact to check the eight holes against.", verdict: "advisory: couldn't confirm", advisory: true },
  { id: "chain", title: "Dimension chain closes", what: "The overall length is the sum of the parts along it: 24 + 28 + 16 + 16 = 84, within tolerance.", verdict: "checked" },
];

export default function VerifyTimed() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);
  const activeRef = useRef(0);
  const elapsed = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    const id = requestAnimationFrame(sync);
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // The timer: a rAF loop that runs only while the section is in view.
  useEffect(() => {
    if (still || prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    let running = false;
    const tick = (t: number) => {
      raf = 0;
      if (!running) return;
      if (last) elapsed.current += Math.min(100, t - last); // a long frame never skips a rule
      last = t;
      const p = Math.min(1, elapsed.current / DURATION);
      if (line.current) line.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (p >= 1) {
        const next = (activeRef.current + 1) % rules.length;
        activeRef.current = next;
        elapsed.current = 0;
        setActive(next);
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [still]);

  const pick = (i: number) => {
    elapsed.current = 0;
    activeRef.current = i;
    if (line.current) line.current.style.transform = "scaleX(0)";
    setActive(i);
  };

  const ranPct = ((100 * CHECKS_RAN) / FIELDS).toFixed(4);
  const fade = still ? "" : "transition-opacity duration-[350ms] ease-out";

  return (
    <section ref={root} id="verify" className="rule" aria-label="Verify">
      <div className="container py-16 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-10 lg:pt-[104px]">
        <div className="w-full lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* left: the claim, the five rules, the coverage summary */}
          <div className="lg:col-span-5">
            <h2 className="max-w-[18ch] text-h2">Verify what can be verified. Say the rest.</h2>
            <p className="mt-3 max-w-[46ch] text-body text-vx-600">
              The checks are rules, not guesses: they pass, they fail, or they couldn&apos;t run. Every verdict lists all three.
            </p>

            {/* below lg the figure sits here, above the list, so the active rule and its figure share a screen */}
            <div className="mt-8 lg:hidden">
              <Figure active={active} fade={fade} />
            </div>

            <ol className="mt-8 border-b border-vx-400" aria-label="Rules">
              {rules.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.id} className="relative border-t border-vx-400">
                    <h3 className="text-h3">
                      <button
                        type="button"
                        onClick={() => pick(i)}
                        onFocus={still ? () => pick(i) : undefined}
                        className="flex w-full items-baseline gap-4 py-3 text-left"
                        aria-current={on ? "step" : undefined}
                      >
                        <span className="mono w-5 shrink-0 text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                        <span className={`transition-colors duration-[350ms] ${on ? "text-vx-900" : "text-vx-600"}`}>{r.title}</span>
                      </button>
                    </h3>
                    {/* the progress line: only the active rule has one, and it goes when the rule completes */}
                    {on && !still && (
                      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px" aria-hidden="true">
                        <div ref={line} className="h-px origin-left bg-dim-deep" style={{ transform: "scaleX(0)" }} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* the summary: resolved, not timed */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-body text-vx-900">What wasn&apos;t checked</p>
                <p className="mono text-micro text-vx-600">
                  {CHECKS_RAN} of {FIELDS.toLocaleString("en-US")} fields
                </p>
              </div>
              <div className="mt-2" role="img" aria-label={`${CHECKS_RAN} checks ran against ${FIELDS.toLocaleString("en-US")} fields`}>
                <div className="flex h-3 w-full overflow-hidden rounded-xs border border-vx-400">
                  <div className="h-full bg-vx-800" style={{ width: `max(2px, ${ranPct}%)` }} />
                  <div className="h-full flex-1 bg-vx-400" />
                </div>
              </div>
              <p className="mt-2 max-w-[46ch] text-small text-vx-600">
                {CHECKS_RAN} checks ran. {FIELDS.toLocaleString("en-US")} fields exist. The sliver is drawn to scale.
              </p>
            </div>
          </div>

          {/* right: what the active rule looks at */}
          <div className="hidden lg:col-span-7 lg:block">
            <Figure active={active} fade={fade} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Figure({ active, fade }: { active: number; fade: string }) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-lg bg-vx-800" style={{ aspectRatio: "5 / 3" }}>
        {rules.map((rule, i) => (
          <div key={rule.id} className={`absolute inset-4 ${fade}`} style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
            <RuleDiagram id={rule.id} />
          </div>
        ))}
      </div>
      {/* every description occupies the same grid cell, so the block is as tall as the longest and never shifts */}
      <div className="mt-4 grid">
        {rules.map((rule, i) => (
          <div key={rule.id} className={`[grid-area:1/1] ${fade}`} style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
            <p className="mono text-micro text-vx-600">
              DRG-4120 · R2 · rule {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 max-w-[56ch] text-body text-vx-900">{rule.what}</p>
            <p className={`mono mt-1 text-small ${rule.advisory ? "text-vx-600" : "text-vx-900"}`}>{rule.verdict}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
