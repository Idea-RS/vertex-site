import Link from "next/link";
import { productNav, site } from "@/content/site";
import { Wordmark } from "./Wordmark";

const columns = [
  {
    title: "Product",
    links: productNav.map((p) => ({ href: p.href, label: p.label })),
  },
  {
    title: "Company",
    links: [
      { href: "/how-it-works/", label: "How it works" },
      { href: "/security/", label: "Security" },
      { href: "/diagnostic/", label: "Diagnostic" },
      { href: "/about/", label: "About" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="rule">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-[36ch] text-small text-vx-600">
              Drawing intelligence for manufacturers. Runs in the cloud or fully offline behind
              your firewall.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="text-small font-heading font-medium text-vx-900">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-small text-vx-600 hover:text-vx-900">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-3">
            <p className="text-small font-heading font-medium text-vx-900">Contact</p>
            <a href={`mailto:${site.contactEmail}`} className="mono mt-3 block text-small text-vx-600 hover:text-vx-900">
              {site.contactEmail}
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-vx-400/50 pt-6 text-micro text-vx-600 sm:flex-row sm:justify-between">
          <p className="mono">© {new Date().getFullYear()} Vertex</p>
        </div>
      </div>
    </footer>
  );
}
