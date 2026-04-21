"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useCMS, Lead, Customer } from "@/store/cms";
import { Search, Mail, Phone, Trash2, ArrowUpRight, UserCheck } from "lucide-react";
import { toast } from "sonner";

const statusStyle: Record<Lead["status"], string> = {
  New: "bg-primary/10 text-primary-deep border-primary/30",
  Contacted: "bg-warning/15 text-[hsl(35_60%_30%)] border-warning/30",
  Qualified: "bg-green-400/15 text-[hsl(142_55%_28%)] border-green-400/30",
  Converted: "bg-primary/80 text-white border-transparent",
  Lost: "bg-muted text-muted-foreground border-border",
};

export default function Leads() {
  const { leads, properties, updateLead, deleteLead, addCustomer, linkProperty } = useCMS();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  const propertyMap = useMemo(() => Object.fromEntries(properties.map((p) => [p.id, p.title])), [properties]);
  const filtered = leads
    .filter((l) => filter === "All" || l.status === filter)
    .filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader eyebrow="Pipeline" title="Leads" subtitle="Track, qualify and convert enquiries from your luxury portfolio." />

      <Card className="rounded-2xl p-3 py-0 md:p-4 shadow-card border-0 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="pl-9 h-10 rounded-xl" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-10 rounded-xl sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["All", "New", "Contacted", "Qualified", "Converted", "Lost"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="rounded-2xl shadow-card border-0 py-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3.5">Lead</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3.5 hidden lg:table-cell">Property</th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">Budget</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-right px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l.id} className="border-t border-border hover:bg-secondary/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {l.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{l.message}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <a href={`mailto:${l.email}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary"><Mail className="h-3 w-3" /> {l.email}</a>
                      <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary"><Phone className="h-3 w-3" /> {l.phone}</a>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground">
                    {l.propertyId ? propertyMap[l.propertyId] || "—" : "—"}
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <Badge variant="outline" className="rounded-md font-normal border-primary/30 text-primary-deep">{l.budget}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Select value={l.status} onValueChange={(v) => updateLead(l.id, { status: v as Lead["status"] })}>
                      <SelectTrigger className={`rounded-lg h-8 text-xs border w-32 ${statusStyle[l.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["New","Contacted","Qualified","Converted","Lost"] as Lead["status"][]).map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1 items-center">
                      {l.status === "Qualified" && (
                        <Button
                          size="sm"
                          onClick={() => setConvertLead(l)}
                          className="h-8 rounded-lg bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90 text-xs ml-2"
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" /> Convert to Client
                        </Button>
                      )}
                      <a href={`mailto:${l.email}`} className="rounded-lg p-2 hover:bg-secondary text-muted-foreground hover:text-foreground" title="Reply">
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                      <button onClick={() => { deleteLead(l.id); toast.success("Lead removed"); }} className="rounded-lg p-2 hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No leads match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConvertDialog
        lead={convertLead}
        onClose={() => setConvertLead(null)}
        onConfirm={(customer, dealAmount) => {
          if (!convertLead) return;
          addCustomer(customer);
          if (convertLead.propertyId) linkProperty(customer.id, convertLead.propertyId);
          updateLead(convertLead.id, { status: "Converted" });
          toast.success(`${customer.name} converted · Deal QAR ${dealAmount.toLocaleString()}`);
          setConvertLead(null);
        }}
      />
    </>
  );
}

function ConvertDialog({
  lead, onClose, onConfirm,
}: {
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (c: Customer, dealAmount: number) => void;
}) {
  const { properties } = useCMS();
  const property = lead?.propertyId ? properties.find((p) => p.id === lead.propertyId) : undefined;

  const [nationality, setNationality] = useState("Qatari");
  const [dealAmount, setDealAmount] = useState<number>(property?.price ?? 0);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [closingDate, setClosingDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  // reset when lead changes
  useMemo(() => {
    setDealAmount(property?.price ?? 0);
    setNationality("Qatari");
    setPaymentMethod("Bank Transfer");
    setClosingDate(new Date().toISOString().slice(0, 10));
    setNotes("");
  }, [lead?.id]);

  if (!lead) return null;

  const submit = () => {
    if (!dealAmount || dealAmount <= 0) {
      toast.error("Enter a valid deal amount");
      return;
    }
    const customer: Customer = {
      id: "c" + Date.now(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      nationality,
      joinedAt: new Date().toISOString(),
      propertyIds: [],
    };
    onConfirm(customer, dealAmount);
  };

  return (
    <Dialog open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-grotesk">Convert to Client</DialogTitle>
          <DialogDescription>
            Closing the deal with <span className="font-medium text-foreground">{lead.name}</span>
            {property ? <> for <span className="font-medium text-foreground">{property.title}</span></> : null}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client Name">
              <Input value={lead.name} disabled className="rounded-xl" />
            </Field>
            <Field label="Nationality">
              <Input value={nationality} onChange={(e) => setNationality(e.target.value)} className="rounded-xl" />
            </Field>
          </div>

          <Field label="Deal Amount (QAR)">
            <Input
              type="number"
              value={dealAmount}
              onChange={(e) => setDealAmount(+e.target.value)}
              className="rounded-xl"
              placeholder="e.g. 18500000"
            />
            {property && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Listed price: QAR {property.price.toLocaleString()}
              </p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Payment Method">
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Bank Transfer", "Cash", "Mortgage", "Installments", "Cheque"].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Closing Date">
              <Input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className="rounded-xl" />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl min-h-20" placeholder="Deal terms, special conditions..." />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={submit} className="rounded-xl bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90">
            <UserCheck className="h-4 w-4 mr-1.5" /> Confirm Conversion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
