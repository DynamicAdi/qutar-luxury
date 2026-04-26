"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* start lower and force it to be an overlay */
      gsap.set(sectionRef.current, {
        y: 40,
        position: "relative", // Required for z-index to work
        zIndex: 10, // Keeps this section on top of the section below it
      });

      /* move upward on scroll */
      gsap.to(sectionRef.current, {
        yPercent: -108,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          // Changing to "top top" usually works best for overlay reveals,
          // meaning the effect starts when the section hits the top of the viewport.
          start: "top top",
          end: "+=100%", // Animates over the scroll distance of its own height
          scrub: 1.2,
          pin: true,
          pinSpacing: false, // CRITICAL FIX: Stops GSAP from adding extra padding/layout disruption
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-transparent"
    >
      {/* Background */}
      <Image
        src="/CTA.png"
        alt="CTA Image"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          <h4 className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-3xl font-semibold text-transparent md:text-6xl">
            Find You. We’ll Help You Get There.
          </h4>

          <Button
            variant="secondary"
            className="h-13 rounded-full px-6 text-lg"
          >
            Let&apos;s Get Started
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
