"use client";

import type { Control, FieldValues } from "react-hook-form";
import type { SchemaObjectDescription } from "yup";

import { getFormSchema } from "@/lib/yupResolver";

function getFieldDescription(description: unknown, path: string) {
  const parts = String(path)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current: any = description;
  for (const part of parts) {
    if (!current) return null;
    if (current.fields?.[part]) {
      current = current.fields[part];
      continue;
    }
    if (current.innerType && /^\d+$/.test(part)) {
      current = current.innerType;
      continue;
    }
    return null;
  }
  return current;
}

export function isFieldRequired<T extends FieldValues>(
  control: Control<T> | undefined,
  name?: string | null,
): boolean {
  if (!control || !name) return false;

  const schema = getFormSchema(control);
  if (!schema || typeof schema.describe !== "function") return false;

  try {
    const values = (control as { _formValues?: unknown })._formValues;
    let description: SchemaObjectDescription;
    try {
      description = schema.describe(
        values != null ? { value: values } : undefined,
      ) as SchemaObjectDescription;
    } catch {
      description = schema.describe() as SchemaObjectDescription;
    }
    const field = getFieldDescription(description, name);
    if (!field) return false;

    if (field.optional === false) return true;

    const tests: Array<{ name?: string }> = field.tests || [];
    return tests.some(
      (test) => test.name === "required" || test.name === "is-required",
    );
  } catch {
    return false;
  }
}

export function RequiredAsterisk({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span className="ms-0.5 font-sans text-danger" aria-hidden="true">
      *
    </span>
  );
}

export function withRequiredMark(label?: string, required?: boolean) {
  if (!label) return label;
  return (
    <>
      {label}
      <RequiredAsterisk show={required} />
    </>
  );
}
