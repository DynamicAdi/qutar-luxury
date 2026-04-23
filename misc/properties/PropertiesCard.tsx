import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, Property } from "@/store/cms";
import { Bath, Bed, Eye, EyeOff, MapPin, Maximize2, Pencil, Trash2 } from "lucide-react";


export function DeleteBtn({ onConfirm }: { onConfirm: () => void }) {
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

export function PropertyCard({
  property: p, index, onEdit, onDelete, onToggleHide,
}: {
  property: Property; index: number;
  onView: () => void; onEdit: () => void; onDelete: () => void; onToggleHide: () => void;
}) {
  return (
    <Card
      className="group rounded-2xl py-0 border border-border/60 shadow-card overflow-hidden hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-500 animate-fade-in-up bg-card flex flex-col"
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
          <Button onClick={onEdit} size="lg" className="flex-1 rounded-xl bg-primary text-primary-foreground shadow-gold hover:opacity-90">
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <DeleteBtn onConfirm={onDelete} />
        </div>
      </div>
    </Card>
  );
}
