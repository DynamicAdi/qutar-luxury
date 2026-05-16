// components/CTAButton.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/original-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PRICE_CEIL, PRICE_FLOOR } from "./client/properties/Filters";
import {
  Search,
  MapPin,
  ArrowRightCircle,
  LucideArrowRightCircle,
} from "lucide-react";
import { qatarCities } from "@/config";

export default function CTAToExplore() {
  const router = useRouter();
  const types = ["COMMERCIAL", "RESIDENTIAL"];
  const filters = ["RENT", "BUY", "SELL"];
  const [usageType, setUsageType] = useState(types[0]);
  const [type, setType] = useState(filters[0]);
  const [priceRange, setPriceRange] = useState({
    priceMin: PRICE_FLOOR,
    priceMax: PRICE_CEIL,
  });
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

  const [showBtn, setShowBtn] = useState(false);
  const [open, setOpen] = useState(false);

  const [location, setLocation] = useState("");

  const [placeData, setPlaceData] = useState<
    Record<string, Record<string, string[]>>
  >({});


  const formatQAR = (val: number) => new Intl.NumberFormat("en-IN").format(val);
  const handleSelectLocation = (city: string) => {
    if (selectedLocations.includes(city)) return;
    if (selectedLocations.length >= 3) return;

    setSelectedLocations((prev) => [...prev, city]);
    setSearchTerm("");
  };

  const removeLocation = (city: string) => {
    setSelectedLocations((prev) => prev.filter((c) => c !== city));
  };
  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setShowBtn(window.scrollY > window.innerHeight);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = () => {
    const locations = encodeURIComponent(selectedLocations.join(","));
    router.push(
      `/properties?type=${type}&location=${locations}&priceMin=${priceRange.priceMin}&priceMax=${priceRange.priceMax}&usageType=${usageType}`
    );
    setOpen(false);
  };

  if (!showBtn) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="
    group fixed bottom-5 left-1/2 z-50 -translate-x-1/2
    h-14 rounded-full px-3
    border border-black/40
    bg-black/40 backdrop-blur-xl
    shadow-[0_8px_30px_rgba(0,0,0,0.18)]
    text-md
    hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)]
    transition-all duration-300
    overflow-hidden
  "
        >
          {/* glow layer */}
          {/* <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-white/10 to-cyan-500/20 opacity-80 group-hover:opacity-100 transition-opacity" /> */}

          {/* moving shine */}
          <span className="absolute -left-20 top-0 h-full w-16 rotate-12 bg-emerald/60 blur-md group-hover:left-[120%] transition-all duration-700" />

          {/* content */}
          <span className="relative flex items-center gap-3 text-white font-semibold tracking-wide">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/20 backdrop-blur-md">
              <Search className="h-4 w-4" />
            </span>
            Search Properties
            <ArrowRightCircle className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-2xl min-h-[80vh] h-full mx-auto">
        <div className="mx-auto w-full px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle>Find Your Property</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4">
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
                  value={item!}
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

                    {/* Bottom labels */}
                    {/* <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatQAR(PRICE_FLOOR)}</span>
                  <span>{formatQAR(PRICE_CEIL)}+</span>
                </div> */}
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
                        <div className="space-y-1 overflow-y-auto">
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
      </DrawerContent>
    </Drawer>
  );
}
