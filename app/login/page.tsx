"use client";

import { useRouter } from "next/navigation";
import { FormEngine, FormFieldConfig, FormValues } from "@/components/forms/form-engine";
import { menuData } from "@/constants/menu";

export default function LoginPage() {
  const router = useRouter();
  const loginFields: FormFieldConfig[] = [
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "password", label: "Password", type: "password", required: true, autoComplete: "current-password" },
  ];

  const validateLogin = (values: FormValues) => {
    const errors: Record<string, string> = {};
    if (values.email && !values.email.includes("@")) {
      errors.email = "Enter a valid email address.";
    }
    if (values.password && values.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    return errors;
  };

  const submitLogin = async (values: FormValues) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email, password: values.password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? "Login failed");
    }

    router.replace(menuData[0].route);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-surface p-8 shadow-xl shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Next.js Starter</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Use demo credentials to access the dashboard.</p>

        <FormEngine
          className="mt-8"
          fields={loginFields}
          initialValues={{ email: "admin@starter.com", password: "Admin@123" }}
          validate={validateLogin}
          onSubmit={submitLogin}
          submitLabel="Sign in"
          loadingLabel="Signing in..."
        />

        <div className="mt-6 rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Demo:</p>
          <p>Email: admin@starter.com</p>
          <p>Password: Admin@123</p>
        </div>
      </div>
    </div>
  );
}
