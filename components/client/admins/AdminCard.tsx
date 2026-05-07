"use client";

import { Admin } from "@/store/cms";
import axios from "axios";
import { useTransition } from "react";

import {
  Shield,
  Trash2,
  Mail,
  Calendar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import { EditAdminDialog } from "./EditAdminDialog";

export function AdminCard({
  admin,
  mutate,
  refreshStats
}: {
  admin: Admin;
  mutate: any;
  refreshStats: any
}) {
  const [isPending, startTransition] = useTransition();

  const deleteAdmin = async () => {
    const ask = confirm(
      `Are you sure you want to delete ${admin.name}?`
    );

    if (!ask) return;

    startTransition(async () => {
      try {
        await axios.delete(`/api/adminusers/${admin.id}`);

        toast.success("Admin deleted successfully");

        mutate();
        refreshStats();
      } catch (error) {
        toast.error("Failed to delete admin");
      }
    });
  };

  return (
    <Card className="group py-1 relative overflow-hidden rounded-[32px] border border-border/50 bg-white/90 backdrop-blur-xl shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* TOP STRIP */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary/90 to-primary" />

      <div className="relative p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* AVATAR */}
            <div className="relative">
              {admin.image ? (
                <img
                  src={admin.image}
                  alt={admin.name}
                  className="h-16 w-16 rounded-2xl object-cover ring-4 ring-primary/10"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-violet-500/15 ring-4 ring-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
              )}

              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {admin.name}
                </h3>

                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />

                <span className="truncate max-w-[180px]">
                  {admin.email}
                </span>
              </div>
            </div>
          </div>

          {/* ROLE */}
          <Badge className="rounded-full border-0 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/10">
            ADMIN
          </Badge>
        </div>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border bg-muted/30 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Joined
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />

              {new Date(admin.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/30 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Status
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              Active
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-7 flex items-center justify-between border-t pt-5">
          <div className="text-xs text-muted-foreground">
            Updated{" "}
            {new Date(
              admin.updatedAt || admin.createdAt
            ).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <EditAdminDialog
              mutate={mutate}
              admin={admin}
            />

            <Button
              variant="destructive"
              size="icon"
              disabled={isPending}
              onClick={deleteAdmin}
              className="h-10 w-10 rounded-2xl shadow-sm transition hover:scale-105"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}