"use client";

import { useState, useEffect } from "react";
import { FieldValues, Control, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@heroui/react";
import { cn } from "@/lib/utils";
import { fieldInputClassNames } from "@/lib/uiStyles";

interface TextDropdownFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  dataset: any[]; // Array of objects with name, value, and phone keys
  className?: string;
  disabled?: boolean;
  handleSelect: (id: number) => void; // Function to handle search
}

const TextDropdownField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Enter data",
  dataset,
  className,
  disabled = false,
  handleSelect,
}: TextDropdownFieldProps<T>) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (dataset.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [dataset]); // Runs only when query or handleSearch changes

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel
            className={`text-base font-normal ${
              fieldState?.error?.message ? "text-danger" : ""
            }`}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="text"
                value={field.value} // Reflect query as input value
                onChange={field.onChange}
                placeholder={placeholder}
                size="md"
                radius="md"
                className={cn("w-full", className)}
                classNames={fieldInputClassNames}
                isDisabled={disabled}
                variant="bordered"
              />
              {!!showDropdown && (
                <div
                  className={`absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow scrollbar-hide ${
                    dataset.length > 4 ? "h-40 overflow-y-auto" : "max-h-40"
                  }`}
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Elevation effect
                  }}
                >
                  {dataset.map((option) => (
                    <div
                      key={option.Id}
                      onClick={() => {
                        handleSelect(option.Id);
                        setShowDropdown(false); // Close the dropdown
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-black transition duration-200"
                    >
                      {option.Cust_Name} - {option.Relation_Name} -{" "}
                      {option.Village}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-danger text-sm font-normal" />
        </FormItem>
      )}
    />
  );
};

export default TextDropdownField;
