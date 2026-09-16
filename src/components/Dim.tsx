"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * The dimension line. Vertex's one decoration.
 *
 * A 1px dotted line with open arrowheads at both ends, short extension ticks,
 * and a number in a gap at the midpoint. It measures a real thing: pass
 * `measure` (a ref to any element) and the label is that element's live pixel
 * size; pass `label` to state a value you know is true.
 *
 * Two tones. "light" (default) is drawn on the vx-100 canvas in the deep
 * dimension orange (#8F4A14, 5.1:1 on vx-100). "dark" is drawn inside a dark
 * viewport in the bright orange (#F0A868, 7.6:1 on vx-800).
 */
export function Dim({
  axis = "x",
  label,
  measure,
  className = "",
  ticks = true,
  tone = "light",
}: {
  axis?: "x" | "y";
  label?: string;
  measure?: RefObject<HTMLElement | null>;
  className?: string;
  ticks?: boolean;
  tone?: "light" | "dark";
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const target = measure?.current ?? wrap.current;
    if (!target) return;
    const read = () => {
      const r = target.getBoundingClientRect();
      setSize(Math.round(axis === "x" ? r.width : r.height));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(target);
    return () => ro.disconnect();
  }, [measure, axis]);

  const T = 24; // thickness of the dim band
  const text = label ?? (size ? `${size.toLocaleString("en-US")}px` : "");
  const textW = text.length * 7.2 + 14; // IBM Plex Mono: 0.6em advance at 12px
  const fits = size > textW + 44;
  const mid = size / 2;
  const gapA = mid - textW / 2;
  const gapB = mid + textW / 2;

  const style =
    measure && size
      ? axis === "x"
        ? { width: size, height: T }
        : { height: size, width: T }
      : axis === "x"
        ? { height: T, width: "100%" }
        : { width: T, height: "100%" };

  const orange = tone === "dark" ? "#F0A868" : "#8F4A14";
  const rule = tone === "dark" ? "#415A77" : "#778DA9";
  const textStyle = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" as const };

  return (
    <div ref={wrap} className={`relative block ${className}`} style={style} aria-hidden="true">
      {size > 0 && axis === "x" && (
        <svg width={size} height={T} viewBox={`0 0 ${size} ${T}`} className="absolute inset-0 block overflow-visible">
          {ticks && (
            <g stroke={rule} strokeWidth="1" shapeRendering="crispEdges">
              <line x1="0.5" y1="0" x2="0.5" y2="18" />
              <line x1={size - 0.5} y1="0" x2={size - 0.5} y2="18" />
            </g>
          )}
          <g stroke={orange} strokeWidth="1" fill="none">
            {fits ? (
              <g strokeDasharray="1 2" shapeRendering="crispEdges">
                <line x1="8" y1="12.5" x2={gapA} y2="12.5" />
                <line x1={gapB} y1="12.5" x2={size - 8} y2="12.5" />
              </g>
            ) : (
              <line x1="8" y1="12.5" x2={size - 8} y2="12.5" strokeDasharray="1 2" shapeRendering="crispEdges" />
            )}
            <polyline points={`8,8.5 1.5,12.5 8,16.5`} strokeLinejoin="miter" />
            <polyline points={`${size - 8},8.5 ${size - 1.5},12.5 ${size - 8},16.5`} strokeLinejoin="miter" />
          </g>
          {text && (
            <text x={mid} y={fits ? 16.5 : 7} textAnchor="middle" fill={orange} fontSize="12" style={textStyle}>
              {text}
            </text>
          )}
        </svg>
      )}
      {size > 0 && axis === "y" && (
        <svg width={T} height={size} viewBox={`0 0 ${T} ${size}`} className="absolute inset-0 block overflow-visible">
          {ticks && (
            <g stroke={rule} strokeWidth="1" shapeRendering="crispEdges">
              <line x1="6" y1="0.5" x2={T} y2="0.5" />
              <line x1="6" y1={size - 0.5} x2={T} y2={size - 0.5} />
            </g>
          )}
          <g stroke={orange} strokeWidth="1" fill="none">
            {fits ? (
              <g strokeDasharray="1 2" shapeRendering="crispEdges">
                <line x1="12.5" y1="8" x2="12.5" y2={gapA} />
                <line x1="12.5" y1={gapB} x2="12.5" y2={size - 8} />
              </g>
            ) : (
              <line x1="12.5" y1="8" x2="12.5" y2={size - 8} strokeDasharray="1 2" shapeRendering="crispEdges" />
            )}
            <polyline points={`8.5,8 12.5,1.5 16.5,8`} strokeLinejoin="miter" />
            <polyline points={`8.5,${size - 8} 12.5,${size - 1.5} 16.5,${size - 8}`} strokeLinejoin="miter" />
          </g>
          {text && (
            <text transform={`translate(${fits ? 16.5 : 4} ${mid}) rotate(-90)`} textAnchor="middle" fill={orange} fontSize="12" style={textStyle}>
              {text}
            </text>
          )}
        </svg>
      )}
    </div>
  );
}
