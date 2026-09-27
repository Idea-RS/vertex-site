/**
 * Core site metadata and navigation.
 * Product facts and claims are strictly verified.
 */

export const site = {
  name: "Vertex",
  wordmark: "VERTEX",
  productName: "FLIP",
  tagline: "Drawings in. Solid models out.",
  description:
    "FLIP turns 2D engineering drawings into checked 3D models with full feature trees and honest verification.",
  contactEmail: "founder@tryvertex.tech",
};

export const nav = [
  { href: "/flip", label: "Product" },
  { href: "/security", label: "Security" },
  { href: "/about", label: "About" },
] as const;

export const faq = [
  {
    q: "Does our drawing data ever leave our network?",
    a: "Native CAD archives run 100% offline inside your firewall; nothing phones home. For scanned PDF archives, you can run our local model in a self-contained container, or provide your own zero-retention private endpoint keys.",
  },
  {
    q: "Which CAD and drawing formats are supported?",
    a: "Native DWG, DXF, and STEP vector files, as well as vector PDFs and raster scans. Geometry, dimension chains, variant tables, and title blocks are parsed directly without requiring active CAD seat licenses.",
  },
  {
    q: "What happens when a drawing is faded, damaged, or ambiguous?",
    a: "FLIP never guesses. When a scan falls below the resolution threshold or an annotation is ambiguous, the field is tagged as unverified and named as a choice. Unread fields never produce false passes.",
  },
  {
    q: "Who signs off on a regenerated drawing variant or 3D solid?",
    a: "FLIP outputs a complete report with a clear verdict: Verified, Needs review, or Refused. Stated dimensions are measured directly against the solid B-rep so your engineering team has cryptographic certainty.",
  },
  {
    q: "How fast is model generation?",
    a: "FLIP reads views, sections and dimensions, builds the solid, and checks the model against the drawing in minutes, not days.",
  },
];
