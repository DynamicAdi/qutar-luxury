"use client";

import axios from "axios";
import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Upload, Mail, User } from "lucide-react";
import { toast } from "sonner";

type Step = "FORM" | "PREVIEW";

export function PersonalizedMailDialog({
  leads = [],
  mutate,
  children,
  propertyId,
}: {
  children: any;
  mutate: any;
  leads: { id: string; name: string; email: string }[];
  propertyId: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("FORM");
  const [loading, startTransition] = useTransition();
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [form, setForm] = useState({
    mode: "existing", // existing | custom
    userId: "",
    customName: "",
    customEmail: "",
  });

  const [draft, setDraft] = useState("");

  const generateDraft = async () => {
    if (!file) return toast.error("Please upload PDF");

    startTransition(async () => {
      try {
        // console.log(form);
        const fd = new FormData();

        fd.append("file", file);
        fd.append("leadId", form.userId);
        fd.append("customName", form.customName);
        fd.append("customEmail", form.customEmail);
        const res = await axios.post(
          `/api/properties/${propertyId}/personalized-docs`,
          fd
        );

        setDraft(res.data.draft);
        // IMPORTANT: store returned metadata
        setForm((p) => ({
          ...p,
          recipientName: res.data.recipientName,
          recipientEmail: res.data.recipientEmail,
        }));
        setSubject(res.data.subject);
        setAttachmentUrl(res.data.attachmentUrl);
        setId(res.data.id);
        setStep("PREVIEW");
        toast.success("Draft generated & saved");
      } catch (err) {
        toast.error("Failed to generate draft");
      }
    });
  };

  const saveDraft = async () => {
    try {
      await axios.put(`/api/properties/${propertyId}/personalized-docs/${id}`, {
        body: draft,
        subject: subject,
      });

      toast.success("Draft updated");
      mutate();
      setOpen(false);
    } catch {
      toast.error("Failed to save");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-3xl max-h-150 overflow-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Personalized Property Mail</DialogTitle>
        </DialogHeader>

        {/* STEP 1 */}
        {step === "FORM" && (
          <div className="space-y-4 pt-3">
            {/* PDF UPLOAD */}
            <div className="rounded-2xl border bg-muted/20 p-4 space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Upload Proposal PDF
              </Label>

              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="h-10 rounded-xl"
              />

              {file && (
                <p className="text-xs text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* MODE SWITCH */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mode: "existing" }))}
                className={`h-10 rounded-xl text-sm ${
                  form.mode === "existing"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Existing User
              </Button>

              <Button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mode: "custom" }))}
                className={`h-10 rounded-xl text-sm ${
                  form.mode === "custom"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Custom
              </Button>
            </div>

            {/* EXISTING USER */}
            {form.mode === "existing" ? (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  Select Recipient
                </Label>

                <div className="rounded-xl border bg-background p-2">
                  <select
                    className="w-full bg-transparent text-sm outline-none"
                    value={form.userId}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        userId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Choose a user</option>

                    {leads.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              /* CUSTOM USER */
              <div className="space-y-3 rounded-2xl border bg-muted/20 p-4">
                <Label className="text-xs text-muted-foreground uppercase">
                  Custom Recipient
                </Label>

                <div className="space-y-2">
                  <Input
                    placeholder="Full Name"
                    value={form.customName}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        customName: e.target.value,
                      }))
                    }
                    className="h-10 rounded-xl"
                  />

                  <Input
                    placeholder="Email Address"
                    value={form.customEmail}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        customEmail: e.target.value,
                      }))
                    }
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* ACTION */}
            <Button
              onClick={generateDraft}
              disabled={
                loading ||
                !file ||
                (form.mode === "existing"
                  ? !form.userId
                  : !form.customEmail || !form.customName)
              }
              className="h-11 w-full rounded-xl font-medium"
            >
              {loading ? "Generating AI Draft..." : "Generate Email Draft"}
            </Button>
          </div>
        )}

        {/* STEP 2 */}
        {step === "PREVIEW" && (
          <div className="flex h-full flex-col pt-2">
            {/* HEADER */}
            <div className="flex items-center justify-between pb-3">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                AI Generated Email
              </Label>

              <span className="text-[10px] text-muted-foreground">
                Editable
              </span>
            </div>

            {/* SUBJECT */}
            <div className="mb-3 space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Subject
              </Label>

              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                className="h-11 rounded-xl border bg-background"
              />
            </div>

            {/* BODY */}
            <div className="flex-1 space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Body
              </Label>

              <div className="rounded-2xl border bg-muted/10 p-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="h-[300px] resize-none border-0 bg-transparent text-sm leading-6 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={loading}
                className="h-10 flex-1 rounded-xl"
              >
                Save Draft
              </Button>

              {/* <Button onClick={()=>handleSendMail(id as string)} className="h-10 flex-1 rounded-xl">
                Send Email
              </Button> */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
