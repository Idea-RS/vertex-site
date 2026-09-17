import HeroExplainer from "@/components/home/HeroExplainer";
import Industries from "@/components/home/Industries";
import Find from "@/components/home/Find";
import VerifyTimed from "@/components/home/VerifyTimed";
import Make from "@/components/home/Make";
import Pipeline from "@/components/home/Pipeline";
import Deploy from "@/components/home/Deploy";
import Diagnostic from "@/components/home/Diagnostic";
import Founders from "@/components/home/Founders";
import FAQSection from "@/components/home/FAQSection";
import { Interlude } from "@/components/home/Interlude";
import { SectionGap } from "@/components/SectionGap";
import { CTA } from "@/components/CTA";
import { archive, problemStats } from "@/content/site";

/**
 * Page rhythm: a pinned moment, then a full viewport of calm copy, then the
 * next. Hero → explainer → industries → rest → Find → rest → Verify → rest →
 * Make → the two-lane still → on-prem → diagnostic → founders → FAQ → CTA.
 */
export default function HomePage() {
  return (
    <>
      <HeroExplainer />
      <Industries />
      <Interlude title="“It’s faster to draw a new part than to find the old one.”" facts={problemStats}>
        <p>An engineering manager at a manufacturer we work with, describing an archive of about 7,000 drawings and three decades of revisions. All three numbers were measured there during a two-week diagnostic. Nothing on this site is estimated.</p>
      </Interlude>
      <Find />
      <Interlude
        title="Understand what depends on what."
        facts={[
          { value: archive.containmentEdgesLabel, label: "assembly relationships in one archive" },
          { value: archive.isolatedLabel, label: "of drawings connected to nothing" },
          { value: archive.bomSupersededLabel, label: "of BOM references point at a superseded drawing" },
        ]}
      >
        <p>Every drawing that contains another becomes an edge in a graph. On one manufacturer&apos;s archive there were over 50,000 of them, and the graph is where the expensive surprises live: the assembly that still calls for revision A two years after B, and the part referenced by nothing that the plant makes every week.</p>
      </Interlude>
      <VerifyTimed />
      <Interlude title="What passes the gate is what you can make.">
        <p>The same rules that verify a drawing you already have are the rules a generated variant has to pass before it exists. That is the whole reason the checks are deterministic: a verdict has to mean the same thing on a sheet drawn in 1950 and on one Vertex regenerated this morning.</p>
        <p>So the next section reads the same way as the last one. Pick a row, watch the sheet follow it, watch the gate run, and watch a named person sign.</p>
      </Interlude>
      <Make />
      <Pipeline />
      <SectionGap />
      <Deploy />
      <Diagnostic />
      <Founders />
      <FAQSection />
      <CTA />
    </>
  );
}
