"use client";

import type { ChangeEventHandler } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  value,
  onChange,
  required,
  placeholder,
  step,
  min,
  max,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0 max-w-full">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        className={
          type === "date" || type === "time" || type === "datetime-local"
            ? "mt-2 block min-w-0 max-w-full"
            : "mt-2 min-w-0 max-w-full"
        }
        dir={type === "date" || type === "time" || type === "datetime-local" ? "ltr" : undefined}
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  value,
  onChange,
  required,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="min-w-0 max-w-full">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="mt-2"
      />
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-gold"
      />
      {label}
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 flex h-12 w-full border border-border bg-background px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-background p-6">
      <h3 className="mb-4 text-lg">{title}</h3>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}
