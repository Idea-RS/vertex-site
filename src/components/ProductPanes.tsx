"use client";

import { useEffect, useState } from "react";
import { DemoFrame } from "@/components/DemoFrame";
import { productPanes, type ProductPaneId } from "@/content/product";

/**
 * Product page interactive panes.
 * Left: navigation options (Find, Verify, Make, Archive).
 * Right: ONLY the selected or hovered feature's description and content is shown.
 */
export function ProductPanes() {
  const [active, setActive] = useState<ProductPaneId>("find");

  // Synchronize with hash on load and hashchange (e.g. /product/#verify or footer links)
  useEffect(() => {
    const applyHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "") as ProductPaneId;
      if (productPanes.some((p) => p.id === hash)) {
        setActive(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const select = (id: ProductPaneId) => {
    setActive(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  const activePane = productPanes.find((p) => p.id === active) ?? productPanes[0];
  const activeIndex = productPanes.findIndex((p) => p.id === activePane.id);

  return (
    <div className="container lg:grid lg:grid-cols-12 lg:gap-12">
      {/* Desktop navigation: sticky list on the left */}
      <div className="hidden lg:col-span-4 lg:block">
        <nav className="sticky top-[120px]" aria-label="Product surfaces" role="tablist">
          <ul className="space-y-1">
            {productPanes.map((p, i) => {
              const on = p.id === active;
              return (
                <li key={p.id} onMouseEnter={() => setActive(p.id)}>
                  <a
                    href={`#${p.id}`}
                    role="tab"
                    aria-selected={on}
                    onClick={(e) => {
                      e.preventDefault();
                      select(p.id);
                    }}
                    onMouseEnter={() => setActive(p.id)}
                    onFocus={() => setActive(p.id)}
                    className={`group flex w-full items-center gap-3.5 py-3 text-h3 transition-colors duration-150 cursor-pointer ${
                      on ? "text-vx-900 font-medium" : "text-vx-600 hover:text-vx-900"
                    }`}
                    aria-current={on ? "true" : undefined}
                  >
                    <span
                      className={`block h-2 w-2 shrink-0 bg-vx-900 transition-all duration-150 ${
                        on
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-50 group-hover:opacity-30 group-hover:scale-100"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`mono w-6 text-micro transition-colors ${
                        on ? "text-vx-900 font-semibold" : "text-vx-600 group-hover:text-vx-900"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{p.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Right side: ONLY the selected or hovered feature is displayed */}
      <div className="lg:col-span-8">
        {/* Mobile navigation: row of tabs */}
        <nav className="mb-8 flex flex-wrap gap-2 border-b border-vx-400/40 pb-4 lg:hidden" aria-label="Product surfaces" role="tablist">
          {productPanes.map((p, i) => {
            const on = p.id === active;
            return (
              <a
                key={p.id}
                href={`#${p.id}`}
                role="tab"
                aria-selected={on}
                onClick={(e) => {
                  e.preventDefault();
                  select(p.id);
                }}
                className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-small transition-colors ${
                  on
                    ? "bg-vx-900 text-vx-100 font-medium"
                    : "text-vx-600 hover:text-vx-900 hover:bg-vx-200/60"
                }`}
                aria-current={on ? "true" : undefined}
              >
                <span className="mono text-micro opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <span>{p.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Selected feature description and demo */}
        <article
          key={activePane.id}
          id={activePane.id}
          className="animate-pane-enter pb-8 lg:pb-16"
          aria-labelledby={`${activePane.id}-heading`}
        >
          <p className="mono text-micro text-vx-600">
            {String(activeIndex + 1).padStart(2, "0")} · {activePane.name}
          </p>
          <h2 id={`${activePane.id}-heading`} className="mt-3 max-w-[24ch] text-h2 font-heading font-medium text-vx-900">
            {activePane.heading}
          </h2>
          <div className="mt-6 max-w-[60ch] space-y-3">
            {activePane.body.map((t) => (
              <p key={t} className="text-body text-vx-600">
                {t}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <DemoFrame label={activePane.name} />
          </div>
          <dl className="mt-8 grid gap-6 border-t border-vx-400 pt-6 sm:grid-cols-3">
            {activePane.numbers.map((n) => (
              <div key={n.label}>
                <dt className="mono text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-vx-900 font-medium">{n.value}</dt>
                <dd className="mt-2 max-w-[24ch] text-small text-vx-600">{n.label}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </div>
  );
}

