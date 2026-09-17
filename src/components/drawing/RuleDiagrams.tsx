import type { CSSProperties } from "react";

/**
 * Five small figures, one per verification rule: not the whole sheet, just
 * the feature the rule looks at. Same linework as the sheets: vx-100 strokes
 * on vx-800, vx-600 hairlines, vx-400 dimension text, 1px non-scaling.
 * viewBox 600 × 360.
 */

export type RuleId = "number" | "rows" | "placeholder" | "holes" | "chain";

const ink = "var(--color-vx-100)";
const dim = "var(--color-vx-400)";
const hair = "var(--color-vx-600)";
const mono: CSSProperties = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" };
const sans: CSSProperties = { fontFamily: "var(--font-sans)" };
const st = (color = ink, w = 1) => ({ stroke: color, strokeWidth: w, vectorEffect: "non-scaling-stroke" as const, fill: "none" });
const rd = (n: number) => Math.round(n * 100) / 100;

function Arrow({ x, y, deg, size = 10 }: { x: number; y: number; deg: number; size?: number }) {
  const a = (deg * Math.PI) / 180;
  const bx = x - size * Math.cos(a), by = y - size * Math.sin(a), w = size * 0.27;
  const px = -Math.sin(a) * w, py = Math.cos(a) * w;
  return <polygon points={`${rd(x)},${rd(y)} ${rd(bx + px)},${rd(by + py)} ${rd(bx - px)},${rd(by - py)}`} fill={dim} />;
}

function Cell({ x, y, w, h, label, value, lit = false, monoFace = true }: { x: number; y: number; w: number; h: number; label: string; value: string; lit?: boolean; monoFace?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} {...st(lit ? ink : hair, lit ? 1.5 : 1)} />
      <text x={x + 10} y={y + 18} fill={dim} fontSize="12" style={sans}>{label}</text>
      <text x={x + 10} y={y + h - 14} fill={lit ? ink : dim} fontSize="18" style={monoFace ? mono : sans}>{value}</text>
    </g>
  );
}

const figures: Record<RuleId, React.ReactNode> = {
  number: (
    <g>
      {/* three title-block cells; the drawing-number cell is the one the rule reads */}
      <Cell x={60} y={110} w={200} h={64} label="Drawing no." value="DRG-4120" lit />
      <Cell x={260} y={110} w={120} h={64} label="Rev" value="R2" />
      <Cell x={380} y={110} w={160} h={64} label="Sheet" value="1/1" />
      {/* the archive's record, and the match */}
      <g {...st(hair)}>
        <line x1={160} y1={174} x2={160} y2={230} strokeDasharray="4 4" />
      </g>
      <rect x={60} y={230} width={300} height={56} {...st(hair)} />
      <text x={70} y={248} fill={dim} fontSize="12" style={sans}>Archive index</text>
      <text x={70} y={274} fill={ink} fontSize="18" style={mono}>DRG-4120</text>
      <text x={380} y={266} fill={ink} fontSize="14" style={mono}>= checked</text>
    </g>
  ),
  rows: (
    <g>
      {[["S1", "97.2", "108", "84"], ["S2", "108.0", "121", "90"], ["S3", "127.2", "142", "96"]].map((row, ri) => {
        const y = 96 + ri * 56;
        const lit = ri === 0;
        return (
          <g key={row[0]}>
            <rect x={80} y={y} width={440} height={56} {...st(lit ? ink : hair, lit ? 1.5 : 1)} />
            {[80, 190, 300, 410].slice(1).map((x) => <line key={x} x1={x} y1={y} x2={x} y2={y + 56} {...st(hair)} />)}
            {row.map((v, ci) => (
              <text key={ci} x={[135, 245, 355, 465][ci]} y={y + 34} textAnchor="middle" fill={lit ? ink : dim} fontSize="18" style={mono}>{v}</text>
            ))}
            {lit && <polygon points={`${52},${y + 20} ${68},${y + 28} ${52},${y + 36}`} fill={ink} />}
          </g>
        );
      })}
      <text x={80} y={76} fill={dim} fontSize="12" style={sans}>Variant table · the indicator names the row in force</text>
    </g>
  ),
  placeholder: (
    <g>
      {/* a bore dimension whose value reads from the table */}
      <g {...st(ink, 1.5)}>
        <line x1={120} y1={120} x2={120} y2={260} />
        <line x1={380} y1={120} x2={380} y2={260} />
      </g>
      <g {...st(dim)}>
        <line x1={120} y1={100} x2={120} y2={80} />
        <line x1={380} y1={100} x2={380} y2={80} />
        <line x1={120} y1={86.5} x2={380} y2={86.5} />
        <line x1={100} y1={190} x2={400} y2={190} strokeDasharray="22 5 4 5" />
      </g>
      <Arrow x={120} y={86.5} deg={180} />
      <Arrow x={380} y={86.5} deg={0} />
      <text x={250} y={78} textAnchor="middle" fill={ink} fontSize="18" style={mono}>Ø97.2 H9</text>
      <text x={250} y={58} textAnchor="middle" fill={dim} fontSize="12" style={mono}>was Ø{"{d}"} H9</text>
      {/* where the value came from */}
      <rect x={430} y={150} width={120} height={56} {...st(ink, 1.5)} />
      <text x={440} y={168} fill={dim} fontSize="12" style={sans}>row S1 · d</text>
      <text x={440} y={194} fill={ink} fontSize="18" style={mono}>97.2</text>
      <polyline points="430,178 400,178 380,86.5" {...st(dim)} />
    </g>
  ),
  holes: (
    <g>
      {/* a flange face: eight holes on a PCD, and the parts list that should count them */}
      <g {...st(ink, 1.5)}>
        <circle cx={190} cy={190} r={120} />
        <circle cx={190} cy={190} r={40} />
      </g>
      <circle cx={190} cy={190} r={92} {...st(dim)} strokeDasharray="14 6" />
      <g {...st(dim)} strokeDasharray="22 5 4 5">
        <line x1={50} y1={190} x2={330} y2={190} />
        <line x1={190} y1={50} x2={190} y2={330} />
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + Math.PI / 8;
        return <circle key={i} cx={rd(190 + 92 * Math.cos(a))} cy={rd(190 + 92 * Math.sin(a))} r={9} {...st(ink, 1.5)} />;
      })}
      <text x={400} y={120} fill={dim} fontSize="12" style={sans}>On the sheet</text>
      <text x={400} y={146} fill={ink} fontSize="18" style={mono}>8 × Ø9</text>
      <text x={400} y={200} fill={dim} fontSize="12" style={sans}>Parts list</text>
      <text x={400} y={226} fill={dim} fontSize="18" style={mono}>—</text>
      <text x={400} y={272} fill={dim} fontSize="14" style={mono}>advisory</text>
    </g>
  ),
  chain: (
    <g>
      {/* a closed chain: four parts summing to the overall */}
      {(() => {
        const x0 = 70;
        const parts = [24, 28, 16, 16];
        const total = 84;
        const sc = 460 / total;
        let x = x0;
        const els: React.ReactNode[] = [];
        parts.forEach((p, i) => {
          const x1 = x, x2 = x + p * sc;
          els.push(
            <g key={i}>
              <line x1={rd(x1)} y1={180} x2={rd(x1)} y2={250} {...st(ink, 1.5)} />
              <line x1={rd(x1)} y1={250.5} x2={rd(x2)} y2={250.5} {...st(dim)} />
              <Arrow x={x1} y={250.5} deg={180} />
              <Arrow x={x2} y={250.5} deg={0} />
              <text x={rd((x1 + x2) / 2)} y={274} textAnchor="middle" fill={dim} fontSize="16" style={mono}>{p}</text>
            </g>,
          );
          x = x2;
        });
        els.push(<line key="last" x1={rd(x)} y1={180} x2={rd(x)} y2={250} {...st(ink, 1.5)} />);
        els.push(
          <g key="overall">
            <line x1={x0} y1={120} x2={x0} y2={170} {...st(dim)} />
            <line x1={rd(x)} y1={120} x2={rd(x)} y2={170} {...st(dim)} />
            <line x1={x0} y1={126.5} x2={rd(x)} y2={126.5} {...st(dim)} />
            <Arrow x={x0} y={126.5} deg={180} />
            <Arrow x={x} y={126.5} deg={0} />
            <text x={rd((x0 + x) / 2)} y={116} textAnchor="middle" fill={ink} fontSize="18" style={mono}>84</text>
          </g>,
        );
        return els;
      })()}
      <text x={70} y={320} fill={dim} fontSize="14" style={mono}>24 + 28 + 16 + 16 = 84 · closes</text>
    </g>
  ),
};

export function RuleDiagram({ id, className = "" }: { id: RuleId; className?: string }) {
  return (
    <svg viewBox="0 0 600 360" className={`block h-full w-full ${className}`} role="img" aria-label={`What the rule checks: ${id}`}>
      {figures[id]}
    </svg>
  );
}
