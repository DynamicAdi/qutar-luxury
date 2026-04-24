"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import LineRevealOnScroll from "@/components/LineReveal";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const houseWrapRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);

  const textWrapRef = useRef<HTMLDivElement>(null);
  const strokeTextRef = useRef<HTMLHeadingElement>(null);
  const fillTextRef = useRef<HTMLHeadingElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Initial states */
      gsap.set(textWrapRef.current, {
        autoAlpha: 0,
      });

      gsap.set(strokeTextRef.current, {
        clipPath: "inset(0 100% 0 0)",
      });
      // gsap.set(smokeRef.current, {
      //   height: 100, // initial small height
      //   y: 0,
      // });
      gsap.set(fillTextRef.current, {
        clipPath: "inset(0 100% 0 0)",
        backgroundPosition: "50% 0%",
      });

      /* House starts below + smaller */
      gsap.set(houseWrapRef.current, {
        y: 320,
        scale: 1.5,
      });

      gsap.set(houseRef.current, {
        scale: 0.8,
        transformOrigin: "center bottom",
        opacity: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3800",
          scrub: 1.15,
          pin: true,
        },
      });

      /* 1 Hero content leaves */
      tl.to(
        contentRef.current,
        {
          y: 220,
          opacity: 0,
          ease: "none",
        },
        0
      )

        /* 2 House rises from below + expands */
        .to(
          houseWrapRef.current,
          {
            y: -260,
            ease: "none",
          },
          0
        )

        .to(
          houseRef.current,
          {
            scale: 1.18,
            ease: "none",
          },
          0
        )

        /* 3 Text appears after house settles */
        .to(
          textWrapRef.current,
          {
            autoAlpha: 1,
            ease: "none",
          },
          0.58
        )

        /* 4 Stroke draws */
        .to(
          strokeTextRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
          },
          0.62
        )

        /* 5 House fades out */
        .to(
          houseRef.current,
          {
            opacity: 0,
            ease: "none",
          },
          0.78
        )

        /* 6 Image fill enters text */
        .to(
          fillTextRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
          },
          0.82
        )
        .to(smokeRef.current, {
          height: 520, // grows taller slowly
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom top",
            scrub: 1.4,
          },
        })

        /* 7 Move image inside text */
        .to(
          fillTextRef.current,
          {
            backgroundPosition: "50% 100%",
            ease: "none",
          },
          0.88
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#eef4fb]"
    >
      {/* Background */}
      <Image
        src="/herobg.png"
        fill
        alt="Background"
        priority
        className="object-cover"
      />

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-20 mx-auto flex max-w-[1600px] flex-col items-center px-6 pt-32 text-center md:px-10"
      >
        <h1 className="max-w-[1500px] text-[3.3rem] font-bold leading-[0.9] tracking-tight text-black sm:text-[5rem] md:text-[7rem] lg:text-8xl">
          <LineRevealOnScroll text={`Find What Moves You.`}/>
        </h1>

        <p className="mt-6 max-w-4xl flex text-lg font-medium text-black/80 sm:text-2xl md:text-2xl">
          <span className="text-black"><LineRevealOnScroll text={`Expert agents. Real guidance.`}/></span>{" "}
          <span className="text-black/45">
            <LineRevealOnScroll text={`A clear path to find what’s next.`} />
          </span>
        </p>

        <button className="mt-8 inline-flex items-center gap-4 rounded-full bg-[#161819] px-6 py-3 text-md font-medium text-white">
          Find Properties <ArrowRight size={20} />
        </button>
      </div>

      {/* House */}
      <div ref={houseWrapRef} className="absolute inset-0 z-10">
        <div
          ref={houseRef}
          className="absolute inset-x-0 bottom-0 h-[100%] w-[140%] left-1/2 -translate-x-1/2"
        >
          <Image
            src="/house.png"
            fill
            alt="House"
            priority
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* PERFECT CENTER TEXT */}
      <div
        ref={textWrapRef}
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
      >
        <div className="relative flex items-center justify-center">
          {/* Stroke */}
          <h2
            ref={strokeTextRef}
            className="block text-center text-[4rem] font-black leading-none tracking-tight text-transparent sm:text-[7rem] md:text-[10rem] lg:text-[13rem]"
            style={{
              WebkitTextStroke: "2px #111",
            }}
          >
            FIND HOME
          </h2>

          {/* Fill */}
          <h2
            ref={fillTextRef}
            className="absolute inset-0 block text-center text-[4rem] font-black leading-none tracking-tight text-transparent sm:text-[7rem] md:text-[10rem] lg:text-[13rem]"
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundImage: "url('/house.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "50% 0%",
            }}
          >
            FIND HOME
          </h2>
        </div>
      </div>

      {/* Smoke */}
      <div
        ref={smokeRef}
        className="pointer-events-none absolute inset-x-0 -bottom-30 z-[999] h-40"
      >
        <Image
          fill
          src="/smoke.png"
          alt="Smoke"
          className="object-cover object-top"
        />
      </div>
    </section>
  );
}
