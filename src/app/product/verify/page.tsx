import type { Metadata } from "next";
import { Block, PageHeader, RuledList } from "@/components/PageHeader";
import { DemoFrame } from "@/components/DemoFrame";
import { CoverageTray } from "@/components/CoverageTray";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Verify",
  description: "Deterministic checks on every drawing, with honest coverage: what passed, what failed, and what couldn't be checked, with the reason.",
};

export default function VerifyPage() {
  return (
    <>
      <PageHeader
        title="Deterministic checks, with honest coverage."
        lede="The checks are rules. They pass, they fail, or they couldn't run. Every verdict lists all three, so a PASS means exactly what it says and nothing more."
      />

      <div className="container pb-12 lg:pb-16">
        <DemoFrame label="Verify" />
      </div>

      <Block title="What gets checked">
        <RuledList
          items={[
            "Title-block fields present and well-formed: number, revision, scale, sheet, drawn, checked.",
            "Dimension chains close. A chain that doesn't add up is a fail, not a warning.",
            "Hole counts on the sheet match the variant table.",
            "The revision on the sheet matches the bill of material that references it.",
            "Units and general tolerances are stated once, and match the template.",
            "Every referenced drawing exists in the archive at the referenced revision.",
            "The sheet matches its template: same cells, same notes, same projection.",
          ]}
        />
      </Block>

      <Block title="Three outcomes, not two">
        <dl className="divide-y divide-vx-400 border-y border-vx-400">
          {[
            ["Checked", "The rule ran against exact or inferred data and reports a result."],
            ["Failed", "The rule ran and the sheet doesn't satisfy it. The verdict names the rule and the values."],
            ["Not checked", "The rule couldn't run. No native data, a scan below the resolution floor, a field that isn't on this sheet. The reason is stated, and it counts against nothing."],
          ].map(([term, def]) => (
            <div key={term} className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr]">
              <dt className="mono text-small text-vx-900">{term}</dt>
              <dd className="max-w-[58ch] text-body text-vx-900">{def}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title="The coverage tray">
        <CoverageTray />
      </Block>

      <CTA title="Check the drawings you ship next week." body="The diagnostic runs every check across the archive and reports coverage as well as results." />
    </>
  );
}
