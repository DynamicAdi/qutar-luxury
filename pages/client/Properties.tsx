"use client";

import { useMemo, useState } from "react";
import Filters, { FilterState, PRICE_FLOOR, PRICE_CEIL } from "@/components/client/properties/Filters";
import PropertyCard from "@/components/client/properties/PropertyCard";
import { properties } from "@/lib/properties";

const Properties = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: "ALL",
    state: "",
    city: "",
    street: "",
    priceMin: PRICE_FLOOR,
    priceMax: PRICE_CEIL,
  });

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const catOK = filters.category === "ALL" || p.category === filters.category;
      const stateOK = !filters.state || p.address.state === filters.state;
      const cityOK = !filters.city || p.address.city === filters.city;
      const streetOK = !filters.street || p.address.street === filters.street;
      const priceOK = p.price >= filters.priceMin && p.price <= filters.priceMax;
      return catOK && stateOK && cityOK && streetOK && priceOK;
    });
  }, [filters]);

  return (
    <>
      <main style={{background: `hsl(44 38% 96%)`}}>
        {/* Header — title left, meta right (justify-between, smaller title) */}
        <section className="mx-auto px-24 pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-display tracking-[0.4em] text-emerald text-xs md:text-sm mb-3 animate-fade-in">QATAR · REAL ESTATE</p>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground animate-fade-in leading-[0.95]" style={{ animationDelay: "80ms" }}>
                Find <span className="text-emerald">your address.</span>
              </h1>
            </div>
            <div className="text-left md:text-right">
              <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">Showing</p>
              <p className="font-display text-3xl md:text-4xl text-foreground font-bold">
                {filtered.length}<span className="text-muted-foreground"> / {properties.length}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Filter row — Category buttons / Location selects / Price range */}
        <section className="mx-auto px-24 pb-10 animate-fade-in" style={{ animationDelay: "180ms" }}>
          <div className="bg-card border border-border shadow-card p-5 md:p-7">
            <Filters value={filters} onChange={setFilters} />
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto px-24 pb-32">
          {filtered.length === 0 ? (
            <div className="border border-dashed border-border py-32 text-center">
              <p className="font-display text-3xl text-muted-foreground">No properties match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Footer band */}
        <footer className="bg-emerald-deep text-primary-foreground py-16">
          <div className="container">
            <p className="font-display tracking-[0.4em] text-gold text-xs mb-4">QATAR · ESTATE</p>
            <h2 className="text-giant font-display">BUILT FOR<br />THE BOLD.</h2>
            <p className="mt-6 max-w-xl text-primary-foreground/70">
              Curated luxury properties across Doha, Lusail and the Pearl. Speak to an agent today.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Properties;
