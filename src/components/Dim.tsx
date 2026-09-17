"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The dimension line. Vertex's one decoration.
 *
 * A 1px dotted line with open arrowheads at both ends, short extension ticks,
 * and a number in a gap at the midpoint. It measures a real thing: pass
 * `measure` (a ref to any element) and the label is that element's live pixel
 * size; pass `label` to state a value you know is true.
 *
 * Can animate smoothly from 0 to the target dimension when scrolled into view.
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
  animate = true,
}: {
  axis?: "x" | "y";
  label?: string;
  measure?: RefObject<HTMLElement | null>;
  className?: string;
  ticks?: boolean;
  tone?: "light" | "dark";
  animate?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [animProgress, setAnimProgress] = useState(animate ? 0 : 1);
  const animRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

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

  const triggerAnimation = () => {
    if (!animate || prefersReducedMotion()) {
      setAnimProgress(1);
      hasAnimatedRef.current = true;
      return;
    }

    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startTime = performance.now();
    const duration = 1200; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      // easeOutCubic: fast start, smooth deceleration into final dimension
      const ease = 1 - Math.pow(1 - p, 3);
      setAnimProgress(ease);

      if (p < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
        hasAnimatedRef.current = true;
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!animate || prefersReducedMotion()) {
      const id = requestAnimationFrame(() => setAnimProgress(1));
      return () => cancelAnimationFrame(id);
    }

    const el = wrap.current;
    if (!el || size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimatedRef.current) {
              triggerAnimation();
            }
          } else if (entry.intersectionRatio === 0) {
            // Reset when completely scrolled out of view so it can replay on re-entry
            hasAnimatedRef.current = false;
            setAnimProgress(0);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate, size]);

  const T = 24; // thickness of the dim band
  const ease = animate ? animProgress : 1;

  // Compute final label vs animated display label
  const targetNum = size;
  const currentNum = Math.round(targetNum * ease);

  // If a custom label is provided, try extracting numeric part or replace on completion
  let text = "";
  let finalText = "";
  if (label) {
    finalText = label;
    const match = label.match(/^([^0-9.-]*)([0-9.,]+)(.*)$/);
    if (match) {
      const prefix = match[1];
      const rawNum = parseFloat(match[2].replace(/,/g, ""));
      const unit = match[3];
      if (!isNaN(rawNum)) {
        const cur = Math.round(rawNum * ease);
        text = ease >= 1 ? label : `${prefix}${cur.toLocaleString("en-US")}${unit}`;
      } else {
        text = label;
      }
    } else {
      text = label;
    }
  } else {
    finalText = size ? `${size.toLocaleString("en-US")}px` : "";
    text = size ? `${currentNum.toLocaleString("en-US")}px` : "";
  }

  // Stable width reservation based on finalText to prevent gap jitter
  const textW = finalText.length * 7.2 + 14; // IBM Plex Mono: 0.6em advance at 12px
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

  // Tick progression: ticks drop down / extend as dimension approaches ends
  const tickProgress = Math.max(0, Math.min(1, (ease - 0.4) / 0.6));

  // Geometry calculations for horizontal (axis === "x")
  const minLeftX = 8;
  const maxLeftX = fits ? gapA - 2 : mid - 2;
  const leftWingsX = maxLeftX - (maxLeftX - minLeftX) * ease;
  const leftTipX = leftWingsX - 6.5;

  const minRightX = fits ? gapB + 2 : mid + 2;
  const maxRightX = size - 8;
  const rightWingsX = minRightX + (maxRightX - minRightX) * ease;
  const rightTipX = rightWingsX + 6.5;

  // Geometry calculations for vertical (axis === "y")
  const minTopY = 8;
  const maxTopY = fits ? gapA - 2 : mid - 2;
  const topWingsY = maxTopY - (maxTopY - minTopY) * ease;
  const topTipY = topWingsY - 6.5;

  const minBottomY = fits ? gapB + 2 : mid + 2;
  const maxBottomY = size - 8;
  const bottomWingsY = minBottomY + (maxBottomY - minBottomY) * ease;
  const bottomTipY = bottomWingsY + 6.5;

  return (
    <div
      ref={wrap}
      className={`relative block select-none cursor-pointer ${className}`}
      style={style}
      aria-hidden="true"
      onClick={() => triggerAnimation()}
      title="Click to replay measurement"
    >
      {size > 0 && axis === "x" && (
        <svg width={size} height={T} viewBox={`0 0 ${size} ${T}`} className="absolute inset-0 block overflow-visible">
          {ticks && (
            <g stroke={rule} strokeWidth="1" shapeRendering="crispEdges" opacity={tickProgress}>
              <line x1="0.5" y1="0" x2="0.5" y2={18 * tickProgress} />
              <line x1={size - 0.5} y1="0" x2={size - 0.5} y2={18 * tickProgress} />
            </g>
          )}
          <g stroke={orange} strokeWidth="1" fill="none">
            {fits ? (
              <g strokeDasharray="1 2" shapeRendering="crispEdges">
                {leftWingsX < gapA - 1 && <line x1={leftWingsX} y1="12.5" x2={gapA} y2="12.5" />}
                {rightWingsX > gapB + 1 && <line x1={gapB} y1="12.5" x2={rightWingsX} y2="12.5" />}
              </g>
            ) : (
              <line x1={leftWingsX} y1="12.5" x2={rightWingsX} y2="12.5" strokeDasharray="1 2" shapeRendering="crispEdges" />
            )}
            <polyline points={`${leftWingsX},8.5 ${leftTipX},12.5 ${leftWingsX},16.5`} strokeLinejoin="miter" />
            <polyline points={`${rightWingsX},8.5 ${rightTipX},12.5 ${rightWingsX},16.5`} strokeLinejoin="miter" />
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
            <g stroke={rule} strokeWidth="1" shapeRendering="crispEdges" opacity={tickProgress}>
              <line x1="0" y1="0.5" x2={18 * tickProgress} y2="0.5" />
              <line x1="0" y1={size - 0.5} x2={18 * tickProgress} y2={size - 0.5} />
            </g>
          )}
          <g stroke={orange} strokeWidth="1" fill="none">
            {fits ? (
              <g strokeDasharray="1 2" shapeRendering="crispEdges">
                {topWingsY < gapA - 1 && <line x1="12.5" y1={topWingsY} x2="12.5" y2={gapA} />}
                {bottomWingsY > gapB + 1 && <line x1="12.5" y1={gapB} x2="12.5" y2={bottomWingsY} />}
              </g>
            ) : (
              <line x1="12.5" y1={topWingsY} x2="12.5" y2={bottomWingsY} strokeDasharray="1 2" shapeRendering="crispEdges" />
            )}
            <polyline points={`8.5,${topWingsY} 12.5,${topTipY} 16.5,${topWingsY}`} strokeLinejoin="miter" />
            <polyline points={`8.5,${bottomWingsY} 12.5,${bottomTipY} 16.5,${bottomWingsY}`} strokeLinejoin="miter" />
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
