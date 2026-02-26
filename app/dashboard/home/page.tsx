"use client";

import { useEffect, useState } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { DataTable, TableColumn } from "@/components/ui/data-table";
import { InputField } from "@/components/ui/input-field";
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

export default function DashboardHomePage() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((res) => (res.ok ? res.json() : Promise.reject())),
      fetch("/api/dashboard/users").then((res) => (res.ok ? res.json() : Promise.reject())),
    ])
      .then(([statsResponse, usersResponse]) => {
        setStats(statsResponse.data);
        setUsers(usersResponse.data);
      })
      .catch(() => {
        setStats([]);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedUser = users.find((user) => user.id === deleteId) ?? null;

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setUsers((current) => current.filter((user) => user.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
    showToast("User removed successfully.", "success");
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
      sortValue: (row) => row.name.toLowerCase(),
    },
    { id: "role", header: "Role", cell: (row) => row.role, sortValue: (row) => row.role.toLowerCase() },
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
      sortValue: (row) => row.status.toLowerCase(),
    },
    { id: "lastLogin", header: "Last Login", cell: (row) => row.lastLogin, sortValue: (row) => row.lastLogin },
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
        <p className="mt-2 text-sm text-slate-600">
          Complete setup with table components, toasts, confirmation modal, and input fields.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading &&
          [1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-white/70" />
          ))}

        {!loading &&
          stats.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-600">{item.trend}</p>
            </article>
          ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <InputField
            label="Search users"
            placeholder="Search by name, email, role or status"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="button"
            className="h-[46px] w-full rounded-xl bg-accent px-4 text-sm font-semibold text-white transition hover:brightness-110 md:w-auto"
            onClick={() => showToast("Add user action clicked.", "success")}
          >
            Add User
          </button>
        </div>
      </div>

      <DataTable
        title="Team Members"
        columns={columns}
        data={users}
        rowKey={(row) => row.id}
        filterQuery={query}
        filterFn={(row, search) => {
          const q = search.toLowerCase();
          return [row.name, row.email, row.role, row.status].some((item) => item.toLowerCase().includes(q));
        }}
        emptyMessage="No users match the filter."
      />

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
