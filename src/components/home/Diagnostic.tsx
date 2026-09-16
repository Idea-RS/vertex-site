import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { diagnostic, findings } from "@/content/site";

export default function Diagnostic() {
  return (
    <section className="rule section">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeader
              title="Start with the diagnostic."
              lede={`${diagnostic.duration}. ${diagnostic.fee}. Six deliverables you keep, whether or not you go further.`}
            />
            <div className="mt-10">
              <p className="text-small text-vx-600">On one manufacturer&apos;s archive, the diagnostic found:</p>
              <ul className="mt-4 divide-y divide-vx-400 border-y border-vx-400">
                {findings.map((f) => (
                  <li key={f} className="py-3 text-body text-vx-900">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10">
              <Button href="/diagnostic/">Book the diagnostic</Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ol className="grid gap-x-8 border-t border-vx-400 sm:grid-cols-2">
              {diagnostic.deliverables.map((d, i) => (
                <li key={d.title} className="border-b border-vx-400 py-5">
                  <div className="flex items-baseline gap-4">
                    <span className="mono text-small text-vx-600">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-h3 text-vx-900">{d.title}</span>
                  </div>
                  <p className="mt-2 max-w-[38ch] pl-10 text-small text-vx-600">{d.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
