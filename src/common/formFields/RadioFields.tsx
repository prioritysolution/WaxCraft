"use client";

import { Radio, RadioGroup } from "@heroui/react";
import { FieldValues, Control, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  orientation?: "vertical" | "horizontal" | undefined;
  className?: string;
  options: Array<{ value: string; label: string }>;
  isDisabled?: boolean;
  onValueChange?: (value: string) => void;
}

const RadioField = <T extends FieldValues>({
  control,
  name,
  label,
  size = "md",
  color = "primary",
  orientation = "vertical",
  className,
  options,
  isDisabled = false,
  onValueChange,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="w-full ">
          {label && (
            <FormLabel className="text-sm font-medium text-foreground">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={cn(
                "bg-transparent px-0 py-0",
                className
              )}
            >
              <RadioGroup
                isInvalid={!!fieldState?.error?.message}
                value={field.value}
                onValueChange={(value) => {
                  if (isDisabled) return;
                  field.onChange(value);
                  onValueChange?.(value);
                }}
                color={color}
                size={size}
                orientation={orientation}
                isDisabled={isDisabled}
                classNames={{
                  wrapper: "bg-transparent gap-4",
                }}
              >
                {options.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    isDisabled={isDisabled}
                  >
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioField;
