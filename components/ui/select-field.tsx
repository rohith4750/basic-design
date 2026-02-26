"use client";

import { SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
};

export function SelectField({ label, id, options, error, helperText, className = "", ...props }: SelectFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={inputId}>
        {label}
      </label>
      <select
        id={inputId}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${
          error ? "border-rose-300 ring-rose-100" : "border-slate-300 ring-teal-200"
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-xs font-medium text-danger">{error}</p> : null}
      {!error && helperText ? <p className="mt-2 text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
}
