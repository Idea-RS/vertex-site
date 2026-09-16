"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/product/find/" ? pathname.startsWith("/product") : pathname.startsWith(href);

  return (
    <header className="sticky z-40 bg-vx-100" style={{ top: "var(--inset)" }}>
      <div className="container">
        <nav aria-label="Primary" className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Vertex home" className="inline-flex items-center">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`text-small transition-colors duration-150 hover:text-vx-900 ${
                    isActive(item.href) ? "text-vx-900" : "text-vx-600"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/diagnostic/"
                className="inline-flex h-9 items-center rounded-sm border border-vx-400 px-4 text-small text-vx-900 transition-colors duration-150 hover:border-vx-900"
              >
                Book a diagnostic
              </Link>
            </li>
          </ul>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-vx-900 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.25" />
              ) : (
                <path d="M2 6h16M2 10h16M2 14h16" stroke="currentColor" strokeWidth="1.25" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="border-t border-vx-400 bg-vx-100 lg:hidden"
          >
            <ul className="container flex flex-col py-2">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-vx-400/50 last:border-0">
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`block py-4 text-h3 ${isActive(item.href) ? "text-vx-900" : "text-vx-600"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="py-4">
                <Link
                  href="/diagnostic/"
                  onClick={close}
                  className="inline-flex h-11 items-center rounded-sm border border-vx-400 px-5 text-body text-vx-900"
                >
                  Book a diagnostic
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="rule" />
    </header>
  );
}
