import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { designPartner, founders } from "@/content/site";

export default function Founders() {
  return (
    <section className="rule section">
      <div className="container">
        <SectionHeader
          title="Two founders and a design partner."
          lede="Vertex is built against one real archive with the people who use it every day, not against a demo set."
        />
        <div className="mt-12 grid gap-8 border-t border-vx-600 pt-8 md:grid-cols-3">
          {founders.map((f, i) => (
            <div key={i}>
              <p className="text-h3 text-vx-100">{f.name}</p>
              <p className="mt-1 text-small text-vx-400">{f.role}</p>
              <p className="mt-4 max-w-[36ch] text-small text-vx-400">{f.bio}</p>
            </div>
          ))}
          <div>
            <p className="text-h3 text-vx-100">Design partner</p>
            <p className="mt-1 text-small text-vx-400">Anonymised, like their title blocks</p>
            <p className="mt-4 max-w-[36ch] text-small text-vx-400">{designPartner.description}</p>
          </div>
        </div>
        <p className="mt-8 text-small text-vx-400">
          <Link href="/about/" className="link">
            More about the company
          </Link>
        </p>
      </div>
    </section>
  );
}
