"use client";

import React, { useState, startTransition } from "react";
import useSWR, { mutate } from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Textarea } from "../ui/textarea";
import Pagination from "@/components/Pagination";
import { usePaginationFrontend } from "@/hooks/usePaginationFrontend";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function FollowUpBoard({ id }: { id: string }) {
  const [message, setMessage] = useState("");

  const { data, isLoading } = useSWR(`/api/leads/${id}/followups`, fetcher);

  const followups = data?.data || [];

  const {
    page,
    setPage,
    totalPages,
    paginatedData,
    hasNext,
    hasPrev,
    next,
    prev,
  } = usePaginationFrontend({
    data: followups,
    pageSize: 5,
  });

  const handleAddFollowup = async () => {
    if (!message) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/leads/${id}/followups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setMessage("");
        mutate(`/api/leads/${id}/followups`);
        toast.success("Followup added");
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Followup Messages Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse bg-muted rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Follow up Messages</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* LIST */}
        {paginatedData.length > 0 ? (
          paginatedData.map((f: any) => (
            <div
              key={f.id}
              className="group relative overflow-hidden rounded-2xl border bg-background p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              {/* left accent line */}
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-primary/60 to-primary/10" />

              <div className="flex items-start gap-3 pl-2">
                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {f.message
                    .split(" ")
                    .slice(0, 2)
                    .map((w: string) => w[0])
                    .join("")
                    .toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <p className="mt-2 text-sm leading-relaxed font-semibold text-muted-foreground">
                    {f.message}
                  </p>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {new Date(f.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Footer meta (future extensible) */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-1">
                      Lead Interaction
                    </span>
                    <span className="opacity-70">• Auto logged</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h6 className="text-center">No Followups Added!</h6>
        )}

        {/* INPUT */}
        <Textarea
          placeholder="Add followup..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button onClick={handleAddFollowup} disabled={!message}>
          Add Followup
        </Button>
      </CardContent>
      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNext}
        hasPrevPage={hasPrev}
        onNext={next}
        onPrev={prev}
        onPageChange={setPage}
      />
    </Card>
  );
}
