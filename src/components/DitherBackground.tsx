"use client";

import dynamic from "next/dynamic";

const Dither = dynamic(() => import("@/components/Dither"), {
  ssr: false,
});

export default function DitherBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden opacity-60"
      aria-hidden="true"
    >
      <Dither
        waveColor={[0.05882, 0.20392, 0.37647]} /* Prussian Blue #0F3460 */
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0}
        colorNum={4.5}
        waveAmplitude={0.16}
        waveFrequency={5.8}
        waveSpeed={0.008}
        backgroundColor={[0.10196, 0.10196, 0.18039]} /* Midnight Blue #1A1A2E */
      />
    </div>
  );
}
