"use client";

import { DitheringShader } from "@/components/ui/dithering-shader";

export default function DemoOne() {
  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black">
      <DitheringShader 
        shape="swirl"
        type="4x4"
        colorBack="#220011"
        colorFront="#00ffff"
        pxSize={4}
        speed={0.9}
        className="absolute inset-0"
        width={1200}
        height={1200}
      />
      <span className="pointer-events-none z-10 text-center text-7xl leading-none absolute font-semibold text-white tracking-tighter whitespace-pre-wrap">
        Swirl
      </span>
    </div>
  );
}


