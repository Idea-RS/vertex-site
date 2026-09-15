/**
 * Everything on the site that is a claim lives here.
 * Every number below was measured on one real 6,926-drawing archive.
 * Do not add a statistic that wasn't.
 */

export const site = {
  name: "Vertex",
  tagline: "Drawing intelligence for manufacturers",
  description:
    "Vertex reads a manufacturer's entire archive of engineering drawings exactly, makes every part findable in milliseconds, checks what can be checked deterministically and says what it couldn't, and regenerates variants from your own templates. Cloud or fully offline.",
  // TODO(content): replace with the real contact address before launch.
  contactEmail: "hello@example.com",
};

export const nav = [
  { href: "/product/find/", label: "Product" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/security/", label: "Security" },
  { href: "/diagnostic/", label: "Diagnostic" },
  { href: "/about/", label: "About" },
] as const;

export const productNav = [
  { href: "/product/find/", label: "Find" },
  { href: "/product/verify/", label: "Verify" },
  { href: "/product/make/", label: "Make" },
  { href: "/product/archive/", label: "Archive" },
] as const;

export const archive = {
  drawings: 6926,
  drawingsLabel: "6,926",
  searchP1: "91.9%",
  duplicateCandidates: 961,
  bomSuperseded: 0.28,
  bomSupersededLabel: "28%",
  isolated: 0.36,
  isolatedLabel: "36%",
  containmentEdges: 53879,
  containmentEdgesLabel: "53,879",
  nativeCadCost: "$0.00",
  familyMs: 9,
  familyHits: 10,
};

export const problemStats = [
  {
    value: "961",
    label: "duplicate candidates in one archive",
  },
  {
    value: archive.bomSupersededLabel,
    label: "of bills of material point at superseded drawings",
  },
  {
    value: archive.isolatedLabel,
    label: "of drawings connected to nothing",
  },
];

export const findings = [
  "Their second-most-used drawing was missing from the archive entirely.",
  "Their part-coding scheme couldn't express parts they were actually making.",
  "28% of their bills of material reference drawings that have since been superseded.",
];

export const faq = [
  {
    q: "Does our data leave our network?",
    a: "Native CAD archives run fully offline; nothing phones home. PDF archives need a reader — bring your own keys, zero-retention endpoints, or the local model.",
  },
  {
    q: "What if our drawings are scans?",
    a: "Scans go through the second lane: a vision model reads them, and every field it reads is marked as inferred, with the crop it read it from. Nothing inferred is ever presented as exact.",
  },
  {
    q: "Do we have to change how we draw?",
    a: "No. Vertex reads what you already have, in the formats you already use. Variants are generated from your own templates, so they look like your drawings because they are.",
  },
  {
    q: "What happens when it isn't sure?",
    a: "It says so. Every result states what it checked and what it couldn't.",
  },
  {
    q: "Why not CADDi?",
    a: "CADDi is an enterprise platform that deploys with on-site consultants. Vertex runs from one container behind your firewall and authors drawings; CADDi doesn't.",
  },
];

export const diagnostic = {
  duration: "Two weeks",
  fee: "Fixed fee, quoted before we start",
  deliverables: [
    {
      title: "Duplicate candidates",
      body: "Every pair of drawings that may describe the same part, ranked, with the dimensions that match.",
    },
    {
      title: "Superseded references",
      body: "Every bill-of-material line that points at a drawing with a newer revision.",
    },
    {
      title: "Isolation map",
      body: "Which drawings are referenced by nothing and reference nothing.",
    },
    {
      title: "Missing drawings",
      body: "Drawing numbers your archive refers to that aren't in it.",
    },
    {
      title: "Part-coding review",
      body: "Where your numbering scheme can't express what you make, with examples from your own parts.",
    },
    {
      title: "A search index you keep",
      body: "Your archive, searchable by number, words, or dimensions. It runs on your network after we leave.",
    },
  ],
};

// TODO(content): real names, roles and bios. Not supplied in the brief.
export const founders = [
  {
    name: "Founder name",
    role: "Co-founder",
    bio: "Bio to follow.",
  },
  {
    name: "Founder name",
    role: "Co-founder",
    bio: "Bio to follow.",
  },
];

export const designPartner = {
  description:
    "A precision-components manufacturer with a 6,926-drawing archive: native CAD and PDF, three decades of revisions.",
};
