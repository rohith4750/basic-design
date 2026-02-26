"use client";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark" | "accent";
  label?: string;
  className?: string;
};

const sizeClassMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-[3px]",
};

const toneClassMap: Record<NonNullable<LoaderProps["tone"]>, string> = {
  light: "border-white/40 border-t-white",
  dark: "border-slate-300 border-t-slate-700",
  accent: "border-teal-200 border-t-teal-600",
};

export function Loader({ size = "md", tone = "dark", label, className = "" }: LoaderProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <span className={`inline-block animate-spin rounded-full ${sizeClassMap[size]} ${toneClassMap[tone]}`} />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </span>
  );
}
