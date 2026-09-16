import type { CSSProperties } from "react";

/**
 * A CAD re-draft of US Patent 2,529,098 (George A. Noll, "Pipe coupling", 1950),
 * sheet 1, used landscape: Fig. 2 (end view of the sealing ring) beside Fig. 1
 * (longitudinal section through the coupling) at the same positions and scale
 * as the scan in public/hero/sketch.webp, so the linework draws over the paper
 * and lines up.
 *
 * Coordinate space is the processed scan's pixel space (1800 × 1229). Every
 * measured position below was read from that image with column and row
 * probes; the ring's centre and radii come from a radial-histogram fit. Every
 * derived value goes through rd() before it reaches the markup.
 *
 * Five planes, each its own <g data-plane>: border-zones, geometry,
 * dimensions, tables-notes, title-block. Each plane carries one [data-anchor]
 * (what the explainer's bracket measures) and invisible .hit areas.
 */

export type PatentPlane = "border-zones" | "geometry" | "dimensions" | "tables-notes" | "title-block";
export const PATENT_PLANES: PatentPlane[] = ["border-zones", "geometry", "dimensions", "tables-notes", "title-block"];
export const PATENT_PLANE_LABELS: Record<PatentPlane, string> = {
  "border-zones": "Border and zones",
  geometry: "Geometry",
  dimensions: "Dimensions",
  "tables-notes": "Tables and notes",
  "title-block": "Title block",
};

export const PATENT_W = 1800;
export const PATENT_H = 1229;

const rd = (n: number) => Math.round(n * 100) / 100;
const ink = "var(--color-vx-100)";
const dimInk = "var(--color-vx-400)";
const hair = "var(--color-vx-600)";
const mono: CSSProperties = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" };
const sans: CSSProperties = { fontFamily: "var(--font-sans)" };

/* ------------------------------------------------------------ measured geometry */
// Fig. 2 — end view of the sealing ring. Centre and radii from the radial fit.
const RING = { cx: 454, cy: 458, bore: 243, seatIn: 249, seatOut: 282, wallIn: 300, wallOut: 309, od: 318 };
// Fig. 1 — the coupling, sectioned. Symmetric about x = AX; measured on the left half.
const AX = 1190.5; // sleeve axis
const CL = 497; // section line 2–2 (the drawing's centre line)
const F1 = {
  pipe1: { xo: 921, xi: 931, top: 150, bottom: 318 }, // upper pipe wall, outer/inner x, y extent
  pipe2: { xo: 928, xi: 938, top: 738, bottom: 960 }, // lower pipe wall
  topBand: { x0: 886, y0: 318, y1: 342 }, // sleeve top ring, solid in the scan
  wall: { xo: 873, xi: 909, y0: 342, y1: 530 }, // sleeve wall
  bead: { xo: 827, xi: 867, y0: 530, y1: 670 }, // outward bead
  innerWall: [[890, 530], [969, 530], [961, 690], [908, 690]] as [number, number][],
  lowerWall: { xo: 908, xi: 961, y0: 690, y1: 722 },
  flange: { x0: 859, y0: 722, y1: 738 },
  ring16: { x0: 941, y0: 510, y1: 528 }, // pipe 2 end ring
  gasket: [[909, 470], [941, 470], [947, 520], [909, 520]] as [number, number][],
  lips: [{ x: 790, y0: 552, y1: 567 }, { x: 790, y0: 657, y1: 683 }],
};
const mx = (x: number) => rd(2 * AX - x); // mirror about the sleeve axis
const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${rd(x)},${rd(y)}`).join(" ");
const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [mx(x), y] as [number, number]);
const rect = (x0: number, x1: number, y0: number, y1: number): [number, number][] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** Invisible hit area so a plane can be hovered where its content is. */
const Hit = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => <rect x={x} y={y} width={w} height={h} fill="none" className="hit" />;

type Props = { planes?: PatentPlane[]; id?: string; className?: string; decorative?: boolean; label?: string };

export function PatentSheet({
  planes = PATENT_PLANES,
  id = "patent",
  className = "",
  decorative = false,
  label = "CAD re-draft of US patent 2,529,098, a pipe coupling: end view of the sealing ring and a longitudinal section through the coupling, with dimensions, a variant table, notes and an anonymised title block",
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
        <pattern id={hatch} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={ink} strokeWidth="0.9" opacity="0.55" />
        </pattern>
      </defs>
      {has("border-zones") && <BorderZones />}
      {has("geometry") && <Geometry hatch={hatch} />}
      {has("dimensions") && <Dimensions />}
      {has("tables-notes") && <TablesNotes />}
      {has("title-block") && <TitleBlock />}
    </svg>
  );
}

/* ------------------------------------------------------------------ border */
function BorderZones() {
  const inset = 20;
  const iw = PATENT_W - 2 * inset;
  const ih = PATENT_H - 2 * inset;
  const cols = 8;
  const rows = 4;
  const cw = iw / cols;
  const rh = ih / rows;
  return (
    <g data-plane="border-zones">
      <Hit x={0} y={0} w={PATENT_W} h={inset + 36} />
      <Hit x={0} y={PATENT_H - inset - 36} w={PATENT_W} h={inset + 36} />
      <Hit x={0} y={0} w={inset + 36} h={PATENT_H} />
      <Hit x={PATENT_W - inset - 36} y={0} w={inset + 36} h={PATENT_H} />
      <rect x={inset + 0.5} y={inset + 0.5} width={iw - 1} height={ih - 1} stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} data-anchor data-bracket="inside-right" />
      <rect x={inset + 18.5} y={inset + 18.5} width={iw - 37} height={ih - 37} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <g stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="fade">
        {Array.from({ length: cols - 1 }, (_, i) => {
          const x = rd(inset + cw * (i + 1));
          return (
            <g key={`c${i}`}>
              <line x1={x} y1={inset} x2={x} y2={inset + 18} />
              <line x1={x} y1={PATENT_H - inset - 18} x2={x} y2={PATENT_H - inset} />
            </g>
          );
        })}
        {Array.from({ length: rows - 1 }, (_, i) => {
          const y = rd(inset + rh * (i + 1));
          return (
            <g key={`r${i}`}>
              <line x1={inset} y1={y} x2={inset + 18} y2={y} />
              <line x1={PATENT_W - inset - 18} y1={y} x2={PATENT_W - inset} y2={y} />
            </g>
          );
        })}
      </g>
      <g fill={dimInk} fontSize="11" style={mono} className="fade" textAnchor="middle">
        {Array.from({ length: cols }, (_, i) => (
          <g key={`cn${i}`}>
            <text x={rd(inset + cw * i + cw / 2)} y={inset + 13}>{i + 1}</text>
            <text x={rd(inset + cw * i + cw / 2)} y={PATENT_H - inset - 6}>{i + 1}</text>
          </g>
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <g key={`rn${i}`}>
            <text x={inset + 9} y={rd(inset + rh * i + rh / 2 + 4)}>{"ABCD"[i]}</text>
            <text x={PATENT_W - inset - 9} y={rd(inset + rh * i + rh / 2 + 4)}>{"ABCD"[i]}</text>
          </g>
        ))}
      </g>
      <g stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="fade">
        <line x1={PATENT_W / 2} y1={inset} x2={PATENT_W / 2} y2={inset + 30} />
        <line x1={PATENT_W / 2} y1={PATENT_H - inset - 30} x2={PATENT_W / 2} y2={PATENT_H - inset} />
        <line x1={inset} y1={PATENT_H / 2} x2={inset + 30} y2={PATENT_H / 2} />
        <line x1={PATENT_W - inset - 30} y1={PATENT_H / 2} x2={PATENT_W - inset} y2={PATENT_H / 2} />
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- geometry */
function Geometry({ hatch }: { hatch: string }) {
  const thick = { stroke: ink, strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" as const };
  const thin = { stroke: ink, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  const centre = { stroke: dimInk, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, strokeDasharray: "22 5 4 5" };
  const f = F1;
  const p1 = rect(f.pipe1.xo, f.pipe1.xi, f.pipe1.top, f.pipe1.bottom);
  const p2 = rect(f.pipe2.xo, f.pipe2.xi, f.pipe2.top, f.pipe2.bottom);
  const wall = rect(f.wall.xo, f.wall.xi, f.wall.y0, f.wall.y1);
  const bead = rect(f.bead.xo, f.bead.xi, f.bead.y0, f.bead.y1);
  const lower = rect(f.lowerWall.xo, f.lowerWall.xi, f.lowerWall.y0, f.lowerWall.y1);
  // a break line: shallow zigzag across a pipe end
  const breakLine = (y: number, x0: number, x1: number) => {
    const n = 8;
    const step = (x1 - x0) / n;
    return Array.from({ length: n + 1 }, (_, i) => `${rd(x0 + step * i)},${rd(y + (i % 2 ? -6 : 6))}`).join(" ");
  };
  return (
    <g data-plane="geometry">
      <Hit x={120} y={120} w={670} h={670} />
      <Hit x={800} y={130} w={780} h={850} />

      {/* ---------- Fig. 2: sealing ring, end view ---------- */}
      <g {...centre} className="fade">
        <line x1={RING.cx - 60} y1={RING.cy} x2={RING.cx + 60} y2={RING.cy} />
        <line x1={RING.cx} y1={RING.cy - 60} x2={RING.cx} y2={RING.cy + 60} />
      </g>
      <g {...thick}>
        <circle cx={RING.cx} cy={RING.cy} r={RING.od} className="draw" pathLength={1} data-anchor data-bracket="left" />
        <circle cx={RING.cx} cy={RING.cy} r={RING.bore} className="draw" pathLength={1} />
      </g>
      <g {...thin}>
        <circle cx={RING.cx} cy={RING.cy} r={RING.wallIn} className="draw" pathLength={1} />
        <circle cx={RING.cx} cy={RING.cy} r={RING.wallOut} className="draw" pathLength={1} />
      </g>
      {/* the sealing ring's cut face, hatched: an annulus drawn as an even-odd path */}
      <path
        d={`M${RING.cx + RING.seatOut} ${RING.cy} A${RING.seatOut} ${RING.seatOut} 0 1 0 ${RING.cx - RING.seatOut} ${RING.cy} A${RING.seatOut} ${RING.seatOut} 0 1 0 ${RING.cx + RING.seatOut} ${RING.cy} M${RING.cx + RING.seatIn} ${RING.cy} A${RING.seatIn} ${RING.seatIn} 0 1 1 ${RING.cx - RING.seatIn} ${RING.cy} A${RING.seatIn} ${RING.seatIn} 0 1 1 ${RING.cx + RING.seatIn} ${RING.cy}`}
        fill={`url(#${hatch})`}
        fillRule="evenodd"
        {...thin}
        className="draw"
        pathLength={1}
      />

      {/* ---------- Fig. 1: coupling, longitudinal section ---------- */}
      <g {...centre} className="fade">
        <line x1={804} y1={CL} x2={1580} y2={CL} />
        <line x1={AX} y1={120} x2={AX} y2={990} />
      </g>
      {/* section line 2–2 arrows */}
      <g fill={dimInk} className="fade">
        <polygon points={`804,${CL} 822,${CL - 6} 822,${CL + 6}`} />
        <polygon points={`1580,${CL} 1562,${CL - 6} 1562,${CL + 6}`} />
        <text x={826} y={CL - 12} fontSize="14" style={mono}>2</text>
        <text x={1546} y={CL - 12} fontSize="14" style={mono}>2</text>
      </g>
      <g {...thick} fill={`url(#${hatch})`}>
        {/* pipes */}
        <polygon points={poly(p1)} className="draw" pathLength={1} />
        <polygon points={poly(mirror(p1))} className="draw" pathLength={1} />
        <polygon points={poly(p2)} className="draw" pathLength={1} />
        <polygon points={poly(mirror(p2))} className="draw" pathLength={1} />
        {/* sleeve */}
        <polygon points={poly(rect(f.topBand.x0, mx(f.topBand.x0), f.topBand.y0, f.topBand.y1))} className="draw" pathLength={1} />
        <polygon points={poly(wall)} className="draw" pathLength={1} />
        <polygon points={poly(mirror(wall))} className="draw" pathLength={1} />
        <polygon points={poly(bead)} className="draw" pathLength={1} />
        <polygon points={poly(mirror(bead))} className="draw" pathLength={1} />
        <polygon points={poly(f.innerWall)} className="draw" pathLength={1} />
        <polygon points={poly(mirror(f.innerWall))} className="draw" pathLength={1} />
        <polygon points={poly(lower)} className="draw" pathLength={1} />
        <polygon points={poly(mirror(lower))} className="draw" pathLength={1} />
        <polygon points={poly(rect(f.flange.x0, mx(f.flange.x0), f.flange.y0, f.flange.y1))} className="draw" pathLength={1} />
        <polygon points={poly(rect(f.ring16.x0, mx(f.ring16.x0), f.ring16.y0, f.ring16.y1))} className="draw" pathLength={1} />
        {/* gasket wedges */}
        <polygon points={poly(f.gasket)} className="draw" pathLength={1} />
        <polygon points={poly(mirror(f.gasket))} className="draw" pathLength={1} />
      </g>
      <g {...thin} className="draw">
        {/* lips of the retaining band */}
        {f.lips.map((l, i) => (
          <g key={i}>
            <polyline points={poly([[f.bead.xo, l.y0], [l.x, l.y0], [l.x, l.y1], [f.bead.xo, l.y1]])} pathLength={1} />
            <polyline points={poly(mirror([[f.bead.xo, l.y0], [l.x, l.y0], [l.x, l.y1], [f.bead.xo, l.y1]]))} pathLength={1} />
          </g>
        ))}
        {/* break lines at the pipe ends */}
        <polyline points={breakLine(f.pipe1.top, f.pipe1.xo, mx(f.pipe1.xo))} pathLength={1} />
        <polyline points={breakLine(f.pipe2.bottom, f.pipe2.xo, mx(f.pipe2.xo))} pathLength={1} />
        {/* pipe bores: the inner wall lines continue through the sleeve */}
        <line x1={f.pipe1.xi} y1={f.pipe1.bottom} x2={f.pipe1.xi} y2={376} pathLength={1} />
        <line x1={mx(f.pipe1.xi)} y1={f.pipe1.bottom} x2={mx(f.pipe1.xi)} y2={376} pathLength={1} />
        <line x1={f.pipe1.xo} y1={376} x2={f.pipe1.xi} y2={376} pathLength={1} />
        <line x1={mx(f.pipe1.xi)} y1={376} x2={mx(f.pipe1.xo)} y2={376} pathLength={1} />
      </g>
      <g {...thin} strokeDasharray="10 6" className="fade">
        {/* hidden edges of the retaining band behind the section */}
        <line x1={f.pipe2.xi + 10} y1={560} x2={mx(f.pipe2.xi + 10)} y2={560} />
        <line x1={f.pipe2.xi + 10} y1={670} x2={mx(f.pipe2.xi + 10)} y2={670} />
      </g>
      <g fill={ink} fontSize="18" fontWeight="500" style={sans} className="fade">
        <text x={392} y={830}>FIG. 2</text>
        <text x={1140} y={1010}>FIG. 1</text>
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
        <line x1={rd(x1)} y1={ext[0]} x2={rd(x1)} y2={ext[1]} pathLength={1} />
        <line x1={rd(x2)} y1={ext[0]} x2={rd(x2)} y2={ext[1]} pathLength={1} />
        <line x1={rd(x1)} y1={y + 0.5} x2={rd(x2)} y2={y + 0.5} pathLength={1} />
      </g>
      <g className="fade">
        <Arrow x={x1} y={y + 0.5} deg={180} />
        <Arrow x={x2} y={y + 0.5} deg={0} />
        <text x={rd((x1 + x2) / 2)} y={above ? y - 7 : y + 18} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>{label}</text>
      </g>
    </g>
  );
}
function VDim({ y1, y2, x, ext, label, left = true, anchor = false }: { y1: number; y2: number; x: number; ext: [number, number]; label: string; left?: boolean; anchor?: boolean }) {
  const tx = left ? x - 7 : x + 7;
  const ty = rd((y1 + y2) / 2);
  return (
    <g>
      <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw">
        <line x1={ext[0]} y1={y1} x2={ext[1]} y2={y1} pathLength={1} />
        <line x1={ext[0]} y1={y2} x2={ext[1]} y2={y2} pathLength={1} />
        <line x1={x + 0.5} y1={y1} x2={x + 0.5} y2={y2} pathLength={1} data-anchor={anchor ? "" : undefined} data-bracket={anchor ? "right" : undefined} />
      </g>
      <g className="fade">
        <Arrow x={x + 0.5} y={y1} deg={-90} />
        <Arrow x={x + 0.5} y={y2} deg={90} />
        <text x={tx} y={ty} textAnchor="middle" fill={dimInk} fontSize="15" style={mono} transform={`rotate(-90 ${tx} ${ty})`}>{label}</text>
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
  const f = F1;
  const wedgeDeg = Math.round((Math.atan2(f.gasket[2][0] - f.gasket[1][0], f.gasket[2][1] - f.gasket[1][1]) * 180) / Math.PI * 10) / 10; // measured taper of the gasket wedge
  const ang = { cx: f.gasket[1][0], cy: f.gasket[1][1], r: 90 };
  const a1 = ((90 - wedgeDeg) * Math.PI) / 180;
  const arcEnd: [number, number] = [rd(ang.cx + ang.r * Math.cos(a1)), rd(ang.cy + ang.r * Math.sin(a1))];
  return (
    <g data-plane="dimensions">
      <Hit x={880} y={96} w={640} h={40} />
      <Hit x={800} y={968} w={760} h={80} />
      <Hit x={1568} y={300} w={50} h={460} />
      <Hit x={770} y={520} w={50} h={170} />
      <Hit x={90} y={80} w={600} h={40} />
      <Hit x={640} y={140} w={160} h={60} />
      <Hit x={600} y={700} w={200} h={60} />
      <Hit x={950} y={380} w={130} h={110} />
      {/* Fig. 1 */}
      <HDim x1={f.pipe1.xo} x2={mx(f.pipe1.xo)} y={118} ext={[146, 110]} label="108" />
      <HDim x1={f.bead.xo} x2={mx(f.bead.xo)} y={1000} ext={[672, 1008]} label="145.4" above={false} />
      <HDim x1={f.pipe2.xo} x2={mx(f.pipe2.xo)} y={1030} ext={[962, 1038]} label="105" above={false} />
      <VDim y1={f.topBand.y0} y2={f.flange.y1} x={1590} ext={[1560, 1598]} label="84" left={false} anchor />
      <VDim y1={f.bead.y0} y2={f.bead.y1} x={796} ext={[824, 788]} label="28" />
      <Leader from={[f.wall.xo + 18, 400]} via={[760, 300]} to={[720, 300]} label="7.2" anchor="end" />
      <Leader from={[f.flange.x0 + 30, f.flange.y1]} via={[820, 790]} to={[780, 790]} label="3.2" anchor="end" />
      {/* Fig. 2 */}
      <HDim x1={RING.cx - RING.od} x2={RING.cx + RING.od} y={96} ext={[RING.cy - RING.od + 2, 88]} label="Ø127.2" />
      <Leader from={[rd(RING.cx + RING.bore * Math.cos(-0.6)), rd(RING.cy + RING.bore * Math.sin(-0.6))]} via={[720, 170]} to={[760, 170]} label="Ø97.2 H9" />
      <Leader from={[rd(RING.cx + RING.seatOut * Math.cos(0.7)), rd(RING.cy + RING.seatOut * Math.sin(0.7))]} via={[700, 740]} to={[740, 740]} label="Ø112.8" />
      {/* angular: the gasket wedge taper */}
      <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw">
        <line x1={ang.cx} y1={ang.cy} x2={ang.cx} y2={ang.cy + 110} pathLength={1} />
        <path d={`M${ang.cx} ${ang.cy + ang.r} A${ang.r} ${ang.r} 0 0 0 ${arcEnd[0]} ${arcEnd[1]}`} pathLength={1} />
      </g>
      <g className="fade">
        <Arrow x={ang.cx} y={ang.cy + ang.r} deg={0} />
        <Arrow x={arcEnd[0]} y={arcEnd[1]} deg={rd(90 - wedgeDeg + 180)} />
        <text x={ang.cx + 14} y={ang.cy + 128} fill={dimInk} fontSize="15" style={mono}>{`${wedgeDeg}°`}</text>
      </g>
      {/* GD&T: concentricity of the ring bore to the outside diameter, datum A */}
      <g className="fade">
        <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke">
          <rect x={200} y={840} width={150} height={26} />
          <line x1={232} y1={840} x2={232} y2={866} />
          <line x1={312} y1={840} x2={312} y2={866} />
          <circle cx={216} cy={853} r={7} />
          <circle cx={216} cy={853} r={3.5} />
          <rect x={RING.cx + RING.od + 14} y={RING.cy + 120} width={26} height={24} />
          <polygon points={`${RING.cx + RING.od + 27},${RING.cy + 98} ${RING.cx + RING.od + 21},${RING.cy + 120} ${RING.cx + RING.od + 33},${RING.cy + 120}`} fill={dimInk} />
        </g>
        <text x={272} y={859} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>0.05</text>
        <text x={331} y={859} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>A</text>
        <text x={RING.cx + RING.od + 27} y={RING.cy + 138} textAnchor="middle" fill={dimInk} fontSize="15" style={mono}>A</text>
      </g>
    </g>
  );
}

/* ---------------------------------------------------------- tables & notes */
function Cell({ x, y, w, h, text, align = "start", muted = false, monoFace = true, size = 13 }: { x: number; y: number; w: number; h: number; text: string; align?: "start" | "middle" | "end"; muted?: boolean; monoFace?: boolean; size?: number }) {
  const tx = align === "start" ? x + 8 : align === "end" ? x + w - 8 : x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <text x={tx} y={rd(y + h / 2 + 4.5)} textAnchor={align} fill={muted ? dimInk : ink} fontSize={size} style={monoFace ? mono : sans} className="fade">{text}</text>
    </>
  );
}

export const VARIANTS: [string, string, string, string][] = [
  ["S1", "97.2", "108", "84"],
  ["S2", "108.0", "121", "90"],
  ["S3", "127.2", "142", "96"],
];

function TablesNotes() {
  const x0 = 60;
  const y0 = 1042;
  const rowH = 24;
  const cols = [
    { w: 60, h: "Size", a: "middle" as const },
    { w: 90, h: "d", a: "middle" as const },
    { w: 90, h: "D", a: "middle" as const },
    { w: 80, h: "L", a: "middle" as const },
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  return (
    <g data-plane="tables-notes">
      <Hit x={50} y={1014} w={340} h={140} />
      <Hit x={440} y={1014} w={520} h={140} />
      <text x={x0} y={y0 - 10} fill={dimInk} fontSize="12" style={sans} className="fade">Variant table</text>
      {(() => { let cx = x0; return cols.map((c, i) => { const el = <Cell key={`h${i}`} x={cx} y={y0} w={c.w} h={rowH} text={c.h} align={c.a} muted />; cx += c.w; return el; }); })()}
      {VARIANTS.map((row, ri) => { let cx = x0; return cols.map((c, ci) => { const el = <Cell key={`${ri}-${ci}`} x={cx} y={y0 + rowH * (ri + 1)} w={c.w} h={rowH} text={row[ci]} align={c.a} />; cx += c.w; return el; }); })}
      <rect x={x0} y={y0} width={totalW} height={rowH * (VARIANTS.length + 1)} stroke={ink} strokeWidth="1.25" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      {/* what the explainer's bracket measures: the table and the notes together */}
      <rect x={x0} y={y0 - 16} width={900} height={rowH * (VARIANTS.length + 1) + 16} fill="none" stroke="none" data-anchor data-bracket="below" />
      <g style={sans} className="fade">
        <text x={460} y={y0 - 10} fill={dimInk} fontSize="12">Notes</text>
        {["1. Break all sharp edges 0.5 max.", "2. Ring 13 seated dry; sleeve drawn up to 40 N·m.", "3. Ra 3.2 unless stated; bore Ø97.2 H9 Ra 1.6."].map((t, i) => (
          <text key={i} x={460} y={y0 + 17 + i * 22} fill={ink} fontSize="13">{t}</text>
        ))}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------ title block */
function TCell({ x, y, w, h, label, value, monoFace = true }: { x: number; y: number; w: number; h: number; label: string; value: string; monoFace?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <text x={x + 8} y={y + 13} fill={dimInk} fontSize="9.5" style={sans} className="fade">{label}</text>
      <text x={x + 8} y={y + h - 10} fill={ink} fontSize={monoFace ? 13 : 13.5} style={monoFace ? mono : sans} className="fade">{value}</text>
    </g>
  );
}

function TitleBlock() {
  const x0 = 1260;
  const y0 = 1030;
  const w = 520;
  const q = w / 4;
  const r1 = 48;
  const r2 = 44;
  const r3 = 44;
  return (
    <g data-plane="title-block">
      <Hit x={x0 - 10} y={y0 - 10} w={w + 20} h={r1 + r2 + r3 + 20} />
      <rect x={x0} y={y0} width={w} height={r1 + r2 + r3} stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} data-anchor data-bracket="above" />
      {/* company and address, redacted at the text's own size */}
      <rect x={x0} y={y0} width={q * 2} height={r1} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <g fill={hair} className="fade">
        <rect x={x0 + 12} y={y0 + 12} width={150} height={13} />
        <rect x={x0 + 12} y={y0 + 30} width={190} height={8} />
      </g>
      <TCell x={x0 + q * 2} y={y0} w={q * 2} h={r1} label="Title" value="Pipe coupling, sealing ring" monoFace={false} />
      <TCell x={x0} y={y0 + r1} w={q} h={r2} label="Drawing no." value="DRG-4120" />
      <TCell x={x0 + q} y={y0 + r1} w={q} h={r2} label="Rev" value="R2" />
      <TCell x={x0 + q * 2} y={y0 + r1} w={q} h={r2} label="Scale" value="1:1" />
      <TCell x={x0 + q * 3} y={y0 + r1} w={q} h={r2} label="Sheet" value="1/1" />
      <TCell x={x0} y={y0 + r1 + r2} w={q} h={r3} label="Drawn" value="R.K." />
      <TCell x={x0 + q} y={y0 + r1 + r2} w={q} h={r3} label="Date" value="2026-09-17" />
      <TCell x={x0 + q * 2} y={y0 + r1 + r2} w={q} h={r3} label="Checked" value="S.M." />
      <TCell x={x0 + q * 3} y={y0 + r1 + r2} w={q} h={r3} label="Source" value="US 2,529,098" />
    </g>
  );
}
