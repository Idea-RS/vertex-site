"use client";

import React from "react";
import { EngineeringCountdown } from "@/components/countdown/Countdown";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

export function HomeFinalCTA() {
  return (
    <section className="rule section py-16 sm:py-20 lg:py-28" id="join-section">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Engineering Countdown readout */}
          <EngineeringCountdown />

          {/* Waitlist Form container */}
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
