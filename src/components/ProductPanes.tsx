"use client";

import { useEffect, useState } from "react";
import { DemoFrame } from "@/components/DemoFrame";
import { productPanes, type ProductPaneId } from "@/content/product";

/**
 * The product page's section list, in the pattern from the Tandem study: a
 * list on the left, one pane on the right, switched on hover (and focus, click
 * and the deep link); not pinned, not scroll-driven. The active row gets a
 * square marker and full colour; inactive rows sit at vx-600. The pane is
 * replaced, not animated. Below 1024px every pane stacks in order under its
 * own name.
 */
export function ProductPanes() {
  const [active, setActive] = useState<ProductPaneId>("find");

  // Deep links: /product#verify lands on that pane.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "") as ProductPaneId;
      if (productPanes.some((p) => p.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const pane = productPanes.find((p) => p.id === active)!;

  return (
    <div className="container lg:grid lg:grid-cols-12 lg:gap-8">
      <nav className="hidden lg:col-span-4 lg:block" aria-label="Product surfaces">
        <ul>
          {productPanes.map((p) => {
            const on = p.id === active;
            return (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className={`flex items-center gap-3 py-2 text-h3 transition-colors duration-200 ${on ? "text-vx-900" : "text-vx-600 hover:text-vx-900"}`}
                  onMouseEnter={() => setActive(p.id)}
                  onFocus={() => setActive(p.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(p.id);
                    history.replaceState(null, "", `#${p.id}`);
                  }}
                  aria-current={on ? "true" : undefined}
                >
                  <span className={`block h-2 w-2 shrink-0 bg-vx-900 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                  {p.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* desktop: one pane */}
      {/* the ids live on the stacked panes below so a deep link scrolls on phones; on desktop it only picks the pane */}
      <div className="hidden lg:col-span-8 lg:block" aria-live="polite">
        <Pane p={pane} />
      </div>

      {/* below lg: every pane, stacked */}
      <div className="lg:hidden">
        {productPanes.map((p, i) => (
          <div key={p.id} id={p.id} className={i ? "mt-16 border-t border-vx-400 pt-12" : ""}>
            <p className="mono text-micro text-vx-600">
              {String(i + 1).padStart(2, "0")} · {p.name}
            </p>
            <div className="mt-3">
              <Pane p={p} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pane({ p }: { p: (typeof productPanes)[number] }) {
  return (
    <div>
      <h2 className="max-w-[22ch] text-h2">{p.heading}</h2>
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
    </div>
  );
}
