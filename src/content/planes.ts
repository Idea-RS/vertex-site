import type { PatentPlane } from "@/components/drawing/PatentSheet";

/** What each plane of a sheet is, and what Vertex does with it. Shown on hover in the explainer. */
export const planeDescriptions: Record<PatentPlane, { title: string; what: string; vertex: string }> = {
  "border-zones": {
    title: "Border and zones",
    what: "The sheet's coordinate grid: letters down the sides, numbers along the top and bottom, so any feature can be named by its cell. It is the first thing a drawing office standardises and the last thing anyone reads.",
    vertex: "Every finding Vertex reports is placed by zone, so a reviewer opens the sheet and goes straight to D4.",
  },
  geometry: {
    title: "Geometry",
    what: "The part's linework: outlines, section hatching, centre lines and hidden detail, drawn to scale in the views the draughtsman chose. This is the part; everything else on the sheet describes it.",
    vertex: "Read exactly from native CAD and never re-drawn. A scan is read by the vision lane instead, and marked as inferred.",
  },
  dimensions: {
    title: "Dimensions",
    what: "Chains, diameters, angles and geometric tolerances: the numbers that turn linework into something a machinist can make and an inspector can check. A chain that doesn't close is a part that can't be made.",
    vertex: "Each value is verified against the sheet's own tables and against the ERP, and every chain is checked to close.",
  },
  "tables-notes": {
    title: "Tables and notes",
    what: "A parts list names what the reference numerals point at; a variant table defines the sheet's variables; the notes carry the house rules that never make it into a dimension. Together they are the sheet's small print.",
    vertex: "Both are parsed: table rows become the variables a variant is generated from, and notes become checks.",
  },
  "title-block": {
    title: "Title block",
    what: "Drawing number, revision, scale, sheet count, and who drew, checked and approved it. It is the sheet's identity and the only place its status is written down.",
    vertex: "Read as the drawing's identity and its approval state. Anonymised here: name and address redacted, initials replaced.",
  },
  revision: {
    title: "Revision table",
    what: "The sheet's history, one row per change: what moved, when, and who signed it. On paper it is often the only record that an earlier revision ever existed.",
    vertex: "Supersessions the archive never recorded are recovered from these rows and linked, so a bill of material can be checked against the revision it actually names.",
  },
};
