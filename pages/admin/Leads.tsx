"use client";

import { useState, useMemo, useTransition, useEffect, useRef } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Lead } from "@/store/cms";
import {
  Search,
  Mail,
  Phone,
  Trash2,
  ArrowUpRight,
  UserCheck,
  LucideLoader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Field } from "@/components/ui/field";
import LoaderScreen from "@/misc/LoaderScreen";
import { usePaginatedFetch } from "@/components/usePaginationFetch";

const statusStyle: Record<Lead["status"], string> = {
  NEW: "bg-primary/10 text-primary-deep border-primary/30",
  CONTACTED: "bg-warning/15 text-[hsl(35_60%_30%)] border-warning/30",
  QUALIFIED: "bg-green-400/15 text-[hsl(142_55%_28%)] border-green-400/30",
  CONVERTED: "bg-primary/80 text-white border-transparent",
  LOST: "bg-muted text-muted-foreground border-border",
};

export default function Leads() {
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  const [isPending, startTransition] = useTransition();
  const [deleteThread, startDeleteThread] = useTransition();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    rows: leads,
    loading,
    search,
    setSearch,
    filters,
    setFilters,

    pagination,
    page,
    pageNumbers,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  } = usePaginatedFetch<Lead>({
    url: "/api/leads",
    limit: 10,
    initialFilters: {
      status: "",
    },
  });

  async function updateLeadStatus(id: string, status: string) {
    const res = await axios.put("/api/leads", { id, status });

    if (res.status === 200) {
      return res.data;
    }
  }

  const handleUpdate = (id: string, status: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          await updateLeadStatus(id, status);
          refresh();
        } catch (error) {
          console.error(error);
        }
      });
    }, 500);
  };

  const deleteRow = (id: string) => {
    startDeleteThread(async () => {
      const req = await axios.delete(`/api/leads?id=${id}`);

      if (req.status === 200) {
        toast.success("Deleted!");
        refresh();
      }
    });
  };

  const askToDelete = (id: string, name: string) => {
    const ask = window.confirm(`Are you sure want to delete ${name}?`);

    if (ask) deleteRow(id);
  };

  if (loading) return <LoaderScreen />;

  return (
    <>
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        subtitle="Track, qualify and convert enquiries from your luxury portfolio."
      />

      {/* Filters */}
      <Card className="rounded-2xl p-3 py-0 md:p-4 shadow-card border-0 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone"
              className="pl-9 h-10 rounded-xl"
            />
          </div>

          <Select
            value={filters.status || "ALL"}
            onValueChange={(v) =>
              setFilters({
                status: v === "ALL" ? "" : v,
              })
            }
          >
            <SelectTrigger className="h-10 rounded-xl sm:w-44">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {[
                "ALL",
                "NEW",
                "CONTACTED",
                "QUALIFIED",
                "CONVERTED",
                "LOST",
              ].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl shadow-card border-0 py-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3.5">Lead</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left px-4 py-3.5 hidden lg:table-cell">
                  Property
                </th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">
                  Budget
                </th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-right px-4 py-3.5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((l, i) => (
                <tr
                  key={l.id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {l.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <div className="font-medium">{l.name}</div>

                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {l.message}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <a
                        href={`mailto:${l.email}`}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                      >
                        <Mail className="h-3 w-3" /> {l.email}
                      </a>

                      <a
                        href={`tel:${l.phone}`}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                      >
                        <Phone className="h-3 w-3" /> {l.phone}
                      </a>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground">
                    {l.property?.title || "—"}
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className="rounded-md font-normal border-primary/30 text-primary-deep"
                    >
                      {l.budget}
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5">
                    <Select
                      value={l.status}
                      onValueChange={(v) => handleUpdate(l.id, v)}
                    >
                      <SelectTrigger
                        className={`rounded-lg h-8 text-xs border w-32 ${
                          statusStyle[l.status]
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {[
                          "NEW",
                          "CONTACTED",
                          "QUALIFIED",
                          "CONVERTED",
                          "LOST",
                        ].map((s) => (
                          <SelectItem key={s} value={s}>
                            {isPending ? "Updating..." : s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1 items-center">
                      {l.status === "QUALIFIED" && (
                        <Button
                          size="sm"
                          onClick={() => setConvertLead(l)}
                          className="h-8 rounded-lg bg-emerald text-white text-xs"
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" />
                          Convert
                        </Button>
                      )}

                      <a
                        href={`mailto:${l.email}`}
                        className="rounded-lg p-2 hover:bg-secondary"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>

                      <button
                        onClick={() => askToDelete(l.id, l.name)}
                        className="rounded-lg p-2 hover:bg-destructive/10 hover:text-destructive"
                      >
                        {deleteThread ? (
                          <LucideLoader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {leads.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <button
              onClick={prevPage}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 rounded-md border disabled:opacity-40"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`h-9 w-9 rounded-md border text-sm ${
                    page === num ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 rounded-md border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </Card>

      <ConvertDialog lead={convertLead} onClose={() => setConvertLead(null)} />
    </>
  );
}

function ConvertDialog({
  lead,
  onClose,
}: {
  lead: Lead | null;
  onClose: () => void;
}) {
  const [nationality, setNationality] = useState("Qatari");
  const [dealAmount, setDealAmount] = useState<number>(
    Number(lead?.property?.price) ?? 0
  );
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [closingDate, setClosingDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [saveProcess, startSaveProcess] = useTransition();
  // reset when lead changes

  const saveCustomer = () =>
    startSaveProcess(async () => {
      const req = await axios.post("/api/customers", {
        name: lead?.name,
        email: lead?.email,
        phone: lead?.phone,
        propertyIds: [lead?.property.id],
        nationality: nationality,
        dealAmount: dealAmount,
        paymentMethod: paymentMethod,
        closingDate: new Date(closingDate),
        note: notes,
      });

      if (req.status === 201) {
        toast.success("Customer added & property linked");
      }
    });

  if (!lead) return null;

  async function updateLead(id: string) {
    const res = await axios.put("/api/leads", {
      id,
      status: "CONVERTED",
    });
    if (res.status === 200) {
      return res.data;
    }
  }
  const submit = () => {
    if (!dealAmount || dealAmount <= 0) {
      toast.error("Enter a valid deal amount");
      return;
    }
    saveCustomer();
    updateLead(lead.id);
    onClose();
  };

  return (
    <Dialog open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-grotesk">Convert to Client</DialogTitle>
          <DialogDescription>
            Closing the deal with{" "}
            <span className="font-medium text-foreground">{lead.name}</span>
            {lead.property ? (
              <>
                {" "}
                for{" "}
                <span className="font-medium text-foreground">
                  {lead.property.title}
                </span>
              </>
            ) : null}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client Name">
              <Input value={lead.name} disabled className="rounded-xl" />
            </Field>
            <Field label="Nationality">
              <Input
                value={nationality}
                disabled
                onChange={(e) => setNationality(e.target.value)}
                className="rounded-xl"
              />
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
            {lead.property && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Listed price: QAR {lead.property.price.toLocaleString()}
              </p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Payment Method">
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Bank Transfer",
                    "Cash",
                    "Mortgage",
                    "Installments",
                    "Cheque",
                  ].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Closing Date">
              <Input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="rounded-xl"
              />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl min-h-20"
              placeholder="Deal terms, special conditions..."
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={submit}
            className="rounded-xl bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90"
          >
            <UserCheck className="h-4 w-4 mr-1.5" /> Confirm Conversion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
