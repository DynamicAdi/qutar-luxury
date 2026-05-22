"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { qatarCitiesByState } from "@/config";
import { handleKeyDown } from "@/lib/InputKeyDown";
import { AddressEntry, Property } from "@/store/cms";
import axios from "axios";
import { Loader, MapPin, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function AddressPicker({ p, upd }: { p: Property; upd: any }) {
  const [mode, setMode] = useState<"select" | "new">("select");
  const [draft, setDraft] = useState<AddressEntry>({
    city: "",
    gmaps: "",
    label: "",
    id: "",
    createdAt: "",
    state: "",
    street: "",
    properties: [],
  });
  const [data, setData] = useState<AddressEntry[]>([]);
  const [transition, setTransition] = useTransition();
  const [preview, setPreview] = useState<AddressEntry | null>(null);
  const [thread, startThread] = useTransition();

  const fetchAddress = () =>
    setTransition(async () => {
      const res = await axios.get("/api/address");
      if (res.status === 200) {
        setData(res.data.data);
      }
    });

  const saveAddress = (address: AddressEntry) =>
    startThread(async () => {
      try {
        const req = await axios.post("/api/address", {
          label: address.label,
          city: address.city,
          street: address.street,
          state: address.state,
          zipCode: address.zipCode,
          longitude: address.longitude,
          latitude: address.latitude,
          gmaps: address.gmaps || null,
        });
        if (req.status === 201) {
          toast.success("Address saved");
          setPreview(req.data);
          setMode("select");

          fetchAddress();
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to save address");
      }
    });

  const saveNew = () => {
    if (!draft?.label || !draft.street)
      return toast.error("Label and street required");
    saveAddress(draft);
    setMode("select");
    toast.success("Address saved & selected");
  };

  const handleSelect = (id: string) => {
    const previewData = data.find((a) => a.id === id);

    if (id === "new") {
      setMode("new");
    } else {
      setMode("select");
      setPreview(previewData as AddressEntry);
      upd("address", previewData?.id);
      upd("addressId", previewData?.id);
    }
  };

  useEffect(() => {
    fetchAddress();
    if (p.address) {
      setPreview(p.address);
    }
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Saved Address
        </Label>
      </div>
      <Select
        value={mode === "new" ? "new" : preview?.id ?? ""}
        onValueChange={(value) => handleSelect(value)}
      >
        <SelectTrigger className="rounded-xl w-full">
          <SelectValue placeholder="Select an street…" />
        </SelectTrigger>
        <SelectContent>
          {transition && (
            <SelectItem
              value="loading"
              disabled
              className="text-primary-deep/40 font-medium"
            >
              {"Loading..."}
            </SelectItem>
          )}
          {data.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.label}
            </SelectItem>
          ))}
          <SelectItem value="new" className="text-primary-deep font-medium">
            + Add new Address
          </SelectItem>
        </SelectContent>
      </Select>

      {mode === "new" ? (
        <Card className="rounded-xl p-4 border border-primary/30 bg-gold-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-primary" /> New street
            </div>
            <button
              onClick={() => setMode("select")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <Field label="Label">
            <Input
              value={draft?.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              className="rounded-xl bg-card"
              placeholder="Pearl Marina, Doha"
            />
          </Field>
          <Field label="Street Address">
            <Input
              value={draft?.street}
              onChange={(e) => setDraft({ ...draft, street: e.target.value })}
              className="rounded-xl bg-card"
              placeholder="Type your street"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="State">
              <select
                value={draft?.state || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    state: e.target.value,
                    city: "",
                  })
                }
                className="h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none"
              >
                <option value="">Select State</option>

                {Object.keys(qatarCitiesByState).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="City">
              <select
                value={draft?.city || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    city: e.target.value,
                  })
                }
                disabled={!draft?.state}
                className="h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none disabled:opacity-50"
              >
                <option value="">Select City</option>

                {(qatarCitiesByState[draft?.state] || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude">
              <Input
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                value={draft?.latitude ?? ""}
                placeholder="Enter Latitude"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    latitude: e.target.value ? +e.target.value : undefined,
                  })
                }
                className="rounded-xl bg-card"
              />
            </Field>
            <Field label="Longitude">
              <Input
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                value={draft?.longitude ?? ""}
                placeholder="Enter Longitude"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    longitude: e.target.value ? +e.target.value : undefined,
                  })
                }
                className="rounded-xl bg-card"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Google Maps">
              <Input
                type="text"
                value={draft?.gmaps ?? ""}
                placeholder="Enter Google Maps"
                onChange={(e) => setDraft({ ...draft, gmaps: e.target.value })}
                className="rounded-xl bg-card"
              />
            </Field>
            <Field label="Zip code">
              <Input
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                value={draft?.zipCode ?? ""}
                placeholder="Enter zip code"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    zipCode: e.target.value.slice(0, 6)
                      ? +e.target.value.slice(0, 6)
                      : undefined,
                  })
                }
                className="rounded-xl bg-card"
              />
            </Field>
          </div>

          <Button
            onClick={saveNew}
            size="sm"
            className="rounded-xl py-5 bg-primary text-primary-foreground shadow-gold"
          >
            <Plus className="h-4 w-4 mr-1" />{" "}
            {thread ? <Loader className="animate-spin" /> : "Save & Select"}
          </Button>
        </Card>
      ) : (
        <Card className="rounded-xl p-4 bg-secondary/40 border-0 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Preview (read-only)
          </div>
          {preview ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <PreviewItem label="Address">
                {preview?.street || "—"}
              </PreviewItem>
              <PreviewItem label="City">{preview?.city || "—"}</PreviewItem>
              <PreviewItem label="State">{preview?.state || "—"}</PreviewItem>
              {preview?.latitude != null && (
                <PreviewItem label="Lat">{preview.latitude}</PreviewItem>
              )}
              {preview?.longitude != null && (
                <PreviewItem label="Lng">{preview.longitude}</PreviewItem>
              )}
              {preview?.gmaps != null && (
                <PreviewItem label="Google Maps">
                  <div className="w-full h-32 rounded-xl">
                    <iframe
                      title="Maps"
                      src={preview.gmaps || undefined}
                      loading="lazy"
                      className="w-full h-full my-2 rounded-xl"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </PreviewItem>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No street selected. Pick one above or add a new one.
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function PreviewItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-medium">{children}</div>
    </div>
  );
}
