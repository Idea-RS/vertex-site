import type { Metadata } from "next";
import { FlipHero } from "@/components/home/FlipHero";
import { ProblemEditorial } from "@/components/home/ProblemEditorial";
import { HowItWorksSequence } from "@/components/workflow/HowItWorksSequence";
import { TwoPartsSection } from "@/components/parts/PartComparisonCard";
import { DeliverablesGrid } from "@/components/home/DeliverablesGrid";
import { AudienceTiles } from "@/components/home/AudienceTiles";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";

export const metadata: Metadata = {
  title: "FLIP by Vertex — Drawings in. Solid models out.",
  description:
    "FLIP turns 2D engineering drawings into checked 3D solid models with named choices and verified dimensions.",
};

export default function HomePage() {
  return (
    <>
      {/* 1.a Hero: one line + subline + live countdown chip + rotating Part A 3D */}
      <FlipHero />

      {/* 1.b Problem Editorial: Meet our first product: FLIP */}
      <ProblemEditorial />

      {/* 1.c How it works: Centrepiece pinned scroll sequence (01 Read to 05 Deliver) */}
      <HowItWorksSequence />

      {/* 1.d Two parts, side by side: Part A & Part B with drawing↔model slider */}
      <TwoPartsSection />

      {/* 1.e What you get: Compact grid of 5 deliverables */}
      <DeliverablesGrid />

      {/* 1.f Who it's for: 3 audience tiles */}
      <AudienceTiles />

      {/* 1.g Final CTA: Engineering countdown + Join the waitlist */}
      <HomeFinalCTA />
    </>
  );
}
