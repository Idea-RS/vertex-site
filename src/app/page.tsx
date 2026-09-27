import type { Metadata } from "next";
import { EngineeringCountdown } from "@/components/countdown/Countdown";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

export const metadata: Metadata = {
  title: "FLIP by Vertex — Drawings in. Solid models out.",
  description:
    "FLIP turns 2D engineering drawings into checked 3D models with named choices and verified dimensions. Launching October 2026.",
};

export default function HomePage() {
  return (
    <div className="container py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-12 sm:space-y-16">
        {/* Header Hero Statement */}
        <div className="max-w-[70ch]">
          <div className="inline-flex items-center gap-2 rounded-xs bg-dim/10 border border-dim/30 px-3 py-1 text-micro mono text-dim-deep font-semibold uppercase tracking-wider mb-5">
            FLIP by Vertex · Launching October 2026
          </div>
          <h1 className="text-display font-heading text-vx-900 leading-[1.0] tracking-[-0.025em]">
            Drawings in.
            <br />
            Solid models out.
          </h1>
          <p className="mt-6 text-h3 font-heading font-normal text-vx-600 leading-relaxed max-w-[56ch]">
            FLIP turns 2D engineering drawings into checked 3D models with named choices and verified dimensions.
          </p>
        </div>

        {/* Calibrated Engineering Readout Countdown */}
        <section aria-label="Launch Countdown">
          <EngineeringCountdown />
        </section>

        {/* Early Access Waitlist Form */}
        <section aria-label="Waitlist Registration">
          <WaitlistForm />
        </section>
      </div>
    </div>
  );
}
