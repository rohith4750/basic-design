"use client";

import { useMemo, useState } from "react";

export type FilterValues = Record<string, string>;

export type ListFilterConfig<T> = {
  key: string;
  predicate: (item: T, value: string, allValues: FilterValues) => boolean;
};

type UseListFiltersParams<T> = {
  items: T[];
  filters: ListFilterConfig<T>[];
  initialValues: FilterValues;
};

export function useListFilters<T>({ items, filters, initialValues }: UseListFiltersParams<T>) {
  const [values, setValues] = useState<FilterValues>(initialValues);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      filters.every((filter) => {
        const value = (values[filter.key] ?? "").trim();
        if (!value) return true;
        return filter.predicate(item, value, values);
      }),
    );
  }, [filters, items, values]);

  const setFilterValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => setValues(initialValues);

  const hasActiveFilters = useMemo(
    () => Object.values(values).some((value) => value.trim().length > 0),
    [values],
  );

  return {
    values,
    filteredItems,
    setFilterValue,
    resetFilters,
    hasActiveFilters,
  };
}
