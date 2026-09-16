import type { CSSProperties } from "react";

/**
 * A CAD re-draft of US Patent 2,090,719 (Karl Alt, "Form of pipe coupling", 1937),
 * sheet 1: the same four views at the same positions and scale as the scan in
 * public/hero/sketch.webp, so the linework draws over the paper and lines up.
 *
 * Coordinate space is the processed scan's pixel space (1800 × 2196). Every
 * measured position below was read from that image; every derived value goes
 * through rd() before it reaches the markup.
 *
 * Six planes, each its own <g data-plane>: border-zones, geometry, dimensions,
 * tables-notes, title-block, revision.
 */

export type PatentPlane = "border-zones" | "geometry" | "dimensions" | "tables-notes" | "title-block" | "revision";
export const PATENT_PLANES: PatentPlane[] = ["border-zones", "geometry", "dimensions", "tables-notes", "title-block", "revision"];
export const PATENT_PLANE_LABELS: Record<PatentPlane, string> = {
  "border-zones": "Border and zones",
  geometry: "Geometry",
  dimensions: "Dimensions",
  "tables-notes": "Tables and notes",
  "title-block": "Title block",
  revision: "Revision table",
};

export const PATENT_W = 1800;
export const PATENT_H = 2196;

const rd = (n: number) => Math.round(n * 100) / 100;
const ink = "var(--color-vx-100)";
const dimInk = "var(--color-vx-400)";
const hair = "var(--color-vx-600)";
const mono: CSSProperties = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" };
const sans: CSSProperties = { fontFamily: "var(--font-sans)" };

/* ------------------------------------------------------------ measured geometry */
// Fig. 1 — longitudinal section of the coupling body, centre line y = 782
const F1 = { cy: 782, neckX0: 93, neckOut: 698, neckIn: 720, bodyX0: 461, bodyTop: 577, bodyIn: 617, bodyX1: 880, mouthTop: 661, lugX: [676, 700], lugTop: 550 };
// Fig. 2 — end view of the body, centre (1210, 775)
const F2 = { cx: 1210, cy: 775, solid: [62.5, 77.5, 134.5, 171, 196], dashed: [103.5, 161.5, 180.5], lugW: 22, lugR: 215 };
// Fig. 3 — end view of the sleeve, centre (326, 1799)
const F3 = { cx: 326, cy: 1799, solid: [61.5, 83.5, 134.5, 223, 231.5], dashed: [114, 149.5, 179.5, 187.5, 201] };
// Fig. 4 — sleeve and nut, half section, centre line y = 1795
const F4 = { cy: 1795, x0: 650, top: 1566, wall: 1577, nutX0: 1138, nutTop: 1558, nutX1: 1240, stepTop: 1606, chamX0: 1300, chamX1: 1380, noseTop: 1675, x1: 1460, lipA: 1591, lipB: 1616, lipX1: 800 };

const m1 = (y: number) => rd(2 * F1.cy - y); // mirror about Fig. 1 centre line
const m4 = (y: number) => rd(2 * F4.cy - y); // mirror about Fig. 4 centre line

// Fig. 1 outer flare, top half, from the neck into the body (measured points)
const flareOut: [number, number][] = [[300, 697], [340, 691], [360, 686], [380, 677], [400, 664], [420, 645], [440, 614], [455, 592], [470, 581], [491, 577]];
// Fig. 1 inner flare (wall inner surface), top half
const flareIn: [number, number][] = [[300, 720], [340, 712], [360, 704], [380, 699], [400, 688], [420, 672], [440, 650], [452, 628], [461, 617]];

/** Invisible hit area so a plane can be hovered where its content is, not across the whole sheet. */
const Hit = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => <rect x={x} y={y} width={w} height={h} fill="none" className="hit" />;

const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${rd(x)},${rd(y)}`).join(" ");

type Props = {
  planes?: PatentPlane[];
  id?: string;
  className?: string;
  decorative?: boolean;
  label?: string;
};

export function PatentSheet({
  planes = PATENT_PLANES,
  id = "patent",
  className = "",
  decorative = false,
  label = "CAD re-draft of US patent 2,090,719, a tapered pipe coupling: longitudinal section and end view of the body, end view and half section of the sleeve and nut, with dimensions, parts list, notes, revision table and an anonymised title block",
}: Props) {
  const has = (p: PatentPlane) => planes.includes(p);
  const hatch = `${id}-hatch`;
  return (
    <svg
      viewBox={`0 0 ${PATENT_W} ${PATENT_H}`}
      className={`sheet-svg ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      fill="none"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      <defs>
        <pattern id={hatch} patternUnits="userSpaceOnUse" width="11" height="11" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="11" stroke={ink} strokeWidth="0.9" opacity="0.55" />
        </pattern>
      </defs>
      {has("border-zones") && <BorderZones />}
      {has("geometry") && <Geometry hatch={hatch} />}
      {has("dimensions") && <Dimensions />}
      {has("tables-notes") && <TablesNotes />}
      {has("title-block") && <TitleBlock />}
      {has("revision") && <Revision />}
    </svg>
  );
}

/* ------------------------------------------------------------------ border */
function BorderZones() {
  const inset = 22;
  const iw = PATENT_W - 2 * inset;
  const ih = PATENT_H - 2 * inset;
  const cols = 8;
  const rows = 8;
  const cw = iw / cols;
  const rh = ih / rows;
  return (
    <g data-plane="border-zones">
      <Hit x={0} y={0} w={PATENT_W} h={inset + 40} />
      <Hit x={0} y={PATENT_H - inset - 40} w={PATENT_W} h={inset + 40} />
      <Hit x={0} y={0} w={inset + 40} h={PATENT_H} />
      <Hit x={PATENT_W - inset - 40} y={0} w={inset + 40} h={PATENT_H} />
      <rect x={inset + 0.5} y={inset + 0.5} width={iw - 1} height={ih - 1} stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} data-anchor />
      <rect x={inset + 20.5} y={inset + 20.5} width={iw - 41} height={ih - 41} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <g stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="fade">
        {Array.from({ length: cols - 1 }, (_, i) => {
          const x = rd(inset + cw * (i + 1));
          return (
            <g key={`c${i}`}>
              <line x1={x} y1={inset} x2={x} y2={inset + 20} />
              <line x1={x} y1={PATENT_H - inset - 20} x2={x} y2={PATENT_H - inset} />
            </g>
          );
        })}
        {Array.from({ length: rows - 1 }, (_, i) => {
          const y = rd(inset + rh * (i + 1));
          return (
            <g key={`r${i}`}>
              <line x1={inset} y1={y} x2={inset + 20} y2={y} />
              <line x1={PATENT_W - inset - 20} y1={y} x2={PATENT_W - inset} y2={y} />
            </g>
          );
        })}
      </g>
      <g fill={dimInk} fontSize="11" style={mono} className="fade" textAnchor="middle">
        {Array.from({ length: cols }, (_, i) => (
          <g key={`cn${i}`}>
            <text x={rd(inset + cw * i + cw / 2)} y={inset + 14}>{i + 1}</text>
            <text x={rd(inset + cw * i + cw / 2)} y={PATENT_H - inset - 7}>{i + 1}</text>
          </g>
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <g key={`rn${i}`}>
            <text x={inset + 10} y={rd(inset + rh * i + rh / 2 + 4)}>{"ABCDEFGH"[i]}</text>
            <text x={PATENT_W - inset - 10} y={rd(inset + rh * i + rh / 2 + 4)}>{"ABCDEFGH"[i]}</text>
          </g>
        ))}
      </g>
      {/* centring marks */}
      <g stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="fade">
        <line x1={PATENT_W / 2} y1={inset} x2={PATENT_W / 2} y2={inset + 32} />
        <line x1={PATENT_W / 2} y1={PATENT_H - inset - 32} x2={PATENT_W / 2} y2={PATENT_H - inset} />
        <line x1={inset} y1={PATENT_H / 2} x2={inset + 32} y2={PATENT_H / 2} />
        <line x1={PATENT_W - inset - 32} y1={PATENT_H / 2} x2={PATENT_W - inset} y2={PATENT_H / 2} />
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- geometry */
function Circles({ cx, cy, solid, dashed }: { cx: number; cy: number; solid: number[]; dashed: number[] }) {
  return (
    <>
      <g stroke={ink} strokeWidth="1.25" vectorEffect="non-scaling-stroke">
        {solid.map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} className="draw" pathLength={1} />
        ))}
      </g>
      <g stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="14 7" className="fade">
        {dashed.map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="22 5 4 5" className="fade">
        <line x1={cx - 70} y1={cy} x2={cx + 70} y2={cy} />
        <line x1={cx} y1={cy - 70} x2={cx} y2={cy + 70} />
      </g>
    </>
  );
}

function Geometry({ hatch }: { hatch: string }) {
  const f1 = F1;
  const f4 = F4;
  // Fig. 1 top half: outer profile neck → flare → body → end face
  const outerTop: [number, number][] = [[f1.neckX0, f1.neckOut], ...flareOut, [f1.bodyX1, f1.bodyTop]];
  const innerTop: [number, number][] = [[f1.neckX0, f1.neckIn], ...flareIn, [f1.bodyX0, f1.bodyIn], [838, f1.bodyIn]];
  // wall polygon (top): outer profile forward, inner profile back
  const wallTop: [number, number][] = [
    [f1.neckX0, f1.neckOut], ...flareOut, [f1.bodyX1, f1.bodyTop], [f1.bodyX1, 583], [838, 583], [838, f1.bodyIn], [f1.bodyX0, f1.bodyIn], [f1.bodyX0, 947],
    // back along the inner surface: the cavity wall then the inner flare and neck bore
    [f1.bodyX0, f1.bodyIn], ...[...flareIn].reverse(), [f1.neckX0, f1.neckIn],
  ];
  // Simplified top wall as two polygons: neck+flare wall, and body top wall
  const neckWallTop: [number, number][] = [[f1.neckX0, f1.neckOut], ...flareOut, [491, 577], [505, 577], [505, f1.bodyIn], [f1.bodyX0, f1.bodyIn], ...[...flareIn].reverse(), [f1.neckX0, f1.neckIn]];
  const bodyWallTop: [number, number][] = [[505, f1.bodyTop], [f1.bodyX1, f1.bodyTop], [f1.bodyX1, f1.mouthTop], [838, f1.mouthTop], [838, f1.bodyIn], [505, f1.bodyIn]];
  const wedgeTop: [number, number][] = [[518, 670], [814, 627], [830, 627], [830, 659], [518, 702]];
  const ringTop: [number, number][] = [[748, 596], [838, 596], [838, 640], [748, 640]];
  const mir = (pts: [number, number][]) => pts.map(([x, y]) => [x, m1(y)] as [number, number]);
  void wallTop;
  void outerTop;
  void innerTop;

  // Fig. 4 silhouette, top half, left to right
  const silTop: [number, number][] = [
    [f4.x0, f4.top], [f4.nutX0, f4.top], [f4.nutX0, f4.nutTop], [f4.nutX1, f4.nutTop], [f4.nutX1, f4.stepTop], [f4.chamX0, f4.stepTop], [f4.chamX1, f4.noseTop], [f4.x1, f4.noseTop],
  ];
  const silBot = silTop.map(([x, y]) => [x, m4(y)] as [number, number]).reverse();
  const sleeveWallTop: [number, number][] = [[f4.x0, f4.top], [f4.nutX0, f4.top], [f4.nutX0, f4.wall], [f4.x0, f4.wall]];
  const wedge4: [number, number][] = [[716, 1707], [1125, 1651], [1125, 1733], [716, 1733]];
  const block12: [number, number][] = [[1088, 1591], [1130, 1591], [1130, 1651], [1088, 1651]];
  const nutWallTop: [number, number][] = [[f4.nutX0, f4.nutTop], [f4.nutX1, f4.nutTop], [f4.nutX1, f4.stepTop], [1280, f4.stepTop], [1280, 1640], [f4.nutX0, 1640]];
  const noseTop: [number, number][] = [[f4.chamX0, f4.stepTop], [f4.chamX1, f4.noseTop], [f4.x1, f4.noseTop], [f4.x1, 1690], [1280, 1690], [1280, f4.stepTop]];
  const thick = { stroke: ink, strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" as const };
  const thin = { stroke: ink, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  const centre = { stroke: dimInk, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, strokeDasharray: "22 5 4 5" };

  return (
    <g data-plane="geometry">
      <Hit x={80} y={545} w={810} h={470} />
      <Hit x={990} y={560} w={440} h={440} />
      <Hit x={90} y={1565} w={470} h={470} />
      <Hit x={645} y={1555} w={820} h={480} />
      {/* ---------- Fig. 1: coupling body, longitudinal section ---------- */}
      <g {...centre} className="fade">
        <line x1={60} y1={f1.cy} x2={905} y2={f1.cy} />
      </g>
      <g {...thick} fill={`url(#${hatch})`}>
        <polygon points={poly(neckWallTop)} className="draw" pathLength={1} data-anchor />
        <polygon points={poly(mir(neckWallTop))} className="draw" pathLength={1} />
        <polygon points={poly(bodyWallTop)} className="draw" pathLength={1} />
        <polygon points={poly(mir(bodyWallTop))} className="draw" pathLength={1} />
        <polygon points={poly(wedgeTop)} className="draw" pathLength={1} />
        <polygon points={poly(mir(wedgeTop))} className="draw" pathLength={1} />
        <polygon points={poly(ringTop)} className="draw" pathLength={1} />
        <polygon points={poly(mir(ringTop))} className="draw" pathLength={1} />
        {/* cap "5" at the mouth */}
        <polygon points={poly([[838, 583], [880, 583], [880, f1.mouthTop], [838, f1.mouthTop]])} className="draw" pathLength={1} />
        <polygon points={poly(mir([[838, 583], [880, 583], [880, f1.mouthTop], [838, f1.mouthTop]]))} className="draw" pathLength={1} />
        {/* lugs "7" */}
        <rect x={f1.lugX[0]} y={f1.lugTop} width={f1.lugX[1] - f1.lugX[0]} height={f1.bodyTop - f1.lugTop} className="draw" pathLength={1} />
        <rect x={f1.lugX[0]} y={m1(f1.bodyTop)} width={f1.lugX[1] - f1.lugX[0]} height={f1.bodyTop - f1.lugTop} className="draw" pathLength={1} />
      </g>
      <g {...thin} className="draw">
        {/* left end face of the neck and the mouth edges */}
        <line x1={f1.neckX0} y1={f1.neckOut} x2={f1.neckX0} y2={m1(f1.neckOut)} pathLength={1} />
        <line x1={f1.bodyX1} y1={f1.mouthTop} x2={f1.bodyX1} y2={m1(f1.mouthTop)} pathLength={1} strokeDasharray="6 4" />
      </g>
      <g {...thin} className="fade">
        {/* thread grooves on the neck */}
        {[112, 134, 156, 178, 200, 222, 244, 266].map((x) => (
          <g key={x}>
            <line x1={x} y1={f1.neckOut} x2={x} y2={f1.neckOut + 5} />
            <line x1={x} y1={m1(f1.neckOut)} x2={x} y2={m1(f1.neckOut) - 5} />
          </g>
        ))}
      </g>

      {/* ---------- Fig. 2: end view of the body ---------- */}
      <Circles cx={F2.cx} cy={F2.cy} solid={F2.solid} dashed={F2.dashed} />
      <g {...thick}>
        <rect x={F2.cx - F2.lugW / 2} y={F2.cy - F2.lugR} width={F2.lugW} height={F2.lugR - 196 + 4} className="draw" pathLength={1} />
        <rect x={F2.cx - F2.lugW / 2} y={F2.cy + 196 - 4} width={F2.lugW} height={F2.lugR - 196 + 4} className="draw" pathLength={1} />
      </g>
      <g {...thin} className="fade">
        <circle cx={F2.cx} cy={F2.cy - 157} r={6} />
        <circle cx={F2.cx} cy={F2.cy + 157} r={6} />
      </g>

      {/* ---------- Fig. 3: end view of the sleeve ---------- */}
      <Circles cx={F3.cx} cy={F3.cy} solid={F3.solid} dashed={F3.dashed} />

      {/* ---------- Fig. 4: sleeve and nut, half section ---------- */}
      <g {...centre} className="fade">
        <line x1={620} y1={f4.cy} x2={1490} y2={f4.cy} />
      </g>
      <g {...thick}>
        <polyline points={poly([...silTop, ...silBot])} className="draw" pathLength={1} />
        <line x1={f4.x0} y1={f4.top} x2={f4.x0} y2={m4(f4.top)} className="draw" pathLength={1} />
        <line x1={f4.x1} y1={f4.noseTop} x2={f4.x1} y2={m4(f4.noseTop)} className="draw" pathLength={1} />
      </g>
      <g {...thick} fill={`url(#${hatch})`}>
        <polygon points={poly(sleeveWallTop)} className="draw" pathLength={1} />
        <polygon points={poly(wedge4)} className="draw" pathLength={1} />
        <polygon points={poly(block12)} className="draw" pathLength={1} />
        <polygon points={poly(nutWallTop)} className="draw" pathLength={1} />
        <polygon points={poly(noseTop)} className="draw" pathLength={1} />
      </g>
      <g {...thin} className="draw">
        {/* rolled lip "10", top and bottom */}
        <path d={`M${f4.x0} ${f4.lipA} H${f4.lipX1} A12.5 12.5 0 0 1 ${f4.lipX1} ${f4.lipB} H${f4.x0}`} pathLength={1} />
        <path d={`M${f4.x0} ${m4(f4.lipA)} H${f4.lipX1} A12.5 12.5 0 0 0 ${f4.lipX1} ${m4(f4.lipB)} H${f4.x0}`} pathLength={1} />
        {/* nut faces */}
        <line x1={f4.nutX0} y1={f4.nutTop} x2={f4.nutX0} y2={m4(f4.nutTop)} pathLength={1} />
        <line x1={1280} y1={f4.stepTop} x2={1280} y2={m4(f4.stepTop)} pathLength={1} />
      </g>
      <g {...thin} strokeDasharray="10 6" className="fade">
        {/* hidden bore in the unsectioned half */}
        <line x1={716} y1={1857} x2={1060} y2={1857} />
        <line x1={880} y1={1903} x2={1180} y2={1949} />
        <line x1={1180} y1={1949} x2={1240} y2={1949} />
        <line x1={1200} y1={f4.cy} x2={1200} y2={1982} />
        <line x1={716} y1={1857} x2={716} y2={m4(1707)} />
      </g>
      {/* view captions */}
      <g fill={ink} fontSize="20" fontWeight="500" style={sans} className="fade">
        <text x={330} y={1072}>FIG. 1</text>
        <text x={1130} y={1120}>FIG. 2</text>
        <text x={272} y={2150}>FIG. 3</text>
        <text x={1015} y={2150}>FIG. 4</text>
      </g>
    </g>
  );
}

/* -------------------------------------------------------------- dimensions */
function Arrow({ x, y, deg, size = 12 }: { x: number; y: number; deg: number; size?: number }) {
  const a = (deg * Math.PI) / 180;
  const bx = x - size * Math.cos(a);
  const by = y - size * Math.sin(a);
  const w = size * 0.27;
  const px = -Math.sin(a) * w;
  const py = Math.cos(a) * w;
  return <polygon points={`${rd(x)},${rd(y)} ${rd(bx + px)},${rd(by + py)} ${rd(bx - px)},${rd(by - py)}`} fill={dimInk} />;
}

function HDim({ x1, x2, y, ext, label, above = true }: { x1: number; x2: number; y: number; ext: [number, number]; label: string; above?: boolean }) {
  return (
    <g>
      <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw">
        <line x1={x1} y1={ext[0]} x2={x1} y2={ext[1]} pathLength={1} />
        <line x1={x2} y1={ext[0]} x2={x2} y2={ext[1]} pathLength={1} />
        <line x1={x1} y1={y + 0.5} x2={x2} y2={y + 0.5} pathLength={1} />
      </g>
      <g className="fade">
        <Arrow x={x1} y={y + 0.5} deg={180} />
        <Arrow x={x2} y={y + 0.5} deg={0} />
        <text x={rd((x1 + x2) / 2)} y={above ? y - 7 : y + 18} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>{label}</text>
      </g>
    </g>
  );
}

function VDim({ y1, y2, x, ext, label, left = true }: { y1: number; y2: number; x: number; ext: [number, number]; label: string; left?: boolean }) {
  const tx = left ? x - 7 : x + 7;
  return (
    <g>
      <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw">
        <line x1={ext[0]} y1={y1} x2={ext[1]} y2={y1} pathLength={1} />
        <line x1={ext[0]} y1={y2} x2={ext[1]} y2={y2} pathLength={1} />
        <line x1={x + 0.5} y1={y1} x2={x + 0.5} y2={y2} pathLength={1} />
      </g>
      <g className="fade">
        <Arrow x={x + 0.5} y={y1} deg={-90} />
        <Arrow x={x + 0.5} y={y2} deg={90} />
        <text x={tx} y={rd((y1 + y2) / 2)} textAnchor="middle" fill={dimInk} fontSize="15" style={mono} transform={`rotate(-90 ${tx} ${rd((y1 + y2) / 2)})`}>{label}</text>
      </g>
    </g>
  );
}

function Leader({ from, via, to, label, anchor = "start" }: { from: [number, number]; via: [number, number]; to: [number, number]; label: string; anchor?: "start" | "end" }) {
  const deg = (Math.atan2(from[1] - via[1], from[0] - via[0]) * 180) / Math.PI;
  return (
    <g>
      <polyline points={poly([from, via, to])} stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <g className="fade">
        <Arrow x={from[0]} y={from[1]} deg={deg} />
        <text x={anchor === "start" ? to[0] + 6 : to[0] - 6} y={to[1] + 5} textAnchor={anchor} fill={dimInk} fontSize="15" style={mono}>{label}</text>
      </g>
    </g>
  );
}

function Dimensions() {
  const f1 = F1;
  const f4 = F4;
  // angular dimension on the nose chamfer of Fig. 4
  const ang = { cx: F4.chamX0, cy: F4.stepTop, r: 110 };
  const a1 = (39 * Math.PI) / 180; // measured chamfer angle: (1675-1606)/(1380-1300) → 40.8°, drawn as 39° after the fillet
  const arcEnd: [number, number] = [rd(ang.cx + ang.r * Math.cos(a1)), rd(ang.cy + ang.r * Math.sin(a1))];
  return (
    <g data-plane="dimensions">
      <Hit x={80} y={500} w={820} h={44} />
      <Hit x={440} y={985} w={380} h={90} />
      <Hit x={30} y={620} w={60} h={260} />
      <Hit x={890} y={560} w={50} h={450} />
      <Hit x={1300} y={540} w={280} h={50} />
      <Hit x={1300} y={900} w={280} h={50} />
      <Hit x={890} y={990} w={140} h={40} />
      <Hit x={440} y={1540} w={200} h={40} />
      <Hit x={400} y={1970} w={200} h={40} />
      <Hit x={600} y={2040} w={880} h={44} />
      <Hit x={1100} y={1500} w={200} h={50} />
      <Hit x={1300} y={1590} w={180} h={100} />
      <Hit x={600} y={1560} w={40} h={480} />
      <Hit x={1470} y={1660} w={50} h={280} />
      {/* Fig. 1 */}
      <HDim x1={f1.neckX0} x2={f1.bodyX1} y={520} ext={[540, 512]} label="157.4" />
      <HDim x1={f1.bodyX0} x2={f1.bodyX1} y={1030} ext={[995, 1038]} label="83.8" above={false} />
      <HDim x1={518} x2={830} y={1000} ext={[940, 1008]} label="62.4" above={false} />
      <VDim y1={f1.bodyTop} y2={m1(f1.bodyTop)} x={912} ext={[888, 920]} label="82" left={false} />
      <VDim y1={f1.neckOut} y2={m1(f1.neckOut)} x={52} ext={[86, 44]} label="33.6" />
      <Leader from={[f1.neckX0 + 40, f1.neckIn]} via={[60, 640]} to={[24, 640]} label="Ø24.8" anchor="start" />
      {/* GD&T: circular runout of the mouth bore to datum A (the body OD) */}
      <g className="fade">
        <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke">
          <rect x={640} y={1046} width={150} height={26} />
          <line x1={672} y1={1046} x2={672} y2={1072} />
          <line x1={752} y1={1046} x2={752} y2={1072} />
          <path d="M650 1066 A7 7 0 1 1 664 1066" />
          <line x1={657} y1={1054} x2={662} y2={1059} />
          <line x1={662} y1={1052} x2={662} y2={1059} />
          <line x1={655} y1={1059} x2={662} y2={1059} />
          <rect x={900} y={770} width={26} height={24} />
          <polygon points="913,748 907,770 919,770" fill={dimInk} />
        </g>
        <text x={712} y={1065} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>0.05</text>
        <text x={771} y={1065} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>A</text>
        <text x={913} y={788} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>A</text>
      </g>
      {/* Fig. 2 */}
      <Leader from={[rd(F2.cx + 196 * Math.cos(-0.7)), rd(F2.cy + 196 * Math.sin(-0.7))]} via={[1440, 560]} to={[1480, 560]} label="Ø78.4" />
      <Leader from={[rd(F2.cx + 161.5 * Math.cos(0.6)), rd(F2.cy + 161.5 * Math.sin(0.6))]} via={[1440, 920]} to={[1480, 920]} label="Ø64.6 PCD" />
      <Leader from={[rd(F2.cx - 62.5 * Math.cos(0.7)), rd(F2.cy + 62.5 * Math.sin(0.7))]} via={[1040, 1010]} to={[1000, 1010]} label="Ø25 H8" anchor="end" />
      {/* Fig. 3 */}
      <Leader from={[rd(F3.cx + 231.5 * Math.cos(-0.9)), rd(F3.cy + 231.5 * Math.sin(-0.9))]} via={[560, 1560]} to={[600, 1560]} label="Ø92.6" />
      <Leader from={[rd(F3.cx + 61.5 * Math.cos(0.8)), rd(F3.cy + 61.5 * Math.sin(0.8))]} via={[500, 1990]} to={[540, 1990]} label="Ø24.6" />
      {/* Fig. 4 */}
      <HDim x1={f4.x0} x2={f4.x1} y={2062} ext={[2032, 2070]} label="162" above={false} />
      <HDim x1={f4.nutX0} x2={f4.nutX1} y={1522} ext={[1556, 1514]} label="20.4" />
      <HDim x1={f4.chamX1} x2={f4.x1} y={1640} ext={[1673, 1632]} label="16" />
      <VDim y1={f4.top} y2={m4(f4.top)} x={618} ext={[648, 610]} label="91.6" />
      <VDim y1={f4.noseTop} y2={m4(f4.noseTop)} x={1500} ext={[1462, 1508]} label="48" left={false} />
      {/* angular */}
      <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw">
        <line x1={ang.cx} y1={ang.cy} x2={ang.cx + 150} y2={ang.cy} pathLength={1} />
        <path d={`M${ang.cx + ang.r} ${ang.cy} A${ang.r} ${ang.r} 0 0 1 ${arcEnd[0]} ${arcEnd[1]}`} pathLength={1} />
      </g>
      <g className="fade">
        <Arrow x={ang.cx + ang.r} y={ang.cy} deg={-90} />
        <Arrow x={arcEnd[0]} y={arcEnd[1]} deg={90 + 39} />
        <text x={rd(ang.cx + ang.r + 10)} y={rd(ang.cy + 46)} fill={dimInk} fontSize="15" style={mono}>39°</text>
      </g>
    </g>
  );
}

/* ---------------------------------------------------------- tables & notes */
const parts: [string, string, string, string][] = [
  ["1", "Coupling body", "1", "EN-GJL-250"],
  ["2", "Tapered insert", "1", "CuSn8"],
  ["3", "Retaining ring", "1", "C45"],
  ["4", "Lock washer", "1", "51CrV4"],
  ["5", "Cap nut", "1", "CuZn39Pb3"],
  ["6", "Grub screw M4", "2", "8.8"],
  ["7", "Lug", "2", "EN-GJL-250"],
  ["8", "Pipe stub", "1", "S235JR"],
  ["9", "Sleeve", "1", "EN-GJL-250"],
  ["10", "Rolled lip", "1", "S235JR"],
];

function Cell({ x, y, w, h, text, align = "start", muted = false, bold = false, monoFace = true, size = 13 }: { x: number; y: number; w: number; h: number; text: string; align?: "start" | "middle" | "end"; muted?: boolean; bold?: boolean; monoFace?: boolean; size?: number }) {
  const tx = align === "start" ? x + 8 : align === "end" ? x + w - 8 : x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <text x={tx} y={rd(y + h / 2 + 4.5)} textAnchor={align} fill={muted ? dimInk : ink} fontSize={size} fontWeight={bold ? 500 : 400} style={monoFace ? mono : sans} className="fade">{text}</text>
    </>
  );
}

function TablesNotes() {
  const x0 = 60;
  const y0 = 1180;
  const rowH = 26;
  const cols = [
    { w: 46, h: "No.", a: "middle" as const },
    { w: 300, h: "Description", a: "start" as const },
    { w: 46, h: "Qty", a: "middle" as const },
    { w: 150, h: "Material", a: "start" as const },
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  return (
    <g data-plane="tables-notes">
      <Hit x={50} y={1160} w={520} h={310} />
      <Hit x={630} y={1160} w={640} h={140} />
      <Hit x={1320} y={1340} w={430} h={80} />
      {/* parts list */}
      <text x={x0} y={y0 - 10} fill={dimInk} fontSize="12" style={sans} className="fade">Parts list</text>
      {(() => {
        let cx = x0;
        return cols.map((c, i) => {
          const el = <Cell key={`h${i}`} x={cx} y={y0} w={c.w} h={rowH} text={c.h} align={c.a} muted monoFace={false} size={12} />;
          cx += c.w;
          return el;
        });
      })()}
      {parts.map((row, ri) => {
        let cx = x0;
        return cols.map((c, ci) => {
          const el = <Cell key={`${ri}-${ci}`} x={cx} y={y0 + rowH * (ri + 1)} w={c.w} h={rowH} text={row[ci]} align={c.a} monoFace={ci !== 1} />;
          cx += c.w;
          return el;
        });
      })}
      <g data-anchor>
        <rect x={x0} y={y0} width={totalW} height={rowH * (parts.length + 1)} stroke={ink} strokeWidth="1.25" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      </g>

      {/* notes */}
      <g style={sans} className="fade">
        <text x={640} y={y0 - 10} fill={dimInk} fontSize="12">Notes</text>
        {[
          "1. Break all sharp edges 0.5 max.",
          "2. Ra 3.2 unless stated; bore Ø25 H8 Ra 1.6.",
          "3. Insert 2 pressed to 12 kN; ring 3 seated before nut 5.",
          "4. Lugs 7 diametrically opposed within 0.2.",
          "5. Section hatching per ISO 128-50.",
        ].map((t, i) => (
          <text key={i} x={640} y={y0 + 20 + i * 24} fill={ink} fontSize="13">{t}</text>
        ))}
      </g>

      {/* general tolerances */}
      <g>
        <text x={1330} y={1352} fill={dimInk} fontSize="12" style={sans} className="fade">General tolerances</text>
        <Cell x={1330} y={1362} w={110} h={26} text="Linear" muted monoFace={false} size={12} />
        <Cell x={1440} y={1362} w={110} h={26} text="±0.2" align="middle" />
        <Cell x={1550} y={1362} w={100} h={26} text="Angular" muted monoFace={false} size={12} />
        <Cell x={1650} y={1362} w={90} h={26} text="±0.5°" align="middle" />
        <Cell x={1330} y={1388} w={110} h={26} text="Standard" muted monoFace={false} size={12} />
        <Cell x={1440} y={1388} w={300} h={26} text="ISO 2768-mK" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------ title block */
function TitleBlock() {
  const x0 = 1180;
  const y0 = 1996;
  const w = 598;
  const q = w / 4;
  const r1 = 50;
  const r2 = 44;
  const r3 = 44;
  const r4 = 40;
  return (
    <g data-plane="title-block">
      <Hit x={x0 - 10} y={y0 - 10} w={w + 20} h={r1 + r2 + r3 + r4 + 20} />
      <rect x={x0} y={y0} width={w} height={r1 + r2 + r3 + r4} stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} data-anchor />
      {/* company and address, redacted at the text's own size */}
      <rect x={x0} y={y0} width={q * 2} height={r1} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <g fill={hair} className="fade">
        <rect x={x0 + 12} y={y0 + 13} width={170} height={13} />
        <rect x={x0 + 12} y={y0 + 32} width={214} height={8} />
      </g>
      <TCell x={x0 + q * 2} y={y0} w={q * 2} h={r1} label="Title" value="Pipe coupling, tapered insert" monoFace={false} />
      <TCell x={x0} y={y0 + r1} w={q} h={r2} label="Drawing no." value="DRG-4120" />
      <TCell x={x0 + q} y={y0 + r1} w={q} h={r2} label="Rev" value="R2" />
      <TCell x={x0 + q * 2} y={y0 + r1} w={q} h={r2} label="Scale" value="1:1" />
      <TCell x={x0 + q * 3} y={y0 + r1} w={q} h={r2} label="Sheet" value="1/2" />
      <TCell x={x0} y={y0 + r1 + r2} w={q} h={r3} label="Drawn" value="R.K." />
      <TCell x={x0 + q} y={y0 + r1 + r2} w={q} h={r3} label="Date" value="2026-09-16" />
      <TCell x={x0 + q * 2} y={y0 + r1 + r2} w={q} h={r3} label="Checked" value="S.M." />
      <TCell x={x0 + q * 3} y={y0 + r1 + r2} w={q} h={r3} label="Material" value="See parts list" monoFace={false} />
      <TCell x={x0} y={y0 + r1 + r2 + r3} w={q * 2} h={r4} label="Projection" value="First angle" monoFace={false} />
      <TCell x={x0 + q * 2} y={y0 + r1 + r2 + r3} w={q * 2} h={r4} label="Source" value="US 2,090,719 · 1937 · public domain" />
    </g>
  );
}

function TCell({ x, y, w, h, label, value, monoFace = true }: { x: number; y: number; w: number; h: number; label: string; value: string; monoFace?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <text x={x + 8} y={y + 13} fill={dimInk} fontSize="9.5" style={sans} className="fade">{label}</text>
      <text x={x + 8} y={y + h - 10} fill={ink} fontSize={monoFace ? 13 : 13.5} style={monoFace ? mono : sans} className="fade">{value}</text>
    </g>
  );
}

/* --------------------------------------------------------------- revision */
function Revision() {
  const x0 = 1330;
  const y0 = 1180;
  const rowH = 26;
  const cols = [
    { w: 50, h: "Rev", a: "middle" as const },
    { w: 110, h: "Date", a: "start" as const },
    { w: 200, h: "Change", a: "start" as const },
    { w: 50, h: "By", a: "middle" as const },
  ];
  const rows: [string, string, string, string][] = [
    ["R0", "2024-03-11", "Issued", "R.K."],
    ["R1", "2025-01-20", "Insert 2 taper 8° → 7°", "S.M."],
    ["R2", "2026-09-16", "Nut 5 chamfer 39°", "R.K."],
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  return (
    <g data-plane="revision">
      <Hit x={x0 - 10} y={y0 - 24} w={totalW + 20} h={rowH * (rows.length + 1) + 34} />
      <text x={x0} y={y0 - 10} fill={dimInk} fontSize="12" style={sans} className="fade">Revisions</text>
      {(() => {
        let cx = x0;
        return cols.map((c, i) => {
          const el = <Cell key={`h${i}`} x={cx} y={y0} w={c.w} h={rowH} text={c.h} align={c.a} muted monoFace={false} size={12} />;
          cx += c.w;
          return el;
        });
      })()}
      {rows.map((row, ri) => {
        let cx = x0;
        return cols.map((c, ci) => {
          const el = <Cell key={`${ri}-${ci}`} x={cx} y={y0 + rowH * (ri + 1)} w={c.w} h={rowH} text={row[ci]} align={c.a} monoFace={ci !== 2} />;
          cx += c.w;
          return el;
        });
      })}
      <rect x={x0} y={y0} width={totalW} height={rowH * (rows.length + 1)} stroke={ink} strokeWidth="1.25" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} data-anchor />
    </g>
  );
}
