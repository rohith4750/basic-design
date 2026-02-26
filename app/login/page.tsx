"use client";

import { useRouter } from "next/navigation";
import { CompanyLogo } from "@/components/brand/company-logo";
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
    <div className="flex min-h-screen items-center justify-center px-4 py-6 md:py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-2">
        <section className="bg-surface p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">Access your dashboard securely.</p>

          <FormEngine
            className="mt-6"
            fields={loginFields}
            initialValues={{ email: "admin@starter.com", password: "Admin@123" }}
            validate={validateLogin}
            onSubmit={submitLogin}
            submitLabel="Sign in"
            loadingLabel="Signing in..."
          />

          <div className="mt-5 rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Demo:</p>
            <p>Email: admin@starter.com</p>
            <p>Password: Admin@123</p>
          </div>
        </section>

        <section className="relative flex min-h-[280px] items-center justify-center border-t border-slate-200 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-3 md:min-h-[360px] md:p-4 lg:min-h-full lg:border-l lg:border-t-0 lg:p-6">
          <CompanyLogo fill className="h-full w-full justify-center" />
        </section>
      </div>
    </div>
  );
}
