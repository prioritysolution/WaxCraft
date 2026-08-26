"use client";

import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";
import { FieldValues, Control, Path, ControllerRenderProps } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { fieldInputClassNames, getSelectPlaceholder } from "@/lib/uiStyles";
import { ReactNode, useEffect, useRef } from "react";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "bordered" | "flat" | "faded" | "underlined" | undefined;
  className?: string;
  options: Array<{ [key: string]: any; Id: string | number }>;
  optionLabelKey?: string;
  disabled?: boolean;
  emptyContent?: ReactNode | null;
  hideContent?: boolean;
  loading?: boolean;
}

const DropdownControl = <T extends FieldValues>({
  field,
  message,
  label,
  options,
  className,
  optionLabelKey,
  disabled,
  loading,
  size,
  radius,
  variant,
  emptyContent,
  hideContent,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  message?: string;
  label: string;
  options: Array<{ [key: string]: any; Id: string | number }>;
  className?: string;
  optionLabelKey: string;
  disabled: boolean;
  loading: boolean;
  size: "sm" | "md" | "lg";
  radius: "none" | "sm" | "md" | "lg" | "full";
  variant: "bordered" | "flat" | "faded" | "underlined" | undefined;
  emptyContent?: ReactNode | null;
  hideContent: boolean;
}) => {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  return (
    <Autocomplete
      className={cn("w-full", className)}
      items={options}
      aria-label={label}
      placeholder={getSelectPlaceholder(label)}
      variant={variant}
      radius={radius}
      size={size}
      classNames={{
        base: fieldInputClassNames.base,
      }}
      inputProps={{ classNames: fieldInputClassNames }}
      isDisabled={disabled || loading}
      isInvalid={!!message}
      errorMessage={message}
      selectedKey={
        field.value != null && String(field.value) !== ""
          ? String(field.value)
          : null
      }
      onSelectionChange={(key) => {
        if (!isMountedRef.current) return;
        if (key == null) return;
        field.onChange(String(key));
      }}
      endContent={loading && <Spinner size="sm" color="primary" />}
      listboxProps={{
        emptyContent: emptyContent || `No ${label.toLowerCase()} found`,
      }}
      popoverProps={{
        classNames: {
          content: hideContent ? "hidden" : "block",
        },
      }}
    >
      {(option) => (
        <AutocompleteItem
          key={String(option.Id)}
          textValue={String(option[optionLabelKey] ?? "")}
        >
          {option[optionLabelKey]}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

const DropdownField = <T extends FieldValues>({
  control,
  name,
  label = "Option",
  size = "md",
  radius = "lg",
  variant = "bordered",
  className,
  options,
  optionLabelKey = "Value",
  disabled = false,
  emptyContent = null,
  hideContent = false,
  loading = false,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const message =
          typeof fieldState?.error?.message === "string"
            ? fieldState.error.message
            : undefined;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <DropdownControl
                field={field}
                message={message}
                label={label}
                options={options}
                className={className}
                optionLabelKey={optionLabelKey}
                disabled={disabled}
                loading={loading}
                size={size}
                radius={radius}
                variant={variant}
                emptyContent={emptyContent}
                hideContent={hideContent}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default DropdownField;
