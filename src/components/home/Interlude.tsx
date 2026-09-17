import type { ReactNode } from "react";

/**
 * A full viewport of calm copy between two pinned moments. One heading, one
 * or two paragraphs, optional ruled facts. Nothing moves.
 */
export function Interlude({ title, children, facts }: { title: ReactNode; children: ReactNode; facts?: { value: string; label: string }[] }) {
  return (
    <section className="rule flex min-h-[100svh] items-center py-24">
      <div className="container lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 className="max-w-[20ch] text-h2">{title}</h2>
        </div>
        <div className="mt-8 lg:col-span-6 lg:col-start-7 lg:mt-0">
          <div className="max-w-[56ch] space-y-4 text-body text-vx-600">{children}</div>
          {facts && (
            <dl className="mt-10 divide-y divide-vx-400 border-y border-vx-400">
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[7rem_1fr] items-baseline gap-4 py-4">
                  <dt className="mono text-h3 text-vx-900">{f.value}</dt>
                  <dd className="text-small text-vx-600">{f.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
