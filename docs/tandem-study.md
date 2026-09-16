# Tandem study — tandem.inc, 2026-09-17

Loaded in a real Chrome (the chrome-devtools session used for our own screenshots), 1440 × 900 desktop and 390 × 844 mobile. Every hover below was performed with a real pointer and the generated CSS read from computed styles; screenshots in `shots/tandem/` (not committed). The site is built in Framer, so most transitions are inline `transition: all` with Framer's default spring; where a duration is stated it was read from the element's inline style.

Pages visited: `/`, `/platform`, `/company`, `/research`.

## Hover states

| Element | Before → after | What changes | Duration / easing | What does not move |
|---|---|---|---|---|
| Nav items (Platform, Company, Research) | `industries-before.png` header vs `nav-hover.png` | The 64px cell fills with `#EDE7E2` (from `rgba(237,231,226,0)`); text stays `#11100E` | Framer default (~0.3s, ease) | Text colour, size, underline: nothing. The cell is the hover target, not the word. |
| Login / Book a Demo | `cta-hover.png` | Nothing measurable: `#11100E` fill, white text, 2px radius, 48px tall, before and after | — | Everything. The primary button has no hover state at all. |
| Industries tiles (home, "Designed for complex hardware teams") | `industries-before.png` → `industries-hover.png` | The hovered tile's width goes 161 → 217px and its neighbours 161 → 153px; the icon card is replaced by a photograph tagged `[ HOVER ]`; the `[01]` label and the name fade in from `opacity:0; translateY(10px)` | Width: `0.2s ease-in-out`. Label/name: `opacity 0.1s 0.2s, transform 0.1s 0.2s` — they wait for the width to finish, then appear in 100ms | Colour, background, borders. Nothing scales. The row's height is fixed at 400px. |
| Platform section list (Tandem Watch · Design Reviews · Systems Engineering · Assist & Automations) | `platform-list-before.png` → `platform-list-hover.png` | Hovering an inactive row makes it Active: an 8×8 black square marker appears before it (`translateY(-4px)`), its text goes from grey to `#11100E`; the previous row goes grey. The right-hand pane swaps image and the copy block below the list swaps heading and paragraph. | Row: Framer variant switch, ~0.2s. Pane: no transition survives on the persisting node — the new pane replaces the old; visually a near-instant swap, at most a short fade. | Position, size, layout. Nothing slides. The ← → arrows below the copy step the same state. No auto-advance in 4.5s of watching. |
| Research cards | `research-card-hover.png` | Nothing: image transform none, opacity 1, title colour unchanged, before and after | — | Everything. Cards rely on the cursor alone. |
| Testimonial list (home, "Used in real hardware workflows") | `industries-before.png` lower half | Same Active/Inactive row pattern as the platform list: square marker + black text for the active company, grey for the rest; the quote swaps | as platform list | — |

The restraint is the finding: of six interactive families, two animate (tiles, list rows), one fills a cell, three do nothing.

## Type

- Display: **Trois Mille** (regular). Body and UI: **Scto Grotesk A** (regular). Two families, one weight each (400 everywhere; nothing bold).
- Scale (px, desktop): h1 64 / 57.6 line-height / −1.92px tracking (home); 55 / 53 / −1.1 (platform, company); section h3 40 / 40 / −0.4; module names on `/platform` 100 / 100; h2 and h4 25 / 32 / −0.25 (or 25/25/−0.5 in lists); body 17 / 24; nav and small UI 14 / 14 / −0.14; captions and labels 9–10 / 1em.
- Body line-height 24px on 17px (1.41). Headlines set solid (line-height = size) with negative tracking that grows with size.

## The label grammar

- `[01]` … `[08]` on the industries tiles: 9px Scto Grotesk, `#11100E`, uppercase, line-height 1em, sits above the tile name (17px). Hidden until hover.
- `[ AUG 28, 2026 ]` above each research card: 9.5px, uppercase, `#11100E`, normal tracking; the brackets are typed characters, not a border.
- `[0,0]` under the footer's "The context layer for hardware engineering": 10px, white on `#11100E`, −0.1px tracking. `SAN FRANCISCO` and `[ WED 12:26 PM ]` in the footer bar: 9–10px, uppercase, white.
- `[We're Hiring]` on `/company` as a link.
- Structurally the brackets do one job: they mark metadata as *instrument readout* — an index, a timestamp, a coordinate — so it reads as a different register from copy without needing colour or a rule. They are always tiny (≤ 10px), never tracked out, and never on headings.

## The image tickers

- Home hero and home/platform CTA ("Build better hardware, faster"): a scatter of 40 small square thumbnails (6–40px) over a ~1000 × 700 area, each drifting independently at roughly 1–2px per 600ms in its own direction — a slow float, not a ticker. No CSS animation; positions are updated by script (Framer motion values). No edge mask: tiles simply sit inside the bounds.
- `/company` hero and mid-page: four horizontal rows of photographs (100–260px wide, mixed aspect ratios, ~20–40px gaps) scrolling left at 50px/s, all rows the same speed, no edge fade, clipped by the section.
- `/research` hero: one row of photographs, same 50px/s leftward, mixed sizes (137–300px tall), gaps 20–40px, no fade.

## The section-list pattern (`/platform`, "Four connected modules. One platform.")

- Left: four names, 17px Scto Grotesk, 28px row pitch, at x = 20 (the page's edge padding). Active row: 8×8 `#11100E` square before the name, name in `#11100E`. Inactive rows: name in light grey (≈ `#B8B4AE`, ~2.4:1 — decorative-low contrast), no marker, `cursor: pointer`.
- Switching is **on hover** (and on the ← → arrows). Scrolling the page does not change the active row: at scroll 0, 800 and 1600 the same row stayed Active. The section is not pinned; it scrolls away like any block.
- Right pane: one image 840 × 598 at x = 580; below the list at left, a 25/32 heading and a 17/24 paragraph. On switch the image, heading and paragraph are replaced; the persisting wrapper shows no transition (opacity 1, transform none at every 40ms sample over 640ms), so the swap reads as instantaneous or a very short fade under Framer's variant change.
- Mobile (390px): the list is gone. The four modules stack: illustration → `[01] TANDEM WATCH` (uppercase label) → heading → paragraph, repeated four times. No hover dependency, nothing to tap.

## Spacing rhythm

- Container: full width with 20px side padding; max width 1640px. Content sits hard against the left edge (h1 at x = 20).
- Section padding: 80/80 (logos), 120/120 (feature sections), 200 top on the dark manifesto section; hero 900px tall (100vh) with 64px top padding under a 64px nav.
- Between "moments": a 336px band of copy (120 padding + 96 text) separates the module carousel from the loop section; the industries section is 844px with 120/120 padding for one row of 400px tiles — more air than content.
- Dark bands alternate with the warm `#F5F0ED` canvas: home has one, platform two, company two. Each is a full-bleed colour change, no gradient, no border.

## What makes it feel premium — five transferable techniques

1. **Hover changes exactly one property and only on the thing under the cursor.** The nav cell fills with a tint; the text doesn't move. A list row gains a marker and its colour; the pane is replaced, not animated. Nothing scales, nothing lifts, nothing casts a shadow — so the few things that do move (tile width 0.2s ease-in-out, then a 100ms fade of the label after a 200ms delay) read as deliberate.
2. **Sequenced, not simultaneous.** The tile's label waits for the width to finish (`transition-delay: 0.2s`) and then appears in 100ms. Two short transitions in series feel considered; one long one feels animated.
3. **One weight, two families, solid-set headlines.** Everything is regular 400. Hierarchy comes from size (100 / 64 / 40 / 25 / 17 / 9.5) and negative tracking that scales with size, never from bold. The 9.5px bracketed labels are the only "colour" in the type system.
4. **Metadata in brackets, never in chrome.** `[01]`, `[ AUG 28, 2026 ]`, `[0,0]`, `SAN FRANCISCO` do the job of badges, tags and dividers at 9–10px with no background, no border, no icon.
5. **Air as a material.** 120px section padding, a 336px band of plain copy between two rich sections, full-bleed dark bands with no transitional gradient. The pinned moments are rare (none on the home page), so the page reads as calm pages with occasional instruments, not a demo reel.

Two things not to copy: the inactive-row grey (~2.4:1) is below AA and the primary button has no focus or hover state at all; ours keep vx-600 (5.4:1) for inactive rows and a visible focus ring.
