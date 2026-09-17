"use client";

import { useEffect, useRef, useState } from "react";
import { RuleDiagram, type RuleId } from "@/components/drawing/RuleDiagrams";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Verify, as a timed progression: the page's third rhythm (scrolled, hovered,
 * and now timed). All five rule headings are in view at once; a thin orange
 * line under the active one fills over ~4s, then that heading steps back to
 * vx-600 and the next takes over. The other side shows a small figure of what
 * the rule checks, replaced with a crossfade. It plays while the section is on
 * screen, pauses when it leaves, and a click on any heading restarts there.
 * After the fifth, the coverage bar resolves. Reduced motion: no timers, every
 * heading shown with its figure.
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
  const lines = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false); // all five have run; the coverage bar is resolved
  const [isStatic, setStatic] = useState(false);
  const running = useRef(false);
  const elapsed = useRef(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStatic(mq.matches);
    const id = requestAnimationFrame(sync);
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
    elapsed.current = 0;
    lines.current.forEach((l, i) => {
      if (!l) return;
      l.style.width = i < active ? "100%" : "0%";
    });
  }, [active]);

  // The timer: rAF while the section is on screen and not finished.
  useEffect(() => {
    if (isStatic || prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (!running.current) return;
      if (last) elapsed.current += t - last;
      last = t;
      const p = Math.min(1, elapsed.current / DURATION);
      const line = lines.current[activeRef.current];
      if (line) line.style.width = `${(p * 100).toFixed(2)}%`;
      if (p >= 1) {
        if (activeRef.current < rules.length - 1) {
          setActive(activeRef.current + 1);
          last = 0;
        } else {
          setDone(true);
          running.current = false;
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        const shouldRun = e.isIntersecting && !done;
        if (shouldRun && !running.current) {
          running.current = true;
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!shouldRun) {
          running.current = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      running.current = false;
      cancelAnimationFrame(raf);
    };
  }, [isStatic, done]);

  const jump = (i: number) => {
    setDone(false);
    setActive(i);
    elapsed.current = 0;
    if (!running.current && !isStatic) {
      running.current = true;
      // the observer effect restarts the loop on the next done→false render
    }
  };

  const ranPct = ((100 * CHECKS_RAN) / FIELDS).toFixed(4);

  return (
    <section ref={root} id="verify" className="rule section" aria-label="Verify">
      <div className="container">
        <h2 className="max-w-[18ch] text-h2">Verify what can be verified. Say the rest.</h2>
        <p className="mt-4 max-w-[52ch] text-body text-vx-600">
          The checks are rules, not guesses: they pass, they fail, or they couldn&apos;t run. Every verdict lists all three, so a PASS means exactly what it says.
        </p>

        <div className={isStatic ? "mt-12 max-w-[40rem]" : "mt-12 lg:grid lg:grid-cols-12 lg:gap-8"}>
          {/* the figure: one at a time, crossfaded; on the static layout each sits under its heading */}
          {!isStatic && (
            <div className="mb-8 lg:order-2 lg:col-span-7 lg:mb-0">
              <div className="lg:sticky" style={{ top: 120 }}>
                <div className="relative overflow-hidden rounded-lg bg-vx-800 p-4" style={{ aspectRatio: "5 / 3" }}>
                  {rules.map((r, i) => (
                    <div key={r.id} className="absolute inset-4 transition-opacity duration-[350ms] ease-out" style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
                      <RuleDiagram id={r.id} />
                    </div>
                  ))}
                </div>
                <p className="mono mt-3 text-micro text-vx-600">DRG-4120 · R2 · what rule {String(active + 1).padStart(2, "0")} looks at</p>
              </div>
            </div>
          )}

          <ol className={isStatic ? "" : "lg:order-1 lg:col-span-5"} aria-label="Rules">
            {rules.map((r, i) => {
              const on = !isStatic && i === active;
              const past = !isStatic && (i < active || done);
              return (
                <li key={r.id} className="relative border-t border-vx-400">
                  <button type="button" onClick={() => jump(i)} className="block w-full py-5 text-left" aria-current={on ? "step" : undefined} disabled={isStatic}>
                    <div className="flex items-baseline gap-4">
                      <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className={`text-h3 transition-colors duration-[350ms] ${on || isStatic ? "text-vx-900" : "text-vx-600"}`}>{r.title}</h3>
                    </div>
                    <p className={`mt-2 max-w-[44ch] pl-9 text-body transition-colors duration-[350ms] ${on || isStatic ? "text-vx-900" : "text-vx-600"}`}>{r.what}</p>
                    <p className={`mono mt-2 pl-9 text-small ${past || on || isStatic ? "" : "invisible"} ${r.advisory ? "text-vx-600" : "text-vx-900"}`}>{r.verdict}</p>
                  </button>
                  {/* the progress line: vx-400 base, orange fill */}
                  {!isStatic && (
                    <div className="absolute inset-x-0 bottom-0 h-px" aria-hidden="true">
                      <div ref={(el) => { lines.current[i] = el; }} className="h-px bg-dim-deep" style={{ width: "0%" }} />
                    </div>
                  )}
                  {isStatic && (
                    <div className="mb-6 overflow-hidden rounded-lg bg-vx-800 p-4" style={{ aspectRatio: "5 / 3" }}>
                      <RuleDiagram id={r.id} />
                    </div>
                  )}
                </li>
              );
            })}
            <li className="border-y border-vx-400 py-5">
              <div className="flex items-baseline gap-4">
                <span className="mono text-micro text-vx-600">06</span>
                <h3 className="text-h3 text-vx-900">What wasn&apos;t checked</h3>
              </div>
              <p className="mt-2 max-w-[44ch] pl-9 text-body text-vx-900">
                {CHECKS_RAN} checks ran. {FIELDS.toLocaleString("en-US")} fields exist. Here&apos;s what wasn&apos;t checked.
              </p>
              <div className="mt-4 pl-9" role="img" aria-label={`${CHECKS_RAN} checks ran against ${FIELDS.toLocaleString("en-US")} fields`}>
                <div className="flex h-4 w-full overflow-hidden rounded-xs border border-vx-400">
                  <div className="h-full bg-vx-800 transition-[width] duration-[350ms] ease-out" style={{ width: done || isStatic ? `max(2px, ${ranPct}%)` : "0%" }} />
                  <div className="h-full flex-1 bg-vx-400" />
                </div>
                <div className="mt-2 flex justify-between text-micro text-vx-600">
                  <span className="mono">{CHECKS_RAN} checked</span>
                  <span className="mono">{FIELDS.toLocaleString("en-US")} fields</span>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
