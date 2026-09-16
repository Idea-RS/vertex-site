/**
 * The two-lane extraction layer. Reused on the homepage and /how-it-works.
 * Hairline connectors, no icons; each stage is a real thing in the pipeline.
 */

const lanes = [
  {
    name: "Exact",
    source: "Native CAD",
    sourceNote: "DWG, DXF, STEP, and the vendor formats behind them",
    reader: "Parser",
    readerNote: "reads the file's own structure; no interpretation",
    outputs: ["Geometry", "Dimensions", "Tables", "Title block", "References"],
    status: "Exact. $0.00 per drawing.",
  },
  {
    name: "Inferred",
    source: "PDF and scans",
    sourceNote: "vector PDFs, raster scans, photographed prints",
    reader: "Vision model",
    readerNote: "yours, ours, or the local one",
    outputs: ["Fields", "Confidence", "The crop each came from"],
    status: "Marked inferred. Never presented as exact.",
  },
];

export function LaneDiagram() {
  return (
    <div className="divide-y divide-vx-400 border-y border-vx-400">
      {lanes.map((lane) => (
        <div key={lane.name} className="grid gap-6 py-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-2">
            <span className="text-h3 text-vx-900">{lane.name}</span>
          </div>
          <Stage title={lane.source} note={lane.sourceNote} className="lg:col-span-3" />
          <Stage title={lane.reader} note={lane.readerNote} className="lg:col-span-3" />
          <div className="lg:col-span-4">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {lane.outputs.map((o) => (
                <li key={o} className="text-body text-vx-900">
                  {o}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-small text-vx-600">{lane.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stage({ title, note, className = "" }: { title: string; note: string; className?: string }) {
  return (
    <div className={`relative border-l border-vx-400 pl-4 ${className}`}>
      <p className="text-body text-vx-900">{title}</p>
      <p className="mt-1 max-w-[30ch] text-small text-vx-600">{note}</p>
    </div>
  );
}
