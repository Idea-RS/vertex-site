# Vertex — design plan

The sentence the site exists to say: *your drawings already know the answer; Vertex reads them exactly and never claims to have checked what it didn't.*

The site is an instrument. Everything on it is either a drawing, a number that was measured, or a sentence in plain verbs. There is one decoration — the dimension line — and it only ever measures something true.

## 1. Tokens (revision 2 — light canvas, blue as the material)

```
Colour (structural — nothing else)
  vx-100  #E0E1DD   page canvas
  vx-900  #0D1B2A   primary text on the canvas
  vx-600  #415A77   secondary text on the canvas (5.41:1); hairlines inside dark viewports
  vx-400  #778DA9   rules and borders on the canvas. Never text on light (2.59:1).
  vx-800  #1B263B   the material: every drawing viewport, dark cards, the primary CTA
                    Inside a viewport: vx-100 linework and text, vx-400 dimension text,
                    vx-600 hairlines — a CAD modelspace inside a light application.

Accent (one hue, two values)
  dim       #F0A868   inside dark viewports only (7.6:1 on vx-800)
  dim-deep  #8F4A14   the same hue re-derived for the light canvas (5.1:1 on vx-100).
                      The brief's #B5641F measures 3.3:1 and fails for 12px mono, so a
                      darker sibling was chosen.
  Never a background, never a gradient, ≤ 1 element per viewport.

Derived tint (not a new hue)
  muted-raised   vx-100 mixed 72% into vx-800 — small secondary text on dark cards (6.7:1)

Radius (encodes hierarchy: larger surface, larger radius)
  lg 16px  page wrapper, containers, DemoFrame, the hero viewport
  md 12px  cards and panels (coverage tray, result panel, verdict, graph card)
  sm  8px  buttons and inputs
  xs  6px  chips and small bars
  Hairline frames follow the curve; viewports clip to their radius with overflow hidden.

Spacing        4px base. Section rhythm: 96 / 128 / 160 (mobile 64 / 80 / 96).
Hairline       1px vx-400 on light; 1px vx-600 inside dark viewports.
Inset          --inset: 10px mobile, 24px ≥ 1024px. Frame hairline vx-400 at 45%.
Content        max-width 1280px.
Stroke         geometry 1.5px, everything else 1px, vector-effect non-scaling.
```

### Contrast after the flip (WCAG 2.x)

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| vx-900 text | vx-100 canvas | 13.24:1 | primary text |
| vx-600 text | vx-100 canvas | 5.41:1 | secondary text, ledes, captions |
| vx-400 | vx-100 canvas | 2.59:1 | rules and borders only — never text |
| dim-deep #8F4A14 | vx-100 canvas | 5.06:1 | dimension lines and numbers on the light page |
| #F0A868 (rejected on light) | vx-100 canvas | 1.52:1 | fails; used inside dark viewports only |
| #B5641F (brief suggestion) | vx-100 canvas | 3.32:1 | fails AA for 12px mono; darker sibling chosen |
| vx-100 text | vx-800 viewport | 11.52:1 | linework, panel text |
| vx-100 text | vx-900 panel | 13.24:1 | result panel, verdict |
| vx-400 text | vx-900 panel | 5.11:1 | metadata inside the Find/Make panels |
| vx-400 text | vx-800 viewport | 4.45:1 | fails for small text; use muted-raised |
| muted-raised #a9adb0 | vx-800 viewport | 6.70:1 | small secondary text on dark cards |
| #F0A868 dim | vx-800 viewport | 7.57:1 | dimension line inside dark viewports |
| vx-100 text | vx-800 button | 11.52:1 | primary CTA |
| vx-900 text | vx-100 nav | 13.24:1 | nav links (active) |

## 2. Type

```
Grotesk   Inter Tight (variable, self-hosted). Headings and all UI. Weights 400/500.
Mono      IBM Plex Mono 400/500 (self-hosted). Numbers, drawing refs, dimension values only.

display   clamp(40px, 5.6vw, 76px)  / 1.0   / -0.025em   500
h2        clamp(28px, 3.4vw, 46px)  / 1.08  / -0.02em    500
h3        22px                      / 1.25  / -0.01em    500
body      17px                      / 1.55                400   vx-900 on the canvas, vx-100 in viewports
small     14px                      / 1.5                 400
mono      13–14px, tabular-nums; stat figures 40–56px mono 400
wordmark  VERTEX, 14px, 500, tracking 0.2em (the only tracked/uppercase text on the site)

Sentence case everywhere. No eyebrows. No arrows on links. Line length ≤ 72ch.
```

## 3. Layout

- One in-flow `sheet` wrapper, inset by `--inset` (24px desktop, 10px mobile) from the viewport, 16px radius, hairline vx-400 at 45%. The canvas continues behind it.
- Nav is sticky at `top: var(--inset)` inside the sheet: wordmark left, five links, one outlined button.
- Sections are separated by vx-400 hairline rules on the light canvas. Dark vx-800 cards (12px) hold anything that is a drawing, a graph or a verdict; everything else is ruled rows.
- Product demos live in `<DemoFrame>`: vx-800 surface, hairline frame, 16:10, corner registration marks, a labelled placeholder until a recording exists. Interactive scenes (Find, Make) render inside it.

## 4. The dimension line (`<Dim>`)

1px dotted line (`stroke-dasharray 1 2`, `shape-rendering: crispEdges`, half-pixel aligned) in `#8F4A14` on the light canvas or `#F0A868` inside a dark viewport, open arrowheads 7px long at 30°, short extension ticks, label in mono in a gap at the midpoint. Two modes: fixed `label`, or `measure` — a ResizeObserver reads the real box of a target and the label is the live pixel value.

Uses on the homepage (six):

| # | Where | Measures | Reads |
|---|-------|----------|-------|
| 1 | Hero | width of the h1, live | `1,142px` (whatever it is) |
| 2 | Problem | height of one stat, live | `88px` |
| 3 | Find | the query-to-result span | `9 ms` |
| 4 | Understand | the 28% segment of the BOM bar, exact | `28%` |
| 5 | Make | width of the demo frame, live | `1,184px` |
| 6 | Between pipeline and deploy | the gap between two sections, live | `128px` |

## 5. Motion budget (revision 4 — one vocabulary)

Lenis for smoothing. **One motion pattern on the page: sticky-left, stepping-right.** A section pins a visual in the left ~55%; the right column holds N short steps. As a step enters the centre band, the visual highlights one element — full vx-100 strokes, a 4px lift, everything else at 25%, an orange dimension-line bracket beside it measuring it — and the step's text is at full strength while the others recede. Transitions 350ms ease-out. No z-space, no blur, no planes flying, no scale beyond the lift. Steps reverse on scroll-back. Below 1024px and under reduced motion the visual is a still above the steps as a plain list.

Three sections use it (explainer, Find, Make) and Verify is the page's one timed rhythm. The only other motion is the hero's scan-to-CAD dissolve. From the Tandem study, the rule for everything else: of six interactive families only two animate; if an element doesn't need to move, it doesn't move.

| Section | Steps | What lights |
|---|---|---|
| Explainer | 5 | one plane of the re-drafted patent sheet per step; bracket on that plane's anchor (frame, ring OD, the 84 chain, the variant table, the title block) |
| Industries | hover, not scroll | the row's label and a square marker; the part illustration crossfades in 250ms |
| Find (rev 5) | 4 | a column of sheets races upward with scroll (a 54-sheet set tiled twice, a vertical blur of 0–4px scaled to scroll velocity); at step 2 it decelerates onto the resting frame (500ms ease-out), the blur clears, the query finishes, the three matches lift and the other 33 drop to 25%; step 3 the result rows; step 4 the honest line. Phones keep the still 6 × 6 wall |
| Verify (rev 5) | timed, 5 × 4s | not scrubbed: all five rule headings stacked, a thin orange line under the active one fills over 4s, the finished heading steps back to vx-600 and the next lights; the other side crossfades a small figure of what the rule checks (350ms); after the fifth the coverage bar resolves — 6 checks against 44,800 fields, a 2px sliver at its true proportion. Plays on enter, pauses on leave, a click on a heading restarts there; reduced motion shows all five with their figures and no timer |
| Make (rev 5) | 4 | a camera: one transform on the sheet wrapper (scale + translate, origin top-left, 700ms ease-in-out) frames the step's region from its own bbox — 3× into the variant table, 1.8× onto the dimension chains, the whole sheet for the gate, 4× into the title block — and the beat plays there as a 350ms change with the bracket on it. Below 1024px and under reduced motion each step carries a static crop computed the same way |
| Product page | hover, not scroll, not pinned | the list row's marker and colour; the pane is replaced |

Between pinned sections there is at least one full viewport of calm copy (`Interlude`), so the page reads as a pinned moment, then rest, then the next.

### Part figures (rev 5)

The eight industry parts are traced from public-domain US patent figures (US 2,218,016; 1,707,664; 1,899,799; 1,739,779; 1,521,934; 2,423,345; 2,390,148; 1,678,640), each an orthographic view with centrelines, witness lines and hatching where the source is a section. Provenance in `docs/part-icons.md`.

### Lighthouse (rev 5, desktop preset, static export)

Home: performance 99, accessibility 100, best practices 100, SEO 100, CLS 0. Product: 100 / 100 / 100 / 100, CLS 0. Page weight is recorded in the rev-5 commit message against the rev-4 build.

### The hero drawing (rev 4)

Landscape, as the brief required: US Patent 2,529,098, George A. Noll, "Pipe coupling", 1950 — the end view of the sealing ring beside the longitudinal section, used rotated so the header reads. Provenance and processing in `docs/hero-sketch.md`; registration overlay in `shots/registration-overlay-r4.png`. The re-draft adds ten dimensions (one angular, one concentricity frame), a three-row variant table, three notes, a compact title block and an A–D / 1–8 zone grid. No parts list, no revision table.

### The hero drawing (rev 3)

The hero is a real public-domain sheet — US Patent 2,090,719, Karl Alt, 1937 — and the vector sheet is a CAD re-draft registered to it (same views, same positions, same scale; provenance and processing in `docs/hero-sketch.md`, registration overlay in `shots/registration-overlay.png`). The re-draft adds what a modern sheet has and the patent doesn't: fourteen dimensions including one angular and one GD&T frame, a ten-row parts list, notes, a tolerance block, a revision table and an A–H / 1–8 zone grid. The sheet is portrait (1800 × 2196), so the explainer lands it height-fit under the nav — about 47% of the container at 1440 × 900 rather than the 55% first sketched.

## 6. Wireframes

### Homepage (desktop)

```
┌─ sheet (inset 24px, 16px radius, hairline) ────────────────────────────────────────────────┐
│ VERTEX          Product  How it works  Security  Diagnostic  About  [Book a diagnostic]
│                                                                                │
│  Your drawings already know the answer.          ┌──────────────────────────┐ │
│  ├──────── 1,142px ────────┤ (dim line)          │  ┌─┐ drawing sheet       │ │
│  Vertex reads every drawing in your archive      │  │ │  ◎  ▐▌▐▌            │ │
│  exactly, finds any part in milliseconds, and    │  └─┘        ▐▌▐▌  table  │ │
│  says what it couldn't check.                    │      A—A          ┌─────┐│ │
│  [Book a diagnostic]  Read how it works           │                   │title││ │
│                                                   └──────────────────────────┘ │
│                     (pinned: sheet explodes into 5 labelled planes, collapses) │
├────────────────────────────────────────────────────────────────────────────────┤
│  “It's faster to draw a new part than to find the old one.”                    │
│  Engineering manager, design partner                                           │
│  ┃961            ┃28%                       ┃36%                                │
│  ┃duplicate      ┃of BOM references point   ┃of drawings connected             │
│  ┃candidates     ┃at superseded drawings    ┃to nothing        ↕ 88px (dim)    │
├────────────────────────────────────────────────────────────────────────────────┤
│  Find                                                                          │
│  Search by number, words, dimensions, or a dropped file.                       │
│  ┌ DemoFrame ───────────────────────────────────────────────────────────────┐  │
│  │  ▫ ▫  ▫   ▫ ▫   ▫  ▫  (thumbnails receding)   ▫  ▫   ▫                    │  │
│  │ ┌──────────────────────┐   ▫   ▫  ▪ ▪ ▪ (hits)   ▫                        │  │
│  │ │ Ø31.77 flange        │        ▪ ▪ ▪ ▪                                   │  │
│  │ │ ├──── 9 ms ────┤     │   ▫  ▪ ▪ ▪      ▫                                 │  │
│  │ │ 10 hits                                                                 │  │
│  │ │ DRG-4120  Flanged housing                                               │  │
│  │ └──────────────────────┘                                                  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────┤
│  Understand                        │   ○──○──●──○   (containment graph)        │
│  53,879 containment edges          │      │  │                                 │
│  Which drawings depend on this one │   ○──●  ○ ┈┈ ○ (superseded, dashed)       │
│  BOM references  ├─ 28% ─┤▒▒▒▒░░░░░░░░░░░░░                    ·  ·  · (36%)   │
├────────────────────────────────────────────────────────────────────────────────┤
│  Make            Pick a row · Generate · Gate · Sign   (steps light in turn)   │
│  ┌ DemoFrame (pinned, 100svh) ─────────────────────────────────────────────┐   │
│  │   ◎  ▐▌▐▌     ▸ S2 160 130 31.77 6      GENERATED — NOT APPROVED (lifts) │   │
│  │   Ø38.10        S4 200 165 38.10 8      ┌ title block: Checked  A.M.P. ┐  │   │
│  │   PASS · 7 checked · 2 not checked                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│  ├──────────────────────────── 1,184px ─────────────────────────────────────┤  │
├────────────────────────────────────────────────────────────────────────────────┤
│  Verify                            │  Coverage                                 │
│  What can be checked, is.          │  Title block fields present     checked   │
│  What can't, is said.              │  Dimension chain closes         checked   │
│                                    │  Thread callout on sheet 2      not checked — no native data
│                                    │  Verdict  PASS · 2 not checked            │
├────────────────────────────────────────────────────────────────────────────────┤
│  Two lanes                                                                     │
│  CAD ──▶ parser ──▶ geometry · dimensions · tables · title block   exact $0.00 │
│  PDF ──▶ vision  ──▶ fields · confidence · crop                    inferred    │
│                                     ↕ 128px (dim, measures the gap)            │
├────────────────────────────────────────────────────────────────────────────────┤
│  Cloud                  │  On-prem                                             │
│  runs in our cloud      │  one container behind your firewall                  │
│  ...                    │  nothing phones home                                 │
├────────────────────────────────────────────────────────────────────────────────┤
│  The diagnostic — two weeks, fixed fee, six deliverables       1. … 6.         │
│  Founders  (two columns, ruled)                                                │
│  FAQ (customer's voice, accordion)                                             │
│  Book the diagnostic  [orange CTA — the only orange in this viewport]          │
│  footer: wordmark · links · "Nothing on this site phones home."                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### /product/make

```
│ VERTEX  ...nav...                                                            │
│ Find   Verify   Make   Archive        (product sub-nav, active underlined)   │
│                                                                              │
│ Make a variant from your own template.                                       │
│ Pick the rows. Vertex regenerates the drawing, gates it, and a named person  │
│ signs it. Until then it says so on the sheet.                                │
│                                                                              │
│ ┌ DemoFrame ─────────────────────────────────────────────────────────────┐   │
│ │ [placeholder: Recording — Make. Not yet available.]                    │   │
│ └────────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│ 1 Pick a row        │ 2 Generate          │ 3 Gate            │ 4 Sign       │
│ table rows are the  │ from your template, │ deterministic     │ a named      │
│ spec …              │ not ours …          │ checks; verdict   │ person …     │
│ ────────────────────┴─────────────────────┴───────────────────┴───────────── │
│ What the gate checks                        │ What the watermark means        │
│ ruled list                                  │ GENERATED — NOT APPROVED …      │
│                                                                              │
│ Book the diagnostic                                                          │
```

## 7. Tells check

| Tell | Status |
|------|--------|
| Near-black + acid accent | No. Canvas is #0D1B2A; the accent is a warm orange used on ≤ 1 element per viewport. |
| Card grids, identical radii and shadows | No cards. Ruled rows and hairline panels; radius 2px; no shadows. |
| Hairline broadsheet look | Hairlines are used for structure, but panels (vx-800) and the drawings carry the weight; not a newspaper. |
| All-caps eyebrows | None. The wordmark is the only uppercase. |
| Arrow-suffixed links | None. |
| Fade-and-slide-up on every section | None. Four scroll moments total, all scrubbed. |
| Hover lift on cards | None. Hover changes colour only. |
| Gradient / glow / blob | None. |
| Single accented word in a headline | None. |

## 8. Removed before shipping

- Section index numbers (`01`, `02`) beside headings — an accessory. Gone.
- A seventh dimension line measuring the FAQ column. Gone.

## 9. Placeholders that need real content

`src/content/site.ts` — founder names and bios, contact email. Everything else on the site is supplied by the brief.
