"use client";

import { useEffect, useState, useTransition } from "react";
import axios from "axios";

import Filters, {
  FilterState,
  PRICE_FLOOR,
  PRICE_CEIL,
} from "@/components/client/properties/Filters";

import PropertyCard from "@/components/client/properties/PropertyCard";
import { Property } from "@/store/cms";
import { useDebounce } from "@/components/useDebounce";

const LIMIT = 9;

const Properties = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: "ALL",
    state: "",
    city: "",
    street: "",
    priceMin: PRICE_FLOOR,
    priceMax: PRICE_CEIL,
  });

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
        const params: any = {
          page,
          limit: LIMIT,
        };

        // use debounced filters
        if (debouncedFilters.category !== "ALL") {
          params.category = debouncedFilters.category;
        }

        if (debouncedFilters.state) {
          params.state = debouncedFilters.state;
        }

        if (debouncedFilters.city) {
          params.city = debouncedFilters.city;
        }

        if (debouncedFilters.street) {
          params.street = debouncedFilters.street;
        }

        const req = await axios.get("/api/properties", { params });

        if (req.status === 200) {
          let rows = req.data.data;

          // price filter after debounce
          rows = rows.filter(
            (item: Property) =>
              item.price >= debouncedFilters.priceMin &&
              item.price <= debouncedFilters.priceMax
          );

          setData(rows);
          setPagination(req.data.pagination);
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
  }, [filters.category, filters.state, filters.city, filters.street]);

  return (
    <main style={{ background: `hsl(44 38% 96%)` }}>
      {/* Header */}
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

      {/* Filters */}
      <section className="mx-auto px-6 pb-10 md:px-12 lg:px-24">
        <div className="border border-border bg-card p-5 shadow-card md:p-7">
          <Filters value={filters} onChange={setFilters} />
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto px-6 pb-20 md:px-12 lg:px-24 lg:pb-32">
        {isPending ? (
          <div className="py-32 text-center">
            <p className="text-xl text-muted-foreground">
              Loading properties...
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="border border-dashed border-border py-32 text-center">
            <p className="text-3xl text-muted-foreground">
              No properties match your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-24">
              {data.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>

            {/* Pagination */}
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
      </section>

    </main>
  );
};

export default Properties;
