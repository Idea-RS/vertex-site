/** Vertex wordmark in Cormorant font, significantly bigger and all caps. */
export function Wordmark({ className = "" }: { className?: string }) {
  const colorClass = className.includes("text-") ? "" : "text-vx-900";
  return (
    <span
      className={`font-title text-[28px] sm:text-[34px] font-semibold uppercase leading-none tracking-[0.08em] ${colorClass} ${className}`}
    >
      VERTEX
    </span>
  );
}
