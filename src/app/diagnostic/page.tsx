import type { Metadata } from "next";
import { Block, PageHeader, RuledList } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { DeliverablesList } from "@/components/DeliverablesList";
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
          <span className="text-small text-vx-600">We reply with a quote and a start date.</span>
        </div>
      </PageHeader>

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <div className="grid gap-8 border-t border-vx-400 pt-8 sm:grid-cols-3">
            {[
              ["Two weeks", "from read access to the final report"],
              ["Fixed fee", "quoted before we start; no day rates"],
              ["Six deliverables", "all of them yours to keep"],
            ].map(([v, l]) => (
              <div key={v} className="border-l border-vx-400 pl-5">
                <div className="text-h3 text-vx-900">{v}</div>
                <p className="mt-2 text-small text-vx-600">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Block title="How it runs">
        <dl className="divide-y divide-vx-400 border-y border-vx-400">
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-small text-vx-600">Week one</dt>
            <dd className="max-w-[58ch] text-body text-vx-900">
              We ingest the archive where it lives, read every drawing, build the index and the graph, and run the checks.
              You get an hour of our questions about your numbering scheme.
            </dd>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-small text-vx-600">Week two</dt>
            <dd className="max-w-[58ch] text-body text-vx-900">
              We go through the findings with the people who drew the parts, generate one variant from your own template,
              and write the report. The search index stays running on your network.
            </dd>
          </div>
        </dl>
      </Block>

      <section className="rule" id="deliverables">
        <div className="container py-14 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <span className="mono text-micro text-vx-600 uppercase tracking-wider block mb-3">
                  Outputs
                </span>
                <h2 className="text-h2 font-heading font-medium text-vx-900">The six deliverables</h2>
                <p className="mt-4 text-body text-vx-600 max-w-[34ch]">
                  Six concrete deliverables your team keeps whether or not you go further. Built directly from your own drawing archive.
                </p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <DeliverablesList items={diagnostic.deliverables} />
            </div>
          </div>
        </div>
      </section>

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
        <p className="mt-6 max-w-[60ch] text-small text-vx-600">
          Measured on one manufacturer&apos;s archive of about 7,000 drawings. Your numbers will be your own; we don&apos;t estimate them.
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
