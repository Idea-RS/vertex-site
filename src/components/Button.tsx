import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "accent";

const styles: Record<Variant, string> = {
  primary: "bg-vx-100 text-vx-900 hover:bg-white",
  outline: "border border-vx-600 text-vx-100 hover:border-vx-100",
  // The single orange CTA. Use once per viewport, and never with a dimension line in view.
  accent: "bg-dim text-vx-900 hover:brightness-105",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const cls = `inline-flex h-11 items-center rounded-sm px-5 text-body font-medium transition-colors duration-150 ${styles[variant]} ${className}`;
  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
