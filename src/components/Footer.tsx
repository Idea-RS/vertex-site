import Link from "next/link";
import { site } from "@/content/site";
import { Wordmark } from "./Wordmark";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/flip", label: "FLIP" },
      { href: "/flip#workflow", label: "Workflow" },
      { href: "/flip#join", label: "Waitlist" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/security", label: "Security" },
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 w-full text-vx-100 [text-shadow:0_0_6px_#0d1b2a,0_0_12px_#0d1b2a,0_0_24px_#0d1b2a,0_0_48px_#0d1b2a,2px_2px_6px_#0d1b2a,-2px_-2px_6px_#0d1b2a]">
      <div className="container pb-16 pt-8 lg:pb-20 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark className="text-white drop-shadow-sm" />
            <p className="mt-4 max-w-[38ch] text-small text-dim leading-relaxed font-normal">
              FLIP turns 2D engineering drawings into checked 3D solid models with named choices and verified dimensions.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="mono text-micro font-semibold uppercase tracking-widest text-white">{col.title}</p>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-small text-vx-100/75 transition-colors duration-150 hover:text-dim font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-3">
            <p className="mono text-micro font-semibold uppercase tracking-widest text-white">Contact</p>
            <a href={`mailto:${site.contactEmail}`} className="mono mt-3.5 inline-block text-small text-vx-100/75 transition-colors duration-150 hover:text-dim font-medium">
              {site.contactEmail}
            </a>
            <p className="mt-2 text-micro text-vx-100/60">
              Response within one business day.
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-vx-400/30 pt-6 text-micro text-vx-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-dim">© {new Date().getFullYear()} Vertex Intelligence. All rights reserved.</p>
          <div className="mono flex items-center gap-4 text-micro text-dim">
            <span>ASME Y14.5 / ISO 1101</span>
            <span aria-hidden="true">·</span>
            <span>B-Rep STEP Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
