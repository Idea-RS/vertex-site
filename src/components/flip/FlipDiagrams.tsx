"use client";

import React from "react";

// ─── Shared SVG Styles & Helpers ──────────────────────────────────────────────
const ink = "var(--color-vx-100, #E0E1DD)";
const dim = "var(--color-vx-400, #778DA9)";
const hair = "var(--color-vx-600, #415A77)";
const dark = "#0D1B2A";
const darkCard = "#1B263B";
const amber = "#F0A868";
const green = "#10B981";
const red = "#EF4444";

/**
 * 01 — Pipeline Diagram SVG (Read → Trace → Plan → Build → Verify)
 */
export function PipelineDiagramSvg({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-4 shadow-lg ${className}`}>
      <div className="mb-3 flex items-center justify-between border-b border-vx-600/60 pb-2 text-micro mono text-vx-400">
        <span className="text-vx-100 font-semibold">B-REP KERNEL RECONSTRUCTION PIPELINE</span>
        <span className="text-dim font-mono">OPENCASCADE ENGINE</span>
      </div>

      <svg
        viewBox="0 0 860 210"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connection flow lines */}
        <line x1="140" y1="105" x2="190" y2="105" stroke={hair} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="190,105 182,100 182,110" fill={hair} />

        <line x1="310" y1="105" x2="360" y2="105" stroke={hair} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="360,105 352,100 352,110" fill={hair} />

        <line x1="480" y1="105" x2="530" y2="105" stroke={hair} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="530,105 522,100 522,110" fill={hair} />

        <line x1="650" y1="105" x2="700" y2="105" stroke={hair} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="700,105 692,100 692,110" fill={hair} />

        {/* ── Stage 01: READ ── */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="120" height="170" rx="4" fill={darkCard} stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="120" height="26" rx="4" fill="#142132" stroke={hair} strokeWidth="1" />
          <text x="10" y="17" fill={amber} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">01 · READ</text>
          
          {/* Drawing sheet mini graphic */}
          <rect x="15" y="38" width="90" height="85" fill="#0D1B2A" stroke={hair} strokeWidth="0.75" />
          {/* OCR bounding box overlay */}
          <rect x="22" y="48" width="45" height="18" fill="none" stroke={amber} strokeWidth="1" strokeDasharray="2 2" />
          <text x="25" y="60" fill={amber} fontSize="8" fontFamily="var(--font-mono)">Ø160.0</text>
          
          <circle cx="60" cy="85" r="18" stroke={ink} strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="60" cy="85" r="6" stroke={ink} strokeWidth="1" />
          
          <text x="10" y="145" fill={ink} fontSize="10" fontFamily="var(--font-sans)" fontWeight="500">2D Geometry &amp;</text>
          <text x="10" y="158" fill={dim} fontSize="9" fontFamily="var(--font-mono)">Stated Dimensions</text>
        </g>

        {/* ── Stage 02: TRACE ── */}
        <g transform="translate(190, 20)">
          <rect x="0" y="0" width="120" height="170" rx="4" fill={darkCard} stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="120" height="26" rx="4" fill="#142132" stroke={hair} strokeWidth="1" />
          <text x="10" y="17" fill={amber} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">02 · TRACE</text>
          
          {/* Vector curves & tangent handles */}
          <g transform="translate(15, 38)">
            <rect x="0" y="0" width="90" height="85" fill="#0D1B2A" stroke={hair} strokeWidth="0.75" />
            <path d="M15 70 C 15 30, 75 30, 75 70" stroke={green} strokeWidth="1.5" fill="none" />
            <circle cx="15" cy="70" r="3" fill={amber} />
            <circle cx="75" cy="70" r="3" fill={amber} />
            <circle cx="45" cy="30" r="2.5" fill={ink} />
            <line x1="25" y1="30" x2="65" y2="30" stroke={dim} strokeWidth="0.75" strokeDasharray="2 2" />
            {/* Centrelines */}
            <line x1="45" y1="10" x2="45" y2="78" stroke={hair} strokeWidth="0.75" strokeDasharray="6 2 2 2" />
          </g>

          <text x="10" y="145" fill={ink} fontSize="10" fontFamily="var(--font-sans)" fontWeight="500">Vector Contours</text>
          <text x="10" y="158" fill={dim} fontSize="9" fontFamily="var(--font-mono)">Centrelines &amp; Arcs</text>
        </g>

        {/* ── Stage 03: PLAN ── */}
        <g transform="translate(360, 20)">
          <rect x="0" y="0" width="120" height="170" rx="4" fill={darkCard} stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="120" height="26" rx="4" fill="#142132" stroke={hair} strokeWidth="1" />
          <text x="10" y="17" fill={amber} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">03 · PLAN</text>
          
          {/* Parametric constraint graph */}
          <g transform="translate(15, 38)">
            <rect x="0" y="0" width="90" height="85" fill="#0D1B2A" stroke={hair} strokeWidth="0.75" />
            <rect x="10" y="12" width="70" height="16" rx="2" fill="#1B263B" stroke={hair} strokeWidth="0.75" />
            <text x="15" y="24" fill={ink} fontSize="8" fontFamily="var(--font-mono)">Constrain(H, V)</text>
            
            <line x1="45" y1="28" x2="45" y2="40" stroke={amber} strokeWidth="1" />
            
            <rect x="10" y="40" width="70" height="16" rx="2" fill="#1B263B" stroke={hair} strokeWidth="0.75" />
            <text x="15" y="52" fill={ink} fontSize="8" fontFamily="var(--font-mono)">FeatureTree[D1]</text>
            
            <line x1="45" y1="56" x2="45" y2="66" stroke={amber} strokeWidth="1" />
            <circle cx="45" cy="70" r="3" fill={green} />
          </g>

          <text x="10" y="145" fill={ink} fontSize="10" fontFamily="var(--font-sans)" fontWeight="500">Constraint Solver</text>
          <text x="10" y="158" fill={dim} fontSize="9" fontFamily="var(--font-mono)">Driving Dimensions</text>
        </g>

        {/* ── Stage 04: BUILD ── */}
        <g transform="translate(530, 20)">
          <rect x="0" y="0" width="120" height="170" rx="4" fill={darkCard} stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="120" height="26" rx="4" fill="#142132" stroke={hair} strokeWidth="1" />
          <text x="10" y="17" fill={amber} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">04 · BUILD</text>
          
          {/* 3D Extrusion & Revolve wireframe graphic */}
          <g transform="translate(15, 38)">
            <rect x="0" y="0" width="90" height="85" fill="#0D1B2A" stroke={hair} strokeWidth="0.75" />
            {/* Isometric Flange cylinder wireframe */}
            <ellipse cx="45" cy="35" rx="32" ry="12" stroke={ink} strokeWidth="1.25" fill="none" />
            <ellipse cx="45" cy="55" rx="32" ry="12" stroke={ink} strokeWidth="1" fill="none" />
            <line x1="13" y1="35" x2="13" y2="55" stroke={ink} strokeWidth="1.25" />
            <line x1="77" y1="35" x2="77" y2="55" stroke={ink} strokeWidth="1.25" />
            
            {/* Inner Hub cylinder */}
            <ellipse cx="45" cy="25" rx="18" ry="7" stroke={amber} strokeWidth="1" fill="none" />
            <ellipse cx="45" cy="18" rx="8" ry="3.5" stroke={green} strokeWidth="1" fill="none" />
          </g>

          <text x="10" y="145" fill={ink} fontSize="10" fontFamily="var(--font-sans)" fontWeight="500">B-Rep Solid Kernel</text>
          <text x="10" y="158" fill={dim} fontSize="9" fontFamily="var(--font-mono)">STEP / FreeCAD</text>
        </g>

        {/* ── Stage 05: VERIFY ── */}
        <g transform="translate(700, 20)">
          <rect x="0" y="0" width="140" height="170" rx="4" fill={darkCard} stroke={green} strokeWidth="1.25" />
          <rect x="0" y="0" width="140" height="26" rx="4" fill="#0E2E24" stroke={green} strokeWidth="1" />
          <text x="10" y="17" fill={green} fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">05 · VERIFY</text>
          
          {/* Verification checkmark & IoU gate */}
          <g transform="translate(15, 38)">
            <rect x="0" y="0" width="110" height="85" fill="#0D1B2A" stroke={hair} strokeWidth="0.75" />
            <path d="M35 42 L48 55 L75 28" stroke={green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="12" y="74" fill={green} fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">PASS · 100% CHECK</text>
          </g>

          <text x="10" y="145" fill={ink} fontSize="10" fontFamily="var(--font-sans)" fontWeight="500">Silhouette Gate</text>
          <text x="10" y="158" fill={dim} fontSize="9" fontFamily="var(--font-mono)">Tolerance Verified</text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Verification Diagram SVG (Inspection with Verified, Needs Review, Refused callouts)
 */
export function VerificationDiagramSvg({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-4 shadow-lg ${className}`}>
      <div className="mb-3 flex items-center justify-between border-b border-vx-600/60 pb-2 text-micro mono text-vx-400">
        <span className="text-vx-100 font-semibold">CAD SOLID INSPECTION GATE · DETERMINISTIC AUDIT</span>
        <span className="rounded-xs bg-emerald-950 border border-emerald-500/50 px-2 py-0.5 text-emerald-400 font-bold">
          STATUS: PROVEN
        </span>
      </div>

      <svg
        viewBox="0 0 740 260"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Grid */}
        <defs>
          <pattern id="verif-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1b263b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="740" height="260" fill="url(#verif-grid)" />

        {/* ── Technical CAD Part Silhouette (Flange Section) ── */}
        <g transform="translate(180, 130)">
          {/* Centrelines */}
          <line x1="-120" y1="0" x2="120" y2="0" stroke={hair} strokeWidth="1" strokeDasharray="14 3 3 3" />
          <line x1="0" y1="-85" x2="0" y2="85" stroke={hair} strokeWidth="1" strokeDasharray="14 3 3 3" />

          {/* Part Outlines */}
          <rect x="-95" y="-18" width="190" height="36" stroke={ink} strokeWidth="1.5" fill="#172436" opacity="0.8" />
          <rect x="-45" y="-55" width="90" height="37" stroke={ink} strokeWidth="1.5" fill="#172436" opacity="0.8" />
          <rect x="-20" y="-55" width="40" height="73" stroke={hair} strokeWidth="1.2" strokeDasharray="4 3" fill="#0D1B2A" />

          {/* Bolt Holes */}
          <rect x="-78" y="-18" width="14" height="36" stroke={hair} strokeWidth="1" strokeDasharray="3 2" fill="#0D1B2A" />
          <rect x="64" y="-18" width="14" height="36" stroke={hair} strokeWidth="1" strokeDasharray="3 2" fill="#0D1B2A" />

          {/* Dimension 1: Verified (Flange OD Ø160.0) */}
          <line x1="-95" y1="28" x2="95" y2="28" stroke={green} strokeWidth="1.2" />
          <line x1="-95" y1="20" x2="-95" y2="36" stroke={green} strokeWidth="1" />
          <line x1="95" y1="20" x2="95" y2="36" stroke={green} strokeWidth="1" />
          <rect x="-42" y="21" width="84" height="15" fill="#0D1B2A" rx="2" stroke={green} strokeWidth="0.75" />
          <text x="0" y="32" fill={green} fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
            Ø160.00 mm ✓
          </text>

          {/* Dimension 2: Needs Review (Hub Chamfer 2.0 × 45°) */}
          <line x1="45" y1="-55" x2="80" y2="-75" stroke={amber} strokeWidth="1" />
          <circle cx="45" cy="-55" r="3" fill={amber} />
          <rect x="80" y="-86" width="100" height="18" fill="#0D1B2A" rx="2" stroke={amber} strokeWidth="0.75" />
          <text x="85" y="-73" fill={amber} fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600">
            2.0×45° ⚠ Inferred
          </text>

          {/* Dimension 3: Refused (Contradictory PCD Callout) */}
          <line x1="-71" y1="-18" x2="-120" y2="-55" stroke={red} strokeWidth="1" />
          <circle cx="-71" cy="-18" r="3" fill={red} />
          <rect x="-210" y="-68" width="85" height="24" fill="#0D1B2A" rx="2" stroke={red} strokeWidth="0.75" />
          <text x="-205" y="-55" fill={red} fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">
            PCD Ø130 vs 134
          </text>
          <text x="-205" y="-46" fill={red} fontSize="7" fontFamily="var(--font-mono)">
            ✕ Refused: Conflict
          </text>
        </g>

        {/* ── Inspection Ledger Card (Right Side) ── */}
        <g transform="translate(420, 20)">
          <rect x="0" y="0" width="300" height="220" rx="4" fill="#121D2B" stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="300" height="30" rx="4" fill="#182738" stroke={hair} strokeWidth="1" />
          <text x="14" y="20" fill={ink} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
            DETECTION &amp; VERDICT REPORT
          </text>

          {/* Row 1: Verified */}
          <g transform="translate(14, 45)">
            <rect x="0" y="0" width="272" height="42" rx="3" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
            <text x="12" y="18" fill={green} fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">✓ VERIFIED</text>
            <text x="12" y="32" fill={dim} fontSize="9" fontFamily="var(--font-mono)">14 Dimensions · Bounds &amp; Silhouette Matched</text>
          </g>

          {/* Row 2: Needs Review */}
          <g transform="translate(14, 95)">
            <rect x="0" y="0" width="272" height="42" rx="3" fill="rgba(240, 168, 104, 0.08)" stroke="rgba(240, 168, 104, 0.3)" strokeWidth="1" />
            <text x="12" y="18" fill={amber} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">⚠ NEEDS REVIEW</text>
            <text x="12" y="32" fill={dim} fontSize="9" fontFamily="var(--font-mono)">Chamfer unspecified on sheet · Inferred from title block</text>
          </g>

          {/* Row 3: Refused */}
          <g transform="translate(14, 145)">
            <rect x="0" y="0" width="272" height="42" rx="3" fill="rgba(239, 68, 68, 0.08)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
            <text x="12" y="18" fill={red} fontSize="11" fontFamily="var(--font-mono)" fontWeight="500">✕ REFUSED</text>
            <text x="12" y="32" fill={dim} fontSize="9" fontFamily="var(--font-mono)">Contradictory views · Will not generate false model</text>
          </g>

          {/* Ledger Footer */}
          <text x="14" y="206" fill={dim} fontSize="9" fontFamily="var(--font-mono)">
            GOVERNANCE: Nothing ships silently.
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Feature Tree Diagram SVG (SolidWorks / FreeCAD Parametric Tree Hierarchy)
 */
export function FeatureTreeDiagramSvg({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-4 shadow-lg ${className}`}>
      <div className="mb-3 flex items-center justify-between border-b border-vx-600/60 pb-2 text-micro mono text-vx-400">
        <span className="text-vx-100 font-semibold">PARAMETRIC FEATURE TREE (NOT A RAW MESH)</span>
        <span className="text-dim">PROVENANCE BY STROKE STYLE</span>
      </div>

      <svg
        viewBox="0 0 740 230"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tree Root */}
        <g transform="translate(20, 15)">
          <rect x="0" y="0" width="220" height="30" rx="3" fill="#182738" stroke={hair} strokeWidth="1" />
          <circle cx="15" cy="15" r="4" fill={amber} />
          <text x="28" y="19" fill={ink} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
            FLANGE_HOUSING.STEP
          </text>
        </g>

        {/* Tree Vertical Guide Lines */}
        <path d="M 35 45 L 35 195" stroke={hair} strokeWidth="1" strokeDasharray="3 2" />

        {/* Node 1: Base Sketch (READ - Solid border) */}
        <g transform="translate(60, 52)">
          <path d="M -25 15 L 0 15" stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="280" height="30" rx="3" fill="#121D2B" stroke={ink} strokeWidth="1.5" />
          <text x="12" y="19" fill={ink} fontSize="10.5" fontFamily="var(--font-mono)">
            ├── Sketch_01 (Outer Flange)
          </text>
          {/* Provenance Badge */}
          <rect x="295" y="4" width="140" height="22" rx="2" fill="#0D1B2A" stroke={ink} strokeWidth="1.5" />
          <text x="305" y="18" fill={ink} fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">
            READ · Solid [Ø160.0]
          </text>
        </g>

        {/* Node 2: Extrude Flange Body (READ - Solid border) */}
        <g transform="translate(60, 88)">
          <path d="M -25 15 L 0 15" stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="280" height="30" rx="3" fill="#121D2B" stroke={ink} strokeWidth="1.5" />
          <text x="12" y="19" fill={ink} fontSize="10.5" fontFamily="var(--font-mono)">
            ├── Extrude_Flange (Depth)
          </text>
          {/* Provenance Badge */}
          <rect x="295" y="4" width="140" height="22" rx="2" fill="#0D1B2A" stroke={ink} strokeWidth="1.5" />
          <text x="305" y="18" fill={ink} fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">
            READ · Solid [h=12.0]
          </text>
        </g>

        {/* Node 3: Center Bore Revolve (INFERRED - Dashed border) */}
        <g transform="translate(60, 124)">
          <path d="M -25 15 L 0 15" stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="280" height="30" rx="3" fill="#121D2B" stroke={dim} strokeWidth="1.2" strokeDasharray="4 3" />
          <text x="12" y="19" fill={ink} fontSize="10.5" fontFamily="var(--font-mono)">
            ├── Cut_Bore (Through)
          </text>
          {/* Provenance Badge */}
          <rect x="295" y="4" width="140" height="22" rx="2" fill="#0D1B2A" stroke={dim} strokeWidth="1.2" strokeDasharray="4 3" />
          <text x="305" y="18" fill={dim} fontSize="9" fontFamily="var(--font-mono)" fontWeight="500">
            INFERRED · Dashed [Ø40]
          </text>
        </g>

        {/* Node 4: Chamfer & Fillet (CHOSEN - Dotted border) */}
        <g transform="translate(60, 160)">
          <path d="M -25 15 L 0 15" stroke={hair} strokeWidth="1" />
          <rect x="0" y="0" width="280" height="30" rx="3" fill="#121D2B" stroke={dim} strokeWidth="1.5" strokeDasharray="2 3" />
          <text x="12" y="19" fill={ink} fontSize="10.5" fontFamily="var(--font-mono)">
            └── Fillet_01 (Edge Break)
          </text>
          {/* Provenance Badge */}
          <rect x="295" y="4" width="140" height="22" rx="2" fill="#0D1B2A" stroke={dim} strokeWidth="1.5" strokeDasharray="2 3" />
          <text x="305" y="18" fill={dim} fontSize="9" fontFamily="var(--font-mono)">
            CHOSEN · Dotted [R3.0]
          </text>
        </g>

        {/* Right Side Annotation: Provenance Rules Key */}
        <g transform="translate(520, 48)">
          <rect x="0" y="0" width="200" height="142" rx="4" fill="#142132" stroke={hair} strokeWidth="1" />
          <text x="15" y="24" fill={amber} fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
            PROVENANCE ENCODING
          </text>
          <line x1="15" y1="34" x2="185" y2="34" stroke={hair} strokeWidth="0.75" />
          
          <line x1="15" y1="52" x2="55" y2="52" stroke={ink} strokeWidth="2" />
          <text x="65" y="55" fill={ink} fontSize="9.5" fontFamily="var(--font-mono)">Solid = Read</text>

          <line x1="15" y1="80" x2="55" y2="80" stroke={dim} strokeWidth="1.75" strokeDasharray="4 3" />
          <text x="65" y="83" fill={dim} fontSize="9.5" fontFamily="var(--font-mono)">Dashed = Inferred</text>

          <line x1="15" y1="108" x2="55" y2="108" stroke={dim} strokeWidth="2" strokeDasharray="2 3" />
          <text x="65" y="111" fill={dim} fontSize="9.5" fontFamily="var(--font-mono)">Dotted = Chosen</text>

          <text x="15" y="132" fill={hair} fontSize="8" fontFamily="var(--font-mono)">
            (No color ambiguity)
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Divergence Detection Diagram SVG (Stated vs Geometry Contradiction)
 */
export function DivergenceDiagramSvg({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-4 shadow-lg ${className}`}>
      <div className="mb-3 flex items-center justify-between border-b border-vx-600/60 pb-2 text-micro mono text-vx-400">
        <span className="text-vx-100 font-semibold">DRAWING CONTRADICTION &amp; DIVERGENCE DETECTION</span>
        <span className="text-amber-400 font-mono font-bold">DELTA: Δ -2.35 mm</span>
      </div>

      <svg
        viewBox="0 0 740 180"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Nominal Stated Dimension Line */}
        <g transform="translate(60, 45)">
          <text x="0" y="0" fill={ink} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
            1. STATED DRAWING CALLOUT (Nominal Dimension):
          </text>
          <line x1="0" y1="20" x2="380" y2="20" stroke={ink} strokeWidth="1.5" />
          <line x1="0" y1="12" x2="0" y2="28" stroke={ink} strokeWidth="1.5" />
          <line x1="380" y1="12" x2="380" y2="28" stroke={ink} strokeWidth="1.5" />
          <rect x="140" y="11" width="100" height="18" fill="#0D1B2A" stroke={ink} strokeWidth="1" />
          <text x="190" y="24" fill={ink} fontSize="10" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
            84.00 mm
          </text>
        </g>

        {/* Drawn Geometry Dimension Line (Shorter - Contradiction) */}
        <g transform="translate(60, 105)">
          <text x="0" y="0" fill={amber} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
            2. SCALED SHEET GEOMETRY (As-Drawn Line):
          </text>
          <line x1="0" y1="20" x2="340" y2="20" stroke={amber} strokeWidth="1.5" />
          <line x1="0" y1="12" x2="0" y2="28" stroke={amber} strokeWidth="1.5" />
          <line x1="340" y1="12" x2="340" y2="28" stroke={amber} strokeWidth="1.5" />
          <rect x="120" y="11" width="100" height="18" fill="#0D1B2A" stroke={amber} strokeWidth="1" />
          <text x="170" y="24" fill={amber} fontSize="10" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
            81.65 mm
          </text>

          {/* Divergence Gap Bracket */}
          <line x1="340" y1="20" x2="380" y2="20" stroke={red} strokeWidth="2" strokeDasharray="3 2" />
          <line x1="380" y1="12" x2="380" y2="28" stroke={red} strokeWidth="1.5" />
          <rect x="348" y="28" width="85" height="18" fill="#2E0E0E" stroke={red} strokeWidth="1" rx="2" />
          <text x="390" y="40" fill={red} fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
            Δ -2.35 mm
          </text>
        </g>

        {/* Decision Banner on Right */}
        <g transform="translate(480, 40)">
          <rect x="0" y="0" width="220" height="100" rx="4" fill="#1B263B" stroke={amber} strokeWidth="1.2" />
          <text x="14" y="24" fill={amber} fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">
            FLIP RECONCILIATION RULE
          </text>
          <line x1="14" y1="32" x2="206" y2="32" stroke={hair} strokeWidth="0.75" />
          <text x="14" y="52" fill={ink} fontSize="9" fontFamily="var(--font-sans)">
            • Builds model to stated dimension (84.0mm).
          </text>
          <text x="14" y="70" fill={ink} fontSize="9" fontFamily="var(--font-sans)">
            • Flags geometry disagreement in report.
          </text>
          <text x="14" y="88" fill={red} fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">
            • Never averages or guesses silently.
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * 02 — Model to Drawing Diagram SVG (3D CAD Projecting Outward into 2D Views)
 */
export function ModelToDrawingDiagramSvg({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-4 shadow-lg ${className}`}>
      <div className="mb-3 flex items-center justify-between border-b border-vx-600/60 pb-2 text-micro mono text-vx-400">
        <span className="text-vx-100 font-semibold">MODEL TO DRAWING GENERATOR · COMING</span>
        <span className="text-dim">AUTOMATIC ORTHOGRAPHIC VIEWS &amp; SECTIONING</span>
      </div>

      <svg
        viewBox="0 0 740 210"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center: 3D CAD Solid Source */}
        <g transform="translate(90, 85)">
          <rect x="-60" y="-55" width="120" height="110" rx="4" fill="#1B263B" stroke={hair} strokeWidth="1" />
          <ellipse cx="0" cy="-10" rx="35" ry="14" stroke={ink} strokeWidth="1.5" fill="#243447" />
          <ellipse cx="0" cy="18" rx="35" ry="14" stroke={ink} strokeWidth="1.2" fill="none" />
          <line x1="-35" y1="-10" x2="-35" y2="18" stroke={ink} strokeWidth="1.5" />
          <line x1="35" y1="-10" x2="35" y2="18" stroke={ink} strokeWidth="1.5" />
          <ellipse cx="0" cy="-22" rx="18" ry="7" stroke={amber} strokeWidth="1.2" fill="none" />
          <text x="0" y="46" fill={amber} fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
            3D CAD MODEL
          </text>
        </g>

        {/* Projection Rays from 3D to 2D Sheets */}
        <path d="M 160 85 L 250 45" stroke={dim} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M 160 85 L 250 85" stroke={dim} strokeWidth="1.5" />
        <path d="M 160 85 L 250 125" stroke={dim} strokeWidth="1" strokeDasharray="3 3" />

        {/* Right: Generated Production Drawing Sheet */}
        <g transform="translate(260, 20)">
          <rect x="0" y="0" width="450" height="170" rx="4" fill="#121D2B" stroke={ink} strokeWidth="1.2" />
          <rect x="6" y="6" width="438" height="158" fill="none" stroke={hair} strokeWidth="0.75" />

          {/* View 1: Projected Top View */}
          <g transform="translate(80, 85)">
            <circle cx="0" cy="0" r="38" stroke={ink} strokeWidth="1.2" />
            <circle cx="0" cy="0" r="28" stroke={amber} strokeWidth="0.8" strokeDasharray="3 2" />
            <circle cx="0" cy="0" r="14" stroke={ink} strokeWidth="1" />
            <line x1="-45" y1="0" x2="45" y2="0" stroke={hair} strokeWidth="0.75" strokeDasharray="8 2 2 2" />
            <line x1="0" y1="-45" x2="0" y2="45" stroke={hair} strokeWidth="0.75" strokeDasharray="8 2 2 2" />
            <text x="0" y="52" fill={dim} fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">
              PLAN VIEW
            </text>
          </g>

          {/* View 2: Generated Section A-A */}
          <g transform="translate(230, 85)">
            <rect x="-40" y="-14" width="80" height="28" stroke={ink} strokeWidth="1.2" fill="none" />
            <rect x="-20" y="-32" width="40" height="18" stroke={ink} strokeWidth="1" fill="none" />
            {/* Automatic dimensions */}
            <line x1="-40" y1="20" x2="40" y2="20" stroke={amber} strokeWidth="0.8" />
            <text x="0" y="30" fill={amber} fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">
              Ø160.0 mm
            </text>
            <text x="0" y="52" fill={dim} fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">
              SECTION A-A
            </text>
          </g>

          {/* Title Block on Sheet */}
          <g transform="translate(330, 110)">
            <rect x="0" y="0" width="105" height="46" fill="#182738" stroke={hair} strokeWidth="0.75" />
            <text x="8" y="14" fill={ink} fontSize="8" fontFamily="var(--font-mono)" fontWeight="600">
              PRODUCTION DWG
            </text>
            <text x="8" y="27" fill={dim} fontSize="7" fontFamily="var(--font-mono)">
              DERIVED FROM 3D
            </text>
            <text x="8" y="40" fill={green} fontSize="7" fontFamily="var(--font-mono)">
              VERIFIED 100%
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Deployment Diagram SVG (On-Prem, Self-Hosted, Zero Outbound Connections)
 */
export function DeploymentDiagramSvg({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-4 shadow-lg ${className}`}>
      <div className="mb-3 flex items-center justify-between border-b border-vx-600/60 pb-2 text-micro mono text-vx-400">
        <span className="text-vx-100 font-semibold">SECURITY &amp; AIR-GAPPED DEPLOYMENT TOPOLOGY</span>
        <span className="rounded-xs bg-emerald-950 border border-emerald-500/50 px-2 py-0.5 text-emerald-400 font-bold">
          AIR-GAPPED
        </span>
      </div>

      <svg
        viewBox="0 0 740 160"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Enterprise Firewall Perimeter Box */}
        <rect x="20" y="15" width="460" height="130" rx="6" fill="#121D2B" stroke={hair} strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="35" y="34" fill={amber} fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">
          YOUR INFRASTRUCTURE / PRIVATE CLOUD (No external dependencies)
        </text>

        {/* Local Drawing Storage */}
        <g transform="translate(45, 52)">
          <rect x="0" y="0" width="115" height="75" rx="3" fill="#1B263B" stroke={hair} strokeWidth="1" />
          <text x="12" y="22" fill={ink} fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
            LOCAL ARCHIVE
          </text>
          <text x="12" y="40" fill={dim} fontSize="8.5" fontFamily="var(--font-mono)">
            DWG · DXF · PDF
          </text>
          <text x="12" y="58" fill={dim} fontSize="8.5" fontFamily="var(--font-mono)">
            NFS / S3 Local
          </text>
        </g>

        {/* Arrow to FLIP */}
        <line x1="165" y1="90" x2="200" y2="90" stroke={green} strokeWidth="1.5" />
        <polygon points="200,90 193,86 193,94" fill={green} />

        {/* FLIP Self-Hosted Container */}
        <g transform="translate(205, 52)">
          <rect x="0" y="0" width="240" height="75" rx="3" fill="#182738" stroke={green} strokeWidth="1.5" />
          <text x="15" y="22" fill={green} fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">
            FLIP ENGINE (DOCKER / K8S)
          </text>
          <text x="15" y="40" fill={ink} fontSize="9" fontFamily="var(--font-sans)">
            • OpenCASCADE kernel runs entirely locally
          </text>
          <text x="15" y="56" fill={ink} fontSize="9" fontFamily="var(--font-sans)">
            • Deterministic feature tree reconstruction
          </text>
        </g>

        {/* Blocked Outbound Firewall Graphic on Right */}
        <g transform="translate(515, 30)">
          <rect x="0" y="0" width="205" height="100" rx="4" fill="#241515" stroke={red} strokeWidth="1.2" />
          <circle cx="28" cy="30" r="12" fill="none" stroke={red} strokeWidth="2" />
          <line x1="20" y1="22" x2="36" y2="38" stroke={red} strokeWidth="2" />
          <text x="48" y="34" fill={red} fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">
            OUTBOUND BLOCKED
          </text>
          <line x1="15" y1="52" x2="190" y2="52" stroke="#4A1E1E" strokeWidth="0.75" />
          <text x="15" y="70" fill={ink} fontSize="9" fontFamily="var(--font-mono)">
            Outbound telemetry: 0 bytes
          </text>
          <text x="15" y="86" fill={dim} fontSize="9" fontFamily="var(--font-mono)">
            Zero phone-home calls
          </text>
        </g>
      </svg>
    </div>
  );
}
