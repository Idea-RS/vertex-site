import React from "react";

interface AudienceTile {
  audience: string;
  tagline: string;
  description: string;
}

const AUDIENCES: AudienceTile[] = [
  {
    audience: "Manufacturers & job shops",
    tagline: "Quote and machine faster.",
    description: "Turn customer PDF and DXF drawings into verified STEP solids in minutes. Generate clean toolpaths and quotes without waiting days for manual redrafting.",
  },
  {
    audience: "Design & drafting offices",
    tagline: "Free your drafters from redrawing.",
    description: "Automate legacy archive conversion and sheet digitisation. Let your senior mechanical engineers design rather than re-keying historical prints.",
  },
  {
    audience: "Engineers, students & makers",
    tagline: "From historical prints to 3D parts.",
    description: "Convert textbook figures, patent sheets, and catalog drawings into usable 3D models with honest verification and named assumptions.",
  },
];

export function AudienceTiles() {
  return (
    <section className="rule section py-16 sm:py-20 lg:py-24" id="audience">
      <div className="container">
        <div className="max-w-[64ch] mb-12">
          <div className="mono text-micro uppercase tracking-wider text-[#EFC07B] font-semibold mb-3">
            Applications
          </div>
          <h2 className="text-h2 font-heading text-vx-100 leading-[1.08] tracking-[-0.02em]">
            Who it&apos;s for.
          </h2>
          <p className="mt-4 text-body text-vx-400 leading-relaxed">
            From precision machine shops quoting batch runs to engineering offices digitising decades of drawings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-[rgba(45,78,120,0.5)] bg-[#0F1726]/90 p-6 sm:p-7 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all hover:border-[#EFC07B]/70"
            >
              <div>
                <div className="mono text-micro text-[#EFC07B] font-semibold uppercase tracking-wider mb-2">
                  0{idx + 1}
                </div>
                <h3 className="text-h3 font-heading text-vx-100 leading-snug">
                  {item.audience}
                </h3>
                <p className="mt-2 text-small font-medium text-[#EFC07B]/90">
                  {item.tagline}
                </p>
                <p className="mt-4 text-small text-vx-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
