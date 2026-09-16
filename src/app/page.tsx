import HeroExplainer from "@/components/home/HeroExplainer";
import Problem from "@/components/home/Problem";
import Find from "@/components/home/Find";
import Understand from "@/components/home/Understand";
import Make from "@/components/home/Make";
import Verify from "@/components/home/Verify";
import Pipeline from "@/components/home/Pipeline";
import Deploy from "@/components/home/Deploy";
import Diagnostic from "@/components/home/Diagnostic";
import Founders from "@/components/home/Founders";
import FAQSection from "@/components/home/FAQSection";
import { SectionGap } from "@/components/SectionGap";
import { CTA } from "@/components/CTA";

export default function HomePage() {
  return (
    <>
      <HeroExplainer />
      <Problem />
      <Find />
      <Understand />
      <Make />
      <Verify />
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
