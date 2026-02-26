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
    <div className="h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50">
      <div className="grid h-full w-full lg:grid-cols-2">
        <section className="flex h-full items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-7">
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
          </div>
        </section>

        <section className="hidden h-full items-center justify-center border-l border-slate-200 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-6 lg:flex">
          <CompanyLogo fill className="h-full w-full justify-center" />
        </section>
      </div>
    </div>
  );
}
