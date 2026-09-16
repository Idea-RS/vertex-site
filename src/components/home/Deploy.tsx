import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { DeploySplit } from "@/components/DeploySplit";

export default function Deploy() {
  return (
    <section className="pb-16 lg:pb-32">
      <div className="container">
        <SectionHeader
          title="In the cloud, or behind your firewall."
          lede="Same product, two places to run it. On-prem is one container; native CAD archives run fully offline and nothing phones home."
        />
        <div className="mt-12">
          <DeploySplit />
        </div>
        <p className="mt-8 text-small text-vx-600">
          <Link href="/security/" className="link">
            What leaves your network, and what never does
          </Link>
        </p>
      </div>
    </section>
  );
}
