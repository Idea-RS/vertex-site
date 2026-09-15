import type { ReactNode } from "react";

/**
 * Heading + lede, left-aligned, line length capped. No eyebrow, no index.
 */
export function SectionHeader({
  title,
  lede,
  children,
  as: Tag = "h2",
  size = "h2",
  className = "",
}: {
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  as?: "h1" | "h2";
  size?: "display" | "h2";
  className?: string;
}) {
  return (
    <div className={`max-w-[62ch] ${className}`}>
      <Tag className={size === "display" ? "text-display" : "text-h2"}>{title}</Tag>
      {lede && <p className="mt-5 max-w-[58ch] text-body text-vx-400">{lede}</p>}
      {children}
    </div>
  );
}
