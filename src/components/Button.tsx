import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline";

/**
 * On the light canvas the primary call is vx-800 fill, vx-100 text: blue as the
 * material. Outline buttons are vx-600 hairline, vx-900 text. No orange on light.
 */
const styles: Record<Variant, string> = {
  primary: "bg-[#EFC07B] text-[#1A1A2E] hover:bg-[#EFC07B]/90 font-semibold shadow-md",
  outline: "border border-[#0F3460] bg-[#16213E]/80 text-[#F8FAFC] hover:border-[#EFC07B] hover:text-[#EFC07B] transition-colors",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant | "accent";
  className?: string;
}) {
  const v: Variant = variant === "accent" ? "primary" : variant;
  const cls = `inline-flex h-11 items-center rounded-sm px-5 text-body font-heading font-medium transition-colors duration-150 ${styles[v]} ${className}`;
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
