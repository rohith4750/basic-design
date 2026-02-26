"use client";

import { useMemo, useState } from "react";

export type BackendSortDirection = "asc" | "desc";

type UseBackendListParams = {
  initialFilters: Record<string, string>;
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialSortDirection?: BackendSortDirection;
};

export function useBackendList({
  initialFilters,
  initialPage = 1,
  initialLimit = 10,
  initialSortBy = "name",
  initialSortDirection = "asc",
}: UseBackendListParams) {
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState<BackendSortDirection>(initialSortDirection);

  const setFilterValue = (key: string, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
    setSortBy(initialSortBy);
    setSortDirection(initialSortDirection);
  };

  const onSortChange = (nextSortBy: string, nextSortDirection: BackendSortDirection) => {
    setSortBy(nextSortBy);
    setSortDirection(nextSortDirection);
    setPage(1);
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sortBy", sortBy);
    params.set("sortDirection", sortDirection);

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) params.set(key, value.trim());
    });

    return params.toString();
  }, [filters, limit, page, sortBy, sortDirection]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => value.trim().length > 0),
    [filters],
  );

  return {
    filters,
    page,
    limit,
    sortBy,
    sortDirection,
    queryString,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilterValue,
    resetFilters,
    onSortChange,
  };
}
