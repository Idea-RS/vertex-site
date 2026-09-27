"use client";

import dynamic from "next/dynamic";

const Dither = dynamic(() => import("@/components/Dither"), {
  ssr: false,
});

export default function DitherBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden"
      aria-hidden="true"
    >
      <Dither
        waveColor={[0.5, 0.5, 0.5]}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0}
        colorNum={4.7}
        waveAmplitude={0.2}
        waveFrequency={6.5}
        waveSpeed={0.01}
        backgroundColor={[0.050980392156862744, 0.10588235294117647, 0.16470588235294117]}
      />
    </div>
  );
}
