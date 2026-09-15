import type { Metadata } from "next";
import { Block, PageHeader, RuledList } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { diagnostic, findings, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Diagnostic",
  description: "A two-week archive audit. Fixed fee, quoted before we start. Six deliverables you keep.",
};

export default function DiagnosticPage() {
  return (
    <>
      <PageHeader
        title="A two-week archive audit."
        lede="Fixed fee, quoted before we start. Six deliverables you keep whether or not you go further. It can run on-prem from the first day."
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href={`mailto:${site.contactEmail}?subject=Diagnostic`} variant="accent">
            Book the diagnostic
          </Button>
          <span className="text-small text-vx-400">We reply with a quote and a start date.</span>
        </div>
      </PageHeader>

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <div className="grid gap-8 border-t border-vx-600 pt-8 sm:grid-cols-3">
            {[
              ["Two weeks", "from read access to the final report"],
              ["Fixed fee", "quoted before we start; no day rates"],
              ["Six deliverables", "all of them yours to keep"],
            ].map(([v, l]) => (
              <div key={v} className="border-l border-vx-600 pl-5">
                <div className="text-h3 text-vx-100">{v}</div>
                <p className="mt-2 text-small text-vx-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Block title="How it runs">
        <dl className="divide-y divide-vx-600 border-y border-vx-600">
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-small text-vx-400">Week one</dt>
            <dd className="max-w-[58ch] text-body text-vx-100">
              We ingest the archive where it lives, read every drawing, build the index and the graph, and run the checks.
              You get an hour of our questions about your numbering scheme.
            </dd>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-small text-vx-400">Week two</dt>
            <dd className="max-w-[58ch] text-body text-vx-100">
              We go through the findings with the people who drew the parts, generate one variant from your own template,
              and write the report. The search index stays running on your network.
            </dd>
          </div>
        </dl>
      </Block>

      <Block title="The six deliverables">
        <ol className="divide-y divide-vx-600 border-y border-vx-600">
          {diagnostic.deliverables.map((d, i) => (
            <li key={d.title} className="grid gap-2 py-4 sm:grid-cols-[3rem_1fr]">
              <span className="mono text-small text-vx-400">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-body text-vx-100">{d.title}</h3>
                <p className="mt-1 max-w-[56ch] text-small text-vx-400">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Block>

      <Block title="What we need from you">
        <RuledList
          items={[
            "Read access to the archive: a folder, a share, or a PLM export. On-prem, a machine to run the container on.",
            "One person who knows the numbering scheme, for about an hour.",
            "One drawing family you'd like a variant of.",
          ]}
        />
      </Block>

      <Block title="What one diagnostic found">
        <RuledList items={findings} />
        <p className="mt-6 max-w-[60ch] text-small text-vx-400">
          Measured on the design partner&apos;s 6,926-drawing archive. Your numbers will be your own; we don&apos;t estimate them.
        </p>
      </Block>

      <section className="rule">
        <div className="container py-16 lg:py-24">
          <h2 className="max-w-[24ch] text-h2">Two weeks from now you&apos;ll know what your archive knows.</h2>
          <div className="mt-8">
            <Button href={`mailto:${site.contactEmail}?subject=Diagnostic`}>Book the diagnostic</Button>
          </div>
        </div>
      </section>
    </>
  );
}
