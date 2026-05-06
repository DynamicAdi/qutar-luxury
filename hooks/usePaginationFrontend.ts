import { useEffect, useMemo, useState } from "react";

interface UsePaginationProps<T> {
  data: T[];
  pageSize?: number;
}

export function usePaginationFrontend<T>({
  data,
  pageSize = 5,
}: UsePaginationProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // reset page if data changes (important for SWR refetch)
  useEffect(() => {
    setPage(1);
  }, [data.length]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const goTo = (p: number) =>
    setPage(Math.max(1, Math.min(p, totalPages)));

  return {
    page,
    totalPages,
    paginatedData,
    next,
    prev,
    goTo,
    setPage,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}