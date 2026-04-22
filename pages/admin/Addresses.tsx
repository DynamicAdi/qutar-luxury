"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { AddressEntry } from "@/store/cms";
import { MapPin, Plus, Search, ChevronRight, Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddressDialog from "@/misc/AddressDialog";

export default function Addresses() {
  const navigate = useRouter();
  const [q, setQ] = useState("");
  const [data, setData] = useState<AddressEntry[]>([]);
  const [editing, setEditing] = useState<AddressEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [transition, startTransition] = useTransition();
  const [postThread, startThread] = useTransition();


  const fetchAddress = () => startTransition(async () =>{
    const res = await axios.get("/api/address");
    if (res.status === 200) {
      setData(res.data.data);
    }
  })

  const saveAddress = (address: AddressEntry) => startThread(async () =>{
    try {
      const req = await axios.post("/api/address", {
      label: address.label,
      city: address.city,
      street: address.street,
      state: address.state,
      zipCode: address.zipCode,
      longitude: address.longitude,
      latitude: address.latitude,
      gmaps: address.gmaps,
      });
      if (req.status === 200) {
        toast.success("Address saved");
        fetchAddress();
      }
    }
    catch (error) {
      console.log(error);
      toast.error("Failed to save address");
    }

  })

  const filtered = useMemo(
    () =>
      data.filter(
        (a) =>
          a.label.toLowerCase().includes(q.toLowerCase()) ||
          a.street.toLowerCase().includes(q.toLowerCase()) ||
          a.city.toLowerCase().includes(q.toLowerCase())
      ),
    [data, q]
  );

  const blank = () => ({
    label: "", street: "", city: "", state: "", gmaps: "", zipCode: undefined,
    createdAt: new Date().toISOString(),
  });

  const openNew = () => { setEditing(blank() as any); setOpen(true); };

  const save = () => {
    if (!editing) return;
    if (!editing.label || !editing.street) return toast.error("Label and address are required");
    saveAddress(editing);
    toast.success("Address added");
    setOpen(false);
  };

  useEffect(() => {
    fetchAddress();
  }, [])
  return (
    <>
    {
      transition && <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    }
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
            <Button onClick={openNew} size="default" className="rounded-lg px-4 pb-0.5 bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold">
              <Plus className="h-4 w-4" /> New Address
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
                <th className="text-left px-4 py-3.5 hidden md:table-cell">State</th>
                <th className="text-right px-4 py-3.5">Properties</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No addresses found.</td></tr>
              )}
              {filtered.map((a, i) => {
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
                    <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{a.street}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{a.city}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{a.state}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Badge variant="secondary" className="rounded-md">{a._count?.properties || 0}</Badge>
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

      <AddressDialog 
      open={open}
      setEditing={setEditing}
      editing={editing}
      setOpen={setOpen}
      loading={postThread}
      save={save}
      />
    </>
  );
}
