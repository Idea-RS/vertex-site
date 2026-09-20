import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "FLIP",
  description: "Vertex FLIP template page.",
};

export default function FlipPage() {
  return (
    <>
      <PageHeader
        title="FLIP"
        lede="Empty template page."
      />

      <section className="container py-12 lg:py-20">
        <div className="min-h-[400px] w-full rounded-lg border border-dashed border-vx-400/40 bg-vx-100/30 p-8">
          {/* Empty template page ready for content */}
        </div>
      </section>
    </>
  );
}
