// components/Pagination.tsx
"use client";

import React from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPrev,
  onNext,
  onPageChange,
  className = "",
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const disableAll = totalPages <= 1;

  const getPageNumbers = () => {
    const pages: number[] = [];

    let start = Math.max(1, page - 2);
    let end = Math.min(safeTotalPages, page + 2);

    if (page <= 3) end = Math.min(5, safeTotalPages);
    if (page >= safeTotalPages - 2) {
      start = Math.max(1, safeTotalPages - 4);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`mt-4 flex flex-col gap-3 border-t bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{safeTotalPages}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onPrev}
          disabled={disableAll || !hasPrevPage}
          className="h-9 rounded-md border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            disabled={disableAll}
            className={`h-9 min-w-[36px] rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
              page === num
                ? "border-primary bg-primary text-white"
                : "bg-white hover:bg-muted"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={onNext}
          disabled={disableAll || !hasNextPage}
          className="h-9 rounded-md border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}