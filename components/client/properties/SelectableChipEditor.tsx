"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function SelectableChipEditor({
  label,
  items,
  onChange,
  suggestions,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  suggestions: string[];
}) {
  const [v, setV] = useState("");

  const add = (val: string) => {
    if (!val || items.includes(val)) return;
    onChange([...items, val]);
    setV("");
  };

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(
      (s) =>
        s.toLowerCase().includes(v.toLowerCase()) &&
        !items.includes(s)
    );
  }, [v, suggestions, items]);

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>

      {/* selected chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {items.map((i) => (
          <Badge
            key={i}
            variant="secondary"
            className="rounded-md gap-1 pr-1 px-2 py-1"
          >
            {i}
            <button
              type="button"
              onClick={() => onChange(items.filter((x) => x !== i))}
              className="rounded hover:bg-foreground/10 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* search only input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}`}
          className="rounded-xl pl-9"
        />
      </div>

      {/* searchable suggestion chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-[11px] rounded-full bg-secondary hover:bg-gold-soft px-2.5 py-1 text-muted-foreground hover:text-primary-deep transition-colors border"
            >
              + {s}
            </button>
          ))
        ) : (
          <p className="text-xs text-muted-foreground px-1">
            No matching {label.toLowerCase()} found
          </p>
        )}
      </div>
    </div>
  );
}