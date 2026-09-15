/** VERTEX in capitals, tracked wide, weight 500. Plain type is the logo. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-sans text-[14px] font-medium leading-none text-vx-100 ${className}`}
      style={{ letterSpacing: "0.2em" }}
    >
      VERTEX
    </span>
  );
}
