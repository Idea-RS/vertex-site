import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vertex builds tools that turn engineering drawings into verified models. FLIP is our first product.",
};

export default function AboutPage() {
  return (
    <div className="container py-16 lg:py-28">
      <div className="max-w-[68ch]">
        <div className="mono text-micro font-medium uppercase tracking-wider text-vx-600 mb-4">
          About Vertex
        </div>
        <h1 className="text-h2 font-heading text-vx-900 leading-[1.12] tracking-[-0.02em]">
          Vertex builds tools that turn engineering drawings into verified models.
        </h1>
        <p className="mt-6 text-body text-vx-900 leading-relaxed">
          FLIP is our first product. It reads 2D drawings, builds the solid 3D geometry, and verifies every dimension against the sheet before delivery.
        </p>
        <p className="mt-4 text-small text-vx-600 leading-relaxed">
          Every result gets an honest verdict and names any unstated dimension as a choice. Built for manufacturers, job shops, and drafting offices.
        </p>

        {/* Marked placeholder for founders */}
        <div className="mt-14 border-t border-vx-400/40 pt-8">
          <div className="mono text-micro uppercase tracking-wider text-vx-500 mb-2">
            Leadership
          </div>
          <div className="rounded-sm border border-dashed border-vx-400/60 bg-vx-100/50 p-6 text-small text-vx-600">
            {/* FOUNDERS: Add founder names and credentials here */}
            Founders — to be announced.
          </div>
        </div>
      </div>
    </div>
  );
}
