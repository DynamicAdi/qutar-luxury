"use client";

import { motion } from "framer-motion";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, BedDouble, Bath, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LISTINGS = [
  { id: 1, title: "Modern Loft in Manhattan", city: "New York", price: 1450000, beds: 2, baths: 2, type: "Buy", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop" },
  { id: 2, title: "Luxury Rental with Skyline View", city: "Brooklyn", price: 5200, beds: 2, baths: 2, type: "Rent", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop" },
  { id: 3, title: "Townhouse Near Central Park", city: "New York", price: 2890000, beds: 4, baths: 3, type: "Buy", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop" },
  { id: 4, title: "Cozy Apartment for Young Professionals", city: "Queens", price: 3200, beds: 1, baths: 1, type: "Rent", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=1600&auto=format&fit=crop" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("All");

  const filtered = useMemo(() => {
    return LISTINGS.filter((item) => {
      const q = query.toLowerCase();
      const matchText = item.title.toLowerCase().includes(q) || item.city.toLowerCase().includes(q);
      const matchMode = mode === "All" ? true : item.type === mode;
      return matchText && matchMode;
    });
  }, [query, mode]);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="min-h-screen bg-[#eef4fb] text-black">
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="relative overflow-hidden border-b border-black/10">
        <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/50">Find Search</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">Find What Moves You.</h1>
          <p className="mt-5 max-w-2xl text-lg text-black/60 md:text-xl">Search homes, rentals, and opportunities with a cleaner smarter experience.</p>

          <div className="mt-10 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city, neighborhood, listing..." className="h-14 rounded-2xl border-black/10 pl-11" />
              </div>
              <div className="flex gap-2">
                {["All", "Buy", "Rent"].map((item) => (
                  <Button key={item} type="button" variant={mode === item ? "default" : "outline"} className="h-14 rounded-2xl px-6" onClick={() => setMode(item)}>{item}</Button>
                ))}
              </div>
              <Button className="h-14 rounded-2xl px-6"><SlidersHorizontal className="mr-2 h-4 w-4" />Filters</Button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, delay: 0.1 }} className="mx-auto max-w-[1500px] px-6 py-14 md:px-10 lg:px-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">{filtered.length} Results</h2>
          <p className="text-sm text-black/45">Updated daily listings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((home) => (
            <motion.div key={home.id} initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }} whileHover={{ y: -8 }}>
            <Card className="overflow-hidden rounded-3xl border-black/10 bg-white">
              <div className="relative aspect-[16/11]">
                <Image src={home.image} alt={home.title} fill className="object-cover transition duration-700 hover:scale-105" />
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">{home.type}</span>
                  <span className="text-lg font-semibold">${home.price.toLocaleString()}</span>
                </div>
                <h3 className="text-2xl font-medium tracking-tight">{home.title}</h3>
                <div className="mt-3 flex items-center gap-2 text-black/55"><MapPin className="h-4 w-4" />{home.city}</div>
                <div className="mt-5 flex gap-5 text-sm text-black/70">
                  <span className="flex items-center gap-2"><BedDouble className="h-4 w-4" />{home.beds} Beds</span>
                  <span className="flex items-center gap-2"><Bath className="h-4 w-4" />{home.baths} Baths</span>
                </div>
                <Button asChild className="mt-6 h-12 w-full rounded-2xl">
                  <Link href="#">View Property <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}
