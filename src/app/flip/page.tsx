import type { Metadata } from "next";
import { EngineeringCountdown } from "@/components/countdown/Countdown";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "FLIP — Product & Early Access",
  description:
    "FLIP turns 2D engineering drawings into verified 3D models with named choices and verified dimensions.",
};

const COMPACT_STEPS = [
  {
    step: "01",
    title: "Read",
    desc: "Extracts views, sections, and dimensions without OCR hallucinations.",
    badge: "Vector Index",
  },
  {
    step: "02",
    title: "Build",
    desc: "Generates true B-rep solid geometry with complete topological validity.",
    badge: "B-Rep Solid",
  },
  {
    step: "03",
    title: "Check",
    desc: "Overlays model views onto the sheet; audits every stated dimension.",
    badge: "Audited",
  },
  {
    step: "04",
    title: "Assumptions",
    desc: "Names all unstated dimensions and design choices in plain sentences.",
    badge: "Transparent",
  },
  {
    step: "05",
    title: "Deliver",
    desc: "Outputs an AP242 STEP file, drawing overlays, and an honest audit report.",
    badge: "STEP File",
  },
];

export default function FlipProductPage() {
  return (
    <div className="container py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Header & One-Line Summary */}
        <div className="max-w-[72ch]">
          <div className="mono text-micro uppercase tracking-wider font-semibold text-[#EFC07B] mb-3">
            Product · FLIP by Vertex
          </div>
          <h1 className="text-display font-heading text-vx-100 leading-[1.0] tracking-[-0.025em]">
            Drawings in.
            <br />
            Solid models out.
          </h1>
          <p className="mt-6 text-h3 text-vx-400 leading-relaxed font-normal">
            FLIP turns 2D engineering drawings (DXF, DWG, PDF, or image) into checked 3D solid models in minutes.
          </p>
        </div>

        {/* Full Interactive Engineering Countdown */}
        <section aria-label="Launch Countdown">
          <EngineeringCountdown />
        </section>

        {/* Compact Workflow Overview */}
        <section id="workflow" className="border-t border-[#0F3460] pt-14">
          <div className="max-w-[64ch] mb-10">
            <div className="mono text-micro uppercase tracking-wider text-[#EFC07B] font-semibold mb-2">
              The Workflow
            </div>
            <h2 className="text-h2 font-heading text-vx-100 leading-[1.1] tracking-[-0.02em]">
              Five deterministic stages.
            </h2>
            <p className="mt-3 text-small text-vx-400 leading-relaxed">
              Every drawing proceeds through an audited pipeline from initial vector extraction to final STEP delivery.
            </p>
          </div>

          {/* Compact Workflow Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COMPACT_STEPS.map((s) => (
              <div
                key={s.step}
                className="flex flex-col justify-between rounded-xl border border-[#0F3460] bg-[#16213E] p-5 shadow-xl transition-all hover:border-[#EFC07B]/70"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono text-micro text-[#EFC07B] font-bold">
                      {s.step}
                    </span>
                    <span className="mono text-[10px] rounded-2xs bg-[#1A1A2E] border border-[#0F3460] px-1.5 py-0.5 text-vx-300">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-small font-semibold font-heading text-vx-100">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-micro text-vx-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Drawing Reference Strip */}
          <div className="mt-8 rounded-xl border border-[#0F3460] bg-[#16213E] p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#0F3460] pb-3 mb-4 text-micro mono text-vx-400">
              <span className="text-[#EFC07B] font-semibold">INSPECTION SHEET ARCHIVE</span>
              <span>SCALE 1:1 · ASME Y14.5</span>
            </div>
            <div className="grid grid-cols-2 gap-4 h-[180px] sm:h-[220px]">
              <div className="relative rounded-md overflow-hidden bg-[#1A1A2E] p-2 border border-[#0F3460]">
                <Image
                  src="/drawings/part-a.svg"
                  alt="Part A Drawing Linework"
                  fill
                  className="object-contain p-2 opacity-85"
                />
                <span className="absolute bottom-2 left-2 mono text-[10px] text-[#EFC07B] font-semibold bg-[#1A1A2E]/95 border border-[#0F3460] px-2 py-0.5 rounded-2xs">
                  PART A
                </span>
              </div>
              <div className="relative rounded-md overflow-hidden bg-[#1A1A2E] p-2 border border-[#0F3460]">
                <Image
                  src="/drawings/part-b.svg"
                  alt="Part B Drawing Linework"
                  fill
                  className="object-contain p-2 opacity-85"
                />
                <span className="absolute bottom-2 left-2 mono text-[10px] text-[#EFC07B] font-semibold bg-[#1A1A2E]/95 border border-[#0F3460] px-2 py-0.5 rounded-2xs">
                  PART B
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Form at Anchor #join */}
        <section id="join" className="border-t border-[#0F3460] pt-14 scroll-mt-20">
          <WaitlistForm />
        </section>
      </div>
    </div>
  );
}
