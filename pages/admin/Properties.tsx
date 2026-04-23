"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCMS, formatPrice, Property, PropertyCategory } from "@/store/cms";
import {Pencil, Eye, EyeOff,
  LayoutGrid, List, Plus, Search,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteBtn, PropertyCard } from "@/misc/properties/PropertiesCard";
import axios from "axios";

const validCategories: PropertyCategory[] = ["Buy", "Sell", "Rent", "Plots", "Residential"];

const titleCase = (s: string): PropertyCategory | null => {
  const found = validCategories.find((c) => c.toLowerCase() === s.toLowerCase());
  return found ?? null;
};

export default function Properties({category}: Readonly<{category: string}>) {
  const navigate = useRouter();
  const tab = titleCase(category ?? "residential") ?? "Residential";

  const { properties, deleteProperty, toggleHidden } = useCMS();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [transition, startTransition] = useTransition()

  const [q, setQ] = useState("");

  const fetchProperty = () => {startTransition(async () => {
    const req = await axios.get(`/api/properties?category=${category.toUpperCase()}`)
    
    if (req.status === 200) {
      console.log(req.data)
    }
  })}

  // Redirect /dashboard/properties (no category) to default
  useEffect(() => {
    fetchProperty()
    if (!category) navigate.push("/dashboard/properties/buy");
  }, [category, navigate]);

  const filtered = useMemo(
    () =>
      properties
        .filter((p) => p.category === tab)
        .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.address.toLowerCase().includes(q.toLowerCase())),
    [properties, tab, q]
  );
  

  const newProperty = () => {
    navigate.push(`/dashboard/properties/${category}/new/edit`);
  };

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
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i}
              onView={() => navigate.push(`/dashboard/properties/${category}/${p.id}/edit`)}
              onEdit={() => navigate.push(`/dashboard/properties/${category}/${p.id}/edit`)}
              onDelete={() => { deleteProperty(p.id); toast.success("Property deleted"); }}
              onToggleHide={() => toggleHidden(p.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl shadow-card border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Property</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Specs</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.title} className="h-12 w-16 rounded-lg object-cover" loading="lazy" />
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-muted-foreground">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.city}, {p.state}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {p.bedrooms > 0 ? `${p.bedrooms} BR · ${p.bathrooms} BA · ` : ""}{p.area.toLocaleString()} sqft
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.price, p.currency)}</td>
                    <td className="px-4 py-3">
                      <StatusBadges p={p} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn onClick={() => toggleHidden(p.id)} title={p.hidden ? "Unhide" : "Hide"}>
                          {p.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </IconBtn>
                        <IconBtn onClick={() => navigate.push(`/dashboard/properties/${p.id}/edit`)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </IconBtn>
                        <DeleteBtn onConfirm={() => { deleteProperty(p.id); toast.success("Property deleted"); }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

function StatusBadges({ p }: { p: Property }) {
  return (
    <div className="flex flex-wrap gap-1">
      {p.status === "Sold" && <Badge className="bg-success text-success-foreground hover:bg-success rounded-md">Sold</Badge>}
      {p.status === "Available" && <Badge variant="secondary" className="rounded-md">Available</Badge>}
      {p.hidden && <Badge variant="outline" className="rounded-md text-muted-foreground">Hidden</Badge>}
    </div>
  );
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button onClick={onClick} title={title} className="rounded-lg p-2  hover:bg-secondary transition-colors">
      {children}
    </button>
  );
}

