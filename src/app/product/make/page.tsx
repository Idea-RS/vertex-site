import type { Metadata } from "next";
import { Block, PageHeader, RuledList } from "@/components/PageHeader";
import { DemoFrame } from "@/components/DemoFrame";
import { CoverageTray } from "@/components/CoverageTray";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Make",
  description:
    "The variant loop: pick rows from your own variant table, generate from your template, gate with deterministic checks, and have a named person sign. Until then the sheet says so.",
};

const steps = [
  {
    title: "Pick a row",
    body: "The variant table on your own drawing is the specification. Pick one row or twenty. Nothing is typed in twice.",
  },
  {
    title: "Generate",
    body: "Vertex regenerates the sheet from your template, not ours. Every dimension follows the row. Notes, tolerances, title-block layout, projection symbol: yours, unchanged.",
  },
  {
    title: "Gate",
    body: "The deterministic checks run on the new sheet. The verdict lists what passed, what failed, and what couldn't be checked, with a reason for each.",
  },
  {
    title: "Sign",
    body: "A named person reads the sheet and signs. Their initials go in the title block, the signature is recorded against the checks they saw, and the watermark comes off.",
  },
];

export default function MakePage() {
  return (
    <>
      <PageHeader
        title="Make a variant from your own template."
        lede="Pick the rows you need. Vertex regenerates the drawing, checks it, watermarks it, and holds it until a named person signs. This is the part no one else does."
      />

      <div className="container pb-12 lg:pb-16">
        <DemoFrame label="Make" />
      </div>

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <ol className="grid gap-x-8 gap-y-8 border-t border-vx-600 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="pt-6">
                <div className="flex items-baseline gap-3">
                  <span className="mono text-small text-vx-400">{i + 1}</span>
                  <h2 className="text-h3 text-vx-100">{s.title}</h2>
                </div>
                <p className="mt-3 max-w-[32ch] text-small text-vx-400">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Block title="What the gate checks">
        <CoverageTray drawingNo="EEI-3057 · S4" />
        <p className="mt-6 max-w-[60ch] text-small text-vx-400">
          Every row of the tray is a rule that either ran or didn&apos;t. A check that couldn&apos;t run is never counted
          as a pass.
        </p>
      </Block>

      <Block title="What the watermark means">
        <RuledList
          items={[
            "GENERATED — NOT APPROVED is drawn on the sheet, not overlaid in the viewer. Export the PDF and it's still there.",
            "It lifts only when a named person signs. Not when the gate passes; a passing gate is necessary, not sufficient.",
            "The signature is a record: who, when, and which checks they were looking at when they signed.",
          ]}
        />
      </Block>

      <Block title="What Vertex won't do">
        <RuledList
          items={[
            "It won't sign for you.",
            "It won't lift the watermark on a sheet whose gate failed.",
            "It won't generate from a template it hasn't read exactly. If the template is a scan, it says so and stops.",
          ]}
        />
      </Block>

      <CTA title="Bring one drawing family." body="The diagnostic includes a variant generated from your own template, gated and ready to sign." />
    </>
  );
}
