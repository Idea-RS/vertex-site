import { FAQ } from "@/components/FAQ";
import { SectionHeader } from "@/components/SectionHeader";

export default function FAQSection() {
  return (
    <section className="rule section" id="faq">
      <div className="container grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeader title="What people ask first." />
          </div>
        </div>
        <div className="lg:col-span-8">
          <FAQ />
        </div>
      </div>
    </section>
  );
}
