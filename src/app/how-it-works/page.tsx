import type { Metadata } from "next";
import { Block, PageHeader } from "@/components/PageHeader";
import { LaneDiagram } from "@/components/LaneDiagram";
import { CTA } from "@/components/CTA";
import { archive } from "@/content/site";

export const metadata: Metadata = {
  title: "How it works",
  description: "The pipeline in two lanes: exact from native CAD, inferred by a vision model from PDFs and scans. Then index, graph, check, author.",
};

const stages = [
  {
    title: "Ingest",
    body: "Point Vertex at the archive: a folder, a share, a PLM export. It walks everything, keeps the originals untouched, and records what it found.",
  },
  {
    title: "Read, exactly",
    body: `Native CAD is parsed, not interpreted. Geometry, dimensions, tables, title block and references come out as the file stores them. This lane costs ${archive.nativeCadCost} a drawing and never guesses.`,
  },
  {
    title: "Read, by model",
    body: "PDFs and scans go to a vision model: the local one inside the container, or an endpoint you hold the keys to. Every field it returns is stored with a confidence and the crop it read it from, and marked inferred.",
  },
  {
    title: "Index",
    body: "Numbers, words and dimensions go into one index. Exact and inferred values are indexed together and labelled apart, so a search can find both and the result can tell you which is which.",
  },
  {
    title: "Graph",
    body: `Every reference from one drawing to another becomes an edge. On one manufacturer's archive that was over 50,000 assembly relationships, and it's where duplicates, stale references and isolated drawings show up.`,
  },
  {
    title: "Check",
    body: "Deterministic rules run against what was read. Each reports checked, failed, or not checked with a reason. Nothing inferred is allowed to pass a rule that needs exact data.",
  },
  {
    title: "Author",
    body: "Variants are regenerated from your own templates, gated by the same checks, watermarked until a named person signs.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        title="The pipeline, in two lanes."
        lede="Exact where the data is exact, inferred where it isn't, and never confused about which is which. Here is what happens to a drawing from the moment Vertex sees it."
      />

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <LaneDiagram />
        </div>
      </section>

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <ol className="divide-y divide-vx-400 border-y border-vx-400">
            {stages.map((s, i) => (
              <li key={s.title} className="grid gap-3 py-6 lg:grid-cols-12 lg:gap-8">
                <div className="flex items-baseline gap-4 lg:col-span-4">
                  <span className="mono text-small text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="text-h3 text-vx-900">{s.title}</h2>
                </div>
                <p className="max-w-[60ch] text-body text-vx-900 lg:col-span-8">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Block title="Why the lanes stay separate">
        <p className="max-w-[60ch] text-body text-vx-900">
          A number read from a DXF is the number. A number read from a 150 dpi scan is a good guess with a crop attached.
          Treating them the same is how archives fill up with confident errors. Vertex keeps the label on every value all
          the way to the screen, the search result, and the verdict.
        </p>
      </Block>

      <CTA />
    </>
  );
}
