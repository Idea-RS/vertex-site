"use client";

import { useId } from "react";

/**
 * Eight small parts in the site's linework, one per industry segment. Each is
 * an orthographic figure traced from a public-domain United States patent
 * drawing (provenance in docs/part-icons.md), redrawn at 240 × 160: vx-100
 * outlines, vx-400 centrelines and witness lines, hatching where the source
 * figure is a section. 1px, non-scaling. Every computed coordinate is rounded
 * so server and client stringify the same.
 */

const rd = (n: number) => Math.round(n * 100) / 100;
const ink = "var(--color-vx-100)";
const dim = "var(--color-vx-400)";
const s = { stroke: ink, strokeWidth: 1.25, vectorEffect: "non-scaling-stroke" as const, fill: "none" };
const thin = { stroke: ink, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };
const cl = { stroke: dim, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none", strokeDasharray: "14 3 2 3" };
const hidden = { stroke: dim, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none", strokeDasharray: "4 3" };
const wit = { stroke: dim, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };

/** 45° section hatching clipped to a path. */
function Hatch({ id, d, pitch = 5 }: { id: string; d: string; pitch?: number }) {
  return (
    <g>
      <clipPath id={`hatch-${id}`}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#hatch-${id})`} stroke={ink} strokeWidth="0.75" vectorEffect="non-scaling-stroke" opacity="0.7">
        {Array.from({ length: Math.ceil(400 / pitch) }, (_, i) => {
          const x = -160 + i * pitch;
          return <line key={i} x1={x} y1={160} x2={x + 160} y2={0} />;
        })}
      </g>
    </g>
  );
}

export const partIcons: Record<string, { title: string; source: string; svg: (u: string) => React.ReactNode }> = {
  /* US 2,218,016 (Anderson, Bus bar clamp, 1940), Fig. 2: two bus bars in section, the clamp plates either side, the bolt through. */
  switchgear: {
    title: "Bus bar clamp",
    source: "US 2,218,016 · Fig. 2",
    svg: (u) => (
      <g>
        {/* the two bus bars, broken at the ends */}
        <path d="M20 58 L36 58 L36 104 L20 104" {...s} />
        <path d="M220 58 L204 58 L204 104 L220 104" {...s} />
        <path d="M20 58 L14 66 L22 74 L14 82 L22 90 L14 98 L20 104" {...thin} />
        <path d="M220 58 L226 66 L218 74 L226 82 L218 90 L226 98 L220 104" {...thin} />
        <line x1={36} y1={58} x2={204} y2={58} {...s} />
        <line x1={36} y1={104} x2={204} y2={104} {...s} />
        {/* the clamp plates, one either side, and the cut section on the left plate */}
        <rect x={60} y={44} width={120} height={72} {...s} />
        <Hatch id={`${u}-sw`} d="M60 44 H92 V116 H60 Z" />
        <line x1={92} y1={44} x2={92} y2={116} {...s} />
        {/* bar edges seen through the plate, hidden */}
        <line x1={92} y1={72} x2={180} y2={72} {...hidden} />
        <line x1={92} y1={90} x2={180} y2={90} {...hidden} />
        {/* the bolt: head above, shank through, nut below */}
        <rect x={112} y={30} width={16} height={14} {...s} />
        <line x1={116} y1={44} x2={116} y2={116} {...hidden} />
        <line x1={124} y1={44} x2={124} y2={116} {...hidden} />
        <rect x={109} y={116} width={22} height={14} {...s} />
        <path d="M109 123 H131" {...thin} />
        {/* centreline of the bolt, and section arrows 3–3 */}
        <line x1={120} y1={18} x2={120} y2={142} {...cl} />
        <line x1={44} y1={30} x2={44} y2={132} {...wit} />
        <path d="M40 34 L44 26 L48 34" {...wit} />
        <path d="M40 128 L44 136 L48 128" {...wit} />
      </g>
    ),
  },
  /* US 1,707,664 (Jacobsen, Centrifugal pump, 1929), Fig. 2: the casing seen from the back; six bolt lugs, the suction eye, the discharge nozzle at top. */
  pumps: {
    title: "Pump casing, rear view",
    source: "US 1,707,664 · Fig. 2",
    svg: () => (
      <g>
        {(() => {
          const cx = 110, cy = 92, R = 56, Ri = 46;
          const lugs = [-58, -122, -180, 122, 58, 0].map((deg) => {
            const a = (deg * Math.PI) / 180;
            return { x: rd(cx + (R + 6) * Math.cos(a)), y: rd(cy + (R + 6) * Math.sin(a)) };
          });
          return (
            <g>
              <circle cx={cx} cy={cy} r={R} {...s} />
              <circle cx={cx} cy={cy} r={Ri} {...s} />
              <circle cx={cx} cy={cy} r={Ri - 4} {...thin} />
              <circle cx={cx} cy={cy} r={9} {...s} />
              {lugs.map((l, i) => (
                <g key={i}>
                  <circle cx={l.x} cy={l.y} r={8} {...s} />
                  <circle cx={l.x} cy={l.y} r={2.5} {...s} />
                </g>
              ))}
              {/* the discharge nozzle, rising from the volute to a flange */}
              <path d={`M${cx - 16} ${cy - R + 4} C ${cx - 14} ${cy - R - 14}, ${cx - 10} ${cy - R - 24}, ${cx - 9} ${cy - R - 30} L${cx + 9} ${cy - R - 30} C ${cx + 10} ${cy - R - 24}, ${cx + 14} ${cy - R - 14}, ${cx + 16} ${cy - R + 4}`} {...s} />
              <rect x={cx - 12} y={cy - R - 36} width={24} height={6} {...s} />
              <path d={`M${cx - 6} ${cy - R - 30} L${cx - 6} ${cy - R - 8} L${cx + 6} ${cy - R - 8} L${cx + 6} ${cy - R - 30}`} {...hidden} />
              {/* the foot */}
              <rect x={cx - 12} y={cy + R + 6} width={24} height={10} {...s} />
              {/* centrelines */}
              <line x1={cx - R - 20} y1={cy} x2={cx + R + 20} y2={cy} {...cl} />
              <line x1={cx} y1={cy - R - 42} x2={cx} y2={cy + R + 22} {...cl} />
              {/* the bore diameter, witnessed */}
              <line x1={cx + 9} y1={cy} x2={cx + 9} y2={cy + 24} {...wit} />
              <line x1={cx - 9} y1={cy} x2={cx - 9} y2={cy + 24} {...wit} />
              <line x1={cx - 9} y1={cy + 20} x2={cx + 9} y2={cy + 20} {...wit} />
            </g>
          );
        })()}
      </g>
    ),
  },
  /* US 1,899,799 (Edwards, Welded bracket connection, 1933), Fig. 3: a seat bracket welded to a column flange, in section. */
  fabrication: {
    title: "Welded seat bracket, section",
    source: "US 1,899,799 · Fig. 3",
    svg: (u) => (
      <g>
        {/* the column: flange (vertical) and web (horizontal), both cut */}
        <path d="M78 22 H96 V72 H164 V84 H96 V138 H78 Z" {...s} />
        <Hatch id={`${u}-fb`} d="M78 22 H96 V72 H164 V84 H96 V138 H78 Z" />
        <path d="M164 72 L168 76 L164 80 L168 84" {...thin} />
        {/* the bracket: an angle with its vertical leg against the flange and the seat leg outward */}
        <path d="M78 30 H70 V128 H78" {...s} />
        <Hatch id={`${u}-fbb`} d="M70 30 H78 V128 H70 Z" pitch={4} />
        <path d="M70 128 H40 V136 H70" {...s} />
        <Hatch id={`${u}-fbs`} d="M40 128 H70 V136 H40 Z" pitch={4} />
        {/* the welds, top and bottom of the leg */}
        <path d="M70 30 L64 24 L78 24" {...thin} fill={ink} fillOpacity={0.35} />
        <path d="M70 136 L64 142 L78 142" {...thin} fill={ink} fillOpacity={0.35} />
        {/* the beam that sits on the seat, broken */}
        <path d="M40 128 V112 H20" {...hidden} />
        {/* centreline of the web */}
        <line x1={60} y1={78} x2={200} y2={78} {...cl} />
        {/* seat length, witnessed */}
        <line x1={40} y1={136} x2={40} y2={152} {...wit} />
        <line x1={70} y1={142} x2={70} y2={152} {...wit} />
        <line x1={40} y1={148} x2={70} y2={148} {...wit} />
      </g>
    ),
  },
  /* US 1,739,779 (Blood, Gear housing, 1929), Fig. 5: the cast housing in section, cover on top, bearing bore in the middle. */
  foundry: {
    title: "Cast gear housing, section",
    source: "US 1,739,779 · Fig. 5",
    svg: (u) => (
      <g>
        {/* the body: an open box with a flange at the top and feet at the bottom, cut */}
        <path d="M52 56 H188 V64 H180 V136 H60 V64 H52 Z" {...s} />
        <path d="M60 64 V128 H180 V64" {...s} />
        <path d="M68 64 V128 M172 64 V128" {...thin} />
        <Hatch id={`${u}-fd1`} d="M52 56 H188 V64 H180 V136 H172 V64 H68 V136 H60 V64 H52 Z" />
        <Hatch id={`${u}-fd2`} d="M60 128 H180 V136 H60 Z" />
        {/* the cover, with its filler boss at top right */}
        <path d="M48 56 V44 H150 V30 H176 V44 H192 V56" {...s} />
        <Hatch id={`${u}-fd3`} d="M48 44 H150 V30 H176 V44 H192 V56 H48 Z" />
        {/* the bearing sleeve inside, and the shaft bore */}
        <rect x={100} y={80} width={40} height={48} {...s} />
        <rect x={108} y={80} width={24} height={48} {...s} />
        <Hatch id={`${u}-fd4`} d="M100 80 H108 V128 H100 Z M132 80 H140 V128 H132 Z" pitch={4} />
        {/* the feet */}
        <path d="M64 136 V148 H80 V136 M160 136 V148 H176 V136" {...s} />
        {/* centreline of the bore */}
        <line x1={120} y1={22} x2={120} y2={152} {...cl} />
        {/* the bore, witnessed */}
        <line x1={108} y1={128} x2={108} y2={144} {...wit} />
        <line x1={132} y1={128} x2={132} y2={144} {...wit} />
        <line x1={108} y1={141} x2={132} y2={141} {...wit} />
      </g>
    ),
  },
  /* US 1,521,934 (Eicher, Auxiliary axle stub shaft, 1925), Fig. 2: the stub shaft in elevation; taper, thread, collar, journal, end. */
  auto: {
    title: "Axle stub shaft",
    source: "US 1,521,934 · Fig. 2",
    svg: () => (
      <g>
        {/* left to right: castle nut, taper, thread, collar, journal, end spigot */}
        <path d="M22 66 H34 V98 H22 Z" {...s} />
        <path d="M22 70 H34 M22 94 H34" {...thin} />
        <path d="M34 60 H42 V104 H34" {...s} />
        <path d="M42 68 L100 60 L100 104 L42 96 Z" {...s} />
        <path d="M100 58 H116 V106 H100" {...s} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={100 + 2 + i * 2} y1={58} x2={100 + 2 + i * 2} y2={106} {...thin} />
        ))}
        <rect x={116} y={40} width={30} height={84} {...s} />
        <rect x={146} y={52} width={50} height={60} {...s} />
        <path d="M196 60 H216 Q220 60 220 64 V100 Q220 104 216 104 H196" {...s} />
        {/* the taper's hidden continuation and the pin hole in the collar */}
        <path d="M42 60 L100 52" {...hidden} />
        <circle cx={126} cy={82} r={3} {...thin} />
        {/* centreline */}
        <line x1={12} y1={82} x2={230} y2={82} {...cl} />
        {/* the journal length, witnessed */}
        <line x1={146} y1={112} x2={146} y2={140} {...wit} />
        <line x1={196} y1={104} x2={196} y2={140} {...wit} />
        <line x1={146} y1={136} x2={196} y2={136} {...wit} />
      </g>
    ),
  },
  /* US 2,423,345 (Roters, Alternating current dynamoelectric machine, 1947), Fig. 2b: the laminated core with its round slots. */
  electrical: {
    title: "Laminated core",
    source: "US 2,423,345 · Fig. 2b",
    svg: () => (
      <g>
        {(() => {
          const cx = 120, cy = 82, R = 60, Rs = 40, rs = 11, N = 8;
          return (
            <g>
              <circle cx={cx} cy={cy} r={R} {...s} />
              <circle cx={cx} cy={cy} r={R - 5} {...thin} />
              <circle cx={cx} cy={cy} r={16} {...s} />
              <circle cx={cx} cy={cy} r={5} {...s} />
              {Array.from({ length: N }, (_, i) => {
                const a = (i * 2 * Math.PI) / N + Math.PI / N;
                return <circle key={i} cx={rd(cx + Rs * Math.cos(a))} cy={rd(cy + Rs * Math.sin(a))} r={rs} {...s} />;
              })}
              {/* keyway in the bore */}
              <path d={`M${cx - 3} ${cy - 16} V${cy - 20} H${cx + 3} V${cy - 16}`} {...s} />
              {/* centrelines */}
              <line x1={cx - R - 20} y1={cy} x2={cx + R + 20} y2={cy} {...cl} />
              <line x1={cx} y1={cy - R - 12} x2={cx} y2={cy + R + 12} {...cl} />
              {/* section plane 2a–2a, as in the source */}
              <path d={`M${cx - R - 14} ${cy - 6} V${cy + 6} M${cx + R + 14} ${cy - 6} V${cy + 6}`} {...wit} />
            </g>
          );
        })()}
      </g>
    ),
  },
  /* US 2,390,148 (Hijmans, Tool mounting, 1945), Fig. 1: the tool block on its dovetail slideway, seen from above; the gib and its screw on the right. */
  machineTools: {
    title: "Dovetail tool slide",
    source: "US 2,390,148 · Fig. 1",
    svg: (u) => (
      <g>
        {/* the slide body */}
        <rect x={40} y={28} width={112} height={88} {...s} />
        {/* the dovetail edges: the 60° flanks, left and right */}
        <path d="M40 116 L28 128 H52 L40 116" {...s} />
        <path d="M152 116 L164 128 H140 L152 116" {...s} />
        <path d="M28 128 H164" {...s} />
        <line x1={40} y1={116} x2={152} y2={116} {...hidden} />
        {/* the base the slide runs on */}
        <rect x={20} y={128} width={160} height={24} {...s} />
        <line x1={20} y1={134} x2={180} y2={134} {...hidden} />
        {/* the gib strip and its adjusting screw */}
        <rect x={152} y={40} width={8} height={76} {...thin} />
        <Hatch id={`${u}-mt`} d="M152 40 H160 V116 H152 Z" pitch={3} />
        <circle cx={170} cy={78} r={5} {...s} />
        <line x1={160} y1={78} x2={165} y2={78} {...thin} />
        {/* the tool bore with its clamp nut, and the two hold-down screws */}
        <path d="M84 52 L108 52 L120 72 L108 92 L84 92 L72 72 Z" {...s} />
        <circle cx={96} cy={72} r={12} {...s} />
        <circle cx={56} cy={44} r={7} {...s} />
        <circle cx={56} cy={100} r={7} {...s} />
        <path d="M51 44 H61 M51 100 H61" {...thin} />
        {/* centreline of the tool bore */}
        <line x1={96} y1={20} x2={96} y2={124} {...cl} />
        {/* the slideway width, witnessed */}
        <line x1={28} y1={128} x2={28} y2={158} {...wit} />
        <line x1={164} y1={128} x2={164} y2={158} {...wit} />
        <line x1={28} y1={154} x2={164} y2={154} {...wit} />
      </g>
    ),
  },
  /* US 1,678,640 (Hall, Fitting for aircraft and the like, 1928), Fig. 4: a tube-end fitting with its lug eye. */
  aerospace: {
    title: "Tube-end lug fitting",
    source: "US 1,678,640 · Fig. 4",
    svg: () => (
      <g>
        {/* the tube, broken at the left */}
        <path d="M30 52 H92 V112 H30" {...s} />
        <path d="M30 52 C 24 62, 36 72, 30 82 C 24 92, 36 102, 30 112" {...thin} />
        {/* the sleeve over the tube end, and the fitting's shoulder */}
        <rect x={92} y={48} width={34} height={68} {...s} />
        <line x1={92} y1={56} x2={126} y2={56} {...hidden} />
        <line x1={92} y1={108} x2={126} y2={108} {...hidden} />
        <rect x={126} y={40} width={10} height={84} {...s} />
        {/* the spigot inside the tube, hidden */}
        <path d="M92 64 H60 V100 H92" {...hidden} />
        <path d="M108 64 L126 82 L108 100" {...hidden} />
        {/* the lug: a flat tongue with a rounded end and the pin hole */}
        <path d="M136 60 H186 A22 22 0 0 1 186 104 H136" {...s} />
        <circle cx={186} cy={82} r={10} {...s} />
        {/* centreline */}
        <line x1={16} y1={82} x2={224} y2={82} {...cl} />
        <line x1={186} y1={54} x2={186} y2={110} {...cl} />
        {/* the hole, witnessed */}
        <line x1={176} y1={82} x2={176} y2={134} {...wit} />
        <line x1={196} y1={82} x2={196} y2={134} {...wit} />
        <line x1={176} y1={130} x2={196} y2={130} {...wit} />
      </g>
    ),
  },
};

export function PartIcon({ id, className = "" }: { id: keyof typeof partIcons; className?: string }) {
  const p = partIcons[id];
  // the icon renders more than once on a page (stacked and hovered layouts), so clip ids are per instance
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label={`${p.title}, after ${p.source}`}>
      {p.svg(u)}
    </svg>
  );
}
