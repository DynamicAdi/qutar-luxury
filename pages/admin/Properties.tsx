"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Property, PropertyCategory } from "@/store/cms";
import {Pencil, Eye, EyeOff,
  LayoutGrid, List, Plus, Search,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteBtn, PropertyCard } from "@/misc/properties/PropertiesCard";
import axios from "axios";
import LoaderScreen from "@/misc/LoaderScreen";

const validCategories: PropertyCategory[] = ["BUY", "SELL", "RENT", "PLOTS", "RESIDENTIAL"];

const titleCase = (s: string): PropertyCategory | null => {
  const found = validCategories.find((c) => c.toLowerCase() === s.toLowerCase());
  return found ?? null;
};

export default function Properties({category}: Readonly<{category: string}>) {
  const navigate = useRouter();
  const tab = titleCase(category ?? "residential") ?? "Residential";

  const [view, setView] = useState<"grid" | "list">("grid");
  const [transition, startTransition] = useTransition()
  const [process, startProcess] = useTransition()
  const [data, setData] = useState<Property[]>([])
  const [panigation, setPanigation] = useState()

  const [q, setQ] = useState("");

  const fetchProperty = () => {startTransition(async () => {
    const req = await axios.get(`/api/properties?category=${category.toUpperCase()}`)
    
    if (req.status === 200) {
      setPanigation(req.data.pagination)
      setData(req.data.data)
    }  
})}

  // Redirect /dashboard/properties (no category) to default
  useEffect(() => {
    if (!category) navigate.push("/dashboard/properties/buy");
    fetchProperty()
  }, [category, navigate]);

  const filtered = useMemo(
    () =>
      data.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())),
    [data, tab, q]
  );
  

  const newProperty = () => {
    navigate.push(`/dashboard/properties/${category}/new/edit`);
  };

  const deleteProperty = (id: string) => startProcess(async () => {
    const req = await axios.delete(`/api/properties?id=${id}`)
    if (req.status === 200) {
      fetchProperty()
    }
  })

  if (transition) {
    return (
      <LoaderScreen />
    )
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
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or address" className="pl-9 h-9 rounded-xl" />
            </div>
            <div className="flex rounded-xl bg-secondary p-1">
              <button onClick={() => setView("grid")} className={`rounded-lg px-2 py-1 ${view === "grid" ? "bg-card shadow-card" : "text-muted-foreground"}`} aria-label="Grid">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setView("list")} className={`rounded-lg px-2 py-1 ${view === "list" ? "bg-card shadow-card" : "text-muted-foreground"}`} aria-label="List">
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={newProperty} size="sm" className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-gold">
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </>
        }
      />

      {filtered.length === 0 ? (
        <Card className="rounded-2xl p-12 shadow-card border-0 text-center py-0">
          <p className="text-muted-foreground">No properties in this category yet.</p>
          <Button onClick={newProperty} className="mt-4 rounded-xl bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-1.5" /> Add your first
          </Button>
        </Card>
      ) : 
      // view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {
            filtered.map((item, i) => (
              <PropertyCard 
              index={i}
              key={item.id}
              p={item}
              onEdit={() => navigate.push(`/dashboard/properties/${category}/${item.id}/edit`)}
              />
            ))
          }
        </div>
      }
    </>
  );
}