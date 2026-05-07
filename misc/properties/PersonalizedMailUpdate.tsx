"use client";

import axios from "axios";
import { ReactNode, useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

interface EditPersonalizedMailDialogProps {
  children: ReactNode;
  mutate?: () => void;

  propertyId: string;

  mail: {
    id: string;
    recipientName: string;
    recipientEmail: string;
    subject: string;
    body: string;
  };
}

export function EditPersonalizedMailDialog({
  children,
  mutate,
  propertyId,
  mail,
}: EditPersonalizedMailDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();

  const [form, setForm] = useState({
    subject: mail.subject,
    body: mail.body,
  });

  const updateDraft = () => {
    startTransition(async () => {
      try {
        const res = await axios.put(
          `/api/properties/${propertyId}/personalized-docs/${mail.id}`,
          {
            subject: form.subject,
            body: form.body,
          }
        );

        if (!res.data.success) {
          throw new Error(res.data.message);
        }

        toast.success("Draft updated");

        mutate?.();

        setOpen(false);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to update draft"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-150 overflow-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edit Draft</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* RECIPIENT NAME */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Recipient Name
            </Label>

            <Input
              disabled
              value={mail.recipientName}
              className="h-11 rounded-xl bg-muted/40"
            />
          </div>

          {/* RECIPIENT EMAIL */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Recipient Email
            </Label>

            <Input
              disabled
              value={mail.recipientEmail}
              className="h-11 rounded-xl bg-muted/40"
            />
          </div>

          {/* SUBJECT */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Subject
            </Label>

            <Input
              value={form.subject}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  subject: e.target.value,
                }))
              }
              className="h-11 rounded-xl"
            />
          </div>

          {/* BODY */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Email Body
            </Label>

            <div className="rounded-2xl border bg-muted/10 p-2">
              <Textarea
                value={form.body}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    body: e.target.value,
                  }))
                }
                className="min-h-[300px] resize-none border-0 bg-transparent text-sm leading-6 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            onClick={updateDraft}
            disabled={loading}
            className="rounded-xl"
          >
            {loading ? "Updating..." : "Update Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}