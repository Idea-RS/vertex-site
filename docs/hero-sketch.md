# Hero drawing — provenance

The hero shows a real, public-domain engineering drawing: sheet 1 of a 1937 United States patent, chosen from three candidates against the criteria below. The vector sheet that draws over it on scroll is a CAD re-draft of the same views at the same positions.

## Chosen sheet

| | |
|---|---|
| Patent | US 2,090,719 |
| Title | Form of pipe coupling |
| Inventor | Karl Alt |
| Filed | 1935-12-26 (original filing; sheet header reads "Original Filed Dec. 26, 1935") |
| Granted | 1937-08-24 |
| Sheet | Drawings, sheet 1 of 2 (Figs. 1–4) |
| Source page | https://patents.google.com/patent/US2090719A/en |
| Source image | Google Patents full-resolution page image, `US2090719-drawings-page-1.png` (2320 × 3408, bilevel), served from `patentimages.storage.googleapis.com` and linked from the page above |
| Official copy | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/2090719 (USPTO, PDF, page 1 is this sheet) |
| Licence | Public domain. Works of the United States Government, and US patent documents in particular, are not subject to copyright (17 U.S.C. § 105; 37 CFR § 1.71(d) permits only a limited copyright notice on the *specification*, never on the drawings, and this patent carries none). The 1937 grant is also long past any term. |

## Files

- `public/hero/patent-source.png` — the source page image, byte-for-byte as downloaded. 2320 × 3408.
- `public/hero/sketch.webp` — the processed hero. Cropped to the drawn sheet (the printed header through the FIG. 3 / FIG. 4 captions: source region x 150–2060, y 400–2730, which leaves out the scanner's black edge bar at x ≈ 2100, the blank lower third of the page and the inventor's signature), no rotation needed (the scan's edge bar is vertical to the pixel over the full height, so skew is < 0.05°), converted to grey, softened by 0.6 px so the bilevel scan reads as paper and ink rather than vector, contrast lifted gently (`linear 0.94, +12`), tinted to a warm paper white, resized to 1800 × 2196, WebP q82. The Google page image is bilevel, so the "texture" that survives is the scan's own edge roughness; nothing was cleaned or re-traced.

## Why this one

Karl Alt's coupling is the sheet a machinist would recognise as a drawing rather than a diagram: four orthographic views in a proper arrangement — a longitudinal section (Fig. 1) beside its end view (Fig. 2), and the mating half below it (Figs. 3 and 4) — with section hatching, hidden lines, centre lines and a handful of reference numerals, and almost no handwriting apart from the signature that was cropped away. The other two finalists were more, not better: Nathan C. Hunt's *Valve and coupling* (US 1,850,879, 1932) has five dense sectional views and some seventy leaders, which would fight a vector overlay and any dimension chain placed on top; George F. Hauf's *Pipe coupling* (US 2,508,716, 1950) is a fine sheet but its two rotated elevations carry cursive numerals and a slanted caption that read as a sketch, not a drawing. Alt's geometry is also honest to re-draft: concentric circles, straight bores, tapered inserts and hatched walls, every one of which the vector sheet can sit on within a few pixels.

## Candidates considered

| Patent | Title | Year | Verdict |
|---|---|---|---|
| US 2,090,719 | Form of pipe coupling (Karl Alt) | 1937 | **Chosen.** Four views, two hatched sections, sparse numerals. |
| US 1,850,879 | Valve and coupling (Nathan C. Hunt) | 1932 | Too dense: five sections, ~70 leaders. |
| US 2,508,716 | Pipe coupling (George F. Hauf) | 1950 | Rotated views, cursive numerals; reads as a sketch. |
| US 2,271,336 | Bearing mounting (Lester M. Goldsmith) | 1942 | One large elevation, captions rotated; not an orthographic set. |

Screenshots of the three finalists: `shots/candidates/` (not committed).

## Selection criteria

Issued 1900–1960, single mechanical part or small assembly, 2–4 orthographic views on one sheet, ideally a hatched section, clean paper, minimal handwriting, era-typical figure numbers and reference numerals; must read as an engineering drawing to a machinist. Source restricted to Google Patents page images or the USPTO — no third-party scan sites, no other country's office.
