import type { Metadata } from "next";
import { Block, Facts, PageHeader, RuledList } from "@/components/PageHeader";
import { DemoFrame } from "@/components/DemoFrame";
import { CTA } from "@/components/CTA";
import { archive, findings } from "@/content/site";

export const metadata: Metadata = {
  title: "Archive",
  description: "The archive report: what's duplicated, what's stale, what's isolated. Measured on one real 6,926-drawing archive.",
};

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        title="The archive report: what's duplicated, stale, and isolated."
        lede="Once every drawing is read and every reference is an edge, the archive can be asked questions it has never answered. These are the ones that cost money."
      />

      <div className="container pb-12 lg:pb-16">
        <DemoFrame label="Archive" />
      </div>

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <Facts
            items={[
              { value: archive.drawingsLabel, label: "drawings ingested from one archive" },
              { value: String(archive.duplicateCandidates), label: "duplicate candidates found" },
              { value: archive.bomSupersededLabel, label: "of BOM references point at superseded drawings" },
            ]}
          />
          <div className="mt-8">
            <Facts
              items={[
                { value: archive.isolatedLabel, label: "of drawings connected to nothing" },
                { value: archive.containmentEdgesLabel, label: "containment edges" },
                { value: archive.nativeCadCost, label: "per native CAD drawing, read exactly" },
              ]}
            />
          </div>
        </div>
      </section>

      <Block title="Duplicates">
        <p className="max-w-[60ch] text-body text-vx-100">
          Two drawings that describe the same part, under different numbers, drawn years apart. Vertex ranks candidate
          pairs by the dimensions they share and shows both sheets side by side. You decide which one lives.
        </p>
      </Block>

      <Block title="Stale references">
        <p className="max-w-[60ch] text-body text-vx-100">
          A bill of material that points at revision A when revision B has been in the archive for two years. Every
          such line is listed, with the drawing, the revision it names, and the current one.
        </p>
      </Block>

      <Block title="Isolation">
        <p className="max-w-[60ch] text-body text-vx-100">
          Drawings referenced by nothing and referencing nothing. Some are genuinely standalone. Some are the
          second-most-used part in the plant, missing from the archive that&apos;s supposed to contain it.
        </p>
      </Block>

      <Block title="What the report found on one archive">
        <RuledList items={findings} />
      </Block>

      <CTA title="Get the report for your archive." body="The archive report is the first deliverable of the diagnostic." />
    </>
  );
}
