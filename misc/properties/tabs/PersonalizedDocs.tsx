"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import axios from "axios";

import {
  Search,
  Mail,
  FileText,
  Clock3,
  Send,
  Eye,
  Trash2,
  Clipboard,
  ClipboardCopy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalizedMailDialog } from "@/components/client/admins/PersonalizedEmailDialog";
import { fetcher } from "@/lib/fetcher";
import { Property } from "@/store/cms";
import { ConfirmDialog } from "../ConfirmDialog";
import { toast } from "sonner";
import { EditPersonalizedMailDialog } from "../PersonalizedMailUpdate";
interface Props {
  id: string;
  p: Property;
}
export default function PersonalizedDocsTab({ id, p }: Props) {
  const [search, setSearch] = useState("");

  const { data, isLoading, mutate } = useSWR(
    `/api/properties/${id}/personalized-docs`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const { data: rawLeads } = useSWR(`/api/properties/${id}/leads`, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
  const mails = data?.data || [];

  const filtered = useMemo(() => {
    return mails.filter((item: any) =>
      `${item.recipientName} ${item.recipientEmail} ${item.property}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, mails]);
  const leads = rawLeads?.data ?? [];
  const onDelete = async (mailId: string) => {
    try {
      const res = await axios.delete(
        `/api/properties/${id}/personalized-docs/${mailId}`
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to delete mail");
      }

      toast.success("Mail deleted successfully");

      mutate();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete mail");
    }
  };

  const handleSendMail = async (mailId: string) => {
    try {
      const res = await axios.post(
        `/api/properties/${id}/personalized-docs/${mailId}/send-email`,
        {
          mailId,
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      toast.success("Email sent successfully");

      mutate?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send email");
    }
  };
  return (
    <Card className="rounded-2xl border-0 p-3 shadow-sm space-y-3">
      {/* SEARCH + ACTION */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mails..."
            className="h-9 rounded-xl pl-9"
          />
        </div>

        <PersonalizedMailDialog propertyId={id} leads={leads} mutate={mutate}>
          <Button className="h-9 rounded-xl">
            <Mail className="mr-1 h-4 w-4" />
            Create
          </Button>
        </PersonalizedMailDialog>
      </div>

      {/* HISTORY */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No History Found
          </p>
        ) : (
          filtered.map((mail: any) => (
            <div
              key={mail.id}
              className="group rounded-2xl border bg-background p-4 transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                {/* LEFT */}
                <div className="min-w-0 flex-1 space-y-2">
                  {/* TITLE + STATUS */}
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {mail.property}
                    </p>

                    <Badge
                      className={`h-5 rounded-full px-2 text-[10px] ${
                        mail.status === "SENT"
                          ? "bg-green-100 text-green-700"
                          : mail.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {mail.status}
                    </Badge>
                  </div>

                  {/* RECIPIENT */}
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-[11px] text-muted-foreground truncate">
                      To: {mail.recipientEmail}
                    </p>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(mail.recipientEmail)
                      }
                      className="text-primary hover:bg-primary/10 transition-all p-[4px] rounded-full"
                    >
                      <ClipboardCopy className="h-3 w-3" />
                    </button>
                  </div>

                  {/* SUBJECT */}
                  <p className="line-clamp-2 text-[11px] text-muted-foreground">
                    {mail.subject}
                  </p>

                  {/* META */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      PDF
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      {new Date(mail.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
                  {/* VIEW */}
                  <EditPersonalizedMailDialog mail={mail} propertyId={id}>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-xl"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </EditPersonalizedMailDialog>
                  {/* SEND ONLY IF DRAFT */}
                  {mail.status === "DRAFT" && (
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-xl"
                      onClick={() => handleSendMail(mail.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}

                  {/* DELETE */}
                  <ConfirmDialog onConfirm={() => onDelete(mail.id)}>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmDialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
