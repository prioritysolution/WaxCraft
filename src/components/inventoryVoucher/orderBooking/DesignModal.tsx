"use client";

import { tableClassNames } from "@/lib/uiStyles";

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
  DesignModalProps,
  OrderBookingFormData,
} from "@/types/inventoryVoucher/OrderBookingTypes";
import { DesignTableData } from "@/types/master/DesignTypes";
import { sanitizeDecimalInput } from "@/utils/formatDecimal";
import {
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC } from "react";
import { Path } from "react-hook-form";
import { useSelector } from "react-redux";

interface OrderBookingState {
  orderDesignDetailsData: DesignTableData;
}

interface RootState {
  orderBooking: OrderBookingState;
}

const DesignModal: FC<DesignModalProps> = ({
  showDesignDialog,
  setShowDesignDialog,
  form,
  handleAddDesign,
  setDesignInput,
}) => {
  const designFormTableData = useSelector(
    (state: RootState) => state?.orderBooking?.orderDesignDetailsData
  );
  // Re-render on nested item field changes (rate / making rate / totals).
  const items = form.watch("item");
  const itemType = form.watch("itemType");
  const designImage = form.watch("image");
  const isPartyItem = itemType === "0";

  // Don't memoize: react-hook-form `watch()` may keep the same reference while inner values change.
  const itemGrandTotal = (items ?? []).reduce((acc, item) => {
    const rate = item?.itemTotal ? parseFloat(item.itemTotal) : 0;
    return acc + (Number.isFinite(rate) ? rate : 0);
  }, 0);

  const childRows = designFormTableData.childrow ?? [];

  return (
    <FormModal
      isOpen={showDesignDialog}
      onOpenChange={setShowDesignDialog}
      size="3xl"
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
        >
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
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
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

                <div className=" w-full flex justify-center">
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
                <ScrollArea className="w-full max-w-[400px] sm:max-w-full mx-auto mt-5">
                  <Table
                    removeWrapper
                    aria-label="Example static collection table"
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
                        ...childRows.map((_, index) => (
                          <TableRow key={`design-item-${index}`}>
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
                              <InputField
                                control={form.control}
                                name={`item.${index}.itemShName`}
                                disabled
                                className="min-w-[70px]"
                              />
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
                                  const next = sanitizeDecimalInput(input.value);
                                  input.value = next;
                                  form.setValue(
                                    `item.${index}.itemRate` as Path<OrderBookingFormData>,
                                    next,
                                    { shouldValidate: true, shouldDirty: true },
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
                                  const next = sanitizeDecimalInput(input.value);
                                  input.value = next;
                                  form.setValue(
                                    `item.${index}.makingRate` as Path<OrderBookingFormData>,
                                    next,
                                    { shouldValidate: true, shouldDirty: true },
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
                        ...(childRows.length > 0
                          ? [
                              <TableRow
                                key="design-item-grand-total"
                                className="border-t-2 border-black/[0.08] bg-[#F7F5F3]/90 hover:bg-[#F7F5F3]/90"
                              >
                                <TableCell colSpan={6} className="py-4 text-right">
                                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                    Item Grand Total
                                  </span>
                                </TableCell>
                                <TableCell className="py-4">
                                  <span className="inline-flex min-w-[70px] items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold tabular-nums text-primary">
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
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
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
