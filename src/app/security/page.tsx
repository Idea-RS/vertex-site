import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { DeploySplit } from "@/components/DeploySplit";
import { SecurityDetails } from "@/components/SecurityDetails";
import { CTA } from "@/components/CTA";

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

      <SecurityDetails />

      <CTA
        title="Run it behind your firewall first."
        body="The diagnostic can run on-prem from day one. Two weeks, fixed fee, nothing leaves."
      />
    </>
  );
}

