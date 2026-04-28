"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import axios from "axios";

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type UsePaginatedFetchOptions<T> = {
  url: string;
  limit?: number;
  initialPage?: number;
  initialSearch?: string;
  initialFilters?: Record<string, any>;
  enabled?: boolean;
  debounce?: number;
  transform?: (data: any) => T[];
};

export function usePaginatedFetch<T = any>({
  url,
  limit = 10,
  initialPage = 1,
  initialSearch = "",
  initialFilters = {},
  enabled = true,
  debounce = 500,
  transform,
}: UsePaginatedFetchOptions<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);

  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  const [pending, startTransition] = useTransition();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(
    (pageArg = page, searchArg = search, filtersArg = filters) => {
      startTransition(async () => {
        try {
          const params = new URLSearchParams();

          params.append("page", String(pageArg));

          params.append("limit", String(limit));

          if (searchArg) {
            params.append("search", searchArg);
          }

          Object.entries(filtersArg).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });

          const req = await axios.get(`${url}?${params.toString()}`);

          if (req.status === 200) {
            setRows(transform ? transform(req.data.data) : req.data.data);

            setPagination(req.data.pagination);
          }
        } catch (error) {
          console.error(error);
        }
      });
    },
    [url, page, search, filters, limit, transform]
  );

  /* initial load */
  useEffect(() => {
    if (!enabled) return;
    fetchData(initialPage, initialSearch, initialFilters);
  }, [enabled]);

  /* search debounce */
  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setPage(1);

      fetchData(1, search, filters);
    }, debounce);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search]);

  /* filters change */
  useEffect(() => {
    if (!enabled) return;

    setPage(1);

    fetchData(1, search, filters);
  }, [filters]);

  const nextPage = () => {
    if (pagination?.hasNextPage) {
      const next = page + 1;

      setPage(next);
      fetchData(next);
    }
  };

  const prevPage = () => {
    if (pagination?.hasPrevPage) {
      const prev = page - 1;

      setPage(prev);
      fetchData(prev);
    }
  };

  const goToPage = (num: number) => {
    if (!pagination) return;

    if (num < 1 || num > pagination.totalPages) return;

    setPage(num);
    fetchData(num);
  };

  const pageNumbers = useMemo(() => {
    if (!pagination) return [];

    const total = pagination.totalPages;
    const current = pagination.page;

    if (total <= 5) {
      return Array.from(
        {
          length: total,
        },
        (_, i) => i + 1
      );
    }

    if (current <= 3) {
      return [1, 2, 3, 4, total];
    }

    if (current >= total - 2) {
      return [1, total - 3, total - 2, total - 1, total];
    }

    return [1, current - 1, current, current + 1, total];
  }, [pagination]);

  return {
    rows,
    pagination,
    loading: pending,

    page,
    search,
    filters,

    setRows,
    setPage,
    setSearch,
    setFilters,

    refresh: fetchData,
    nextPage,
    prevPage,
    goToPage,

    pageNumbers,
  };
}
