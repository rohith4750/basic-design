"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { FilterValues } from "@/components/filters/use-list-filters";

type FilterField = {
  key: string;
  label: string;
  type: "search" | "select";
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
};

type ListFiltersProps = {
  title?: string;
  fields: FilterField[];
  values: FilterValues;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  actions?: React.ReactNode;
};

export function ListFilters({
  title = "Filters",
  fields,
  values,
  onChange,
  onReset,
  hasActiveFilters,
  actions,
}: ListFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onReset} disabled={!hasActiveFilters} className="py-2">
            Reset
          </Button>
          {actions}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {fields.map((field) => {
          const value = values[field.key] ?? "";

          if (field.type === "select") {
            return (
              <SelectField
                key={field.key}
                id={field.key}
                label={field.label}
                value={value}
                options={field.options ?? []}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            );
          }

          return (
            <InputField
              key={field.key}
              id={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={value}
              onChange={(event) => onChange(field.key, event.target.value)}
            />
          );
        })}
      </div>
    </section>
  );
}
