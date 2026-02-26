"use client";

import { useRouter } from "next/navigation";
import { FormEngine, FormFieldConfig, FormValues } from "@/components/forms/form-engine";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

const addUserFields: FormFieldConfig[] = [
  { name: "name", label: "Full Name", required: true, placeholder: "Enter full name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email" },
  { name: "role", label: "Role", required: true, placeholder: "Frontend Engineer" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Active", value: "Active" },
      { label: "Pending", value: "Pending" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
];

export default function AddUserPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const validate = (values: FormValues) => {
    const errors: Record<string, string> = {};
    if (values.email && !values.email.includes("@")) {
      errors.email = "Enter a valid email address.";
    }
    return errors;
  };

  const handleCreateUser = async (values: FormValues) => {
    const response = await fetch("/api/dashboard/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? "Failed to create user.");
    }

    showToast("User created successfully.", "success");
    router.push("/dashboard/home");
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Add User</h2>
        <p className="mt-2 text-sm text-slate-600">Create a new user using the reusable form engine.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <FormEngine
          fields={addUserFields}
          initialValues={{ name: "", email: "", role: "", status: "Active" }}
          validate={validate}
          onSubmit={handleCreateUser}
          submitLabel="Create User"
          loadingLabel="Creating..."
        />

        <div className="mt-4">
          <Button variant="secondary" type="button" onClick={() => router.push("/dashboard/home")}>
            Cancel
          </Button>
        </div>
      </div>
    </section>
  );
}
