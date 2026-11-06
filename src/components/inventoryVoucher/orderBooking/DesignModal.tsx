"use client";

import { cn } from "@/lib/utils";

import InputField from "@/common/formFields/InputField";
import {
  ItemShortNameCell,
  useItemVariants,
} from "@/components/inventoryVoucher/common/ItemShortNameSelect";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DesignModalProps,
  OrderBookingFormData,
} from "@/types/inventoryVoucher/OrderBookingTypes";
import {
  sanitizeDecimalInput,
  sanitizeRateInput,
  toRateString,
} from "@/utils/formatDecimal";
import { Image } from "@heroui/react";
import { FC } from "react";
import { Path } from "react-hook-form";

const formatOrderItemRate = (rate: string) => toRateString(rate);

const headClassName =
  "bg-[#F7F5F3] h-11 px-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const cellClassName = "px-3 py-3.5 text-center align-middle text-sm text-foreground";

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
  const manualDesignRates = form.watch("manualDesignRates");
  const isPartyItem = itemType === "0";
  const rows = items ?? [];
  const showMakingRate = rows.some((row) => row.makingRateManual);

  const { variantsByAttrs, variantsLoading } = useItemVariants(
    showDesignDialog,
    items,
  );

  const itemGrandTotal = (items ?? []).reduce((acc, item) => {
    const rate = item?.itemTotal ? parseFloat(item.itemTotal) : 0;
    return acc + (Number.isFinite(rate) ? rate : 0);
  }, 0);

  return (
    <FormModal
      isOpen={showDesignDialog}
      onOpenChange={setShowDesignDialog}
      size="3xl"
    >
      <Form {...form}>
        <form className="flex w-full flex-col" autoComplete="off">
          <FormModalHeader
            title="Design Details"
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

              {manualDesignRates ? (
                <>
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
                  <InputField
                    control={form.control}
                    name="ghat"
                    label="Ghat"
                    type="number"
                  />
                </>
              ) : null}

              <div className="flex w-full justify-center sm:col-span-2">
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
              <ScrollArea className="mt-5 w-full min-w-0">
                <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
                  <table className="w-full min-w-[720px] border-collapse text-center">
                    <thead>
                      <tr>
                        <th className={headClassName}>Serial No.</th>
                        <th className={headClassName}>Item Name</th>
                        <th className={headClassName}>Item Short Name</th>
                        <th className={headClassName}>Quantity</th>
                        <th className={headClassName}>Rate</th>
                        {showMakingRate ? (
                          <th className={headClassName}>Making Rate</th>
                        ) : null}
                        <th className={headClassName}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length ? (
                        rows.map((row, index) => (
                          <tr
                            key={`design-item-${index}`}
                            className="border-b border-black/[0.05]"
                          >
                            <td className={cellClassName}>{index + 1}</td>
                            <td className={cellClassName}>
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemName`}
                                disabled
                                className="min-w-[160px]"
                              />
                            </td>
                            <td className={cellClassName}>
                              <ItemShortNameCell
                                form={form}
                                index={index}
                                row={row}
                                variantsByAttrs={variantsByAttrs}
                                variantsLoading={variantsLoading}
                                isPartyItem={isPartyItem}
                                partyRate="0"
                                formatRate={formatOrderItemRate}
                              />
                            </td>
                            <td className={cellClassName}>
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemQuantity`}
                                type="text"
                                inputMode="decimal"
                                variant="bordered"
                                className="min-w-[70px]"
                                onInput={(e) => {
                                  const input = e.currentTarget;
                                  const next = sanitizeDecimalInput(
                                    input.value,
                                    4,
                                  );
                                  input.value = next;
                                  form.setValue(
                                    `item.${index}.itemQuantity` as Path<OrderBookingFormData>,
                                    next,
                                    {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    },
                                  );
                                }}
                              />
                            </td>
                            <td className={cellClassName}>
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
                                  const next = sanitizeRateInput(input.value);
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
                            </td>
                            {showMakingRate ? (
                              <td className={cellClassName}>
                                <InputField
                                  control={form.control}
                                  name={`item.${index}.makingRate`}
                                  type="text"
                                  inputMode="decimal"
                                  variant="bordered"
                                  className="min-w-[70px]"
                                  disabled={!row.makingRateManual}
                                  onInput={(e) => {
                                    const input = e.currentTarget;
                                    const next = sanitizeRateInput(input.value);
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
                              </td>
                            ) : null}
                            <td className={cellClassName}>
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemTotal`}
                                disabled
                                className="min-w-[70px]"
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={showMakingRate ? 7 : 6}
                            className="px-4 py-12 text-center text-sm text-muted-foreground"
                          >
                            No data found.
                          </td>
                        </tr>
                      )}
                      {rows.length > 0 ? (
                        <tr className="border-t-2 border-black/[0.08] bg-[#F7F5F3]/90">
                          <td
                            colSpan={showMakingRate ? 6 : 5}
                            className="px-3 py-4 text-right"
                          >
                            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Item Grand Total
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            <span
                              className={cn(
                                "inline-flex min-w-[70px] items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold tabular-nums text-primary",
                              )}
                            >
                              {itemGrandTotal.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
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
