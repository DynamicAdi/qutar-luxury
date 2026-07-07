"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { usePaginationFrontend } from "@/hooks/usePaginationFrontend";
import { fetcher } from "@/lib/fetcher";
import { MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import Pagination from "../Pagination";
export default function MeetingsBoard({ id }: { id: string }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, startTransition] = useTransition();
  // 🔥 SWR FETCH
  const { data, isLoading, mutate } = useSWR(
    id ? `/api/leads/${id}/meetings` : null,
    fetcher
  );

  const meetings = data?.data || [];

  // 🔥 PAGINATION HOOK
  const {
    page,
    totalPages,
    paginatedData: paginatedMeetings,
    next,
    prev,
    hasNext,
    hasPrev,
    setPage,
  } = usePaginationFrontend({
    data: meetings,
    pageSize: 5,
  });

  // 🔥 CREATE MEETING
  const handleCreateMeeting = async () => {
    if (!title || !location || !scheduledAt) return;

    startTransition(async () => {
      try {
        const req = await fetch(`/api/leads/${id}/meetings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            location,
            scheduledAt,
          }),
        });

        const res = await req.json();

        if (!res.success) {
          throw new Error(res.message);
        }

        setTitle("");
        setLocation("");
        setScheduledAt("");

        mutate(); // SWR refresh

        toast.success(res.message);
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const updateMeetingStatus = async (meetingId: string, status: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/leads/${id}/meetings/${meetingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update meeting");
        }

        // 🔥 refresh SWR cache
        mutate();

        toast.success(`Meeting marked as ${status}`);
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };
  if (isLoading) {
    return <MeetingsSkeleton />;
  }

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Send Email Meeting Notification</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* CREATE MEETING */}
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            type="datetime-local"
            value={scheduledAt}
            disabled={pending}
            onChange={(e) => setScheduledAt(e.target.value)}
          />

          <Input
            placeholder="Meeting Subject"
            value={title}
            disabled={pending}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Location / Address"
            value={location}
            disabled={pending}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <Button disabled={pending} onClick={handleCreateMeeting}>
          Send Invite Email
        </Button>

        {/* HISTORY */}
        <div className="space-y-3">
          <h4 className="font-medium">Meeting History</h4>

          {paginatedMeetings.length === 0 ? (
            <h6 className="text-center">No Meetings Found!</h6>
          ) : (
            paginatedMeetings.map((m: any) => (
              <div
                key={m.id}
                className="group rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* LEFT CONTENT */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-base">{m.title}</p>

                      <Badge
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          m.status === "SCHEDULED"
                            ? "bg-blue-500/10 text-blue-600"
                            : m.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-600"
                            : m.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {m.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      📍 {m.location}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      🕒 {new Date(m.scheduledAt).toLocaleString()}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      ✉️ {m.emailSent ? "Email Sent" : "Email Pending"}
                    </p>
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => updateMeetingStatus(m.id, "SCHEDULED")}
                        >
                          Mark Scheduled
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => updateMeetingStatus(m.id, "COMPLETED")}
                        >
                          Mark Completed
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => updateMeetingStatus(m.id, "CANCELLED")}
                          className="text-red-500"
                        >
                          Cancel Meeting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <Pagination
          hasNextPage={hasNext}
          hasPrevPage={hasPrev}
          onNext={next}
          onPrev={prev}
          onPageChange={setPage}
          page={page}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  );
}

function MeetingsSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Send Email Meeting Notification</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />
        ))}
      </CardContent>
    </Card>
  );
}
