"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListFilters } from "@/components/filters/list-filters";
import { useBackendList } from "@/components/filters/use-backend-list";
import { DataTable, TableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
};

type UsersResponse = {
  data: UserRow[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    sortBy: string;
    sortDirection: "asc" | "desc";
  };
};

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const listQuery = useBackendList({
    initialFilters: { search: "", role: "", status: "" },
    initialLimit: 10,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  useEffect(() => {
    fetch(`/api/dashboard/users?${listQuery.queryString}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((payload: UsersResponse) => {
        setUsers(payload.data ?? []);
        setTotalItems(payload.meta?.totalItems ?? 0);
      })
      .catch(() => {
        setUsers([]);
        setTotalItems(0);
      })
      .finally(() => setLoading(false));
  }, [listQuery.queryString]);

  const columns: TableColumn<UserRow>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
      sortValue: () => 0,
    },
    { id: "role", header: "Role", cell: (row) => row.role, sortValue: () => 0 },
    { id: "status", header: "Status", cell: (row) => row.status, sortValue: () => 0 },
    { id: "lastLogin", header: "Last Login", cell: (row) => row.lastLogin, sortValue: () => 0 },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Users</h2>
        <p className="mt-2 text-sm text-slate-600">Backend-driven reusable filters, sorting, and pagination.</p>
      </div>

      <ListFilters
        title="Filter Users"
        fields={[
          {
            key: "search",
            label: "Search users",
            type: "search",
            placeholder: "Search by name, email, role",
          },
          {
            key: "role",
            label: "Role",
            type: "select",
            options: [
              { label: "All Roles", value: "" },
              { label: "Frontend Engineer", value: "Frontend Engineer" },
              { label: "Backend Engineer", value: "Backend Engineer" },
              { label: "UI Designer", value: "UI Designer" },
              { label: "QA Engineer", value: "QA Engineer" },
              { label: "Product Manager", value: "Product Manager" },
              { label: "DevOps Engineer", value: "DevOps Engineer" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "Active" },
              { label: "Pending", value: "Pending" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
        ]}
        values={listQuery.filters}
        onChange={listQuery.setFilterValue}
        onReset={listQuery.resetFilters}
        hasActiveFilters={listQuery.hasActiveFilters}
        actions={
          <Button type="button" onClick={() => router.push("/dashboard/users/add")} className="py-2">
            Add User
          </Button>
        }
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Loader tone="accent" label="Loading users..." />
        </div>
      ) : (
        <DataTable
          title="All Users"
          columns={columns}
          data={users}
          rowKey={(row) => row.id}
          emptyMessage="No users match the filters."
          serverMode
          page={listQuery.page}
          rowsPerPage={listQuery.limit}
          totalItems={totalItems}
          sortBy={listQuery.sortBy}
          sortDirection={listQuery.sortDirection}
          onPageChange={listQuery.setPage}
          onRowsPerPageChange={listQuery.setLimit}
          onSortChange={listQuery.onSortChange}
        />
      )}
    </section>
  );
}
