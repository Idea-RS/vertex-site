import { SectionHeader } from "@/components/SectionHeader";
import { CoverageTray } from "@/components/CoverageTray";

const rules = [
  "Title-block fields present and well-formed",
  "Dimension chains close",
  "Hole count on the sheet matches the table",
  "Revision on the sheet matches the bill of material",
  "Units and general tolerances stated once",
  "Every referenced drawing exists in the archive",
];

export default function Verify() {
  return (
    <section className="rule section">
      <div className="container grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeader
            title="Verify what can be verified. Say the rest."
            lede="The checks are rules, not guesses: they pass, they fail, or they couldn't run. Every verdict lists all three, so a PASS means exactly what it says."
          />
          <ul className="mt-10 divide-y divide-vx-600 border-y border-vx-600">
            {rules.map((r) => (
              <li key={r} className="py-3 text-body text-vx-100">
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[52ch] text-small text-vx-400">
            When a check couldn&apos;t run, the tray says why: no native data, a scan too coarse to read, a field that
            isn&apos;t on the sheet. It never fills the gap with a guess.
          </p>
        </div>
        <div className="lg:col-span-7">
          <CoverageTray />
        </div>
      </div>
    </section>
  );
}
