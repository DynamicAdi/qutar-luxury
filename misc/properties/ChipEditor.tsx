"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

export function ChipEditor({ label, items, onChange, suggestions }: {
  label: string; items: string[]; onChange: (v: string[]) => void; suggestions: string[];
}) {
  const [v, setV] = useState("");
  const add = (val: string) => { if (val && !items.includes(val)) onChange([...items, val]); setV(""); };
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((i) => (
          <Badge key={i} variant="secondary" className="rounded-md gap-1 pr-1">
            {i}
            <button onClick={() => onChange(items.filter((x) => x !== i))} className="rounded hover:bg-foreground/10 p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add(v))}
          placeholder={`Add ${label.toLowerCase()}`} className="rounded-xl" />
        <Button onClick={() => add(v)} variant="outline" className="rounded-xl">Add</Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {suggestions.filter((s) => !items.includes(s)).map((s) => (
          <button key={s} onClick={() => add(s)} className="text-[11px] rounded-full bg-secondary hover:bg-gold-soft px-2 py-1 text-muted-foreground hover:text-primary-deep transition-colors">
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}