import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cormorant, mitr, karma, plexMono } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/content/site";
import SheetTopMask from "@/components/SheetTopMask";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "Vertex — drawing intelligence for manufacturers",
    template: "%s — Vertex",
  },
  description: site.description,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${mitr.variable} ${karma.variable} ${plexMono.variable}`}
    >
      <body>
        <noscript>
          <style>{`[data-drawing="pending"] .draw{stroke-dasharray:none;stroke-dashoffset:0}[data-drawing="pending"] .fade{opacity:1}`}</style>
        </noscript>
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--inset)] focus:top-[var(--inset)] focus:z-50 focus:bg-vx-100 focus:px-3 focus:py-2 focus:text-vx-900"
        >
          Skip to content
        </a>
        <SheetTopMask />
        <div className="sheet">
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
