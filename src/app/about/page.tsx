import type { Metadata } from "next";
import { Block, PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";
import { designPartner, founders } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Two founders and a design partner. Vertex is built against one real archive with the people who use it.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Two founders and a design partner."
        lede="Vertex is built against one real archive, with the draughtsmen and engineering managers who use it every day. Every number on this site was measured there."
      />

      <section className="rule">
        <div className="container grid gap-10 py-12 md:grid-cols-2 lg:py-20">
          {founders.map((f, i) => (
            <div key={i} className="border-t border-vx-600 pt-6">
              <h2 className="text-h3 text-vx-100">{f.name}</h2>
              <p className="mt-1 text-small text-vx-400">{f.role}</p>
              <p className="mt-4 max-w-[44ch] text-body text-vx-100">{f.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <Block title="The design partner">
        <p className="max-w-[60ch] text-body text-vx-100">{designPartner.description}</p>
        <p className="mt-4 max-w-[60ch] text-body text-vx-400">
          Their drawings appear across this site with the title blocks anonymised: company name and address redacted,
          drawing numbers, dates and initials replaced with placeholders. The linework is theirs.
        </p>
      </Block>

      <Block title="Why drawings">
        <p className="max-w-[60ch] text-body text-vx-100">
          A manufacturer&apos;s knowledge lives in its drawing archive, and most archives can&apos;t be asked a question.
          We think the archive already knows the answer to most of what a plant asks every day, and that reading it
          exactly, and saying honestly what couldn&apos;t be read, is worth a company.
        </p>
      </Block>

      <CTA />
    </>
  );
}
