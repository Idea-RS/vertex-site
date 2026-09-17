/**
 * Eight small parts in the site's linework — vx-100 strokes on vx-800, 1px,
 * non-scaling — one per industry segment. Not icons: each is a plausible part
 * from that shop, drawn as a machinist would sketch it. 240 × 160 box.
 */

const s = { stroke: "var(--color-vx-100)", strokeWidth: 1.25, vectorEffect: "non-scaling-stroke" as const, fill: "none" };
const t = { stroke: "var(--color-vx-400)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none", strokeDasharray: "18 4 3 4" };

export const partIcons: Record<string, { title: string; svg: React.ReactNode }> = {
  switchgear: {
    title: "Busbar clamp",
    svg: (
      <g>
        <rect x="40" y="60" width="160" height="22" {...s} />
        <rect x="40" y="96" width="160" height="22" {...s} />
        <rect x="88" y="40" width="64" height="98" {...s} />
        <circle cx="104" cy="50" r="4" {...s} />
        <circle cx="136" cy="50" r="4" {...s} />
        <circle cx="104" cy="128" r="4" {...s} />
        <circle cx="136" cy="128" r="4" {...s} />
        <line x1="24" y1="89" x2="216" y2="89" {...t} />
      </g>
    ),
  },
  pumps: {
    title: "Volute casing",
    svg: (
      <g>
        <path d="M120 40 a44 44 0 1 1 -31 75 L52 118 L52 96 Q72 100 78 88 A44 44 0 0 1 120 40 Z" {...s} />
        <circle cx="120" cy="84" r="16" {...s} />
        <circle cx="120" cy="84" r="6" {...s} />
        <rect x="180" y="70" width="28" height="28" {...s} />
        <line x1="164" y1="84" x2="180" y2="84" {...s} />
        <line x1="96" y1="84" x2="144" y2="84" {...t} />
        <line x1="120" y1="60" x2="120" y2="108" {...t} />
      </g>
    ),
  },
  fabrication: {
    title: "Gusseted bracket",
    svg: (
      <g>
        <path d="M48 128 H196 V116 H120 L72 60 H48 Z" {...s} />
        <path d="M72 60 L120 116" {...s} />
        <path d="M60 60 L108 116" {...s} strokeDasharray="4 3" />
        <circle cx="160" cy="122" r="4" {...s} />
        <circle cx="184" cy="122" r="4" {...s} />
        <circle cx="60" cy="122" r="4" {...s} />
      </g>
    ),
  },
  foundry: {
    title: "Cast housing, section",
    svg: (
      <g>
        <path d="M44 120 V64 Q44 44 64 44 H176 Q196 44 196 64 V120 Z" {...s} />
        <path d="M60 120 V72 Q60 60 72 60 H168 Q180 60 180 72 V120" {...s} />
        <path d="M44 120 H196" {...s} />
        <path d="M48 116 L58 106 M64 116 L74 106 M80 116 L90 106 M150 116 L160 106 M166 116 L176 106 M182 116 L192 106" {...s} strokeWidth="1" />
        <circle cx="120" cy="88" r="14" {...s} />
        <line x1="100" y1="88" x2="140" y2="88" {...t} />
      </g>
    ),
  },
  auto: {
    title: "Stub axle",
    svg: (
      <g>
        <path d="M40 74 H92 V60 H132 V70 H196 V98 H132 V108 H92 V94 H40 Z" {...s} />
        <path d="M196 76 H208 V92 H196" {...s} />
        <line x1="24" y1="84" x2="216" y2="84" {...t} />
        <path d="M92 60 L92 108 M132 70 L132 98" {...s} strokeWidth="1" />
      </g>
    ),
  },
  electrical: {
    title: "Stator lamination",
    svg: (
      <g>
        <circle cx="120" cy="84" r="60" {...s} />
        <circle cx="120" cy="84" r="34" {...s} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 120 + 34 * Math.cos(a), y1 = 84 + 34 * Math.sin(a);
          const x2 = 120 + 48 * Math.cos(a), y2 = 84 + 48 * Math.sin(a);
          return <line key={i} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} {...s} />;
        })}
        <line x1="52" y1="84" x2="188" y2="84" {...t} />
        <line x1="120" y1="16" x2="120" y2="152" {...t} />
      </g>
    ),
  },
  machineTools: {
    title: "Dovetail slide",
    svg: (
      <g>
        <path d="M40 120 H200 V96 L176 80 H64 L40 96 Z" {...s} />
        <path d="M56 80 V48 H184 V80" {...s} />
        <path d="M64 80 L80 64 H160 L176 80" {...s} strokeWidth="1" />
        <line x1="24" y1="100" x2="216" y2="100" {...t} />
      </g>
    ),
  },
  aerospace: {
    title: "Lug fitting",
    svg: (
      <g>
        <path d="M60 128 H180 V100 L150 70 H90 L60 100 Z" {...s} />
        <circle cx="120" cy="96" r="14" {...s} />
        <circle cx="120" cy="96" r="6" {...s} />
        <path d="M84 128 V140 H156 V128" {...s} />
        <line x1="120" y1="56" x2="120" y2="150" {...t} />
        <line x1="96" y1="96" x2="144" y2="96" {...t} />
      </g>
    ),
  },
};

export function PartIcon({ id, className = "" }: { id: keyof typeof partIcons; className?: string }) {
  const p = partIcons[id];
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label={p.title}>
      {p.svg}
    </svg>
  );
}
