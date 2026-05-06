"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Mode = "create" | "update";

type TaskInput = {
  id?: string;
  title: string;
  dueDate?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

type Props = {
  leadId: string;
  mode?: Mode;
  initialData?: TaskInput;
  onSuccess?: () => void;
  children: React.ReactNode;
};
const toDateTimeLocal = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
const formatToISO = (value: string | null) => {
  if (!value) return null;
  return new Date(value).toISOString();
};
export default function TaskDialog({
  leadId,
  mode = "create",
  initialData,
  onSuccess,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  // 🧠 Prefill when updating
  useEffect(() => {
    if (mode === "update" && initialData) {
      console.log(initialData);
      setTitle(initialData.title || "");
      setDueDate(toDateTimeLocal(initialData.dueDate!));
      setPriority(initialData.priority || "MEDIUM");
    }
  }, [mode, initialData]);

  const handleSubmit = () => {
    if (!title) return;

    startTransition(async () => {
      try {
        const url =
          mode === "update"
            ? `/api/leads/${leadId}/tasks/${initialData?.id}`
            : `/api/leads/${leadId}/tasks`;

        const method = mode === "update" ? "PATCH" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            dueDate: formatToISO(dueDate) || null,
            priority,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          const error = new Error(data.message || "Request failed") as any;
          error.errors = data.errors;
          throw error;
        }

        toast.success(
          mode === "update"
            ? "Task updated successfully"
            : "Task created successfully"
        );

        setOpen(false);
        onSuccess?.();
      } catch (err: any) {
        const errors: Object = err?.errors?.fieldErrors;

        if (errors) {
          const firstError =
            Object.values(errors).flat()?.[0] || "Validation failed";
          toast.error(firstError);
          return;
        }

        toast.error(err?.message || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "update" ? "Update Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* TITLE */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              Task Details
            </h3>

            <Input
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          {/* DATE */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              Due Date & Time
            </h3>

            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          {/* PRIORITY */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Priority Level
            </h3>

            <div className="flex gap-2">
              {["LOW", "MEDIUM", "HIGH"].map((p) => {
                const isActive = priority === p;

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p as any)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                      isActive
                        ? "bg-primary text-white border-primary"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTION */}
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-11 rounded-xl"
          >
            {isPending
              ? mode === "update"
                ? "Updating..."
                : "Creating..."
              : mode === "update"
              ? "Update Task"
              : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
