# Sublevel Studio Landing Page (ThreeUI)

Interactive digital studio and brand workshop landing page component `<SublevelStudioLandingPage />` integrated from ThreeUI using its exact source revision, shaders, motion, and Three.js 0.160 runtime.

## Features

- **Tactile B&W Operating System Interface**: Modular project showcase cells, service diagnostics, team profiles, and terminal-style contact close.
- **Interactive 3D Loft Environment**: Custom Three.js 0.160 scene with loft architecture, developer & dog, lighting, arcade cabinet, and retro CRT monitors.
- **3D Card Fold-out Menu**: Paper-bending projective homography transformation that tracks the 3D sheet in real-time.
- **Top Utility Dock**: Micro-interactions with rAF-throttled flashlight illumination effect on pointer movement.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

## Configured Usage

```tsx
import { SublevelStudioLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <SublevelStudioLandingPage />
    </div>
  );
}
```

## Source References

- Canonical HTML: [`public/landing-pages/sublevel-studio.html`](public/landing-pages/sublevel-studio.html)
- Frame Component: [`src/shaders/landing-pages/LandingPageFrame.tsx`](src/shaders/landing-pages/LandingPageFrame.tsx)
- Landing Pages Registry: [`src/shaders/landing-pages/LandingPages.tsx`](src/shaders/landing-pages/LandingPages.tsx)
- ThreeUI Stylesheet: [`src/shaders/threeui.css`](src/shaders/threeui.css)
