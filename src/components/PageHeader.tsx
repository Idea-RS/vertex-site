import type { ReactNode } from "react";

export function PageHeader({ title, lede, children }: { title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="container pb-12 pt-16 lg:pb-16 lg:pt-24">
      <h1 className="max-w-[20ch] text-display">{title}</h1>
      {lede && <p className="mt-6 max-w-[58ch] text-body text-vx-400">{lede}</p>}
      {children}
    </header>
  );
}

/** A ruled subsection on inner pages: title left, content right. */
export function Block({ title, children, className = "" }: { title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rule ${className}`}>
      <div className="container grid gap-8 py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <h2 className="max-w-[18ch] text-h3">{title}</h2>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export function RuledList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="divide-y divide-vx-600 border-y border-vx-600">
      {items.map((it, i) => (
        <li key={i} className="max-w-[64ch] py-4 text-body text-vx-100">
          {it}
        </li>
      ))}
    </ul>
  );
}

export function Facts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid gap-8 border-t border-vx-600 pt-8 sm:grid-cols-3">
      {items.map((f) => (
        <div key={f.label} className="border-l border-vx-600 pl-5">
          <div className="mono text-[clamp(2rem,3.4vw,2.75rem)] leading-none text-vx-100">{f.value}</div>
          <p className="mt-3 max-w-[22ch] text-small text-vx-400">{f.label}</p>
        </div>
      ))}
    </div>
  );
}
