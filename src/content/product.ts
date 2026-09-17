import { archive } from "./site";

/** The four surfaces of the product, one pane each on /product. Numbers are real. */
export const productPanes = [
  {
    id: "find",
    name: "Find",
    heading: "Find any part by number, words, dimensions, or a dropped file.",
    body: [
      "The drawing you need already exists. Vertex makes the whole archive searchable in milliseconds, in the language of your own title blocks and notes.",
      "Exact values from native CAD and inferred values from PDFs are matched together and told apart in the result, so a hit says where each number came from.",
      "Drop a drawing and get its family, its duplicate candidates, and what contains it.",
    ],
    numbers: [
      { value: archive.searchP1, label: "precision at one, measured on one manufacturer's archive" },
      { value: `${archive.familyMs} ms`, label: "to find a family of ten drawings" },
    ],
  },
  {
    id: "verify",
    name: "Verify",
    heading: "Deterministic checks, with honest coverage.",
    body: [
      "The checks are rules. They pass, they fail, or they couldn't run, and every verdict lists all three.",
      "A check that couldn't run says why: no native data, a scan below the resolution floor, a field that isn't on the sheet. It counts against nothing and it is never presented as a pass.",
      "The coverage line is the point: how many checks ran against how many fields exist.",
    ],
    numbers: [{ value: "6 of 44,800", label: "checks run against fields that exist, stated on every verdict" }],
  },
  {
    id: "make",
    name: "Make",
    heading: "Make a variant from your own template.",
    body: [
      "Pick the rows you need from your own variant table. Vertex regenerates the sheet from your template, not ours, so every dimension follows the row and the notes stay yours.",
      "The gate runs the same checks on the new sheet and the verdict reads PASS before anything can be downloaded.",
      "A named person signs. Until then the sheet says GENERATED — NOT APPROVED on its face, drawn into the drawing, not overlaid.",
    ],
    numbers: [
      { value: "PASS", label: "before download, every time" },
      { value: "Signed", label: "by a named person, with the checks they saw" },
    ],
  },
  {
    id: "archive",
    name: "Archive",
    heading: "The archive report: what's duplicated, stale, and isolated.",
    body: [
      "Once every drawing is read and every reference is an edge, the archive can be asked questions it has never answered.",
      "Duplicate candidates are ranked by the dimensions they share. Stale references list the revision a bill of material names and the current one. Isolated drawings are the ones referenced by nothing.",
      "The report is the first deliverable of the two-week diagnostic, and the search index it builds stays on your network.",
    ],
    numbers: [
      { value: archive.bomSupersededLabel, label: "of BOM references pointed at superseded drawings" },
      { value: archive.isolatedLabel, label: "of drawings connected to nothing" },
      { value: "6", label: "deliverables from the diagnostic, all yours to keep" },
    ],
  },
] as const;

export type ProductPaneId = (typeof productPanes)[number]["id"];
