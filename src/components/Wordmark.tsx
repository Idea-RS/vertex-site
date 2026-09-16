/** Vertex wordmark in Cormorant font, significantly bigger and all caps. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-title text-[28px] sm:text-[34px] font-semibold uppercase leading-none tracking-[0.08em] text-vx-900 ${className}`}
    >
      VERTEX
    </span>
  );
}
