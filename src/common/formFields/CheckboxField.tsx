"use client";

import { Checkbox } from "@heroui/react";
import { FieldValues, Control, Path } from "react-hook-form";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { isFieldRequired, RequiredAsterisk } from "@/lib/formRequired";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  className?: string;
}

const CheckboxField = <T extends FieldValues>({
  control,
  name,
  label,
  color = "default",
  className,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex h-11 items-center gap-3 self-end rounded-2xl border border-black/15 bg-white px-4 text-sm">
          <FormControl>
            <Checkbox
              isSelected={field.value}
              onValueChange={field.onChange}
              isInvalid={!!fieldState?.error?.message}
              color={color}
              className={className}
            >
              {label}
              <RequiredAsterisk show={isFieldRequired(control, name)} />
            </Checkbox>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
