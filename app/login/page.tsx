"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { menuData } from "@/constants/menu";
import { InputField } from "@/components/ui/input-field";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@starter.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Login failed");
        return;
      }

      router.replace(menuData[0].route);
    } catch {
      setError("Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-surface p-8 shadow-xl shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Next.js Starter</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Use demo credentials to access the dashboard.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Demo:</p>
          <p>Email: admin@starter.com</p>
          <p>Password: Admin@123</p>
        </div>
      </div>
    </div>
  );
}
