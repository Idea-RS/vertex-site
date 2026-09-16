# Vertex — marketing site

Fully static Next.js (App Router) site. No server, no third-party scripts, no external fonts, no analytics.

Light canvas (vx-100), blue as the material: every drawing viewport and card is vx-800 with vx-100 linework. Radii encode hierarchy (16 / 12 / 8 / 6 px). Contrast table lives in `docs/design-plan.md`.

```
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to out/
npm run start      # serves out/ locally
```

Deploy `out/` to any static host (S3, nginx, Cloudflare Pages, Netlify, GitHub Pages…). `trailingSlash: true` so every route is a folder with an `index.html`.

## Where things live

| Path | What |
|------|------|
| `docs/design-plan.md` | Tokens, type, wireframes, motion budget, tells check |
| `src/app/globals.css` | The design tokens (`@theme`) and base styles |
| `src/content/site.ts` | Every number and claim on the site. **Placeholders marked `TODO(content)`: founder names/bios, contact email.** |
| `src/components/drawing/Sheet.tsx` | The engineering drawing, in five planes, anonymised title block |
| `src/components/Dim.tsx` | The dimension-line motif; measures real elements live |
| `src/components/DemoFrame.tsx` | The 16:10 product viewport; pass `src` when recordings arrive |
| `src/components/home/*` | Homepage sections; `Hero`, `Find`, `Make`, `Understand` carry the scroll scenes |
| `src/fonts/` | Inter Tight (variable) and IBM Plex Mono 400/500, self-hosted (OFL) |

## Motion

Lenis smooths scroll; GSAP ScrollTrigger (`scrub: 1`) drives every scroll scene. Under `prefers-reduced-motion` nothing initialises and each scene renders its final frame. The hero explode runs at ≥1024px only.

## Recordings

Each `<DemoFrame label="…">` shows a labelled placeholder until you pass `src="/recordings/find.mp4"` (put files in `public/recordings/`).
