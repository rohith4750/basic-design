"use client";

import { ButtonHTMLAttributes } from "react";
import { Loader } from "@/components/ui/loader";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:brightness-110",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export function Button({
  children,
  loading = false,
  loadingText,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${variantClassMap[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader size="sm" tone={variant === "secondary" ? "dark" : "light"} />
          <span>{loadingText ?? "Please wait..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
