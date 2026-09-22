"use client";

import { tableClassNames, fieldInputClassNames } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  getItemUnderCategoryAPI,
  getItemsByAttrsAPI,
} from "@/container/master/item/ItemApis";
import { getItemRateAPI } from "@/container/master/itemRate/ItemRateApis";
import {
  DesignModalProps,
  OrderBookingFormData,
} from "@/types/inventoryVoucher/OrderBookingTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { sanitizeDecimalInput, toTwoDecimalString } from "@/utils/formatDecimal";
import getCookieData from "@/utils/getCookieData";
import {
  Autocomplete,
  AutocompleteItem,
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { Path, UseFormReturn } from "react-hook-form";

type ItemVariantOption = {
  Id: string | number;
  Item_Name: string;
  Item_Sh_Name: string;
  Color_Id?: string | number | null;
  Item_GL?: string | null;
  Cat_Id?: string;
  Model_Id?: string;
  Size_Id?: string;
};

const attrsKey = (catId: string, modelId: string, sizeId: string) =>
  `${catId}|${modelId}|${sizeId}`;

const pickNum = (row: Record<string, unknown>, keys: string[]) => {
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

const ItemShortNameSelect: FC<{
  form: UseFormReturn<OrderBookingFormData>;
  index: number;
  options: ItemVariantOption[];
  loading?: boolean;
  disabled?: boolean;
  isPartyItem: boolean;
}> = ({ form, index, options, loading, disabled, isPartyItem }) => {
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
      form.setValue(`item.${index}.itemRate`, "0", { shouldDirty: true });
      return;
    }

    const orgId = getCookieData<number | null>("waxCraftClientOrgId");
    if (!orgId) return;

    try {
      const res: ApiResponse = await getItemRateAPI(
        orgId,
        String(selected.Id),
      );
      if (res.status === 200 || res.status === 202) {
        const details = res.data?.details;
        const rateRow = Array.isArray(details) ? details[0] : details;
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
            : "";
        if (rate) {
          const nextRate = toTwoDecimalString(rate) || rate;
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
      className="min-w-[160px]"
      aria-label="Item short name"
      placeholder={itemShName || "Select item"}
      variant="bordered"
      radius="lg"
      size="md"
      classNames={{ base: fieldInputClassNames.base }}
      inputProps={{ classNames: fieldInputClassNames }}
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
        >
          {option.Item_Sh_Name || option.Item_Name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

const DesignModal: FC<DesignModalProps> = ({
  showDesignDialog,
  setShowDesignDialog,
  form,
  handleAddDesign,
  setDesignInput,
}) => {
  const items = form.watch("item");
  const itemType = form.watch("itemType");
  const designImage = form.watch("image");
  const isPartyItem = itemType === "0";

  const [variantsByAttrs, setVariantsByAttrs] = useState<
    Record<string, ItemVariantOption[]>
  >({});
  const [variantsLoading, setVariantsLoading] = useState(false);

  const itemGrandTotal = (items ?? []).reduce((acc, item) => {
    const rate = item?.itemTotal ? parseFloat(item.itemTotal) : 0;
    return acc + (Number.isFinite(rate) ? rate : 0);
  }, 0);

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
    if (!showDesignDialog) {
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
  }, [showDesignDialog, attrKeys.join(",")]);

  const rows = items ?? [];

  return (
    <FormModal
      isOpen={showDesignDialog}
      onOpenChange={setShowDesignDialog}
      size="3xl"
    >
      <Form {...form}>
        <form className="flex w-full flex-col" autoComplete="off">
          <FormModalHeader
            title="Add New Design"
            description="Review design details and add it to the order."
            onClose={() => {
              setShowDesignDialog(false);
              form.setValue("designId", "");
              setDesignInput("");
            }}
          />
          <FormModalBody>
            <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
              <InputField
                control={form.control}
                name="designName"
                label="Design Name"
                readOnly
              />

              <InputField
                control={form.control}
                name="designNo"
                label="Design No."
                readOnly
              />

              <InputField
                control={form.control}
                name="wt"
                label="WT"
                type="number"
                readOnly
              />

              <InputField
                control={form.control}
                name="wtRate"
                label="WT Rate"
                type="number"
              />

              <InputField
                control={form.control}
                name="polish"
                label="Polish"
                type="number"
              />

              <div className="flex w-full justify-center">
                {designImage ? (
                  <Image
                    src={designImage}
                    alt="Design Image"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">No image</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <ScrollArea className="mx-auto mt-5 w-full max-w-[400px] sm:max-w-full">
                <Table
                  removeWrapper
                  aria-label="Design items"
                  classNames={tableClassNames}
                >
                  <TableHeader>
                    <TableColumn>Serial No.</TableColumn>
                    <TableColumn align="center">Item Name</TableColumn>
                    <TableColumn align="center">Item Short Name</TableColumn>
                    <TableColumn align="center">Quantity</TableColumn>
                    <TableColumn align="center">Rate</TableColumn>
                    <TableColumn align="center">Making Rate</TableColumn>
                    <TableColumn align="center">Total</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No data found."}>
                    {[
                      ...rows.map((row, index) => {
                        const key = attrsKey(
                          String(row?.catId || ""),
                          String(row?.modelId || ""),
                          String(row?.sizeId || ""),
                        );
                        const options = variantsByAttrs[key] || [];
                        const hasAttrs = Boolean(
                          row?.catId && row?.modelId && row?.sizeId,
                        );

                        return (
                          <TableRow key={`design-item-${index}-${row?.itemId}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemName`}
                                disabled
                                className="min-w-[70px]"
                              />
                            </TableCell>
                            <TableCell>
                              {hasAttrs ? (
                                <ItemShortNameSelect
                                  form={form}
                                  index={index}
                                  options={
                                    options.length
                                      ? options
                                      : [
                                          {
                                            Id: row.itemId,
                                            Item_Name: row.itemName,
                                            Item_Sh_Name: row.itemShName,
                                            Color_Id: row.colorId,
                                            Item_GL: row.itemGl,
                                          },
                                        ]
                                  }
                                  loading={variantsLoading}
                                  isPartyItem={isPartyItem}
                                />
                              ) : (
                                <InputField
                                  control={form.control}
                                  name={`item.${index}.itemShName`}
                                  disabled
                                  className="min-w-[70px]"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemQuantity`}
                                disabled
                                className="min-w-[70px]"
                              />
                            </TableCell>
                            <TableCell>
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemRate`}
                                type="text"
                                inputMode="decimal"
                                variant="bordered"
                                className="min-w-[70px]"
                                disabled={isPartyItem}
                                onInput={(e) => {
                                  const input = e.currentTarget;
                                  const next = sanitizeDecimalInput(
                                    input.value,
                                  );
                                  input.value = next;
                                  form.setValue(
                                    `item.${index}.itemRate` as Path<OrderBookingFormData>,
                                    next,
                                    {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    },
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <InputField
                                control={form.control}
                                name={`item.${index}.makingRate`}
                                type="text"
                                inputMode="decimal"
                                variant="bordered"
                                className="min-w-[70px]"
                                onInput={(e) => {
                                  const input = e.currentTarget;
                                  const next = sanitizeDecimalInput(
                                    input.value,
                                  );
                                  input.value = next;
                                  form.setValue(
                                    `item.${index}.makingRate` as Path<OrderBookingFormData>,
                                    next,
                                    {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    },
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemTotal`}
                                disabled
                                className="min-w-[70px]"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      }),
                      ...(rows.length > 0
                        ? [
                            <TableRow
                              key="design-item-grand-total"
                              className="border-t-2 border-black/[0.08] bg-[#F7F5F3]/90 hover:bg-[#F7F5F3]/90"
                            >
                              <TableCell
                                colSpan={6}
                                className="py-4 text-right"
                              >
                                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                  Item Grand Total
                                </span>
                              </TableCell>
                              <TableCell className="py-4">
                                <span
                                  className={cn(
                                    "inline-flex min-w-[70px] items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold tabular-nums text-primary",
                                  )}
                                >
                                  {itemGrandTotal.toFixed(2)}
                                </span>
                              </TableCell>
                            </TableRow>,
                          ]
                        : []),
                    ]}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
              <InputField
                control={form.control}
                name="totalRate"
                label="Total Rate"
                disabled
              />
              <InputField
                control={form.control}
                name="orderQuantity"
                label="Order Quantity"
                type="number"
              />
            </div>
          </FormModalBody>
          <FormModalFooter
            onCancel={() => {
              setShowDesignDialog(false);
              form.setValue("designId", "");
              setDesignInput("");
            }}
            submitLabel="Save"
            submitType="button"
            onSubmitPress={handleAddDesign}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default DesignModal;
