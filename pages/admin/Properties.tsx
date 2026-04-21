import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCMS, formatPrice, Property, PropertyCategory } from "@/store/cms";
import {
  Bed, Bath, Maximize2, MapPin, Pencil, Trash2, Eye, EyeOff,
  LayoutGrid, List, Plus, Search, ExternalLink,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const validCategories: PropertyCategory[] = ["Buy", "Sell", "Rent", "Plots", "Residential"];

const titleCase = (s: string): PropertyCategory | null => {
  const found = validCategories.find((c) => c.toLowerCase() === s.toLowerCase());
  return found ?? null;
};

export default function Properties() {
  const navigate = useNavigate();
  const { category } = useParams();
  const tab = titleCase(category ?? "residential") ?? "Residential";

  const { properties, deleteProperty, toggleHidden } = useCMS();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");

  // Redirect /app/properties (no category) to default
  useEffect(() => {
    if (!category) navigate("/app/properties/residential", { replace: true });
  }, [category, navigate]);

  const filtered = useMemo(
    () =>
      properties
        .filter((p) => p.category === tab)
        .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.address.toLowerCase().includes(q.toLowerCase())),
    [properties, tab, q]
  );

  const newProperty = () => {
    const id = `p${Date.now()}`;
    navigate(`/app/properties/${id}/edit?new=1&category=${tab}`);
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
        <Card className="rounded-2xl p-12 shadow-card border-0 text-center">
          <p className="text-muted-foreground">No properties in this category yet.</p>
          <Button onClick={newProperty} className="mt-4 rounded-xl bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-1.5" /> Add your first
          </Button>
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i}
              onView={() => navigate(`/app/properties/${p.id}/edit`)}
              onEdit={() => navigate(`/app/properties/${p.id}/edit`)}
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
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.city}, {p.country}</td>
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
                        <IconBtn onClick={() => navigate(`/app/properties/${p.id}/edit`)} title="Edit">
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
    <button onClick={onClick} title={title} className="rounded-lg p-2 hover:bg-secondary transition-colors">
      {children}
    </button>
  );
}

function DeleteBtn({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button title="Delete" className="rounded-lg p-2 hover:bg-destructive/10 hover:text-destructive transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete property?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="rounded-xl bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PropertyCard({
  property: p, index, onView, onEdit, onDelete, onToggleHide,
}: {
  property: Property; index: number;
  onView: () => void; onEdit: () => void; onDelete: () => void; onToggleHide: () => void;
}) {
  return (
    <Card
      className="group rounded-2xl border border-border/60 shadow-card overflow-hidden hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-500 animate-fade-in-up bg-card flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-52 overflow-hidden">
        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className="bg-card/95 backdrop-blur text-foreground hover:bg-card/95 rounded-md border border-border/40 font-medium">
            {p.category}
          </Badge>
          {p.status === "Sold" && (
            <Badge className="bg-success text-success-foreground hover:bg-success rounded-md">Sold</Badge>
          )}
          {p.hidden && (
            <Badge className="bg-foreground/80 text-background hover:bg-foreground/80 rounded-md backdrop-blur">Hidden</Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={onToggleHide} title={p.hidden ? "Unhide" : "Hide"} className="rounded-lg bg-card/95 backdrop-blur p-2 hover:bg-card shadow-card">
            {p.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-grotesk font-semibold text-base leading-tight line-clamp-1">{p.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{p.address}, {p.city}</span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground border-y border-border/60 py-2.5">
          {p.bedrooms > 0 && <span className="flex items-center gap-1.5"><Bed className="h-3.5 w-3.5 text-primary" /> {p.bedrooms}</span>}
          {p.bathrooms > 0 && <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5 text-primary" /> {p.bathrooms}</span>}
          <span className="flex items-center gap-1.5 ml-auto"><Maximize2 className="h-3.5 w-3.5 text-primary" /> {p.area.toLocaleString()} sqft</span>
        </div>

        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</div>
          <div className="font-grotesk font-semibold text-lg text-primary-deep">
            {formatPrice(p.price, p.currency)}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={onView} size="sm" variant="outline" className="flex-1 rounded-xl border-primary/40 text-primary-deep hover:bg-gold-soft hover:text-primary-deep">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View
          </Button>
          <Button onClick={onEdit} size="sm" className="flex-1 rounded-xl bg-primary text-primary-foreground shadow-gold hover:opacity-90">
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <DeleteBtn onConfirm={onDelete} />
        </div>
      </div>
    </Card>
  );
}
