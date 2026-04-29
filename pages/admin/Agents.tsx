"use client";

import axios from "axios";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { usePaginatedFetch } from "@/components/usePaginationFetch";

import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Search, Plus, ChevronRight } from "lucide-react";

import { toast } from "sonner";
import { AgentEntry } from "@/store/cms";
import LoaderScreen from "@/misc/LoaderScreen";
import AgentDialog from "@/misc/AgentDialog";
import Pagination from "@/components/Pagination";

export default function Agents() {
  const navigate = useRouter();

  const [editing, setEditing] = useState<AgentEntry | null>(null);
  const [open, setOpen] = useState(false);

  const [postThread, startThread] = useTransition();

  /* ---------------- PAGINATED HOOK ---------------- */

  const {
    rows: data,
    loading,
    search,
    setSearch,

    pagination,
    page,
    pageNumbers,

    nextPage,
    prevPage,
    goToPage,
    refresh,
  } = usePaginatedFetch<AgentEntry>({
    url: "/api/agent",
    limit: 10,
    debounce: 500,
  });

  /* ---------------- SAVE ---------------- */

  const saveAgent = () =>
    startThread(async () => {
      try {
        if (!editing) return;

        const req = await axios.post("/api/agent", {
          name: editing.name,
          email: editing.email,
          phone: editing.phone,
          bio: editing.bio,
        });

        if (req.status === 200) {
          toast.success("Agent added");
          refresh(page);
        }
      } catch (error) {
        toast.error("Failed to save agent");
      }
    });

  /* ---------------- HELPERS ---------------- */

  const blank = (): AgentEntry => ({
    id: "",
    name: "",
    phone: "",
    email: "",
    bio: "",
    properties: [],
    addedAt: new Date().toISOString(),
  });

  const openNew = () => {
    setEditing(blank());
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;

    if (!editing.name || !editing.email) {
      return toast.error("Name and email are required");
    }

    saveAgent();
    setOpen(false);
  };

  const initials = (n: string) =>
    n
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  /* ---------------- LOADER ---------------- */

  if (loading && data.length === 0) {
    return <LoaderScreen />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Agents"
        subtitle="All saved agents and the properties they handle. Click a row for full details."
        actions={
          <>
            <div className="relative w-44 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents"
                className="pl-9 h-9 rounded-xl"
              />
            </div>

            <Button
              onClick={openNew}
              size="sm"
              className="rounded-lg bg-gradient-gold py-5 px-4 text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Agent
            </Button>
          </>
        }
      />

      {/* TABLE */}
      <Card className="rounded-lg shadow-card border-0 overflow-hidden py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-gold text-xs uppercase tracking-wider text-white">
              <tr>
                <th className="text-left px-4 py-3.5">Agent</th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">
                  Phone
                </th>
                <th className="text-right px-4 py-3.5">Listings</th>
                <th className="w-10"></th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No agents found.
                  </td>
                </tr>
              )}

              {data.map((a, i) => (
                <tr
                  key={a.id}
                  onClick={() => navigate.push(`/dashboard/agents/${a.id}`)}
                  className="border-t border-border hover:bg-secondary/40 cursor-pointer transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/15 text-primary-deep font-semibold flex items-center justify-center text-xs">
                        {initials(a.name)}
                      </div>

                      <div className="font-medium leading-tight">
                        {a.name}
                        <br />
                        <span className="text-xs text-gray-500 font-light">
                          {a.bio}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
                    {a.email}
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">
                    {a.phone}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <Badge variant="secondary" className="rounded-md">
                      {a._count?.properties}
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

        {/* PAGINATION */}
        {/* {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <button
              onClick={prevPage}
              disabled={!pagination?.hasPrevPage}
              className="px-3 py-1 rounded-md border disabled:opacity-40"
            >
              Prev
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`h-9 w-9 rounded-md border text-sm ${
                    page === num
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={!pagination?.hasNextPage}
              className="px-3 py-1 rounded-md border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )} */}
        <Pagination
          page={page}
          totalPages={pagination?.totalPages ?? 0}
          hasPrevPage={pagination?.hasPrevPage ?? false}
          hasNextPage={pagination?.hasNextPage ?? false}
          onPrev={prevPage}
          onNext={nextPage}
          onPageChange={goToPage}
        />
      </Card>

      <AgentDialog
        editing={editing}
        open={open}
        setOpen={setOpen}
        setEditing={setEditing}
        save={save}
        loading={postThread}
      />
    </>
  );
}
