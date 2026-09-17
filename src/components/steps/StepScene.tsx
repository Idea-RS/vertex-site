"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Dim } from "@/components/Dim";

/**
 * The page's one motion vocabulary: sticky-left, stepping-right.
 *
 * A visual is pinned in the left ~55%; the right column holds N short steps.
 * The step in the centre band is the active one — the parent lights one
 * element of the visual, dims the rest to 25%, and lands an orange bracket
 * beside it. Transitions are 350ms ease-out, nothing else moves; on scroll-back
 * the steps reverse. Below 1024px and under reduced motion the visual is a still
 * above the steps, which are a plain list with nothing dimmed.
 */

export type Step = { key: string; title: string; what: string; vertex?: string };

/** Which step is in the centre band. Steps are `[data-step]` descendants of `root`. */
export function useActiveStep(root: RefObject<HTMLElement | null>, enabled = true) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || !enabled) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const k = e.target.getAttribute("data-step")!;
          if (e.isIntersecting) setActive(k);
          else setActive((a) => (a === k ? null : a));
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [root, enabled]);
  return active;
}

/** True below the lg breakpoint or under reduced motion: the static layout. */
export function useStaticLayout() {
  const [isStatic, setStatic] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 63.99rem), (prefers-reduced-motion: reduce)");
    const sync = () => setStatic(mq.matches);
    mq.addEventListener("change", sync);
    const id = requestAnimationFrame(sync);
    return () => {
      mq.removeEventListener("change", sync);
      cancelAnimationFrame(id);
    };
  }, []);
  return isStatic;
}

export type BracketSide = "right" | "left" | "above" | "below" | "inside-right";

/**
 * An orange dimension line beside an element inside `box`, measuring it. The
 * anchor is found by `selector` each time `active` changes, after one frame so
 * the element's 350ms lift has started from its final position.
 */
export function Bracket({ box, selector, active, side = "right", tone = "dark", inset = 0, delay = 0 }: { box: RefObject<HTMLElement | HTMLDivElement | null>; selector: string | null; active: string | null; side?: BracketSide; tone?: "dark" | "light"; inset?: number; delay?: number }) {
  const [b, setB] = useState<{ axis: "x" | "y"; left: number; top: number; height?: number; width?: number } | null>(null);
  const target = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const boxEl = box.current;
    let raf = 0;
    const timer = setTimeout(() => { raf = requestAnimationFrame(() => {
      const anchor = boxEl && selector && active ? boxEl.querySelector<Element>(selector) : null;
      if (!boxEl || !anchor) return setB(null);
      const a = anchor.getBoundingClientRect();
      const r0 = boxEl.getBoundingClientRect();
      const scale = r0.width / boxEl.offsetWidth || 1;
      const r = { left: (a.left - r0.left) / scale, top: (a.top - r0.top) / scale, w: a.width / scale, h: a.height / scale };
      const s = (anchor.getAttribute("data-bracket") as BracketSide | null) ?? side;
      const T = 24;
      const gap = 8;
      if (s === "below") setB({ axis: "x", left: r.left, top: r.top + r.h + gap, width: r.w });
      else if (s === "above") setB({ axis: "x", left: r.left, top: r.top - gap - T, width: r.w });
      else if (s === "left") setB({ axis: "y", left: r.left - gap - T, top: r.top, height: r.h });
      else if (s === "inside-right") setB({ axis: "y", left: r.left + r.w - gap - T, top: r.top, height: r.h });
      else setB({ axis: "y", left: r.left + r.w + gap, top: r.top, height: r.h });
    }); }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [box, selector, active, side, delay]);
  if (!b) return null;
  return (
    <div className="pointer-events-none absolute" style={{ top: inset + b.top, left: inset + b.left, height: b.height ?? 24, width: b.width ?? 24 }} key={active ?? ""} aria-hidden="true">
      <div ref={target} className={b.axis === "y" ? "absolute inset-y-0 left-0 w-px" : "absolute inset-x-0 top-0 h-px"} />
      <Dim axis={b.axis} measure={target} tone={tone} className="absolute left-0 top-0" />
    </div>
  );
}

/**
 * The two-column frame. `visual` is rendered inside the sticky left column on
 * desktop and above the steps on the static layout; `intro` sits above the
 * first step on the right.
 */
export function StepScene({
  id,
  label,
  steps,
  active,
  visual,
  intro,
  caption,
  isStatic,
  renderStep,
}: {
  id: string;
  label: string;
  steps: Step[];
  active: string | null;
  visual: ReactNode;
  intro?: ReactNode;
  caption?: ReactNode;
  isStatic: boolean;
  renderStep?: (s: Step, i: number, lit: boolean) => ReactNode;
}) {
  const NAV = 90;
  return (
    <section className="rule relative" id={id} aria-label={label} data-static={isStatic ? "true" : undefined}>
      <div className="container lg:grid lg:grid-cols-12 lg:gap-8">
        {visual && (
          <div className="pt-12 lg:col-span-7 lg:pt-0">
            <div className={isStatic ? "" : "lg:sticky"} style={isStatic ? undefined : { top: NAV, height: `calc(100svh - ${NAV}px)` }}>
              <div className={isStatic ? "" : "flex h-full flex-col justify-center"}>
                <div className="w-full lg:w-[92%]">{visual}</div>
                {caption && <div className="mono mt-3 text-micro text-vx-600">{caption}</div>}
              </div>
            </div>
          </div>
        )}
        <div className={visual ? "lg:col-span-5" : "lg:col-span-7"}>
          {intro && <div className={`max-w-[44ch] pb-10 pt-12 ${isStatic ? "" : "lg:pb-[24svh] lg:pt-[36svh]"}`}>{intro}</div>}
          <ol className={isStatic ? "pb-12" : intro ? "lg:pb-[30svh]" : "pt-12 lg:pb-[30svh] lg:pt-[36svh]"}>
            {steps.map((s, i) => {
              const lit = active === s.key;
              return (
                <li key={s.key} data-step={s.key} className={`step border-t border-vx-400 py-8 ${isStatic ? "" : "lg:flex lg:min-h-[70svh] lg:items-center lg:border-0 lg:py-0"}`} data-lit={lit ? "true" : undefined}>
                  {renderStep ? (
                    renderStep(s, i, lit)
                  ) : (
                    <div className="max-w-[44ch]">
                      <div className="flex items-baseline gap-4">
                        <span className="mono text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                        <h2 className="text-h3 text-vx-900">{s.title}</h2>
                      </div>
                      <p className="mt-3 text-body text-vx-600">{s.what}</p>
                      {s.vertex && <p className="mt-2 text-body text-vx-900">{s.vertex}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
