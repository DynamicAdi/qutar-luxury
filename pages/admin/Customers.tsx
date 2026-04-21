"use client";

import { useState } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCMS, Customer, formatPrice } from "@/store/cms";
import { Plus, Trash2, Link2, X, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function Customers() {
  const { customers, properties, addCustomer, deleteCustomer, linkProperty, unlinkProperty } = useCMS();
  const [open, setOpen] = useState(false);
  const [linkFor, setLinkFor] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", nationality: "Qatari", propertyId: "" });

  const availableForLink = properties.filter((p) => p.status !== "Sold");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Name and email required");
    if (!form.propertyId) return toast.error("Please link at least one property");
    const customerId = "c" + Date.now();
    addCustomer({
      id: customerId,
      name: form.name, email: form.email, phone: form.phone, nationality: form.nationality,
      joinedAt: new Date().toISOString(), propertyIds: [],
    });
    linkProperty(customerId, form.propertyId);
    toast.success("Customer added & property linked");
    setForm({ name: "", email: "", phone: "", nationality: "Qatari", propertyId: "" });
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="clients" title="Customers"
        subtitle="Manage your client portfolio. Every customer must own at least one property — linking auto-marks it as Sold."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
                <Plus className="h-4 w-4 mr-1.5" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div><Label>Full Name</Label><Input className="rounded-xl mt-1" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
                <div><Label>Email</Label><Input type="email" className="rounded-xl mt-1" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Phone</Label><Input className="rounded-xl mt-1" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
                  <div><Label>Nationality</Label><Input className="rounded-xl mt-1" value={form.nationality} onChange={(e) => setForm({...form, nationality: e.target.value})} /></div>
                </div>
                <div>
                  <Label>Linked Property <span className="text-destructive">*</span></Label>
                  <Select value={form.propertyId} onValueChange={(v) => setForm({ ...form, propertyId: v })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select a property to link" /></SelectTrigger>
                    <SelectContent>
                      {availableForLink.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">No available properties</div>}
                      {availableForLink.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.title} — {formatPrice(p.price, p.currency)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground mt-1">Required. Property will be marked as Sold.</p>
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-xl bg-gradient-gold text-primary-foreground">Save customer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="overflow-hidden border-none py-0 border-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-gold text-xs uppercase tracking-wider text-white">
              <tr>
                <th className="text-left px-4 py-3.5">Customer</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">Nationality</th>
                <th className="text-left px-4 py-3.5">Linked Properties</th>
                <th className="text-right px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className="border-t border-border hover:bg-secondary/30 animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">Joined {new Date(c.joinedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{c.nationality}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {c.propertyIds.length === 0 && <span className="text-xs text-muted-foreground">None linked</span>}
                      {c.propertyIds.map((pid) => {
                        const prop = properties.find((p) => p.id === pid);
                        if (!prop) return null;
                        return (
                          <Badge key={pid} className="rounded-md gap-1 bg-green-400/15 text-[hsl(142_55%_28%)] hover:bg-success/15 border border-green-400/30 pr-1">
                            {prop.title.slice(0, 24)}
                            <button
                              onClick={() => {
                                if (c.propertyIds.length <= 1) return toast.error("A customer must own at least one property");
                                unlinkProperty(c.id, pid);
                              }}
                              className="rounded hover:bg-foreground/10 p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setLinkFor(c)} className="rounded-lg p-2 hover:bg-gold-soft hover:text-primary-deep" title="Link property">
                        <Link2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => { deleteCustomer(c.id); toast.success("Customer removed"); }} className="rounded-lg p-2 hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No customers yet. Add your first.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Link property dialog */}
      <Dialog open={!!linkFor} onOpenChange={(o) => !o && setLinkFor(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader><DialogTitle>Link property to {linkFor?.name}</DialogTitle></DialogHeader>
          <div className="text-xs text-muted-foreground mb-2">Linking marks the property as Sold automatically.</div>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {availableForLink.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No available properties to link.</p>}
            {availableForLink.map((p) => (
              <button
                key={p.id}
                onClick={() => { linkProperty(linkFor!.id, p.id); toast.success(`${p.title} linked & marked Sold`); setLinkFor(null); }}
                className="w-full flex items-center gap-3 rounded-xl border border-border p-2.5 hover:border-primary hover:bg-gold-soft transition-colors text-left"
              >
                <img src={p.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.category} · {formatPrice(p.price, p.currency)}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
