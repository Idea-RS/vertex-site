"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/product/find/" ? pathname.startsWith("/product") : pathname.startsWith(href);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky z-40 transition-all duration-300 ease-out ${
        scrolled
          ? "bg-transparent pointer-events-none pt-2 sm:pt-3"
          : "bg-vx-100 pointer-events-auto pt-0"
      }`}
      style={{
        top: scrolled ? "calc(var(--inset) + 8px)" : "var(--inset)",
      }}
    >
      <div className="container pointer-events-auto">
        <nav
          aria-label="Primary"
          className={`flex items-center justify-between font-heading transition-all duration-300 ease-out ${
            scrolled
              ? "h-14 px-6 sm:px-8 rounded-full bg-vx-100/90 backdrop-blur-md nav-popped"
              : "h-16 px-0 rounded-none bg-transparent border-transparent"
          }`}
        >
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
                className={`inline-flex items-center rounded-sm border px-4 text-small text-vx-900 transition-colors duration-150 ${
                  scrolled
                    ? "h-8 border-vx-600/70 bg-vx-100/70 hover:border-vx-900"
                    : "h-9 border-vx-400 hover:border-vx-900"
                }`}
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`pointer-events-auto bg-vx-100 lg:hidden ${
              scrolled ? "container mt-2" : "border-t border-vx-400"
            }`}
          >
            <ul
              className={`flex flex-col py-2 font-heading ${
                scrolled
                  ? "rounded-2xl nav-popped bg-vx-100/95 backdrop-blur-md p-4 shadow-xl"
                  : "container"
              }`}
            >
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
      <div className={`rule transition-opacity duration-300 ${scrolled ? "opacity-0" : "opacity-100"}`} />
    </header>
  );
}
