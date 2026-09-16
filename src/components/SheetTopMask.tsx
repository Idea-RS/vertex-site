export default function SheetTopMask() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[45] overflow-visible" aria-hidden="true">
      {/* Top gutter above the sheet */}
      <div className="w-full bg-vx-900" style={{ height: "var(--inset)" }} />

      {/* Top-left corner mask: fills outer corner with vx-900 and strokes the curve */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="absolute block"
        style={{ top: "var(--inset)", left: "var(--inset)" }}
      >
        <path d="M 0 0 L 16 0 A 16 16 0 0 0 0 16 Z" fill="var(--color-vx-900)" />
        <path d="M 16 0.5 A 15.5 15.5 0 0 0 0.5 16" fill="none" stroke="var(--frame-line)" strokeWidth="1" />
      </svg>

      {/* Top connecting hairline */}
      <div
        className="absolute border-t border-[var(--frame-line)]"
        style={{
          top: "var(--inset)",
          left: "calc(var(--inset) + 16px)",
          right: "calc(var(--inset) + 16px)",
        }}
      />

      {/* Top-right corner mask: fills outer corner with vx-900 and strokes the curve */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="absolute block"
        style={{ top: "var(--inset)", right: "var(--inset)" }}
      >
        <path d="M 16 0 L 0 0 A 16 16 0 0 1 16 16 Z" fill="var(--color-vx-900)" />
        <path d="M 0 0.5 A 15.5 15.5 0 0 1 15.5 16" fill="none" stroke="var(--frame-line)" strokeWidth="1" />
      </svg>
    </div>
  );
}
