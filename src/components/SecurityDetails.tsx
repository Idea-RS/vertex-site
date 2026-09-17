"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RuledList } from "@/components/PageHeader";
import { FAQ } from "@/components/FAQ";
import { faq } from "@/content/site";

interface SectionItem {
  id: string;
  title: string;
  num: string;
  badge: string;
}

const SECTIONS: SectionItem[] = [
  { id: "on-prem", title: "On-prem, in detail", num: "01", badge: "Deployment" },
  { id: "never-leaves", title: "What never leaves", num: "02", badge: "Privacy" },
  { id: "can-see", title: "What Vertex can see", num: "03", badge: "Access" },
  { id: "faq", title: "Questions people ask", num: "04", badge: "FAQ" },
];

export function SecurityDetails() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="rule" id="security-details">
      <div className="container py-14 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Sticky Headings Navigation */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <span className="mono text-micro text-vx-600 uppercase tracking-wider block mb-4">
                Security breakdown
              </span>

              <nav aria-label="Security sections" className="flex flex-col gap-1.5">
                {SECTIONS.map((sec, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      aria-current={isActive ? "true" : undefined}
                      className={`group relative flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left transition-all duration-150 ${
                        isActive
                          ? "bg-vx-200/70 text-vx-900 shadow-xs"
                          : "text-vx-600 hover:bg-vx-200/35 hover:text-vx-900"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`mono text-micro transition-colors ${
                            isActive ? "font-semibold text-dim-deep" : "text-vx-500 group-hover:text-vx-700"
                          }`}
                        >
                          {sec.num}
                        </span>
                        <span
                          className={`text-h3 font-heading truncate ${
                            isActive ? "font-medium text-vx-900" : "font-normal text-vx-600 group-hover:text-vx-900"
                          }`}
                        >
                          {sec.title}
                        </span>
                      </div>

                      {/* Active indicator bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2.5px] rounded-r bg-dim-deep"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Column: Pop-up Information Panel */}
          <div className="lg:col-span-8">
            <div className="relative min-h-[360px] rounded-xl border border-vx-400/50 bg-vx-100/50 p-6 sm:p-8 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="mb-6 flex items-center justify-between border-b border-vx-400/40 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="mono text-micro font-semibold text-dim-deep">
                        {SECTIONS[activeIndex].num}
                      </span>
                      <h2 className="text-h3 font-heading font-medium text-vx-900">
                        {SECTIONS[activeIndex].title}
                      </h2>
                    </div>
                    <span className="mono text-micro rounded bg-vx-200 px-2 py-0.5 text-vx-600">
                      {SECTIONS[activeIndex].badge}
                    </span>
                  </div>

                  {activeIndex === 0 && (
                    <RuledList
                      items={[
                        "One container. It runs on a machine you own: a workstation under a desk, or a rack in the plant.",
                        "No outbound connections for native CAD archives. Block the container at the firewall and everything still works.",
                        "PDFs and scans need a reader. Three options: the local model inside the container; your own keys to a zero-retention endpoint you choose; or a hosted reader, if you decide that's acceptable for those files.",
                        "Updates are a new container image you pull when you decide to. Nothing updates itself.",
                        "Logs, the index, the graph and every signature stay on the machine.",
                      ]}
                    />
                  )}

                  {activeIndex === 1 && (
                    <RuledList
                      items={[
                        "Your drawings, unless you have chosen a hosted reader for PDFs and scans.",
                        "Your templates, and the variants generated from them.",
                        "The containment graph, the search index, and what people searched for.",
                        "Who signed what, and when.",
                      ]}
                    />
                  )}

                  {activeIndex === 2 && (
                    <dl className="divide-y divide-vx-400 border-y border-vx-400">
                      <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
                        <dt className="text-small font-medium text-vx-600">Cloud</dt>
                        <dd className="max-w-[60ch] text-body text-vx-900">
                          The drawings in your tenant, to run the product for you. Nothing is used for anything else.
                        </dd>
                      </div>
                      <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
                        <dt className="text-small font-medium text-vx-600">On-prem</dt>
                        <dd className="max-w-[60ch] text-body text-vx-900">
                          Nothing. There is no way in, by design.
                        </dd>
                      </div>
                    </dl>
                  )}

                  {activeIndex === 3 && (
                    <FAQ
                      items={faq.filter(
                        (f) =>
                          f.q.includes("network") ||
                          f.q.includes("sure") ||
                          f.q.includes("signs off") ||
                          f.q.includes("scans")
                      )}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
