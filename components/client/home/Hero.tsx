"use client";

import { CategoryCard, CategoryCardSkeleton } from "@/components/client/CategoryCard";
import LineRevealOnScroll from "@/components/LineReveal";
import CustomSwiper from "@/components/Swiper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { qatarCities } from "@/config";
import { formatQAR } from "@/lib/properties";
import {
  LucideArrowRightCircle,
  MapPin,
  Search
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategorySlider from "./Categories";
const PRICE_FLOOR = 0;
const PRICE_CEIL = 50_000_000;
const categories = [
  {
    title: "All",
    href: "/properties",
    description: "Explore every available property in one place.",
  },
  {
    title: "BUY",
    href: "/properties?type=BUY",
    description: "Find properties ready for ownership and investment.",
  },
  {
    title: "RENT",
    href: "/properties?type=RENT",
    description: "Browse flexible rental homes and apartments.",
  },
  {
    title: "SELL",
    href: "/properties?type=SELL",
    description: "List or discover properties available for sale.",
  },
  {
    title: "PLOTS",
    href: "/properties?type=PLOTS",
    description: "Open land and plots for future development.",
  },
  
];
export default function Hero() {
  const router = useRouter();
  const types = ["RESIDENTIAL", "COMMERCIAL"];
  const filters = ["RENT", "BUY", "SELL"];
  const [usageType, setUsageType] = useState(types[0]);
  const [type, setType] = useState(filters[0]);
  const [priceRange, setPriceRange] = useState({
    priceMin: PRICE_FLOOR,
    priceMax: PRICE_CEIL,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const pct = (value: number) =>
    ((value - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const filteredCities = qatarCities.filter(
    (city) =>
      city.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedLocations.includes(city)
  );
  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [])
  const handleSearch = () => {
    const locations = encodeURIComponent(selectedLocations.join(","));
    router.push(
      `/properties?type=${type}&location=${locations}&priceMin=${priceRange.priceMin}&priceMax=${priceRange.priceMax}&usageType=${usageType}`
    );
  };
  const handleSelectLocation = (city: string) => {
    if (selectedLocations.includes(city)) return;
    if (selectedLocations.length >= 3) return;

    setSelectedLocations((prev) => [...prev, city]);
    setSearchTerm("");
  };

  const removeLocation = (city: string) => {
    setSelectedLocations((prev) => prev.filter((c) => c !== city));
  };
  return (
    <section
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

        <div className="w-full space-y-4 max-w-2xl mt-14">
          {/* Tabs */}
          <ToggleGroup
            type="single"
            value={usageType}
            onValueChange={(val) => val && setUsageType(val)}
            className="grid w-full md:grid-cols-2 gap-3 bg-background p-3 rounded-3xl shadow-sm"
          >
            {types.map((item, index) => (
              <ToggleGroupItem
                key={item}
                value={item}
                className={`
        h-10 w-full rounded-full! border border-transparent
        bg-white text-sm font-medium text-zinc-700
        transition-all duration-200
        hover:bg-zinc-50 hover:border-zinc-200
        data-[state=on]:bg-emerald-800
        data-[state=on]:text-white
        data-[state=on]:shadow-md
        data-[state=on]:border-black    
        `}
              >
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(val) => val && setType(val)}
            className="grid w-full md:grid-cols-3 gap-3 bg-background p-3 rounded-3xl shadow-sm"
          >
            {filters.map((item, index) => (
              <ToggleGroupItem
                key={item}
                value={item}
                className={`
        h-10 w-full rounded-full! border border-transparent
        bg-white text-sm font-medium text-zinc-700
        transition-all duration-200
        hover:bg-zinc-50 hover:border-zinc-200
        data-[state=on]:bg-emerald-800
        data-[state=on]:text-white
        data-[state=on]:shadow-md
        data-[state=on]:border-black     
        `}
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
              {mounted ? (
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

                </div>
              ) : (
                <div className="w-full rounded-3xl border border-white/40 bg-white p-5 py-2 pb-3 backdrop-blur-xl shadow-xl h-[118px]" />
              )}
            </div>
          </div>
          <div className="relative">
            {mounted && (
              <>
                <div className="relative flex min-h-14 w-full items-center rounded-full border border-gray-200 bg-white pl-4 pr-32 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                  <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />

                  <div className="flex flex-wrap items-center gap-2 flex-1 py-2">
                    {selectedLocations.map((city) => (
                      <div
                        key={city}
                        className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {city}
                        <button
                          onClick={() => removeLocation(city)}
                          className="text-primary hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {selectedLocations.length < 3 && (
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={
                          selectedLocations.length === 0
                            ? "Search by location..."
                            : ""
                        }
                        className="flex-1 min-w-[140px] bg-transparent outline-none text-sm"
                      />
                    )}
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full text-base px-5 shadow-sm"
                  >
                    Explore <LucideArrowRightCircle size={14} />
                  </Button>
                </div>
                {searchTerm.trim() && selectedLocations.length < 3 && (
                  <Card className="absolute top-full mt-2 w-full z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                    {filteredCities.length > 0 ? (
                      <div className="space-y-1 max-h-72 overflow-y-auto">
                        {filteredCities.slice(0, 8).map((item) => (
                          <button
                            key={item}
                            onClick={() => handleSelectLocation(item)}
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* House */}
      <div className="absolute inset-0 z-10">
        <div
          className="absolute inset-x-0 bottom-0 md:-bottom-20 h-[50%] w-[140%] left-1/2 -translate-x-1/2"
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

      {/* Smoke */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-30 z-[999] h-40"
      >
        <Image
          fill
          src="/smoke.png"
          alt="Smoke"
          className="object-cover object-top"
        />
      </div>

      <section className="w-full relative z-10 px-6 md:px-10 py-14">
        <CategorySlider categories={categories} />
      </section>
    </section>
  );
}
