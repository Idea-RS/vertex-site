import { Cormorant, Mitr, Karma } from "next/font/google";
import localFont from "next/font/local";

export const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const mitr = Mitr({
  subsets: ["latin"],
  variable: "--font-mitr",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const karma = Karma({
  subsets: ["latin"],
  variable: "--font-karma",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
