"use client";

import { ReactNode } from "react";
import { Input } from "@heroui/react";
import { FieldValues, Control, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { fieldInputClassNames, getEnterPlaceholder } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  type?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "bordered" | "underlined" | "flat" | "faded" | undefined;
  placeholder?: string;
  className?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  disabled?: boolean;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  accept?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  required?: boolean;
}

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  size = "md",
  radius = "lg",
  variant = "bordered",
  placeholder,
  className,
  endContent,
  startContent,
  disabled = false,
  onInput,
  accept = "",
  maxLength,
  inputMode,
  pattern,
  required,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { value, ...restField } = field;
        const errorMessage =
          typeof fieldState?.error?.message === "string"
            ? fieldState.error.message
            : undefined;
        const inputValue =
          (value as unknown) instanceof File
            ? undefined
            : typeof value === "object" && value !== null
              ? String(
                  (value as Record<string, unknown>).wt_rate ??
                    (value as Record<string, unknown>).Wt_Rate ??
                    "",
                )
              : (value ?? "");

        return (
          <FormItem className="flex-1">
            {label ? <FormLabel required={required}>{label}</FormLabel> : null}
            <FormControl>
              <Input
                type={type}
                size={size}
                radius={radius}
                variant={variant}
                placeholder={placeholder || getEnterPlaceholder(label)}
                aria-label={label}
                className={cn("w-full", className)}
                classNames={fieldInputClassNames}
                endContent={endContent}
                startContent={startContent}
                isInvalid={!!errorMessage}
                errorMessage={errorMessage}
                isReadOnly={disabled}
                disabled={disabled}
                onInput={onInput}
                accept={accept && accept}
                maxLength={maxLength}
                inputMode={inputMode}
                pattern={pattern}
                {...restField}
                value={type === "file" ? undefined : inputValue}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;
