"use client";

import { useMemo, useState } from "react";

export type TableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
};

type DataTableProps<T> = {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  filterQuery?: string;
  filterFn?: (row: T, query: string) => boolean;
  emptyMessage?: string;
};

export function DataTable<T>({
  title,
  columns,
  data,
  rowKey,
  filterQuery = "",
  filterFn,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState<string>("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = useMemo(() => {
    if (!filterQuery || !filterFn) return data;
    return data.filter((row) => filterFn(row, filterQuery));
  }, [data, filterFn, filterQuery]);

  const sorted = useMemo(() => {
    const selected = columns.find((column) => column.id === sortBy);
    if (!selected?.sortValue) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = selected.sortValue?.(a);
      const bValue = selected.sortValue?.(b);
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue === bValue) return 0;
      if (direction === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [columns, direction, filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleSort = (column: TableColumn<T>) => {
    if (!column.sortValue) return;
    setPage(1);
    if (sortBy !== column.id) {
      setSortBy(column.id);
      setDirection("asc");
      return;
    }
    setDirection((current) => (current === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Rows</span>
          <select
            className="rounded-lg border border-slate-300 bg-white px-2 py-1"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 ${column.className ?? ""}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(column)}
                    className={`inline-flex items-center gap-1 ${column.sortValue ? "cursor-pointer hover:text-slate-800" : "cursor-default"}`}
                  >
                    <span>{column.header}</span>
                    {sortBy === column.id ? <span>{direction === "asc" ? "^" : "v"}</span> : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length > 0 ? (
              paginated.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-slate-50/70">
                  {columns.map((column) => (
                    <td key={column.id} className={`px-4 py-3 text-sm text-slate-700 ${column.className ?? ""}`}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm font-medium text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs text-slate-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage <= 1}
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
