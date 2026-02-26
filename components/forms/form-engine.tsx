"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { TextareaField } from "@/components/ui/textarea-field";

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string>;

type SelectOption = {
  label: string;
  value: string;
};

export type FormFieldConfig = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "select" | "textarea";
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: SelectOption[];
  autoComplete?: string;
  rows?: number;
};

type FormEngineProps = {
  fields: FormFieldConfig[];
  initialValues: FormValues;
  submitLabel: string;
  loadingLabel?: string;
  className?: string;
  validate?: (values: FormValues) => FormErrors;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onValuesChange?: (values: FormValues) => void;
};

export function FormEngine({
  fields,
  initialValues,
  submitLabel,
  loadingLabel,
  className = "",
  validate,
  onSubmit,
  onValuesChange,
}: FormEngineProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requiredFields = useMemo(() => fields.filter((field) => field.required).map((field) => field.name), [fields]);

  const runValidation = (nextValues: FormValues) => {
    const nextErrors: FormErrors = {};

    for (const name of requiredFields) {
      if (!nextValues[name]?.trim()) {
        nextErrors[name] = "This field is required.";
      }
    }

    const customErrors = validate?.(nextValues) ?? {};
    return { ...nextErrors, ...customErrors };
  };

  const handleChange = (name: string, value: string) => {
    setValues((current) => {
      const nextValues = { ...current, [name]: value };
      onValuesChange?.(nextValues);
      return nextValues;
    });

    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });

    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = runValidation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      await onSubmit(values);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Form submission failed.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="space-y-5">
        {fields.map((field) => {
          const value = values[field.name] ?? "";
          const error = errors[field.name];

          if (field.type === "select") {
            return (
              <SelectField
                key={field.name}
                id={field.name}
                label={field.label}
                value={value}
                options={field.options ?? []}
                required={field.required}
                helperText={field.helperText}
                error={error}
                onChange={(event) => handleChange(field.name, event.target.value)}
              />
            );
          }

          if (field.type === "textarea") {
            return (
              <TextareaField
                key={field.name}
                id={field.name}
                label={field.label}
                value={value}
                required={field.required}
                helperText={field.helperText}
                error={error}
                rows={field.rows ?? 4}
                placeholder={field.placeholder}
                onChange={(event) => handleChange(field.name, event.target.value)}
              />
            );
          }

          return (
            <InputField
              key={field.name}
              id={field.name}
              label={field.label}
              value={value}
              required={field.required}
              helperText={field.helperText}
              error={error}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              onChange={(event) => handleChange(field.name, event.target.value)}
            />
          );
        })}
      </div>

      {formError ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-danger">{formError}</p> : null}

      <Button type="submit" loading={submitting} loadingText={loadingLabel} className="mt-5 w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
