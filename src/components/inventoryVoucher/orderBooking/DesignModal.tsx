"use client";

import { tableClassNames } from "@/lib/uiStyles";
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
  formatUpToDecimals,
  sanitizeDecimalInput,
} from "@/utils/formatDecimal";
import {
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC, useMemo } from "react";
import { Path } from "react-hook-form";

const formatOrderItemRate = (rate: string) => formatUpToDecimals(rate, 4, "");

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

  // Snapshot on open so the field stays visible while the user edits/clears it.
  const showGhat = useMemo(
    () =>
      showDesignDialog && String(form.getValues("ghat") ?? "").trim() !== "",
    [showDesignDialog, form],
  );

  const { variantsByAttrs, variantsLoading } = useItemVariants(
    showDesignDialog,
    items,
  );

  const itemGrandTotal = (items ?? []).reduce((acc, item) => {
    const rate = item?.itemTotal ? parseFloat(item.itemTotal) : 0;
    return acc + (Number.isFinite(rate) ? rate : 0);
  }, 0);

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

              {showGhat && (
                <InputField
                  control={form.control}
                  name="ghat"
                  label="Ghat"
                  type="number"
                />
              )}

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
                      ...rows.map((row, index) => (
                        <TableRow key={`design-item-${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <InputField
                              control={form.control}
                              name={`item.${index}.itemName`}
                              disabled
                              className="min-w-[160px]"
                            />
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
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
                                  4,
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
                                  4,
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
                      )),
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
