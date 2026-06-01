"use client";

import { useEffect, useState, useTransition } from "react";
import axios from "axios";
import Filters, {
  FilterState,
  PRICE_CEIL,
  PRICE_FLOOR,
} from "@/components/client/properties/Filters";
import PropertyCard from "@/components/client/properties/PropertyCard";
import { Property } from "@/store/cms";
import { useDebounce } from "@/components/useDebounce";
import { useSearchParams } from "next/navigation";
import SimplePropertyCard from "@/components/client/properties/SimplePropertyCard";

const LIMIT = 9;

const Properties = () => {
  const searchParams = useSearchParams();
  const [noResults, setNoResults] = useState(false);
  const [suggestions, setSuggestions] = useState<Property[]>([]);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    category: "ALL",
    usageType: "RESIDENTIAL",
    state: "",
    cities: [],
    street: "",
    priceMin: PRICE_FLOOR,
    priceMax: PRICE_CEIL,
  });
  useEffect(() => {
    const selectedLocations =
      searchParams
        ?.get("location")
        ?.split(",")
        .map((item) => item.trim())
        .filter(Boolean) ?? [];

    const category = searchParams?.get("type")?.trim() || ("ALL" as any);
    const usageType =
      searchParams?.get("usageType")?.trim() || ("RESIDENTIAL" as any);

    const rawPriceMin = searchParams?.get("priceMin");
    const rawPriceMax = searchParams?.get("priceMax");

    const parsedPriceMin =
      rawPriceMin !== null && !isNaN(Number(rawPriceMin))
        ? Number(rawPriceMin)
        : PRICE_FLOOR;

    const parsedPriceMax =
      rawPriceMax !== null && !isNaN(Number(rawPriceMax))
        ? Number(rawPriceMax)
        : PRICE_CEIL;

    setFilters((prev) => ({
      ...prev,
      category,
      usageType,
      cities: selectedLocations,
      priceMin: parsedPriceMin,
      priceMax: parsedPriceMax,
    }));
  }, [searchParams]);
  const [data, setData] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const debouncedFilters = useDebounce(filters, 500);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isPending, startTransition] = useTransition();

  const fetchProperties = () => {
    startTransition(async () => {
      try {
        const params: Record<string, string | number> = {
          page,
          limit: LIMIT,
        };

        if (debouncedFilters.category && debouncedFilters.category !== "ALL") {
          params.category = debouncedFilters.category;
        }

        if (debouncedFilters.usageType) {
          params.usageType = debouncedFilters.usageType;
        }

        if (debouncedFilters.state) {
          params.state = debouncedFilters.state;
        }

        if (debouncedFilters.cities.length > 0) {
          params.location = debouncedFilters.cities.join(",");
        }

        if (debouncedFilters.street) {
          params.street = debouncedFilters.street;
        }

        if (debouncedFilters.priceMin > PRICE_FLOOR) {
          params.priceMin = debouncedFilters.priceMin;
        }

        if (debouncedFilters.priceMax < PRICE_CEIL) {
          params.priceMax = debouncedFilters.priceMax;
        }
        const req = await axios.get("/api/properties", { params });

        if (req.status === 200) {
          setData(req.data.data || []);
          setPagination(req.data.pagination);
          setNoResults(req.data.noResults || false);
          setSuggestions(req.data.suggestions || []);
          setSuggestionMessage(req.data.suggestionMessage || "");
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    fetchProperties();
  }, [page, debouncedFilters]);

  useEffect(() => {
    setPage(1);
  }, [
    filters.category,
    filters.state,
    filters.cities,
    filters.street,
    filters.priceMin,
    filters.priceMax,
  ]);

  return (
    <main
      style={{
        background: "hsl(44 38% 96%)",
      }}
    >
      <section className="mx-auto px-6 pt-10 pb-6 md:px-12 lg:px-24 md:pt-14 md:pb-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs tracking-[0.4em] text-emerald md:text-sm">
              QATAR · REAL ESTATE
            </p>

            <h1 className="text-5xl font-bold leading-[0.95] text-foreground md:text-6xl">
              Find <span className="text-emerald">your address.</span>
            </h1>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Showing
            </p>

            <p className="text-3xl font-bold text-foreground md:text-4xl">
              {data.length}
              <span className="text-muted-foreground">
                {" "}
                / {pagination.total}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto px-6 pb-10 md:px-12 lg:px-24">
        <div className="border border-border bg-card p-5 shadow-card md:p-7">
          <Filters value={filters} onChange={setFilters} />
        </div>
      </section>

      <section className="mx-auto px-6 pb-20 md:px-12 lg:px-24 lg:pb-32">
        {isPending ? (
          <div className="py-32 text-center text-muted-foreground">
            Loading properties...
          </div>
        ) : data.length === 0 && !noResults ? (
          <div className="border border-dashed border-border py-32 text-center text-muted-foreground">
            No properties available.
          </div>
        ) : (
          <>
            {/* MAIN FILTERED RESULTS */}
            {data.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-24">
                  {data.map((p, i) => (
                    <SimplePropertyCard key={p.id} property={p} index={i} />
                  ))}
                </div>

                <div className="mt-16 flex items-center justify-center gap-4">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="rounded-full border px-5 py-2 disabled:opacity-40"
                  >
                    Prev
                  </button>

                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>

                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-full border px-5 py-2 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* NO EXACT MATCH => SUGGESTIONS */}
            {noResults && suggestions.length > 0 && (
              <div className="space-y-10">
                <div className="border border-dashed border-border py-16 px-6 text-center">
                  <h3 className="text-2xl font-semibold mb-3">
                    No exact properties matched your search
                  </h3>

                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {suggestionMessage}
                  </p>
                </div>

                <div>
                  <h4 className="mb-8 text-xl font-semibold">
                    You may also like these alternatives
                  </h4>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-24">
                    {suggestions.map((p, i) => (
                      <PropertyCard key={p.id} property={p} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Properties;
