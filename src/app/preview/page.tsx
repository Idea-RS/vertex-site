import type { Metadata } from "next";
import { FlipHero } from "@/components/home/FlipHero";
import { ProblemEditorial } from "@/components/home/ProblemEditorial";
import { HowItWorksSequence } from "@/components/workflow/HowItWorksSequence";
import { TwoPartsSection } from "@/components/parts/PartComparisonCard";
import { DeliverablesGrid } from "@/components/home/DeliverablesGrid";
import { AudienceTiles } from "@/components/home/AudienceTiles";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";

export const metadata: Metadata = {
  title: "FLIP by Vertex (Internal Preview)",
  description:
    "Internal development preview of the full FLIP marketing site.",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <>
      <div className="bg-[#16213E] text-vx-300 text-micro mono py-2.5 px-4 text-center border-b border-[#0F3460]">
        INTERNAL PREVIEW MODE · FULL SITE ACTIVE AT <span className="text-[#EFC07B] font-semibold">/preview</span>
      </div>
      <FlipHero />
      <ProblemEditorial />
      <HowItWorksSequence />
      <TwoPartsSection />
      <DeliverablesGrid />
      <AudienceTiles />
      <HomeFinalCTA />
    </>
  );
}
