/**
 * The coverage tray: what was checked, what wasn't, and why. Reused on the
 * homepage and /product/verify. All text on this vx-800 panel is vx-100 or the
 * muted tint, never vx-400 at small sizes.
 */

type Check = { name: string; status: "checked" | "not checked"; note?: string };

const checks: Check[] = [
  { name: "Title-block fields", status: "checked" },
  { name: "Dimension chain, section A–A", status: "checked", note: "4 chains, all close" },
  { name: "Hole count vs. variant table", status: "checked", note: "8 on sheet, 8 in row S4" },
  { name: "Revision vs. bill of material", status: "checked", note: "R2 = R2" },
  { name: "Units and general tolerances", status: "checked" },
  { name: "Referenced drawings exist", status: "checked", note: "2 of 2" },
  { name: "Template match", status: "checked" },
  { name: "Thread callouts, sheet 2", status: "not checked", note: "no native data in this PDF" },
  { name: "Surface finish symbols", status: "not checked", note: "scan at 150 dpi, below the floor" },
];

export function CoverageTray({ drawingNo = "DRG-4120" }: { drawingNo?: string }) {
  const done = checks.filter((c) => c.status === "checked").length;
  const skipped = checks.length - done;
  return (
    <div className="rounded-md border border-vx-600 bg-vx-800" role="region" aria-label={`Coverage for ${drawingNo}`}>
      <div className="flex items-baseline justify-between border-b border-vx-600 px-5 py-4">
        <span className="text-small text-vx-100">Coverage</span>
        <span className="mono text-small text-vx-100">{drawingNo}</span>
      </div>
      <ul className="divide-y divide-vx-600/60">
        {checks.map((c) => (
          <li key={c.name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 px-5 py-3 sm:grid-cols-[1fr_auto_auto]">
            <span className={`text-small ${c.status === "checked" ? "text-vx-100" : "text-muted-raised"}`}>{c.name}</span>
            <span className="mono text-micro text-muted-raised sm:order-3 sm:text-right">{c.status === "checked" ? "checked" : "not checked"}</span>
            {c.note && <span className="col-span-2 text-micro text-muted-raised sm:col-span-1 sm:order-2 sm:text-right">{c.note}</span>}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-vx-600 px-5 py-4">
        <span className="mono text-h3 text-vx-100">PASS</span>
        <span className="text-small text-vx-100">
          {done} checked · {skipped} couldn&apos;t be checked
        </span>
      </div>
    </div>
  );
}
