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
import LoaderScreen from "@/misc/LoaderScreen";
import { usePaginatedFetch } from "@/components/usePaginationFetch";

export default function Addresses() {
  const navigate = useRouter();

  const [editing, setEditing] = useState<AddressEntry | null>(null);

  const [open, setOpen] = useState(false);

  const [postThread, startThread] = useTransition();

  const {
    rows: data,
    loading,

    search,
    setSearch,

    page,
    pagination,

    refresh,
    nextPage,
    prevPage,
    goToPage,
    pageNumbers,
  } = usePaginatedFetch<AddressEntry>({
    url: "/api/address",
    limit: 10,
    debounce: 500,
  });

  /* create address */

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
          gmaps: address.gmaps,
        });

        if (req.status === 200) {
          toast.success("Address saved");
          refresh();
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to save address");
      }
    });

  /* blank form */

  const blank = (): AddressEntry => ({
    id: "",
    label: "",
    street: "",
    city: "",
    state: "",
    gmaps: "",
    zipCode: 0,
    latitude: 0,
    longitude: 0,
    createdAt: new Date().toISOString(),

    properties: [],

    _count: {
      properties: 0,
    },
  });

  const openNew = () => {
    setEditing(blank());
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;

    if (!editing.label || !editing.street) {
      return toast.error("Label and address are required");
    }

    saveAddress(editing);
    setOpen(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  if (loading && !pagination) {
    return <LoaderScreen />;
  }

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

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search address"
                className="pl-9 h-9 rounded-xl"
              />
            </div>

            <Button
              onClick={openNew}
              size="default"
              className="rounded-lg px-4 pb-0.5 bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Address
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

                <th className="text-left px-4 py-3.5 hidden sm:table-cell">
                  Street
                </th>

                <th className="text-left px-4 py-3.5 hidden md:table-cell">
                  City
                </th>

                <th className="text-left px-4 py-3.5 hidden md:table-cell">
                  State
                </th>

                <th className="text-right px-4 py-3.5">Properties</th>

                <th className="w-10"></th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No addresses found.
                  </td>
                </tr>
              )}

              {data.map((a, i) => (
                <tr
                  key={a.id}
                  onClick={() => navigate.push(`/dashboard/addresses/${a.id}`)}
                  className="border-t border-border hover:bg-secondary/40 cursor-pointer transition-colors animate-fade-in-up"
                  style={{
                    animationDelay: `${i * 30}ms`,
                  }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {a.label}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
                    {a.street}
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">
                    {a.city}
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">
                    {a.state}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <Badge variant="secondary" className="rounded-md">
                      {a._count?.properties || 0}
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}

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
