"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { FlipText } from "./ui/flip-text";
import { CornerButton, ArrowNEIcon } from "./ui/corner-button";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  const isActive = (href: string) => {
    if (href === "/flip") return pathname === "/flip" || pathname.startsWith("/flip");
    return pathname === href;
  };

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
          : "bg-vx-100 pointer-events-auto pt-8 sm:pt-10"
      }`}
      style={{
        top: scrolled ? "calc(var(--inset) + 10px)" : "var(--inset)",
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

          {pathname === "/" ? (
            <div className="flex items-center gap-3">
              <span className="mono text-micro rounded-xs bg-dim/10 border border-dim/30 px-2.5 py-1 text-dim-deep font-semibold uppercase tracking-wider">
                FLIP · LAUNCH 2026
              </span>
            </div>
          ) : (
            <>
              <ul className="hidden items-center gap-8 lg:flex">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  const isFlip = item.href === "/flip";

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`inline-flex items-center text-[16px] transition-colors duration-150 hover:text-vx-900 ${
                          active ? "text-vx-900 font-medium" : "text-vx-600"
                        } ${isFlip ? "flip-hover-trigger" : ""}`}
                      >
                        {isFlip ? (
                          <FlipText duration={0.8} loop={true}>
                            {item.label}
                          </FlipText>
                        ) : (
                          item.label
                        )}
                      </Link>
                    </li>
                  );
                })}
                <li className="flex items-center">
                  <CornerButton
                    href="/flip#join"
                    icon={<ArrowNEIcon className="corner-btn-svg" />}
                    accentColor="#1b263b"
                    wrapperClassName="[--cb-padding:0.35rem_0.5rem] [--cb-btn-padding:0.4rem_0.85rem] [--cb-font-size:0.925rem] [--cb-icon-size:16px]"
                  >
                    Login
                  </CornerButton>
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
            </>
          )}
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
              {nav.map((item) => {
                const active = isActive(item.href);
                const isFlip = item.href === "/flip";

                return (
                  <li key={item.href} className="border-b border-vx-400/50 last:border-0">
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`block py-4 text-h3 transition-colors duration-150 ${
                        active ? "text-vx-900 font-medium" : "text-vx-600 hover:text-vx-900"
                      } ${isFlip ? "flip-hover-trigger" : ""}`}
                    >
                      {isFlip ? (
                        <FlipText duration={0.8} loop={true}>
                          {item.label}
                        </FlipText>
                      ) : (
                        item.label
                      )}
                    </Link>
                  </li>
                );
              })}
              <li className="py-4">
                <CornerButton
                  href="/flip#join"
                  onClick={close}
                  icon={<ArrowNEIcon className="corner-btn-svg" />}
                  accentColor="#1b263b"
                >
                  Login
                </CornerButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
