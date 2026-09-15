import type { CSSProperties } from "react";

/**
 * A flanged bearing housing, drawn as an engineering sheet.
 * Five planes, each its own <g data-plane>, so the hero can separate them
 * and the Make scene can address parts of the drawing.
 *
 * Linework is vx-100, dimension text vx-400, hairlines vx-600.
 * Title block is anonymised by design: identifying text is replaced by solid
 * vx-600 bars at the text's own size, references by neutral mono placeholders.
 */

export type Plane = "border" | "geometry" | "dimensions" | "tables" | "titleblock";
export const ALL_PLANES: Plane[] = ["border", "geometry", "dimensions", "tables", "titleblock"];

export const PLANE_LABELS: Record<Plane, string> = {
  border: "Border and zones",
  geometry: "Geometry",
  dimensions: "Dimension chains",
  tables: "Tables and notes",
  titleblock: "Title block",
};

export type VariantRow = { size: string; a: string; b: string; d: string; n: string };
export const VARIANT_ROWS: VariantRow[] = [
  { size: "S1", a: "140", b: "115", d: "25.40", n: "4" },
  { size: "S2", a: "160", b: "130", d: "31.77", n: "6" },
  { size: "S3", a: "180", b: "148", d: "35.00", n: "6" },
  { size: "S4", a: "200", b: "165", d: "38.10", n: "8" },
  { size: "S5", a: "225", b: "185", d: "44.45", n: "8" },
];

export const SHEET_W = 1400;
export const SHEET_H = 990;

const C = { x: 430, y: 470 }; // front view centre
const R_OUT = 200;
const R_HUB = 90;
const R_BORE = 40;
const R_PCD = 162;
const R_HOLE = 11;

const ink = "var(--color-vx-100)";
const dimInk = "var(--color-vx-400)";
const hair = "var(--color-vx-600)";

const monoStyle: CSSProperties = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" };
const sansStyle: CSSProperties = { fontFamily: "var(--font-sans)" };

type Props = {
  planes?: Plane[];
  row?: number; // index into VARIANT_ROWS whose values the dimensions show
  prevRow?: number; // if set, the previous row's values are also rendered (hidden) for crossfades
  checkedBy?: string;
  watermark?: boolean;
  className?: string;
  id?: string;
  label?: string;
  drawingNo?: string;
  decorative?: boolean;
};

export function Sheet({
  planes = ALL_PLANES,
  row = 1,
  prevRow,
  checkedBy = "",
  watermark = false,
  className = "",
  id = "sheet",
  label = "Engineering drawing of a flanged bearing housing, front view and section A–A, with variant table and anonymised title block",
  drawingNo = "EEI-3057",
  decorative = false,
}: Props) {
  const has = (p: Plane) => planes.includes(p);
  const v = VARIANT_ROWS[row];
  const hatchId = `${id}-hatch`;

  return (
    <svg
      viewBox={`0 0 ${SHEET_W} ${SHEET_H}`}
      className={`sheet-svg ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      fill="none"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      <defs>
        <pattern id={hatchId} patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke={ink} strokeWidth="0.8" opacity="0.5" />
        </pattern>
      </defs>

      {has("border") && <Border />}
      {has("geometry") && <Geometry hatchId={hatchId} />}
      {has("dimensions") && <Dimensions v={v} prev={prevRow !== undefined ? VARIANT_ROWS[prevRow] : undefined} />}
      {has("tables") && <Tables activeRow={row} />}
      {has("titleblock") && <TitleBlock checkedBy={checkedBy} drawingNo={drawingNo} />}
      {watermark && (
        <g data-watermark>
          <text
            x={700}
            y={520}
            textAnchor="middle"
            fill={dimInk}
            opacity="0.32"
            fontSize="46"
            fontWeight="500"
            transform="rotate(-18 700 520)"
            style={sansStyle}
          >
            GENERATED — NOT APPROVED
          </text>
        </g>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- border */

function Border() {
  const cols = 8;
  const rows = 6;
  const iw = SHEET_W - 60;
  const ih = SHEET_H - 60;
  const cw = iw / cols;
  const rh = ih / rows;
  return (
    <g data-plane="border">
      <rect x="0" y="0" width={SHEET_W} height={SHEET_H} fill="var(--color-vx-800)" data-paper />
      <rect x="10.5" y="10.5" width={SHEET_W - 21} height={SHEET_H - 21} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <rect x="30" y="30" width={iw} height={ih} stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} data-anchor />
      {/* zone ticks and references */}
      <g stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="fade">
        {Array.from({ length: cols - 1 }, (_, i) => {
          const x = 30 + cw * (i + 1);
          return (
            <g key={`c${i}`}>
              <line x1={x} y1="10" x2={x} y2="30" />
              <line x1={x} y1={SHEET_H - 30} x2={x} y2={SHEET_H - 10} />
            </g>
          );
        })}
        {Array.from({ length: rows - 1 }, (_, i) => {
          const y = 30 + rh * (i + 1);
          return (
            <g key={`r${i}`}>
              <line x1="10" y1={y} x2="30" y2={y} />
              <line x1={SHEET_W - 30} y1={y} x2={SHEET_W - 10} y2={y} />
            </g>
          );
        })}
      </g>
      <g fill={dimInk} fontSize="10" style={monoStyle} className="fade">
        {Array.from({ length: cols }, (_, i) => (
          <text key={`cn${i}`} x={30 + cw * i + cw / 2} y="23.5" textAnchor="middle">
            {i + 1}
          </text>
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <text key={`rn${i}`} x="20" y={30 + rh * i + rh / 2 + 3.5} textAnchor="middle">
            {"ABCDEF"[i]}
          </text>
        ))}
      </g>
      {/* centring marks */}
      <g stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="fade">
        <line x1={SHEET_W / 2} y1="10" x2={SHEET_W / 2} y2="40" />
        <line x1={SHEET_W / 2} y1={SHEET_H - 40} x2={SHEET_W / 2} y2={SHEET_H - 10} />
        <line x1="10" y1={SHEET_H / 2} x2="40" y2={SHEET_H / 2} />
        <line x1={SHEET_W - 40} y1={SHEET_H / 2} x2={SHEET_W - 10} y2={SHEET_H / 2} />
      </g>
    </g>
  );
}

/* -------------------------------------------------------------- geometry */

function Geometry({ hatchId }: { hatchId: string }) {
  const holes = [-90, -30, 30, 90, 150, 210].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: C.x + R_PCD * Math.cos(a), y: C.y + R_PCD * Math.sin(a) };
  });
  const dashdot = "22 5 4 5";
  return (
    <g data-plane="geometry">
      {/* centrelines */}
      <g stroke={dimInk} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray={dashdot} className="fade">
        <line x1={C.x - 225} y1={C.y} x2={C.x + 225} y2={C.y} />
        <line x1={C.x} y1={C.y - 225} x2={C.x} y2={C.y + 225} />
        <circle cx={C.x} cy={C.y} r={R_PCD} />
        <line x1="850" y1={C.y} x2="1012" y2={C.y} />
        {holes.map((h, i) => (
          <g key={i} strokeDasharray="none">
            <line x1={h.x - 17} y1={h.y} x2={h.x + 17} y2={h.y} />
            <line x1={h.x} y1={h.y - 17} x2={h.x} y2={h.y + 17} />
          </g>
        ))}
      </g>

      {/* front view */}
      <g stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke">
        <circle cx={C.x} cy={C.y} r={R_OUT} className="draw" pathLength={1} data-anchor />
        <circle cx={C.x} cy={C.y} r={R_HUB} className="draw" pathLength={1} />
        <circle cx={C.x} cy={C.y} r={R_BORE} className="draw" pathLength={1} />
        {holes.map((h, i) => (
          <circle key={i} cx={h.x} cy={h.y} r={R_HOLE} className="draw" pathLength={1} />
        ))}
      </g>
      {/* chamfer on the bore: thin circle */}
      <circle cx={C.x} cy={C.y} r={R_BORE + 4} stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />

      {/* cutting plane A–A */}
      <g stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="draw">
        <line x1={C.x} y1={C.y - 262} x2={C.x} y2={C.y - 236} pathLength={1} />
        <line x1={C.x} y1={C.y + 236} x2={C.x} y2={C.y + 262} pathLength={1} />
        <line x1={C.x} y1={C.y - 262} x2={C.x + 26} y2={C.y - 262} pathLength={1} />
        <line x1={C.x} y1={C.y + 262} x2={C.x + 26} y2={C.y + 262} pathLength={1} />
      </g>
      <g fill={ink} className="fade">
        <Arrow x={C.x + 30} y={C.y - 262} deg={0} />
        <Arrow x={C.x + 30} y={C.y + 262} deg={0} />
      </g>
      <g fill={ink} fontSize="16" fontWeight="500" style={sansStyle} className="fade">
        <text x={C.x + 40} y={C.y - 256}>A</text>
        <text x={C.x + 40} y={C.y + 268}>A</text>
        <text x="930" y="246" textAnchor="middle">
          A–A
        </text>
      </g>

      {/* section A–A: two cut regions above and below the bore, holes on the cut plane */}
      <g stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill={`url(#${hatchId})`}>
        <path d="M870 270H925V297H870Z" className="draw" pathLength={1} />
        <path d="M870 319H925V380H990V430H870Z" className="draw" pathLength={1} />
        <path d="M870 670H925V643H870Z" className="draw" pathLength={1} />
        <path d="M870 621H925V560H990V510H870Z" className="draw" pathLength={1} />
      </g>
      {/* bore chamfer in section */}
      <g stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw">
        <line x1="870" y1="430" x2="874" y2="426" pathLength={1} />
        <line x1="870" y1="510" x2="874" y2="514" pathLength={1} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------ dimensions */

function Arrow({ x, y, deg, size = 10 }: { x: number; y: number; deg: number; size?: number }) {
  // Filled arrowhead with its tip at (x, y), pointing in direction `deg`.
  const a = (deg * Math.PI) / 180;
  const bx = x - size * Math.cos(a);
  const by = y - size * Math.sin(a);
  const w = size * 0.27;
  const px = -Math.sin(a) * w;
  const py = Math.cos(a) * w;
  return <polygon points={`${x},${y} ${bx + px},${by + py} ${bx - px},${by - py}`} />;
}

function DimText({
  x,
  y,
  children,
  rotate,
  anchor = "middle",
  name,
  prev,
}: {
  x: number;
  y: number;
  children: string;
  rotate?: number;
  anchor?: "start" | "middle" | "end";
  name?: string;
  prev?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={dimInk}
      fontSize="13"
      style={monoStyle}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      data-dim={prev ? undefined : name}
      data-dim-prev={prev ? name : undefined}
    >
      {children}
    </text>
  );
}

function Dimensions({ v, prev }: { v: VariantRow; prev?: VariantRow }) {
  const thin = { stroke: dimInk, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  const leaderFrom = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a) };
  };
  const pcd = leaderFrom(-120, R_PCD);
  const holeA = (-30 * Math.PI) / 180;
  const holeC = { x: C.x + R_PCD * Math.cos(holeA), y: C.y + R_PCD * Math.sin(holeA) };
  const hole = { x: holeC.x + R_HOLE * Math.cos(-Math.PI / 4), y: holeC.y + R_HOLE * Math.sin(-Math.PI / 4) };
  const arcR = 228;
  const a0 = leaderFrom(-90, arcR);
  const a1 = leaderFrom(-30, arcR);

  return (
    <g data-plane="dimensions">
      {/* extension lines */}
      <g {...thin} className="draw">
        {/* 22 flange thickness */}
        <line x1="870" y1="676" x2="870" y2="714" pathLength={1} />
        <line x1="925" y1="676" x2="925" y2="714" pathLength={1} />
        {/* 48 overall */}
        <line x1="870" y1="718" x2="870" y2="744" pathLength={1} />
        <line x1="990" y1="566" x2="990" y2="744" pathLength={1} />
        {/* Ø160 */}
        <line x1="864" y1="270" x2="826" y2="270" pathLength={1} />
        <line x1="864" y1="670" x2="826" y2="670" pathLength={1} />
        {/* Ø72 hub */}
        <line x1="996" y1="380" x2="1034" y2="380" pathLength={1} />
        <line x1="996" y1="560" x2="1034" y2="560" pathLength={1} />
        {/* bore */}
        <line x1="996" y1="430" x2="1072" y2="430" pathLength={1} />
        <line x1="996" y1="510" x2="1072" y2="510" pathLength={1} />
        {/* angular */}
        <line x1={leaderFrom(-90, 206).x} y1={leaderFrom(-90, 206).y} x2={leaderFrom(-90, 236).x} y2={leaderFrom(-90, 236).y} pathLength={1} />
        <line x1={leaderFrom(-30, 206).x} y1={leaderFrom(-30, 206).y} x2={leaderFrom(-30, 236).x} y2={leaderFrom(-30, 236).y} pathLength={1} />
      </g>

      {/* dimension lines */}
      <g {...thin} className="draw">
        <line x1="870" y1="706.5" x2="925" y2="706.5" pathLength={1} />
        <line x1="870" y1="736.5" x2="990" y2="736.5" pathLength={1} />
        <line x1="834.5" y1="270" x2="834.5" y2="670" pathLength={1} data-anchor />
        <line x1="1026.5" y1="380" x2="1026.5" y2="560" pathLength={1} />
        <line x1="1064.5" y1="430" x2="1064.5" y2="510" pathLength={1} />
        <path d={`M${a0.x} ${a0.y} A${arcR} ${arcR} 0 0 1 ${a1.x} ${a1.y}`} pathLength={1} />
        {/* leaders */}
        <polyline points={`${pcd.x},${pcd.y} 290,268 214,268`} pathLength={1} />
        <polyline points={`${hole.x},${hole.y} 648,318 700,318`} pathLength={1} />
      </g>

      {/* arrowheads */}
      <g fill={dimInk} className="fade">
        <Arrow x={870} y={706.5} deg={180} />
        <Arrow x={925} y={706.5} deg={0} />
        <Arrow x={870} y={736.5} deg={180} />
        <Arrow x={990} y={736.5} deg={0} />
        <Arrow x={834.5} y={270} deg={-90} />
        <Arrow x={834.5} y={670} deg={90} />
        <Arrow x={1026.5} y={380} deg={-90} />
        <Arrow x={1026.5} y={560} deg={90} />
        <Arrow x={1064.5} y={430} deg={-90} />
        <Arrow x={1064.5} y={510} deg={90} />
        <Arrow x={a0.x} y={a0.y} deg={180} />
        <Arrow x={a1.x} y={a1.y} deg={60} />
        <Arrow x={pcd.x} y={pcd.y} deg={135} />
        <Arrow x={hole.x} y={hole.y} deg={135} />
      </g>

      {/* values */}
      <g className="fade" data-dim-current-group>
        <DimText x={897.5} y={701}>22</DimText>
        <DimText x={930} y={731}>48</DimText>
        <DimText x={829} y={470} rotate={-90} name="od">{`Ø${v.a}`}</DimText>
        <DimText x={1021} y={470} rotate={-90}>Ø72</DimText>
        <DimText x={1059} y={470} rotate={-90} name="bore">{`Ø${v.d} H7`}</DimText>
        <DimText x={leaderFrom(-60, 246).x} y={leaderFrom(-60, 246).y + 4}>60°</DimText>
        <DimText x={208} y={272} anchor="end" name="pcd">{`Ø${v.b} PCD`}</DimText>
        <DimText x={706} y={322} anchor="start" name="holes">{`${v.n}× Ø9`}</DimText>
        {prev && (
          <g data-dim-prev-group opacity="0">
            <DimText x={829} y={470} rotate={-90} name="od" prev>{`Ø${prev.a}`}</DimText>
            <DimText x={1059} y={470} rotate={-90} name="bore" prev>{`Ø${prev.d} H7`}</DimText>
            <DimText x={208} y={272} anchor="end" name="pcd" prev>{`Ø${prev.b} PCD`}</DimText>
            <DimText x={706} y={322} anchor="start" name="holes" prev>{`${prev.n}× Ø9`}</DimText>
          </g>
        )}
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- tables */

function Tables({ activeRow }: { activeRow: number }) {
  const x0 = 1040;
  const y0 = 64;
  const cols = [
    { key: "size", w: 70, label: "Size" },
    { key: "a", w: 66, label: "A" },
    { key: "b", w: 66, label: "B" },
    { key: "d", w: 70, label: "d" },
    { key: "n", w: 58, label: "n" },
  ] as const;
  const rowH = 32;
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  const totalH = rowH * (VARIANT_ROWS.length + 1);
  let cx = x0;
  const colX = cols.map((c) => {
    const x = cx;
    cx += c.w;
    return x;
  });

  return (
    <g data-plane="tables">
      <text x={x0} y={y0 - 10} fill={dimInk} fontSize="11" style={sansStyle} className="fade">
        Variant table
      </text>
      <g stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw">
        <rect x={x0} y={y0} width={totalW} height={totalH} pathLength={1} data-anchor />
        {Array.from({ length: VARIANT_ROWS.length }, (_, i) => (
          <line key={i} x1={x0} y1={y0 + rowH * (i + 1)} x2={x0 + totalW} y2={y0 + rowH * (i + 1)} pathLength={1} />
        ))}
        {colX.slice(1).map((x, i) => (
          <line key={i} x1={x} y1={y0} x2={x} y2={y0 + totalH} pathLength={1} />
        ))}
      </g>
      <g fontSize="13" style={monoStyle} className="fade">
        {cols.map((c, i) => (
          <text key={c.key} x={colX[i] + c.w / 2} y={y0 + rowH / 2 + 4.5} textAnchor="middle" fill={dimInk}>
            {c.label}
          </text>
        ))}
        {VARIANT_ROWS.map((r, ri) => (
          <g key={r.size} data-row={ri}>
            {cols.map((c, ci) => (
              <text key={c.key} x={colX[ci] + c.w / 2 + (ci === 0 ? 6 : 0)} y={y0 + rowH * (ri + 1) + rowH / 2 + 4.5} textAnchor="middle" fill={ink}>
                {r[c.key]}
              </text>
            ))}
          </g>
        ))}
      </g>
      {/* active-row marker: the Make scene moves this by row height (32) */}
      <g data-row-marker transform={`translate(0 ${rowH * activeRow})`} className="fade">
        <polygon points={`${x0 + 7},${y0 + rowH + rowH / 2 - 5} ${x0 + 15},${y0 + rowH + rowH / 2} ${x0 + 7},${y0 + rowH + rowH / 2 + 5}`} fill={ink} />
      </g>

      {/* notes */}
      <g className="fade" style={sansStyle}>
        <text x="44" y="812" fill={dimInk} fontSize="11">
          Notes
        </text>
        <text x="44" y="834" fill={ink} fontSize="12">
          1. Break all sharp edges 0.5 max.
        </text>
        <text x="44" y="854" fill={ink} fontSize="12">
          2. Ra 3.2 unless stated.
        </text>
        <text x="44" y="874" fill={ink} fontSize="12">
          3. Holes equispaced on PCD.
        </text>
      </g>
    </g>
  );
}

/* ----------------------------------------------------------- title block */

function Cell({
  x,
  y,
  w,
  h,
  label,
  value,
  mono = true,
  name,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  value?: string;
  mono?: boolean;
  name?: string;
  children?: React.ReactNode;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <text x={x + 8} y={y + 13} fill={dimInk} fontSize="9" style={sansStyle} className="fade">
        {label}
      </text>
      {value !== undefined && (
        <text x={x + 8} y={y + h - 11} fill={ink} fontSize={mono ? 13 : 14} style={mono ? monoStyle : sansStyle} className="fade" data-cell={name}>
          {value}
        </text>
      )}
      {children}
    </g>
  );
}

function TitleBlock({ checkedBy, drawingNo }: { checkedBy: string; drawingNo: string }) {
  const x0 = 890;
  const y0 = 768;
  const w = 480;
  const r1 = 52;
  const r2 = 46;
  const r3 = 46;
  const r4 = 48;
  const q = w / 4;
  return (
    <g data-plane="titleblock">
      <rect x={x0} y={y0} width={w} height={r1 + r2 + r3 + r4} stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} data-anchor />

      {/* row 1: company (redacted) and title */}
      <rect x={x0} y={y0} width={q * 2} height={r1} stroke={hair} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" pathLength={1} />
      <g fill={hair} className="fade" data-redaction>
        <rect x={x0 + 12} y={y0 + 14} width={152} height={13} />
        <rect x={x0 + 12} y={y0 + 33} width={196} height={8} />
      </g>
      <Cell x={x0 + q * 2} y={y0} w={q * 2} h={r1} label="Title" value="Bearing housing, flanged" mono={false} />

      {/* row 2 */}
      <Cell x={x0} y={y0 + r1} w={q} h={r2} label="Drawing no." value={drawingNo} name="drawingNo" />
      <Cell x={x0 + q} y={y0 + r1} w={q} h={r2} label="Rev" value="B" />
      <Cell x={x0 + q * 2} y={y0 + r1} w={q} h={r2} label="Scale" value="1:2" />
      <Cell x={x0 + q * 3} y={y0 + r1} w={q} h={r2} label="Sheet" value="1/1" />

      {/* row 3 */}
      <Cell x={x0} y={y0 + r1 + r2} w={q} h={r3} label="Drawn" value="A.M.P." />
      <Cell x={x0 + q} y={y0 + r1 + r2} w={q} h={r3} label="Date" value="16.09.26" />
      <Cell x={x0 + q * 2} y={y0 + r1 + r2} w={q} h={r3} label="Checked" value={checkedBy} name="checkedBy" />
      <Cell x={x0 + q * 3} y={y0 + r1 + r2} w={q} h={r3} label="Material" value="EN-GJL-250" />

      {/* row 4: projection symbol and general tolerances */}
      <Cell x={x0} y={y0 + r1 + r2 + r3} w={q * 2} h={r4} label="Projection">
        <g stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" transform={`translate(${x0 + 78} ${y0 + r1 + r2 + r3 + 26})`}>
          <path d="M0 -8 L18 -12 L18 12 L0 8 Z" pathLength={1} />
          <circle cx="36" cy="0" r="10" pathLength={1} />
          <circle cx="36" cy="0" r="5" pathLength={1} />
        </g>
        <text x={x0 + 140} y={y0 + r1 + r2 + r3 + 30} fill={ink} fontSize="12" style={sansStyle} className="fade">
          First angle
        </text>
      </Cell>
      <Cell x={x0 + q * 2} y={y0 + r1 + r2 + r3} w={q * 2} h={r4} label="General tolerances" value="ISO 2768-mK · mm" />
    </g>
  );
}
