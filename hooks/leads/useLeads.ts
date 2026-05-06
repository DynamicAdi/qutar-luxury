import useSWR from "swr";
import { Response } from "@/store/cms";
import { fetcher } from "@/lib/fetcher";

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