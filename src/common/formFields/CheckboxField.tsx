"use client";

import { Checkbox } from "@heroui/react";
import { FieldValues, Control, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { isFieldRequired } from "@/lib/formRequired";
import { cn } from "@/lib/utils";

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
  description?: string;
}

const CheckboxField = <T extends FieldValues>({
  control,
  name,
  label,
  color = "default",
  className,
  description,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex-1">
          <FormLabel required={isFieldRequired(control, name)}>{label}</FormLabel>
          <FormControl>
            <div
              className={cn(
                "flex min-h-11 items-center gap-3 text-sm",
                className,
              )}
            >
              <Checkbox
                isSelected={field.value}
                onValueChange={field.onChange}
                isInvalid={!!fieldState?.error?.message}
                color={color}
                aria-label={label}
              />
              {description ? (
                <FormDescription className="m-0 leading-snug">
                  {description}
                </FormDescription>
              ) : null}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
