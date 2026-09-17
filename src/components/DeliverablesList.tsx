"use client";

import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

interface Deliverable {
  title: string;
  body: string;
}

export function DeliverablesList({ items }: { items: Deliverable[] }) {
  const reducedMotion = typeof window !== "undefined" && prefersReducedMotion();

  return (
    <ol className="divide-y divide-vx-400/60 border-y border-vx-400/60">
      {items.map((d, i) => (
        <motion.li
          key={d.title}
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
            delay: reducedMotion ? 0 : 0.06,
          }}
          className="group relative flex items-start gap-4 sm:gap-6 py-6 sm:py-7 transition-colors"
        >
          {/* Number Pill / Indicator */}
          <span className="mono text-micro font-semibold text-dim-deep bg-vx-200/80 px-2.5 py-1 rounded border border-vx-400/40 shrink-0 mt-0.5 group-hover:bg-dim-deep group-hover:text-vx-100 transition-colors">
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-h3 font-heading font-medium text-vx-900 group-hover:text-dim-deep transition-colors">
              {d.title}
            </h3>
            <p className="mt-1.5 max-w-[58ch] text-body text-vx-600 leading-relaxed">
              {d.body}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
