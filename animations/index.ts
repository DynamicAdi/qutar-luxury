// hooks/useSectionRevealOnScroll.ts

"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Variants } from "framer-motion";
import { useEffect, useRef } from "react";

type UseSectionRevealOnScrollProps = {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;

  yPercent?: number;
};

export function useSectionRevealOnScroll({
  start = "bottom top",
  end = "+=1500",
  scrub = true,
  pin = true,

  yPercent = -100, // move fully upward
}: UseSectionRevealOnScrollProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const nextSection = section.nextElementSibling as HTMLElement | null;
    if (!nextSection) return;

    const ctx = gsap.context(() => {
      // current section overlays next one
      gsap.set(section, {
        position: "relative",
        zIndex: 20,
        willChange: "transform",
      });

      gsap.set(nextSection, {
        position: "relative",
        zIndex: 10,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start,
          end,
          scrub,
          pin,
          anticipatePin: 1,
        },
      });

      // move current section upward revealing below section
      tl.to(section, {
        yPercent,
        ease: "none",
      });
    }, section);

    return () => ctx.revert();
  }, [start, end, scrub, pin, yPercent]);

  return {
    sectionRef,
  };
}
type UseScrollStrokeRevealProps = {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;

  strokeDuration?: number;
  fillDelay?: number;
  fillOpacity?: number;
};

export function useScrollStrokeReveal({
  start = "top top",
  end = "+=1800",
  scrub = true,
  pin = true,

  strokeDuration = 1,
  fillDelay = 0.65,
  fillOpacity = 1,
}: UseScrollStrokeRevealProps = {}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const text = textRef.current;

    if (!trigger || !text) return;

    const ctx = gsap.context(() => {
      const length = text.getComputedTextLength();

      gsap.set(text, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fillOpacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub,
          pin,
          anticipatePin: 1,
        },
      });

      tl.to(text, {
        strokeDashoffset: 0,
        duration: strokeDuration,
        ease: "none",
      }).to(
        text,
        {
          fillOpacity,
          duration: 0.4,
          ease: "none",
        },
        fillDelay
      );
    }, trigger);

    return () => ctx.revert();
  }, [start, end, scrub, pin, strokeDuration, fillDelay, fillOpacity]);

  return {
    triggerRef,
    textRef,
  };
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 70 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const staggerWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.15,
    },
  },
};

export const lineReveal: Variants = {
  hidden: {
    scaleX: 0,
    transformOrigin: "left",
  },
  show: {
    scaleX: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.08,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function useZoomScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".zoom-card");

      cards.forEach((card) => {
        const image = card.querySelector(".zoom-image");
        const overlay = card.querySelector(".zoom-overlay");

        if (!image || !overlay) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          image,
          { scale: 0.75, opacity: 0.7 },
          { scale: 1.15, opacity: 1, ease: "none" }
        )
          .fromTo(
            overlay,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.35
          )
          .to(
            overlay,
            { opacity: 0, y: -30, duration: 0.25 },
            0.8
          )
          .to(
            image,
            { opacity: 0, scale: 1.25, duration: 0.3 },
            0.85
          );
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return containerRef;
}