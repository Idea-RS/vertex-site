import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProductPanes } from "@/components/ProductPanes";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Product",
  description: "Find, Verify, Make, Archive: the four surfaces of Vertex, with the real numbers that belong to each.",
};

export default function ProductPage() {
  return (
    <>
      <PageHeader
        title="Four surfaces. One archive."
        lede="Find any part, verify what can be verified, make variants from your own templates, and see what the archive has never told you. Each surface reports what it read and what it couldn't."
      />
      <section className="rule">
        <div className="py-12 lg:py-20">
          <ProductPanes />
        </div>
      </section>
      <CTA />
    </>
  );
}
