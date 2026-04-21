"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useCMS, AddressEntry } from "@/store/cms";
import { MapPin, Plus, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Addresses() {
  const navigate = useRouter();
  const { addresses, properties, addAddress } = useCMS();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AddressEntry | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      addresses.filter(
        (a) =>
          a.label.toLowerCase().includes(q.toLowerCase()) ||
          a.address.toLowerCase().includes(q.toLowerCase()) ||
          a.city.toLowerCase().includes(q.toLowerCase())
      ),
    [addresses, q]
  );

  const blank = (): AddressEntry => ({
    id: "addr-" + Date.now(),
    label: "", address: "", city: "Doha", country: "Qatar", notes: "",
    createdAt: new Date().toISOString(),
  });

  const openNew = () => { setEditing(blank()); setOpen(true); };

  const save = () => {
    if (!editing) return;
    if (!editing.label || !editing.address) return toast.error("Label and address are required");
    addAddress(editing);
    toast.success("Address added");
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Addresses"
        subtitle="All saved addresses across your portfolio. Click a row to view linked properties."
        actions={
          <>
            <div className="relative w-44 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search address" className="pl-9 h-9 rounded-xl" />
            </div>
            <Button onClick={openNew} size="sm" className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-gold">
              <Plus className="h-4 w-4 mr-1" /> New Address
            </Button>
          </>
        }
      />

      <Card className="rounded-2xl shadow-card border-0 overflow-hidden py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-gold text-xs uppercase tracking-wider text-white">
              <tr>
                <th className="text-left px-4 py-3.5">Label</th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">Street</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">City</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">Country</th>
                <th className="text-right px-4 py-3.5">Properties</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No addresses found.</td></tr>
              )}
              {filtered.map((a, i) => {
                const count = properties.filter((p) => p.addressId === a.id).length;
                return (
                  <tr
                    key={a.id}
                    onClick={() => navigate.push(`/dashboard/addresses/${a.id}`)}
                    className="border-t border-border hover:bg-secondary/40 cursor-pointer transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-primary" /> {a.label}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{a.address}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{a.city}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{a.country}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Badge variant="secondary" className="rounded-md">{count}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>New address</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Label"><Input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="rounded-xl" placeholder="Pearl Marina, Doha" /></Field>
              <Field label="Street Address"><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} className="rounded-xl" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City"><Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="rounded-xl" /></Field>
                <Field label="Country"><Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="rounded-xl" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude"><Input type="number" value={editing.lat ?? ""} onChange={(e) => setEditing({ ...editing, lat: e.target.value ? +e.target.value : undefined })} className="rounded-xl" /></Field>
                <Field label="Longitude"><Input type="number" value={editing.lng ?? ""} onChange={(e) => setEditing({ ...editing, lng: e.target.value ? +e.target.value : undefined })} className="rounded-xl" /></Field>
              </div>
              <Field label="Notes"><Textarea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="rounded-xl" /></Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl bg-primary text-primary-foreground shadow-gold">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
