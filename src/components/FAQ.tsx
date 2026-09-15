"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faq } from "@/content/site";

/** Questions in the customer's voice. One open at a time; height animates. */
export function FAQ({ items = faq }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <ul className="divide-y divide-vx-600 border-y border-vx-600">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panel = `${base}-panel-${i}`;
        const button = `${base}-button-${i}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={button}
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-baseline justify-between gap-6 py-5 text-left text-h3 text-vx-100 hover:text-white"
              >
                <span>{item.q}</span>
                <span className="mono shrink-0 text-small text-vx-400" aria-hidden="true">
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panel}
                  role="region"
                  aria-labelledby={button}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[60ch] pb-6 text-body text-vx-400">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
