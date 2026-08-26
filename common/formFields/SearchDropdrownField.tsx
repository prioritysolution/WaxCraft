"use client";

import { FieldValues, Control, Path, ControllerRenderProps } from "react-hook-form";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";
import { cn } from "@/lib/utils";
import { fieldInputClassNames, getSelectPlaceholder } from "@/lib/uiStyles";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useMemo,
} from "react";

interface SearchDropdownFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: any[];
  className?: string;
  optionLabelKey: string;
  disabled?: boolean;
  loading?: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  loadMore: () => void;
  handleSearch: () => void;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "bordered" | "flat" | "faded" | "underlined" | undefined;
  emptyContent?: ReactNode | null;
  hideContent?: boolean;
}

function getOptionId(item: any): string {
  return item?.Id != null ? String(item.Id) : "";
}

function getOptionLabel(item: any, optionLabelKey: string): string {
  const label = item?.[optionLabelKey];
  return label != null ? String(label) : "";
}

const SearchDropdownControl = <T extends FieldValues>({
  field,
  errorMessage,
  label,
  options,
  className,
  optionLabelKey,
  disabled,
  loading,
  input,
  setInput,
  handleScroll,
  handleSearch,
  size,
  radius,
  variant,
  emptyContent,
  hideContent,
  placeholder,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  errorMessage?: string;
  label: string;
  options: any[];
  className?: string;
  optionLabelKey: string;
  disabled: boolean;
  loading?: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  handleScroll: () => void;
  handleSearch: () => void;
  size: "sm" | "md" | "lg";
  radius: "none" | "sm" | "md" | "lg" | "full";
  variant: "bordered" | "flat" | "faded" | "underlined" | undefined;
  emptyContent?: ReactNode | null;
  hideContent: boolean;
  placeholder?: string;
}) => {
  const selectedKey =
    field.value != null && String(field.value) !== ""
      ? String(field.value)
      : null;

  const selectedLabel = useMemo(() => {
    const match = (options || []).find(
      (item) => getOptionId(item) === selectedKey,
    );
    return match ? getOptionLabel(match, optionLabelKey) : "";
  }, [options, selectedKey, optionLabelKey]);

  const items = useMemo(() => {
    const list = [...(options || [])];
    if (!selectedKey) return list;
    if (list.some((item) => getOptionId(item) === selectedKey)) return list;

    const label = selectedLabel || input;
    if (!label) return list;

    return [{ Id: selectedKey, [optionLabelKey]: label }, ...list];
  }, [options, selectedKey, selectedLabel, input, optionLabelKey]);

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;
    if (!selectedKey || !selectedLabel) return;
    setInput((prev) => (prev ? prev : selectedLabel));
  }, [selectedKey, selectedLabel, setInput]);

  useEffect(() => {
    if (selectedKey && selectedLabel && input === selectedLabel) {
      return;
    }

    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [input]);

  const applySelection = (key: string | number | null) => {
    if (!isMountedRef.current) return;
    if (key == null || key === "") {
      field.onChange("");
      setInput("");
      return;
    }

    const nextKey = String(key);
    field.onChange(nextKey);
    const match = items.find((item) => getOptionId(item) === nextKey);
    setInput(match ? getOptionLabel(match, optionLabelKey) : "");
  };

  return (
    <Autocomplete
      aria-label={label}
      placeholder={placeholder || getSelectPlaceholder(label)}
      items={items}
      selectedKey={selectedKey}
      onSelectionChange={applySelection}
      inputValue={input}
      onInputChange={(value) => {
        if (!isMountedRef.current) return;
        setInput(value);
      }}
      onClear={() => applySelection(null)}
      isDisabled={disabled}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      variant={variant}
      radius={radius}
      size={size}
      className={cn("w-full", className)}
      classNames={{
        base: fieldInputClassNames.base,
        listboxWrapper: "auto-listbox ",
      }}
      inputProps={{ classNames: fieldInputClassNames }}
      menuTrigger="input"
      listboxProps={{
        onScroll: handleScroll,
        onWheel: handleScroll,
        emptyContent: emptyContent || `No ${label.toLowerCase()} found`,
      }}
      popoverProps={{
        classNames: {
          content: hideContent ? "hidden" : "block",
        },
      }}
      endContent={loading && <Spinner size="sm" color="primary" />}
    >
      {(item) => (
        <AutocompleteItem
          key={getOptionId(item)}
          textValue={getOptionLabel(item, optionLabelKey)}
        >
          {getOptionLabel(item, optionLabelKey)}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

const SearchDropdownField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  className,
  optionLabelKey = "Label",
  disabled = false,
  loading,
  loadMore,
  handleSearch,
  input,
  setInput,
  size = "md",
  radius = "lg",
  variant = "bordered",
  emptyContent = null,
  hideContent = false,
  placeholder,
}: SearchDropdownFieldProps<T>) => {
  const handleScroll = () => {
    const listbox = document.querySelector(".auto-listbox");
    if (listbox) {
      const { scrollTop, scrollHeight, clientHeight } = listbox as HTMLElement;

      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
        loadMore();
      }
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex-grow">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <SearchDropdownControl
              field={field}
              errorMessage={
                typeof fieldState?.error?.message === "string"
                  ? fieldState.error.message
                  : undefined
              }
              label={label}
              options={options}
              className={className}
              optionLabelKey={optionLabelKey}
              disabled={disabled}
              loading={loading}
              input={input}
              setInput={setInput}
              handleScroll={handleScroll}
              handleSearch={handleSearch}
              size={size}
              radius={radius}
              variant={variant}
              emptyContent={emptyContent}
              hideContent={hideContent}
              placeholder={placeholder}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default SearchDropdownField;
