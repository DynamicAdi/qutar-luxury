"use client";

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function useLeadTasks(id: string) {
  const { data, isLoading, mutate } = useSWR(
    id ? `/api/leads/${id}/tasks` : null,
    fetcher
  );

  return {
    tasks: data?.data ?? [],
    isLoading,
    mutate,
  };
}
