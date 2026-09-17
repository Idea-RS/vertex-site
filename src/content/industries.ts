import type { partIcons } from "@/components/drawing/PartIcons";

/** The shops Vertex is built for. Zones follow the hero sheet's grid (A–D, 1–8). */
export const industries: { zone: string; name: string; part: keyof typeof partIcons; line: string }[] = [
  { zone: "A1", name: "Switchgear and HT hardware", part: "switchgear", line: "Busbar clamps, contact carriers, tank flanges: thousands of variants of a few families." },
  { zone: "A2", name: "Pumps and valves", part: "pumps", line: "Casings, impellers and seats where a superseded revision means a leak." },
  { zone: "A3", name: "Fabrication job shops", part: "fabrication", line: "Every job a new drawing, most of them a bracket you have already made." },
  { zone: "A4", name: "Foundries and castings", part: "foundry", line: "Pattern numbers, machining allowances and the sheet the foundry actually poured from." },
  { zone: "B1", name: "Auto ancillaries", part: "auto", line: "Tier-2 parts drawn to a customer's template, re-issued every model year." },
  { zone: "B2", name: "Heavy electrical", part: "electrical", line: "Laminations, frames and terminal boxes across decades of ratings." },
  { zone: "B3", name: "Machine tools", part: "machineTools", line: "Slides, spindles and beds where the chain has to close to the micron." },
  { zone: "B4", name: "Aerospace and defence", part: "aerospace", line: "On-prem only. Nothing leaves the network; nothing phones home." },
];
