import type { Metadata } from "next";
import { Block, Facts, PageHeader, RuledList } from "@/components/PageHeader";
import { DemoFrame } from "@/components/DemoFrame";
import { CTA } from "@/components/CTA";
import { archive } from "@/content/site";

export const metadata: Metadata = {
  title: "Find",
  description: "Search an entire drawing archive by drawing number, words, dimensions, or a dropped file. A family in 9 ms.",
};

const ways = [
  { title: "By drawing number", body: "EEI-3057, or a fragment of it. Old numbering schemes and new ones, side by side." },
  { title: "By words", body: "“Flanged housing”, in the language of your own title blocks and notes." },
  {
    title: "By dimensions",
    body: "Ø31.77, 160 across, 6 holes. Exact values from CAD and inferred values from PDFs are matched, and told apart in the result.",
  },
  { title: "By a dropped file", body: "Drop a drawing. Get its family, its duplicate candidates, and what contains it." },
];

export default function FindPage() {
  return (
    <>
      <PageHeader
        title="Find any part by number, words, dimensions, or a dropped file."
        lede="The drawing you need already exists. Vertex makes the whole archive searchable in milliseconds, and every hit says where its values came from."
      />

      <div className="container pb-12 lg:pb-16">
        <DemoFrame label="Find" />
      </div>

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <Facts
            items={[
              { value: archive.searchP1, label: "precision at one, measured on the design partner's archive" },
              { value: `${archive.familyMs} ms`, label: "to find a family of ten drawings" },
              { value: archive.drawingsLabel, label: "drawings ingested, native CAD and PDF" },
            ]}
          />
        </div>
      </section>

      <Block title="Four ways in">
        <div className="grid gap-x-8 border-t border-vx-600 sm:grid-cols-2">
          {ways.map((w) => (
            <div key={w.title} className="border-b border-vx-600 py-5">
              <h3 className="text-h3 text-vx-100">{w.title}</h3>
              <p className="mt-2 max-w-[34ch] text-small text-vx-400">{w.body}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="What a result tells you">
        <RuledList
          items={[
            "Which values matched, and whether each came out of native CAD (exact) or a vision model (inferred, with the crop).",
            "The family: drawings that share a template and differ by a row.",
            "What contains it and what it contains, from the containment graph.",
            "Whether it has been superseded, and by what.",
          ]}
        />
      </Block>

      <CTA title="See your own archive searched." body="The diagnostic leaves you a search index that runs on your network." />
    </>
  );
}
