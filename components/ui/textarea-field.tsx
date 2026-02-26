"use client";

import { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

export function TextareaField({ label, id, error, helperText, className = "", ...props }: TextareaFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${
          error ? "border-rose-300 ring-rose-100" : "border-slate-300 ring-teal-200"
        } ${className}`}
        {...props}
      />
      {error ? <p className="mt-2 text-xs font-medium text-danger">{error}</p> : null}
      {!error && helperText ? <p className="mt-2 text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
}
