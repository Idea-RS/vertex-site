import localFont from "next/font/local";

// Self-hosted. No CDN, nothing phones home.
export const grotesk = localFont({
  src: [{ path: "../fonts/inter-tight-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-grotesk",
  display: "swap",
  preload: true,
});

export const plexMono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  preload: true,
});
