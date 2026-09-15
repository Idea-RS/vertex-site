import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { LaneDiagram } from "@/components/LaneDiagram";
import { archive } from "@/content/site";

export default function Pipeline() {
  return (
    // No bottom padding: the measured SectionGap that follows is the whole gap.
    <section className="rule pt-[clamp(4rem,9vw,8rem)]">
      <div className="container">
        <SectionHeader
          title="Two lanes. Exact from CAD, inferred by model."
          lede={
            <>
              Native CAD is read directly: geometry, dimensions, tables and title block come out exactly as drawn, at{" "}
              {archive.nativeCadCost} a drawing. PDFs and scans go through a vision model, and everything it reads is
              marked as inferred, with the crop it came from.
            </>
          }
        />
        <div className="mt-12">
          <LaneDiagram />
        </div>
        <p className="mt-8 text-small text-vx-400">
          <Link href="/how-it-works/" className="link">
            How the pipeline works, stage by stage
          </Link>
        </p>
      </div>
    </section>
  );
}
