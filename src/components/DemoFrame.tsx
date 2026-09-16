import type { ReactNode } from "react";

/**
 * The product viewport: vx-800 surface, hairline vx-600 frame, 16:10.
 * Pass a `src` for a recording, `children` for an interactive scene,
 * or neither for the labelled placeholder.
 */
export function DemoFrame({
  label,
  src,
  children,
  className = "",
  frameRef,
  ratio = "16/10",
  fitHeight,
}: {
  label: string;
  src?: string;
  children?: ReactNode;
  className?: string;
  frameRef?: React.Ref<HTMLDivElement>;
  ratio?: string;
  /** A CSS length the frame's height must not exceed; the frame keeps its ratio and centres. */
  fitHeight?: string;
}) {
  return (
    <div
      ref={frameRef}
      className={`relative w-full overflow-hidden rounded-lg border border-vx-400/60 bg-vx-800 ${fitHeight ? "mx-auto" : ""} ${className}`}
      style={{
        aspectRatio: ratio,
        width: fitHeight ? `min(100%, calc(${fitHeight} * 1.6))` : undefined,
      }}
      data-demo-frame={label}
    >
      {src ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          muted
          playsInline
          controls
          preload="metadata"
          aria-label={label}
        />
      ) : children ? (
        children
      ) : (
        <Placeholder label={label} />
      )}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0" aria-label={`${label}: recording pending`} role="img">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="mono text-small text-vx-100">{label}</span>
        <span className="text-small text-muted-raised">Recording pending. This frame is reserved for it.</span>
      </div>
    </div>
  );
}

