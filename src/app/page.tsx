import Hero from "@/components/home/Hero";
import Find from "@/components/home/Find";
import VerifyGate from "@/components/home/VerifyGate";
import TwoDToThreeD from "@/components/home/TwoDToThreeD";
import DiagnosticBento from "@/components/home/DiagnosticBento";
import EnterpriseFAQ from "@/components/home/EnterpriseFAQ";

/**
 * Revamped 6-section product-led homepage:
 * 01. Hero — Product-led value proposition, proof metrics & spotlight CAD viewport.
 * 02. Find — Instant geometric search across 36 patent sheets (100% PROTECTED).
 * 03. VerifyGate — Deterministic checking, honest coverage & cryptographic human sign-off.
 * 04. TwoDToThreeD — Industrial-grade 2D to 3D B-rep solids, dual-gate verification & divergence detection.
 * 05. DiagnosticBento — The two-week archive audit wedge & 6-card deliverable bento.
 * 06. EnterpriseFAQ — Air-gapped on-prem container vs. cloud, top technical FAQs & closing action bar.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Find />
      <VerifyGate />
      <TwoDToThreeD />
      <DiagnosticBento />
      <EnterpriseFAQ />
    </>
  );
}
