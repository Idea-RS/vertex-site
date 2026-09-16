# Hero drawing — provenance

The hero shows a real, public-domain engineering drawing: sheet 1 of a 1950 United States patent, chosen from three landscape candidates against the criteria below. The vector sheet that draws over it on scroll is a CAD re-draft of the same two views at the same positions and scale.

Revision 4 replaced the earlier portrait sheet (US 2,090,719, Karl Alt, 1937) with a landscape one, as the brief required; Alt's sheet remains in the Find archive.

## Chosen sheet

| | |
|---|---|
| Patent | US 2,529,098 |
| Title | Pipe coupling |
| Inventor | George A. Noll |
| Filed | 1946-03-27 |
| Granted | 1950-11-07 |
| Sheet | Drawings, sheet 1 (Fig. 1, longitudinal section through the coupling; Fig. 2, end view of the sealing ring). The figures were drawn landscape on a portrait page; the sheet is used rotated 90° so the header reads and the two views sit side by side. |
| Source page | https://patents.google.com/patent/US2529098A/en |
| Source document | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/2529098 — the USPTO's own PDF of the patent, page 1. (Google Patents' full-page image for this patent is served only as an 82 × 120 thumbnail, so the official PDF was used instead.) |
| Licence | Public domain. US patent documents are works of the United States Government and are not subject to copyright (17 U.S.C. § 105; 37 CFR § 1.71(d) permits at most a limited copyright notice on a specification's text, never on the drawings; this patent carries none). The 1950 grant is also outside any term. |

## Files

- `public/hero/patent-source.pdf` — the USPTO PDF, byte-for-byte as downloaded.
- `public/hero/patent-source.png` — page 1 of that PDF rasterised at 2314 × 3400 (Quick Look, `qlmanage -t -s 3400`), portrait as printed, untouched.
- `public/hero/sketch.webp` — the processed hero, 1800 × 1229 (landscape 1.465:1). Rotated 90° clockwise so the printed header reads upright down the right edge; cropped to the drawn sheet (source region x 290–2970, y 200–2030 after rotation, which excludes the scanner's black edge bar); no deskew needed (the edge bar is straight to the pixel); converted to grey, softened by 0.6 px so the bilevel render reads as paper and ink, contrast lifted gently (`linear 0.94, +12`), tinted to a warm paper white, WebP q82. Nothing was cleaned or re-traced; the pipes' hand-drawn line shading and the inventor's signature are as printed.

## Why this one

Noll's coupling is the landscape sheet that reads as a drawing: two views in a proper relationship — the end view of the sealing ring beside the longitudinal section it belongs to — with hatched section walls, a section line with arrows, centre lines, typeset header, and a dozen plain numerals. Its geometry is honest to re-draft: concentric circles, straight pipe walls and a sleeve profile of a few beads. The runner-up, Lester M. Goldsmith's *Bearing mounting* (US 2,271,336, 1942), has the same two-view layout but a large, dense housing section and cursive captions; Arthur B. Lakey's *Spherical bearing* (US 2,785,022, 1957) is one view, wall-to-wall hatching. Of the other landscape sheets in the archive, Hauf's coupling (US 2,508,716) stacks its views vertically and Goodner's pump (US 2,506,827) is a single busy section.

## Candidates considered (all landscape)

| Patent | Title | Year | Verdict |
|---|---|---|---|
| US 2,529,098 | Pipe coupling (George A. Noll) | 1950 | **Chosen.** Two views side by side, hatched section, sparse plain numerals. |
| US 2,271,336 | Bearing mounting (Lester M. Goldsmith) | 1942 | Two views, but a dense housing section and cursive captions. |
| US 2,785,022 | Spherical bearing (Arthur B. Lakey) | 1957 | One view; hatching wall to wall. |

Screenshots of the three finalists, rotated upright: `shots/candidates-r4/` (not committed).

## Selection criteria

Landscape sheet (hard requirement), issued 1900–1960, 2–3 views laid out horizontally, ideally a hatched section, clean paper, minimal handwriting, era-typical figure numbers and reference numerals; must read as an engineering drawing to a machinist. Source restricted to Google Patents page images or the USPTO.
