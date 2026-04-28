"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, List, Plus, Search } from "lucide-react";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import LoaderScreen from "@/misc/LoaderScreen";
import { PropertyCard } from "@/misc/properties/PropertiesCard";

import { Property, PropertyCategory } from "@/store/cms";

import { usePaginatedFetch } from "@/components/usePaginationFetch";

/* ------------------------------------ */

const validCategories: PropertyCategory[] = [
  "BUY",
  "SELL",
  "RENT",
  "PLOTS",
  "RESIDENTIAL",
];

const titleCase = (s: string): PropertyCategory | null => {
  const found = validCategories.find(
    (c) => c.toLowerCase() === s.toLowerCase()
  );

  return found ?? null;
};

/* ------------------------------------ */

export default function Properties({
  category,
}: Readonly<{
  category: string;
}>) {
  const navigate = useRouter();

  const tab = titleCase(category ?? "buy") ?? "BUY";

  const [view, setView] = useState<"grid" | "list">("grid");

  const [process, startProcess] = useTransition();

  /* ------------------------------------ */
  /* PAGINATED FETCH HOOK */
  /* ------------------------------------ */

  const {
    rows: data,
    loading,

    search,
    setSearch,

    pagination,
    page,
    pageNumbers,

    nextPage,
    prevPage,
    goToPage,
    refresh,
  } = usePaginatedFetch<Property>({
    url: "/api/properties",
    limit: 9,
    debounce: 500,
    initialFilters: {
      category: category?.toUpperCase(),
    },
  });

  /* ------------------------------------ */

  useEffect(() => {
    if (!category) {
      navigate.push("/dashboard/properties/buy");
    }
  }, [category, navigate]);

  /* ------------------------------------ */

  const newProperty = () => {
    navigate.push(`/dashboard/properties/${category}/new`);
  };

  const deleteProperty = (id: string) =>
    startProcess(async () => {
      try {
        const req = await axios.delete(`/api/properties?id=${id}`);

        if (req.status === 200) {
          toast.success("Property deleted");
          refresh(page);
        }
      } catch {
        toast.error("Failed to delete property");
      }
    });

  /* ------------------------------------ */

  if (loading && data.length === 0) {
    return <LoaderScreen />;
  }

  return (
    <>
      <PageHeader
        eyebrow={tab}
        title={`${tab} Listings`}
        subtitle="Manage your luxury listings — toggle visibility, edit details, or remove."
        actions={
          <>
            <div className="relative w-44 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title or address"
                className="pl-9 h-9 rounded-xl"
              />
            </div>

            <div className="flex rounded-xl bg-secondary p-1">
              <button
                onClick={() => setView("grid")}
                className={`rounded-lg px-2 py-1 ${
                  view === "grid"
                    ? "bg-card shadow-card"
                    : "text-muted-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>

              <button
                onClick={() => setView("list")}
                className={`rounded-lg px-2 py-1 ${
                  view === "list"
                    ? "bg-card shadow-card"
                    : "text-muted-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={newProperty}
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-gold"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </>
        }
      />

      {/* EMPTY */}
      {data.length === 0 ? (
        <Card className="rounded-2xl p-12 shadow-card border-0 text-center py-0">
          <p className="text-muted-foreground">
            No properties in this category yet.
          </p>

          <Button
            onClick={newProperty}
            className="mt-4 rounded-xl bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add your first
          </Button>
        </Card>
      ) : (
        <>
          {/* GRID / LIST */}
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {data.map((item, i) => (
              <PropertyCard
                key={item.id} 
                index={i}
                p={item}
                onEdit={() =>
                  navigate.push(
                    `/dashboard/properties/${category}/${item.id}/edit`
                  )
                }
              />
            ))}
          </div>

          {/* PAGINATION */}
          {pagination && pagination.totalPages > 1 && (
            <Card className="mt-4 border-0 py-0">
              <div className="flex items-center justify-between px-4 py-4">
                <button
                  onClick={prevPage}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-1 rounded-md border disabled:opacity-40"
                >
                  Prev
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {pageNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => goToPage(num)}
                      className={`h-9 w-9 rounded-md border text-sm ${
                        page === num
                          ? "bg-primary text-white"
                          : "hover:bg-muted"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 rounded-md border disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}
