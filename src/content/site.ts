/**
 * Everything on the site that is a claim lives here.
 * Every number below was measured on one real manufacturer's archive of about 7,000 drawings.
 * Counts that would only make sense with that customer named are rounded; product facts stay exact.
 * Do not add a statistic that wasn't.
 */

export const site = {
  name: "Vertex",
  tagline: "Drawing intelligence for manufacturers",
  description:
    "Vertex reads a manufacturer's entire archive of engineering drawings exactly, makes every part findable in milliseconds, checks what can be checked deterministically and says what it couldn't, and regenerates variants from your own templates. Cloud or fully offline.",
  // TODO(content): replace with the real contact address before launch.
  contactEmail: "info@tryvertex.tech",
};

export const nav = [
  { href: "/product/", label: "Product" },
  { href: "/#reconstruct", label: "2D to 3D" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/security/", label: "Security" },
  { href: "/diagnostic/", label: "Diagnostic" },
  { href: "/about/", label: "About" },
] as const;

export const productNav = [
  { href: "/product/#find", label: "Find" },
  { href: "/product/#verify", label: "Verify" },
  { href: "/#reconstruct", label: "2D to 3D" },
  { href: "/product/#make", label: "Make" },
  { href: "/product/#archive", label: "Archive" },
] as const;

export const archive = {
  drawings: 7000,
  drawingsLabel: "~7,000",
  searchP1: "91.9%",
  duplicateCandidates: 950,
  duplicateCandidatesLabel: "950+",
  bomSuperseded: 0.28,
  bomSupersededLabel: "28%",
  isolated: 0.36,
  isolatedLabel: "36%",
  containmentEdges: 50000,
  containmentEdgesLabel: "50,000+",
  nativeCadCost: "$0.00",
  familyMs: 9,
  familyHits: 10,
};

export const problemStats = [
  {
    value: "950+",
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
    q: "Does our drawing data ever leave our network?",
    a: "Native CAD archives run 100% offline inside your firewall; nothing phones home. For scanned PDF archives, you can run our local model in a self-contained container, or provide your own zero-retention private endpoint keys.",
  },
  {
    q: "Which CAD and drawing formats are supported?",
    a: "Native DWG, DXF, and STEP vector files, as well as vector PDFs and raster scans. Geometry, dimension chains, variant tables, and title blocks are parsed directly without requiring active CAD seat licenses.",
  },
  {
    q: "What happens when a drawing is faded, damaged, or ambiguous?",
    a: "Vertex never guesses. When a scan falls below the resolution threshold or an annotation is ambiguous, the field is tagged as unverified and routed to a human visual inspection tray. Unread fields never produce false passes.",
  },
  {
    q: "Who signs off on a regenerated drawing variant?",
    a: "Vertex never signs drawings autonomously. When all automated checks pass, the sheet enters your sign-off queue with a prominent 'GENERATED — NOT APPROVED' watermark. A designated engineer must review the diff and authenticate before the drawing is marked approved.",
  },
  {
    q: "How does Vertex connect to inventory records?",
    a: "Vertex evaluates inventory from a point-in-time CSV export from your ERP. Every stock finding states 'as of [date], per your export'. We deliberately avoid fragile, expensive custom ERP integrations so onboarding takes hours, not months.",
  },
];

export const diagnostic = {
  duration: "Two weeks",
  fee: "Fixed fee, quoted before we start",
  deliverables: [
    {
      title: "Duplicate Part Register",
      body: "Every pair of drawings describing the same part, ranked by geometric match and estimated re-tooling savings.",
    },
    {
      title: "Superseded BOM References",
      body: "Every bill-of-material line that points at a drawing with a newer revision in circulation.",
    },
    {
      title: "Isolated Drawing Census",
      body: "Which drawings are referenced by nothing and reference nothing across your active BOM graph.",
    },
    {
      title: "Missing Drawing Ledger",
      body: "Drawing numbers your active bills of materials refer to that are absent from your server.",
    },
    {
      title: "Part-Coding Scheme Review",
      body: "Where legacy numbering schemes can no longer express what you make, with examples from your parts.",
    },
    {
      title: "Self-Hosted Search Index",
      body: "Your archive, searchable by number, words, or dimensions. Runs permanently on your local network.",
    },
  ],
};

export const founders = [
  {
    name: "Raahil Desai",
    role: "Co-founder & Engineering",
    bio: "Based in Ahmedabad. Leads the deterministic extraction engine, confidence calibration, and archive graph architecture on-site with discrete manufacturers.",
  },
  {
    name: "Shubh",
    role: "Co-founder & GTM",
    bio: "Based in Atlanta. Drives ASME Y14.5 standards encoding, customer partnerships, and outbound deployments across US job shops and contract manufacturers.",
  },
];

export const designPartner = {
  name: "Exalt Engineering",
  description:
    "High-tension hardware and connector manufacturer with an archive of over 7,000 drawings: die cast and forged parts, custom ERP, and three decades of engineering revisions.",
};
