"use client";

import { CheckCircle2, Clock3, Search, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { fetcher } from "@/lib/fetcher";

import { AddAdminDialog } from "@/components/client/admins/AddAdminDialog";
import { AdminCard } from "@/components/client/admins/AdminCard";

import { Admin } from "@/store/cms";

export default function AdminUsersPage() {
  const { data, mutate, isLoading } = useSWR("/api/adminusers", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const { data: statsData, isLoading: statsLoading, mutate:refreshStats } = useSWR(
    "/api/adminusers/stats",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const admins: Admin[] = data?.data || [];

  const stats = statsData?.data || {
    totalAdmins: 0,
    activeAdmins: 0,
    recentlyAdded: 0,
  };

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return admins.filter((a) =>
      `${a.name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [admins, search]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Admin Users
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage platform admins, permissions and activity.
          </p>
        </div>

        <AddAdminDialog mutate={mutate} refreshStats={refreshStats}/>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* TOTAL ADMINS */}
        <Card className="rounded-3xl border-0 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Admins</p>

              <h2 className="mt-2 text-3xl font-semibold">
                {statsLoading ? "..." : stats.totalAdmins}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        {/* ACTIVE ADMINS */}
        <Card className="rounded-3xl border-0 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Admins</p>

              <h2 className="mt-2 text-3xl font-semibold">
                {statsLoading ? "..." : stats.activeAdmins}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
              <CheckCircle2 className="h-6 w-6 text-emerald-700" />
            </div>
          </div>
        </Card>

        {/* RECENTLY ADDED */}
        <Card className="rounded-3xl border-0 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recently Added</p>

              <h2 className="mt-2 text-3xl font-semibold">
                {statsLoading ? "..." : stats.recentlyAdded}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
              <Clock3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admins..."
          className="h-12 rounded-2xl pl-11"
        />
      </div>

      {/* LIST */}
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[230px] animate-pulse rounded-3xl bg-muted"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-3xl border-dashed py-20 text-center text-muted-foreground">
          No admins found.
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((admin) => (
            <AdminCard refreshStats={refreshStats} key={admin.id} admin={admin} mutate={mutate} />
          ))}
        </div>
      )}
    </div>
  );
}
