import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function useLead(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/leads/${id}` : null,
    fetcher
  );

  return {
    lead: data?.data,
    isLoading,
    isError: error,
  };
}