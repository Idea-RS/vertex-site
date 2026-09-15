# Vertex — design plan

The sentence the site exists to say: *your drawings already know the answer; Vertex reads them exactly and never claims to have checked what it didn't.*

The site is an instrument. Everything on it is either a drawing, a number that was measured, or a sentence in plain verbs. There is one decoration — the dimension line — and it only ever measures something true.

## 1. Tokens

```
Colour (structural — nothing else)
  vx-900  #0D1B2A   page canvas, deepest surface
  vx-800  #1B263B   raised surfaces, drawing viewport, panels
  vx-600  #415A77   borders, rules, hairlines, redaction bars
  vx-400  #778DA9   secondary text, metadata, dimension text   (5.1:1 on vx-900)
  vx-100  #E0E1DD   primary text, linework, wordmark

Accent (one)
  dim     #F0A868   dimension-line motif; the final CTA button only.
                    Never a background, never a gradient, ≤ 1 element per viewport.

Derived tint (not a new hue)
  muted-raised      vx-100 mixed 72% into vx-800 — small secondary text on vx-800
                    panels, because vx-400 on vx-800 is 4.45:1 and fails AA by a hair.

Spacing        4px base. Section rhythm: 96 / 128 / 160 (mobile 64 / 80 / 96).
Radius         2px everywhere. Nothing rounder. No shadows anywhere.
Hairline       1px vx-600. Frame hairline at 45% opacity.
Inset          --inset: 20px mobile, 48px ≥ 1024px.  Content max-width 1280px.
Stroke         geometry 1.5px, everything else 1px, vector-effect non-scaling.
```

## 2. Type

```
Grotesk   Inter Tight (variable, self-hosted). Headings and all UI. Weights 400/500.
Mono      IBM Plex Mono 400/500 (self-hosted). Numbers, drawing refs, dimension values only.

display   clamp(40px, 5.6vw, 76px)  / 1.0   / -0.025em   500
h2        clamp(28px, 3.4vw, 46px)  / 1.08  / -0.02em    500
h3        22px                      / 1.25  / -0.01em    500
body      17px                      / 1.55                400   vx-100
small     14px                      / 1.5                 400
mono      13–14px, tabular-nums; stat figures 40–56px mono 400
wordmark  VERTEX, 14px, 500, tracking 0.2em (the only tracked/uppercase text on the site)

Sentence case everywhere. No eyebrows. No arrows on links. Line length ≤ 72ch.
```

## 3. Layout

- One in-flow `sheet` wrapper, inset by `--inset` from the viewport, hairline vx-600 at 45%. The canvas continues behind it.
- Nav is sticky at `top: var(--inset)` inside the sheet: wordmark left, five links, one outlined button.
- Sections are separated by hairline rules, not by background bands. No cards; lists are ruled rows.
- Product demos live in `<DemoFrame>`: vx-800 surface, hairline frame, 16:10, corner registration marks, a labelled placeholder until a recording exists. Interactive scenes (Find, Make) render inside it.

## 4. The dimension line (`<Dim>`)

1px dotted `#F0A868` (`stroke-dasharray 1 2`, `shape-rendering: crispEdges`, half-pixel aligned), open arrowheads 7px long at 30°, short vx-600 extension ticks, label in mono in a gap at the midpoint. Two modes: fixed `label`, or `measure` — a ResizeObserver reads the real box of a target and the label is the live pixel value.

Uses on the homepage (six):

| # | Where | Measures | Reads |
|---|-------|----------|-------|
| 1 | Hero | width of the h1, live | `1,142px` (whatever it is) |
| 2 | Problem | height of one stat, live | `88px` |
| 3 | Find | the query-to-result span | `9 ms` |
| 4 | Understand | the 28% segment of the BOM bar, exact | `28%` |
| 5 | Make | width of the demo frame, live | `1,184px` |
| 6 | Between pipeline and deploy | the gap between two sections, live | `128px` |

## 5. Motion budget

Lenis for smoothing. GSAP ScrollTrigger, `scrub: 1`, on every scroll-driven effect. Nothing autoplays except the hero's one-time draw-on. `will-change: transform` only while a scene's trigger is active. `prefers-reduced-motion`: no Lenis, no triggers, every scene renders its final frame.

| Section | The one moment |
|---------|----------------|
| Hero | draw-on (1.2s, geometry, dimensions +300ms), then the exploded sheet — five planes separate in z with 80ms lag, back planes blur 1px, labels appear, then collapse back flat |
| Find | camera moves forward through six depth layers of sheet thumbnails; at 0.6 ten sheets light and the rest dim; the result panel fills: 10 hits in 9 ms |
| Understand | containment edges draw on as the graph enters |
| Make | row marker moves S2→S4, dimension text updates, verdict reads PASS, watermark lifts, initials appear in the title block |
| Everything else | still |

## 6. Wireframes

### Homepage (desktop)

```
┌─ sheet (inset 48px, hairline) ────────────────────────────────────────────────┐
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
│  │ │ EEI-3057  Bearing housing, flanged                                      │  │
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
