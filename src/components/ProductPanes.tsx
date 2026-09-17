"use client";

import { useEffect, useRef, useState } from "react";
import { DemoFrame } from "@/components/DemoFrame";
import { productPanes, type ProductPaneId } from "@/content/product";
import { scrollToElement } from "@/lib/motion";

/**
 * The product page as a sticky list beside scrolling blocks. Left: Find ·
 * Verify · Make · Archive, sticky for the full height of the section and
 * released only where the section ends. Right: each surface as a full block,
 * stacked, scrolling normally. The block crossing the centre band lights its
 * row (square marker, vx-900; the rest vx-600). Hovering a row once the list
 * is stuck, clicking it, or focusing it scrolls smoothly back to the start of
 * that block: a Lenis scrollTo, 600ms ease-in-out, never a jump. Deep links
 * land on the block's start. Below 1024px the list is a row of anchors above
 * the blocks and nothing is sticky.
 */

const TOP = 120; // clears the floating nav; the list sticks here and blocks land here
const HOVER_INTENT = 80; // ms: a pointer passing over rows on its way elsewhere doesn't scroll the page

export function ProductPanes() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ProductPaneId>("find");
  const lockUntil = useRef(0);
  const hover = useRef(0);

  // The block in the centre band is the active one.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (performance.now() < lockUntil.current) return; // a recall scroll is passing other blocks
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as ProductPaneId);
        });
      },
      { rootMargin: "-49% 0px -49% 0px", threshold: 0 },
    );
    el.querySelectorAll("[data-surface]").forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  // A hash change while on the page (a footer link, the back button) glides to its block.
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      const block = productPanes.some((p) => p.id === id) ? document.getElementById(id) : null;
      if (block) go(id as ProductPaneId);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function go(id: ProductPaneId) {
    const block = document.getElementById(id);
    if (!block) return;
    lockUntil.current = performance.now() + 700;
    setActive(id);
    scrollToElement(block, { offset: TOP, duration: 0.6 });
  }

  const recall = (id: ProductPaneId) => ({
    href: `#${id}`,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      history.replaceState(null, "", `#${id}`);
      go(id);
    },
  });

  return (
    <div ref={root} className="container lg:grid lg:grid-cols-12 lg:gap-8">
      {/* desktop: the sticky list */}
      <div className="hidden lg:col-span-4 lg:block">
        <nav className="sticky" style={{ top: TOP }} aria-label="Product surfaces">
          <ul>
            {productPanes.map((p, i) => {
              const on = p.id === active;
              return (
                <li key={p.id}>
                  <a
                    {...recall(p.id)}
                    className={`flex items-center gap-3 py-2 text-h3 transition-colors duration-200 ${on ? "text-vx-900" : "text-vx-600 hover:text-vx-900"}`}
                    onMouseEnter={() => {
                      window.clearTimeout(hover.current);
                      hover.current = window.setTimeout(() => {
                        // only once the list is stuck: at the top of the page a passing pointer shouldn't move it
                        if ((root.current?.getBoundingClientRect().top ?? 1e9) <= TOP + 1) go(p.id);
                      }, HOVER_INTENT);
                    }}
                    onMouseLeave={() => window.clearTimeout(hover.current)}
                    onFocus={() => go(p.id)}
                    aria-current={on ? "true" : undefined}
                  >
                    <span className={`block h-2 w-2 shrink-0 bg-vx-900 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                    <span className="mono w-6 text-micro text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                    {p.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="lg:col-span-8">
        {/* below lg: a row of anchors, not sticky */}
        <nav className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-vx-400 pb-4 lg:hidden" aria-label="Product surfaces">
          {productPanes.map((p) => (
            <a key={p.id} {...recall(p.id)} className="py-2 text-body text-vx-900 underline decoration-vx-400 underline-offset-4">
              {p.name}
            </a>
          ))}
        </nav>

        {productPanes.map((p, i) => (
          <article key={p.id} id={p.id} data-surface className={`scroll-mt-[120px] ${i ? "border-t border-vx-400 pt-12 lg:pt-16" : ""} pb-16 lg:pb-24`} aria-labelledby={`${p.id}-heading`}>
            <p className="mono text-micro text-vx-600">
              {String(i + 1).padStart(2, "0")} · {p.name}
            </p>
            <h2 id={`${p.id}-heading`} className="mt-3 max-w-[22ch] text-h2">
              {p.heading}
            </h2>
            <div className="mt-6 max-w-[60ch] space-y-3">
              {p.body.map((t) => (
                <p key={t} className="text-body text-vx-600">
                  {t}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <DemoFrame label={p.name} />
            </div>
            <dl className="mt-8 grid gap-6 border-t border-vx-400 pt-6 sm:grid-cols-3">
              {p.numbers.map((n) => (
                <div key={n.label}>
                  <dt className="mono text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-vx-900">{n.value}</dt>
                  <dd className="mt-2 max-w-[24ch] text-small text-vx-600">{n.label}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
