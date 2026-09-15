import type { Metadata } from "next";
import { Block, PageHeader, RuledList } from "@/components/PageHeader";
import { DeploySplit } from "@/components/DeploySplit";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { faq } from "@/content/site";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Where Vertex runs, what leaves your network, and what never does. On-prem is one container behind your firewall; native CAD archives run fully offline.",
};

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        title="What leaves your network, and what never does."
        lede="Vertex is built to run where your drawings are. This page says exactly what moves in each deployment, and what we can and can't see. If something isn't listed here, ask, and we'll add it."
      />

      <section className="rule">
        <div className="container py-12 lg:py-20">
          <DeploySplit />
        </div>
      </section>

      <Block title="On-prem, in detail">
        <RuledList
          items={[
            "One container. It runs on a machine you own: a workstation under a desk, or a rack in the plant.",
            "No outbound connections for native CAD archives. Block the container at the firewall and everything still works.",
            "PDFs and scans need a reader. Three options: the local model inside the container; your own keys to a zero-retention endpoint you choose; or a hosted reader, if you decide that's acceptable for those files.",
            "Updates are a new container image you pull when you decide to. Nothing updates itself.",
            "Logs, the index, the graph and every signature stay on the machine.",
          ]}
        />
      </Block>

      <Block title="What never leaves">
        <RuledList
          items={[
            "Your drawings, unless you have chosen a hosted reader for PDFs and scans.",
            "Your templates, and the variants generated from them.",
            "The containment graph, the search index, and what people searched for.",
            "Who signed what, and when.",
          ]}
        />
      </Block>

      <Block title="What Vertex can see">
        <dl className="divide-y divide-vx-600 border-y border-vx-600">
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-small text-vx-400">Cloud</dt>
            <dd className="max-w-[60ch] text-body text-vx-100">
              The drawings in your tenant, to run the product for you. Nothing is used for anything else.
            </dd>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-small text-vx-400">On-prem</dt>
            <dd className="max-w-[60ch] text-body text-vx-100">Nothing. There is no way in, by design.</dd>
          </div>
        </dl>
      </Block>

      <Block title="This website">
        <p className="max-w-[60ch] text-body text-vx-100">
          The marketing site holds itself to the same rule. No third-party scripts, no analytics, no external fonts, no
          cookies. It is a folder of static files. Open your browser&apos;s network panel and check.
        </p>
      </Block>

      <Block title="Questions people ask">
        <FAQ items={faq.filter((f) => f.q.includes("network") || f.q.includes("sure"))} />
      </Block>

      <CTA title="Run it behind your firewall first." body="The diagnostic can run on-prem from day one. Two weeks, fixed fee, nothing leaves." />
    </>
  );
}
