"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListFilters } from "@/components/filters/list-filters";
import { useBackendList } from "@/components/filters/use-backend-list";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { DataTable, TableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/toast-provider";

type DashboardStat = {
  id: string;
  label: string;
  value: string;
  trend: string;
};

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
    totalItems: number;
  };
};

export default function DashboardHomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const listQuery = useBackendList({
    initialFilters: { search: "", role: "", status: "" },
    initialLimit: 5,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((response) => setStats(response.data))
      .catch(() => setStats([]))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    fetch(`/api/dashboard/users?${listQuery.queryString}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((response: UsersResponse) => {
        setUsers(response.data ?? []);
        setTotalItems(response.meta?.totalItems ?? 0);
      })
      .catch(() => {
        setUsers([]);
        setTotalItems(0);
      })
      .finally(() => setUsersLoading(false));
  }, [listQuery.queryString]);

  const selectedUser = users.find((user) => user.id === deleteId) ?? null;

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setUsers((current) => current.filter((user) => user.id !== deleteId));
    setTotalItems((current) => Math.max(0, current - 1));
    setDeleteId(null);
    setDeleting(false);
    showToast("User removed from the current list.", "success");
  };

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
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            row.status === "Active"
              ? "bg-emerald-100 text-emerald-700"
              : row.status === "Pending"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-200 text-slate-600"
          }`}
        >
          {row.status}
        </span>
      ),
      sortValue: () => 0,
    },
    { id: "lastLogin", header: "Last Login", cell: (row) => row.lastLogin, sortValue: () => 0 },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => showToast(`Viewing ${row.name}`, "info")}
          >
            View
          </button>
          <button
            type="button"
            className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            onClick={() => setDeleteId(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Home</h2>
        <p className="mt-2 text-sm text-slate-600">Backend-friendly list filtering for better API integration.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <Loader tone="accent" label="Loading dashboard data..." />
          </div>
        ) : null}

        {!statsLoading &&
          stats.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-600">{item.trend}</p>
            </article>
          ))}
      </div>

      <ListFilters
        title="User Filters"
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

      {usersLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Loader tone="accent" label="Loading users..." />
        </div>
      ) : (
        <DataTable
          title="Team Members"
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

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete user?"
        message={
          selectedUser
            ? `You are removing ${selectedUser.name}. This action cannot be undone.`
            : "This action cannot be undone."
        }
        destructive
        confirmText="Delete"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
