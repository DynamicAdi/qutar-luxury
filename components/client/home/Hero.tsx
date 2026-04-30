"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, LucideArrowRightCircle, MapPin, Search } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import LineRevealOnScroll from "@/components/LineReveal";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { formatQAR } from "@/lib/properties";
const PRICE_FLOOR = 0;
const PRICE_CEIL = 50_000_000;
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const houseWrapRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const strokeTextRef = useRef<HTMLHeadingElement>(null);
  const fillTextRef = useRef<HTMLHeadingElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const filters = ["BUY", "RENT", "SELL"];
  const [type, setType] = useState("BUY");
  const [priceRange, setPriceRange] = useState({
    priceMin: PRICE_FLOOR,
    priceMax: PRICE_CEIL,
  });

  const pct = (value: number) =>
    ((value - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;
  const [location, setLocation] = useState("");
  const [placeData, setPlaceData] = useState<
    Record<string, Record<string, string[]>>
  >({});

  const [loadingPlaces, setLoadingPlaces] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoadingPlaces(true);

        const res = await axios.get("/api/location-filters");

        if (res.status === 200) {
          setPlaceData(res.data.data || {});
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, []);

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
  const results = useMemo(() => {
    if (!location.trim()) return [];

    const query = location.toLowerCase().trim();

    const matched: string[] = [];
    Object.entries(placeData).forEach(([state, cities]) => {

      if (state.toLowerCase().includes(query)) {
        matched.push(state);
      }

      Object.entries(cities).forEach(([city, streets]) => {
        // Match city
        if (city.toLowerCase().includes(query)) {
          matched.push(`${city}, ${state}`);
        }

        streets.forEach((street) => {
          // Match street
          if (street.toLowerCase().includes(query)) {
            matched.push(`${street}, ${city}, ${state}`);
          }
        });
      });
    });

    return [...new Set(matched)].slice(0, 6);
  }, [location, placeData]);
  const handleSearch = () => {
    router.push(`/properties?type=${type}&location=${location}&priceMin=${priceRange.priceMin}&priceMax=${priceRange.priceMax}`);
  };
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
          <LineRevealOnScroll text={`Find What Moves You.`} />
        </h1>

        <p className="mt-6 max-w-4xl flex max-md:flex-col text-lg font-medium text-black/80 sm:text-2xl md:text-2xl">
          <span className="text-black">
            <LineRevealOnScroll text={`Expert agents. Real guidance.`} />
          </span>{" "}
          <span className="text-black/45">
            <LineRevealOnScroll text={`A clear path to find what’s next.`} />
          </span>
        </p>

        {/* <Button className="mt-8 inline-flex items-center gap-4 rounded-full bg-[#161819] px-6 py-5 text-md font-medium text-white">
          Find Properties <ArrowRight size={20} />
        </Button> */}
    
        <div className="w-full space-y-4 max-w-2xl mt-14">
          {/* Tabs */}
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(val) => val && setType(val)}
            className="flex w-full gap-2 bg-white p-2 rounded-full"
          >
            {filters.map((item) => (
              <ToggleGroupItem
                key={item}
                value={item}
                className="flex-1 min-w-[130px] bg-white rounded-full!"
              >
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="w-full rounded-3xl border border-white/40 bg-white p-5 py-2 pb-3 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-end justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">
                    Find within budget
                  </h3>

                <div className="rounded-2xl px-3 py-2 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Selected
                  </p>
                  <p className="text-sm font-semibold text-emerald-800">
                    {formatQAR(priceRange.priceMin)} —{" "}
                    {priceRange.priceMax >= PRICE_CEIL
                      ? `${formatQAR(PRICE_CEIL)}+`
                      : formatQAR(priceRange.priceMax)}
                  </p>
                </div>
              </div>

              {/* Slider */}
              <div className="pt-1">
                <div className="relative h-10">
                  {/* base track */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-secondary" />

                  {/* active track */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-emerald-800"
                    style={{
                      left: `${pct(priceRange.priceMin)}%`,
                      right: `${100 - pct(priceRange.priceMax)}%`,
                    }}
                  />

                  {/* Min slider */}
                  <input
                    type="range"
                    min={PRICE_FLOOR}
                    max={PRICE_CEIL}
                    step={100000}
                    value={priceRange.priceMin}
                    onChange={(e) => {
                      const v = Math.min(
                        Number(e.target.value),
                        priceRange.priceMax - 100000
                      );

                      setPriceRange((prev) => ({
                        ...prev,
                        priceMin: v,
                      }));
                    }}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-emerald-800
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:cursor-pointer"
                  />

                  {/* Max slider */}
                  <input
                    type="range"
                    min={PRICE_FLOOR}
                    max={PRICE_CEIL}
                    step={100000}
                    value={priceRange.priceMax}
                    onChange={(e) => {
                      const v = Math.max(
                        Number(e.target.value),
                        priceRange.priceMin + 100000
                      );

                      setPriceRange((prev) => ({
                        ...prev,
                        priceMax: v,
                      }));
                    }}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-amber-400
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Bottom labels */}
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatQAR(PRICE_FLOOR)}</span>
                  <span>{formatQAR(PRICE_CEIL)}+</span>
                </div>
              </div>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />

              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by location..."
                className="h-14 w-full rounded-full border border-gray-200 bg-white pl-11 pr-32 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
              />

              <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full text-base px-5 shadow-sm"
              >
                Explore <LucideArrowRightCircle size={14} />
              </Button>
            </div>

            {location.trim() && (
              <Card className="absolute top-full mt-2 w-full z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                {loadingPlaces ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-11 w-full animate-pulse rounded-xl bg-muted"
                      />
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((item) => (
                      <button
                        key={item}
                        onClick={() => setLocation(item)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <span className="text-sm font-medium text-foreground">
                          {item}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No locations found
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* House */}
      <div ref={houseWrapRef} className="absolute inset-0 z-10">
        <div
          ref={houseRef}
          className="absolute inset-x-0 bottom-0 md:-bottom-20 h-[100%] w-[140%] left-1/2 -translate-x-1/2"
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
            className="block text-center text-[2.5rem] font-black leading-none tracking-tight text-transparent sm:text-[6rem] md:text-[8rem]"
            style={{
              WebkitTextStroke: "2px #111",
            }}
          >
            LUXURY PROPERTY
          </h2>

          {/* Fill */}
          <h2
            ref={fillTextRef}
            className="absolute inset-0 block text-center text-[2.5rem] font-black leading-none tracking-tight text-transparent sm:text-[6rem] md:text-[8rem]"
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundImage: "url('/house.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "50% 0%",
            }}
          >
            LUXURY PROPERTY
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
