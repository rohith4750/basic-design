"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CompanyLogo } from "@/components/brand/company-logo";
import { getRouteByPath, isRouteActive, menuData, permissionAccess } from "@/constants/menu";

type UserProfile = {
  name: string;
  role: string;
  email: string;
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data?.data ?? null))
      .catch(() => setProfile(null));
  }, []);

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const currentRoute = getRouteByPath(pathname);
  const sidebarItems = menuData.filter(
    (item) => item.showInSideMenu && permissionAccess(item.permissions, profile?.role),
  );

  return (
    <div className="min-h-screen">
      <div
        className={`fixed inset-0 z-30 bg-slate-900/30 transition-opacity md:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[85vw] max-w-72 flex-col border-r border-slate-200 bg-surface px-5 py-5 shadow-xl transition-transform md:w-64 md:max-w-none md:px-4 md:py-5 md:translate-x-0 md:shadow-none lg:w-72 lg:px-6 lg:py-6 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <section className="border-b border-slate-200 pb-5">
          <CompanyLogo className="justify-center" />
        </section>

        <section className="mt-5 flex-1 overflow-y-auto">
          <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Menu</p>
          <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const active = isRouteActive(pathname, item.route);
            return (
              <Link
                key={item.route}
                href={item.route}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-accent text-white"
                    : "bg-surface-soft text-slate-700 hover:bg-accent-soft hover:text-slate-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          </nav>
        </section>

        <section className="border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-danger transition hover:bg-rose-100"
          >
            Logout
          </button>
        </section>
      </aside>

      <div className="md:pl-64 lg:pl-72">
        <header className="fixed left-0 right-0 top-0 z-20 border-b border-slate-200/80 bg-white/85 px-3 py-3 backdrop-blur md:left-64 md:px-5 lg:left-72 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                Menu
              </button>
              <p className="text-sm font-semibold text-slate-500">{currentRoute?.name ?? "Dashboard"}</p>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-surface-soft px-3 py-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-600 text-xs font-bold text-white">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{profile?.name ?? "Loading..."}</p>
                <p className="text-xs text-slate-500">{profile?.role ?? "Member"}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-3 pb-20 pt-20 md:px-5 lg:px-8">{children}</main>

        <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur md:left-64 md:px-5 lg:left-72 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between text-[11px] font-medium text-slate-500 sm:text-xs">
            <CompanyLogo compact />
            <p className="hidden sm:block">Frame Flow Solutions Pvt Ltd</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
