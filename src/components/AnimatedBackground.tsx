"use client";

import { useEffect, useState } from "react";
import { DitheringShader } from "@/components/ui/dithering-shader";

export default function AnimatedBackground() {
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 1920, h: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const set = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div 
        className="pointer-events-none fixed inset-0 z-0" 
        style={{ 
          zIndex: 0, 
          background: "#0a1224",
          margin: 0,
          padding: 0,
          overflow: "hidden"
        }}
      />
    );
  }

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0" 
      style={{ 
        zIndex: 0, 
        background: "#0a1224",
        margin: 0,
        padding: 0,
        overflow: "hidden"
      }}
    >
      <DitheringShader
        shape="swirl"
        type="4x4"
        colorBack="#0a1224"
        colorFront="#1e90ff"
        pxSize={4}
        speed={0.4}
        className="absolute inset-0"
        width={size.w}
        height={size.h}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}


