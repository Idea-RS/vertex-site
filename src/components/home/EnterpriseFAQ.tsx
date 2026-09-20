"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { faq } from "@/content/site";

export default function EnterpriseFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // first item open by default

  const toggle = (i: number) => {
    setOpenIdx((prev) => (prev === i ? null : i));
  };

  return (
    <section className="relative my-20 pt-8" aria-label="Enterprise Deployment and FAQ">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-[54ch]">
          <div className="inline-flex items-center gap-2 rounded-xs border border-vx-400 bg-vx-100 px-2.5 py-1">
            <span className="mono text-micro text-vx-900 font-semibold uppercase tracking-wider">
              06 · ARCHITECTURE & SECURITY
            </span>
          </div>

          <h2 className="mt-4 text-h2 text-vx-900 tracking-[-0.015em]">
            Built to run behind your firewall.
          </h2>

          <p className="mt-4 text-body text-vx-600 leading-relaxed">
            Your drawings represent decades of proprietary tooling and IP. Vertex runs where your files
            already live—in the cloud, or 100% offline on local shop hardware.
          </p>
        </div>

        {/* 2-Column Deployment Split */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Cloud Deployment Card */}
          <div className="rounded-md border border-vx-400/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-vx-600 font-semibold">CLOUD DEPLOYMENT</span>
              <span className="mono rounded-xs border border-vx-400 bg-vx-100 px-2 py-0.5 text-micro font-medium text-vx-900">
                FAST SETUP
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-900 font-semibold">Isolated Cloud Tenant</h3>
            <p className="mt-2 text-small text-vx-600">
              SOC 2-compliant cloud instance. Scanned PDF extraction runs over private zero-retention endpoints
              or your own enterprise API keys. Drawings are never used to train external models.
            </p>
          </div>

          {/* On-Premises Air-Gapped Card */}
          <div className="rounded-md border border-vx-600 bg-vx-900 text-vx-100 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <span className="mono text-micro text-dim font-semibold">ON-PREMISES CONTAINER</span>
              <span className="mono rounded-xs border border-dim/50 bg-dim/10 px-2 py-0.5 text-micro font-semibold text-dim">
                DEFENSE & ITAR READY
              </span>
            </div>
            <h3 className="mt-3 text-h3 text-vx-100 font-semibold">100% Offline Air-Gapped Engine</h3>
            <p className="mt-2 text-small text-vx-400">
              A single self-contained Docker container deployed on your local server. Native CAD parsing operates
              with zero internet connection, zero external network requests, and zero telemetry.
            </p>
          </div>
        </div>

        {/* Top Enterprise FAQ Accordion */}
        <div className="mt-16 max-w-[68ch]">
          <h3 className="text-h3 text-vx-900 font-semibold">Frequently asked technical questions</h3>

          <div className="mt-6 divide-y divide-vx-400/70 border-y border-vx-400/70" role="region" aria-label="Technical FAQs">
            {faq.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <div key={item.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-baseline justify-between gap-4 text-left transition-colors duration-150 hover:text-vx-900"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="mono text-micro text-vx-600 font-semibold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body font-medium text-vx-900">{item.q}</span>
                    </div>
                    <span className="mono text-small text-vx-600 select-none shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pl-8 text-small text-vx-600 leading-relaxed transition-all duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-small text-vx-600">
            Have questions about ITAR compliance or network isolation?{" "}
            <Link href="/security/" className="link font-medium">
              Read our full security audit →
            </Link>
          </p>
        </div>

        {/* Terminal Action Bar */}
        <div className="mt-16 rounded-md border border-vx-600 bg-vx-900 p-8 text-vx-100 shadow-xl lg:flex lg:items-center lg:justify-between">
          <div className="max-w-[44ch]">
            <h3 className="text-h3 font-semibold text-vx-100">
              Start with a fixed-fee archive audit.
            </h3>
            <p className="mt-1 text-small text-vx-400">
              Two weeks. Quoted before we start. Six permanent deliverables you keep.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 lg:mt-0">
            <Button href="/diagnostic/">Book the diagnostic</Button>
            <Link href="/about/" className="text-small text-vx-400 hover:text-vx-100 underline underline-offset-4 decoration-vx-600 transition-colors">
              About the company
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
