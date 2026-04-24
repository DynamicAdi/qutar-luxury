"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: React.PropsWithChildren) {
  useEffect(() => {
    const lenis = new Lenis({
      // smoother motion
      lerp: 0.075,
      duration: 1.25,

      easing: (t: number) => 1 - Math.pow(1 - t, 4),

      orientation: "vertical",
      gestureOrientation: "vertical",

      smoothWheel: true,

      // touch control
      touchMultiplier: 0.9,
      syncTouch: true,
      syncTouchLerp: 0.08,

      infinite: false,
      autoResize: true,
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}