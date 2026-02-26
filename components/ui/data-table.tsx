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
  serverMode?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalItems?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  onSortChange?: (sortBy: string, sortDirection: "asc" | "desc") => void;
};

export function DataTable<T>({
  title,
  columns,
  data,
  rowKey,
  filterQuery = "",
  filterFn,
  emptyMessage = "No data found.",
  serverMode = false,
  page,
  rowsPerPage,
  totalItems,
  sortBy,
  sortDirection,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
}: DataTableProps<T>) {
  const [internalSortBy, setInternalSortBy] = useState<string>("");
  const [internalDirection, setInternalDirection] = useState<"asc" | "desc">("asc");
  const [internalPage, setInternalPage] = useState(1);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(5);

  const activeSortBy = serverMode ? sortBy ?? "" : internalSortBy;
  const activeDirection = serverMode ? sortDirection ?? "asc" : internalDirection;
  const activePage = serverMode ? page ?? 1 : internalPage;
  const activeRowsPerPage = serverMode ? rowsPerPage ?? 10 : internalRowsPerPage;

  const filtered = useMemo(() => {
    if (serverMode) return data;
    if (!filterQuery || !filterFn) return data;
    return data.filter((row) => filterFn(row, filterQuery));
  }, [data, filterFn, filterQuery, serverMode]);

  const sorted = useMemo(() => {
    if (serverMode) return filtered;
    const selected = columns.find((column) => column.id === activeSortBy);
    if (!selected?.sortValue) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = selected.sortValue?.(a);
      const bValue = selected.sortValue?.(b);
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue === bValue) return 0;
      if (activeDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [activeDirection, activeSortBy, columns, filtered, serverMode]);

  const totalCount = serverMode ? totalItems ?? data.length : sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / activeRowsPerPage));
  const currentPage = Math.min(activePage, totalPages);
  const paginated = serverMode
    ? sorted
    : sorted.slice((currentPage - 1) * activeRowsPerPage, currentPage * activeRowsPerPage);

  const setPage = (nextPage: number) => {
    if (serverMode) {
      onPageChange?.(nextPage);
    } else {
      setInternalPage(nextPage);
    }
  };

  const setRows = (rows: number) => {
    if (serverMode) {
      onRowsPerPageChange?.(rows);
      onPageChange?.(1);
    } else {
      setInternalRowsPerPage(rows);
      setInternalPage(1);
    }
  };

  const toggleSort = (column: TableColumn<T>) => {
    if (!column.sortValue) return;

    if (serverMode) {
      const nextDirection = activeSortBy === column.id && activeDirection === "asc" ? "desc" : "asc";
      onSortChange?.(column.id, nextDirection);
      return;
    }

    setInternalPage(1);
    if (internalSortBy !== column.id) {
      setInternalSortBy(column.id);
      setInternalDirection("asc");
      return;
    }
    setInternalDirection((current) => (current === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Rows</span>
          <select
            className="rounded-lg border border-slate-300 bg-white px-2 py-1"
            value={activeRowsPerPage}
            onChange={(event) => setRows(Number(event.target.value))}
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
                    {activeSortBy === column.id ? <span>{activeDirection === "asc" ? "^" : "v"}</span> : null}
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
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
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
