"use client";

import { Textarea } from "@heroui/react";
import { FieldValues, Control, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { fieldTextareaClassNames, getEnterPlaceholder } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "bordered" | "underlined" | "flat" | "faded" | undefined;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  size = "md",
  radius = "lg",
  variant = "bordered",
  placeholder,
  className,
  disabled = false,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <FormControl>
              <Textarea
                size={size}
                radius={radius}
                variant={variant}
                placeholder={placeholder || getEnterPlaceholder(label)}
                aria-label={label}
                className={cn("w-full", className)}
                classNames={fieldTextareaClassNames}
                isInvalid={!!fieldState?.error?.message}
                errorMessage={
                  typeof fieldState?.error?.message === "string"
                    ? fieldState.error.message
                    : undefined
                }
                disabled={disabled}
                isReadOnly={disabled}
                {...field}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default TextareaField;
