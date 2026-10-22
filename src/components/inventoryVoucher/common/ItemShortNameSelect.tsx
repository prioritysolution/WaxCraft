"use client";

import { fieldInputClassNames } from "@/lib/uiStyles";

import InputField from "@/common/formFields/InputField";
import {
  getItemUnderCategoryAPI,
  getItemsByAttrsAPI,
} from "@/container/master/item/ItemApis";
import { getItemRateAPI } from "@/container/master/itemRate/ItemRateApis";
import { ApiResponse } from "@/types/ApiTypes";
import getCookieData from "@/utils/getCookieData";
import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type ItemVariantOption = {
  Id: string | number;
  Item_Name: string;
  Item_Sh_Name: string;
  Color_Id?: string | number | null;
  Item_GL?: string | null;
  Cat_Id?: string;
  Model_Id?: string;
  Size_Id?: string;
};

export type ItemShortNameRow = {
  itemId?: string;
  itemName?: string;
  itemShName?: string;
  itemGl?: string;
  catId?: string;
  modelId?: string;
  sizeId?: string;
  colorId?: string;
};

// Shared by the order booking and sample print design modals, whose forms
// both keep design rows under `item.<index>.*`.
type ItemRowsForm = UseFormReturn<FieldValues>;

export const attrsKey = (catId: string, modelId: string, sizeId: string) =>
  `${catId}|${modelId}|${sizeId}`;

export const pickNum = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    if (value == null || String(value).trim() === "") continue;
    return String(value);
  }
  return "";
};

const normalizeVariantRows = (details: unknown): ItemVariantOption[] => {
  const rows = Array.isArray(details)
    ? details
    : Array.isArray((details as { data?: unknown[] } | null)?.data)
      ? ((details as { data: unknown[] }).data ?? [])
      : [];

  return rows
    .map((row) => {
      const record = row as Record<string, unknown>;
      const id = record.Id ?? record.id ?? record.Item_Id ?? record.item_id;
      if (id == null || String(id).trim() === "") return null;
      return {
        Id: id as string | number,
        Item_Name: String(record.Item_Name ?? record.item_name ?? ""),
        Item_Sh_Name: String(
          record.Item_Sh_Name ?? record.item_sh_name ?? record.Item_Name ?? "",
        ),
        Color_Id:
          (record.Color_Id as string | number | null | undefined) ??
          (record.color_id as string | number | null | undefined) ??
          (record.item_color as string | number | null | undefined) ??
          null,
        Item_GL:
          (record.Item_GL as string | null | undefined) ??
          (record.item_gl as string | null | undefined) ??
          null,
        Cat_Id: pickNum(record, ["Cat_Id", "cat_id"]),
        Model_Id: pickNum(record, ["Model_Id", "model_id", "item_mod"]),
        Size_Id: pickNum(record, ["Size_Id", "size_id", "item_size"]),
      };
    })
    .filter(Boolean) as ItemVariantOption[];
};

/** Loads same category/model/size item variants for every design row. */
export const useItemVariants = (
  isOpen: boolean,
  items: ItemShortNameRow[] | undefined,
) => {
  const [variantsByAttrs, setVariantsByAttrs] = useState<
    Record<string, ItemVariantOption[]>
  >({});
  const [variantsLoading, setVariantsLoading] = useState(false);

  const attrKeys = useMemo(() => {
    const keys = new Set<string>();
    (items ?? []).forEach((item) => {
      const catId = String(item?.catId || "").trim();
      const modelId = String(item?.modelId || "").trim();
      const sizeId = String(item?.sizeId || "").trim();
      if (catId && modelId && sizeId) {
        keys.add(attrsKey(catId, modelId, sizeId));
      }
    });
    return Array.from(keys);
  }, [items]);

  useEffect(() => {
    if (!isOpen) {
      setVariantsByAttrs({});
      return;
    }

    const orgId = getCookieData<number | null>("waxCraftClientOrgId");
    if (!orgId || !attrKeys.length) return;

    let cancelled = false;

    const loadVariants = async () => {
      setVariantsLoading(true);
      const next: Record<string, ItemVariantOption[]> = {};

      await Promise.all(
        attrKeys.map(async (key) => {
          const [catId, modelId, sizeId] = key.split("|");
          try {
            let rows: ItemVariantOption[] = [];

            try {
              const res = await getItemsByAttrsAPI(
                orgId,
                catId,
                modelId,
                sizeId,
              );
              if (res.status === 200 || res.status === 202) {
                rows = normalizeVariantRows(res.data?.details);
              }
            } catch {
              rows = [];
            }

            // Fallback: category items filtered client-side by model + size
            if (!rows.length) {
              const res = await getItemUnderCategoryAPI(orgId, catId);
              if (res.status === 200 || res.status === 202) {
                rows = normalizeVariantRows(res.data?.details).filter(
                  (row) =>
                    String(row.Model_Id || "") === String(modelId) &&
                    String(row.Size_Id || "") === String(sizeId),
                );
              }
            }

            next[key] = rows.map((row) => ({
              Id: row.Id,
              Item_Name: row.Item_Name,
              Item_Sh_Name: row.Item_Sh_Name,
              Color_Id: row.Color_Id,
              Item_GL: row.Item_GL,
            }));
          } catch {
            next[key] = [];
          }
        }),
      );

      if (!cancelled) {
        setVariantsByAttrs(next);
        setVariantsLoading(false);
      }
    };

    void loadVariants();

    return () => {
      cancelled = true;
    };
  }, [isOpen, attrKeys.join(",")]);

  return { variantsByAttrs, variantsLoading };
};

type RateOptions = {
  isPartyItem: boolean;
  /** Rate written for party items (rate is not charged). */
  partyRate: string;
  formatRate: (rate: string) => string;
};

const ItemShortNameSelect: FC<
  RateOptions & {
    form: ItemRowsForm;
    index: number;
    options: ItemVariantOption[];
    loading?: boolean;
    disabled?: boolean;
  }
> = ({
  form,
  index,
  options,
  loading,
  disabled,
  isPartyItem,
  partyRate,
  formatRate,
}) => {
  const itemId = form.watch(`item.${index}.itemId`);
  const itemShName = form.watch(`item.${index}.itemShName`);

  const handleSelect = async (key: string) => {
    const selected = options.find((opt) => String(opt.Id) === String(key));
    if (!selected) return;

    form.setValue(`item.${index}.itemId`, String(selected.Id), {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(`item.${index}.itemName`, selected.Item_Name || "", {
      shouldDirty: true,
    });
    form.setValue(
      `item.${index}.itemShName`,
      selected.Item_Sh_Name || selected.Item_Name || "",
      { shouldDirty: true },
    );
    form.setValue(
      `item.${index}.colorId`,
      selected.Color_Id != null ? String(selected.Color_Id) : "",
      { shouldDirty: true },
    );
    if (selected.Item_GL != null && String(selected.Item_GL).trim() !== "") {
      form.setValue(`item.${index}.itemGl`, String(selected.Item_GL), {
        shouldDirty: true,
      });
    }

    if (isPartyItem) {
      form.setValue(`item.${index}.itemRate`, partyRate, { shouldDirty: true });
      return;
    }

    const orgId = getCookieData<number | null>("waxCraftClientOrgId");
    if (!orgId) return;

    try {
      const res: ApiResponse = await getItemRateAPI(
        orgId,
        String(selected.Id),
      );
      if (
        String(form.getValues(`item.${index}.itemId`) ?? "") !==
        String(selected.Id)
      ) {
        return;
      }
      if (res.status === 200 || res.status === 202) {
        const details = res.data?.details;
        const rateRow = Array.isArray(details) ? details[0] : details;
        // GetItemRate returns the rate itself in `details`; older shapes wrap it in a row.
        const rate =
          rateRow && typeof rateRow === "object"
            ? pickNum(rateRow as Record<string, unknown>, [
                "Item_Rate",
                "item_rate",
                "Sales_Rate",
                "sales_rate",
                "Rate",
                "rate",
              ])
            : rateRow != null &&
                String(rateRow).trim() !== "" &&
                Number.isFinite(Number(rateRow))
              ? String(rateRow)
              : "";
        if (rate) {
          const nextRate = formatRate(rate) || rate;
          form.setValue(`item.${index}.itemRate`, nextRate, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    } catch {
      // Keep existing rate if rate lookup fails.
    }
  };

  const selectedKey =
    itemId && options.some((opt) => String(opt.Id) === String(itemId))
      ? String(itemId)
      : null;

  return (
    <Autocomplete
      className="min-w-[200px] sm:min-w-[220px]"
      aria-label="Item short name"
      placeholder={itemShName || "Select item"}
      variant="bordered"
      radius="lg"
      size="md"
      classNames={{ base: fieldInputClassNames.base }}
      inputProps={{ classNames: fieldInputClassNames }}
      popoverProps={{
        // HeroUI sets an inline width equal to the input; !important lets long names widen the panel.
        classNames: {
          base: "!w-max min-w-[220px] max-w-[min(92vw,420px)]",
        },
      }}
      isDisabled={disabled || loading || options.length === 0}
      selectedKey={selectedKey}
      defaultInputValue={itemShName || ""}
      onSelectionChange={(key) => {
        if (key == null) return;
        void handleSelect(String(key));
      }}
      endContent={loading ? <Spinner size="sm" color="primary" /> : null}
      listboxProps={{ emptyContent: "No matching items found" }}
    >
      {options.map((option) => (
        <AutocompleteItem
          key={String(option.Id)}
          textValue={option.Item_Sh_Name || option.Item_Name}
          classNames={{
            title: "whitespace-normal break-words leading-snug",
          }}
        >
          {option.Item_Sh_Name || option.Item_Name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

/**
 * Item short name dropdown when the row has category/model/size, otherwise
 * the read-only short name.
 */
export const ItemShortNameCell = <T extends FieldValues>({
  form: typedForm,
  index,
  row,
  variantsByAttrs,
  variantsLoading,
  fallbackClassName = "min-w-[200px]",
  ...rateOptions
}: RateOptions & {
  form: UseFormReturn<T>;
  index: number;
  row: ItemShortNameRow | undefined;
  variantsByAttrs: Record<string, ItemVariantOption[]>;
  variantsLoading: boolean;
  fallbackClassName?: string;
}) => {
  const form = typedForm as unknown as ItemRowsForm;
  const key = attrsKey(
    String(row?.catId || ""),
    String(row?.modelId || ""),
    String(row?.sizeId || ""),
  );
  const options = variantsByAttrs[key] || [];
  const hasAttrs = Boolean(row?.catId && row?.modelId && row?.sizeId);

  if (!hasAttrs) {
    return (
      <InputField
        control={form.control}
        name={`item.${index}.itemShName`}
        disabled
        className={fallbackClassName}
      />
    );
  }

  return (
    <ItemShortNameSelect
      form={form}
      index={index}
      options={
        options.length
          ? options
          : [
              {
                Id: row?.itemId ?? "",
                Item_Name: row?.itemName ?? "",
                Item_Sh_Name: row?.itemShName ?? "",
                Color_Id: row?.colorId,
                Item_GL: row?.itemGl,
              },
            ]
      }
      loading={variantsLoading}
      {...rateOptions}
    />
  );
};
