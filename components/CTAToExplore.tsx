// components/CTAButton.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

import { Search, MapPin, ArrowRightCircle } from "lucide-react";

const PRICE_FLOOR = 0;
const PRICE_CEIL = 50_000_000;

export default function CTAToExplore() {
  const router = useRouter();

  const filters = ["COMMERCIAL", "RESIDENTIAL", "BUY", "RENT", "SELL"];

  const [showBtn, setShowBtn] = useState(false);
  const [open, setOpen] = useState(false);

  const [type, setType] = useState("BUY");

  const [priceRange, setPriceRange] = useState({
    priceMin: PRICE_FLOOR,
    priceMax: PRICE_CEIL,
  });

  const [location, setLocation] = useState("");

  const [placeData, setPlaceData] = useState<
    Record<string, Record<string, string[]>>
  >({});

  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const pct = (value: number) =>
    ((value - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  const formatQAR = (val: number) => new Intl.NumberFormat("en-IN").format(val);

  useEffect(() => {
    const onScroll = () => {
      setShowBtn(window.scrollY > window.innerHeight);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const results = useMemo(() => {
    if (!location.trim()) return [];

    const query = location.toLowerCase().trim();

    const matched: string[] = [];

    Object.entries(placeData).forEach(([state, cities]) => {
      if (state.toLowerCase().includes(query)) {
        matched.push(state);
      }

      Object.entries(cities).forEach(([city, streets]) => {
        if (city.toLowerCase().includes(query)) {
          matched.push(`${city}, ${state}`);
        }

        streets.forEach((street) => {
          if (street.toLowerCase().includes(query)) {
            matched.push(`${street}, ${city}, ${state}`);
          }
        });
      });
    });

    return [...new Set(matched)].slice(0, 6);
  }, [location, placeData]);

  const handleSearch = () => {
    router.push(
      `/properties?type=${type}&location=${location}&priceMin=${priceRange.priceMin}&priceMax=${priceRange.priceMax}`
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
    h-14 rounded-full px-5
    border border-white/30
    bg-white/15 backdrop-blur-xl
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
          <span className="absolute -left-20 top-0 h-full w-16 rotate-12 bg-white/30 blur-md group-hover:left-[120%] transition-all duration-700" />

          {/* content */}
          <span className="relative flex items-center gap-3 text-gray-500 font-semibold tracking-wide">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Search className="h-4 w-4" />
            </span>
            Search Properties
            <ArrowRightCircle className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-2xl min-h-[80vh] mx-auto">
        <div className="mx-auto w-full px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle>Find Your Property</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4">
            {/* Tabs */}
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(val) => val && setType(val)}
              className="grid w-full grid-cols-2 md:grid-cols-6 gap-3 bg-background p-3 rounded-3xl shadow-sm mx-auto"
            >
              {filters.map((item, index) => (
                <ToggleGroupItem
                  key={item}
                  value={item}
                  className={`
        h-10 px-5 rounded-full! border border-transparent
        bg-white text-sm font-medium text-zinc-700
        transition-all duration-200
        hover:bg-zinc-50 hover:border-zinc-200
        data-[state=on]:bg-emerald-800
        data-[state=on]:text-white
        data-[state=on]:shadow-md
        data-[state=on]:border-black
        max-md:last:col-span-2
        ${index < 2 ? "md:col-span-3" : "md:col-span-2"}
      `}
                >
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {/* Price */}
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="flex justify-between">
                <h3 className="font-semibold">Budget</h3>

                <p className="text-sm font-semibold text-emerald-800">
                  {formatQAR(priceRange.priceMin)} —{" "}
                  {priceRange.priceMax >= PRICE_CEIL
                    ? `${formatQAR(PRICE_CEIL)}+`
                    : formatQAR(priceRange.priceMax)}
                </p>
              </div>

              <div className="pt-5">
                <div className="relative h-10">
                  <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />

                  <div
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-emerald-800"
                    style={{
                      left: `${pct(priceRange.priceMin)}%`,
                      right: `${100 - pct(priceRange.priceMax)}%`,
                    }}
                  />

                  {/* min */}
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
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-emerald-800"
                  />

                  {/* max */}
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
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full">
              {/* Search Icon */}
              <Search className="absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-zinc-400" />

              {/* Input */}
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search cities, states, areas..."
                className="
      h-16 w-full rounded-full border border-zinc-200
      bg-white/80 backdrop-blur-xl
      pl-14 pr-36 text-[15px] font-medium
      shadow-lg shadow-black/5
      transition-all duration-300
      placeholder:text-zinc-400
      focus-visible:ring-2 focus-visible:ring-emerald-500/40
      focus-visible:border-emerald-500
    "
              />

              {/* Button */}
              <Button
                onClick={handleSearch}
                className="
      absolute right-2 top-1/2 h-12 -translate-y-1/2
      rounded-full px-6 font-medium
      bg-emerald-800
      text-white shadow-xl shadow-emerald-900/20
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-2xl
      active:scale-95
      gap-2
    "
              >
                Explore
                <ArrowRightCircle size={16} className="animate-pulse" />
              </Button>

              {/* Dropdown */}
              {location.trim() && (
                <Card
                  className="
        absolute top-[72px] left-0 z-50 w-full
        rounded-3xl border border-zinc-200
        bg-white/90 backdrop-blur-2xl
        p-2 shadow-2xl shadow-black/10
        max-h-[150px] overflow-y-auto
      "
                >
                  {loadingPlaces ? (
                    <div className="space-y-2 p-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-12 w-full animate-pulse rounded-2xl bg-zinc-100"
                        />
                      ))}
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((item) => (
                        <button
                          key={item}
                          onClick={() => setLocation(item)}
                          className="
                group flex w-full items-start gap-3
                rounded-2xl px-3 py-3 text-left
                transition-all duration-200
                hover:bg-zinc-100
              "
                        >
                          <div
                            className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl bg-emerald-50
                  transition-all group-hover:scale-105 group-hover:bg-emerald-100
                "
                          >
                            <MapPin className="h-4 w-4 text-emerald-700" />
                          </div>

                          <span className="text-sm font-medium leading-5 text-zinc-700 break-words">
                            {item}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-5 text-center text-sm text-zinc-500">
                      No matching locations found
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
