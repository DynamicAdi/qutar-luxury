"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTA() {
  return (
    <section
      // ref={sectionRef}
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
