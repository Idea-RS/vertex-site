"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { productNav } from "@/content/site";

export function ProductTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Product" className="container">
      <ul className="flex gap-8 border-b border-vx-600">
        {productNav.map((p) => {
          const active = pathname.startsWith(p.href);
          return (
            <li key={p.href} className="-mb-px">
              <Link
                href={p.href}
                aria-current={active ? "page" : undefined}
                className={`block border-b py-4 text-small transition-colors duration-150 ${
                  active ? "border-vx-100 text-vx-100" : "border-transparent text-vx-400 hover:text-vx-100"
                }`}
              >
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
