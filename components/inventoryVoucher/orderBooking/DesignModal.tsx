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
import { DesignModalProps } from "@/types/inventoryVoucher/OrderBookingTypes";
import { DesignTableData } from "@/types/master/DesignTypes";
import {
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC, Fragment, useEffect } from "react";
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
  const items = form.watch("item");
  const itemType = form.watch("itemType");
  const isPartyItem = itemType === "0";

  useEffect(() => {
    if (!isPartyItem) return;
    // For party item, rate should always be 0 and non-editable.
    (items ?? []).forEach((_, index) => {
      form.setValue(`item.${index}.itemRate`, "0", { shouldDirty: false });
    });
  }, [isPartyItem, items, form]);

  // Don't memoize: react-hook-form `watch()` may keep the same reference while inner values change.
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
                  disabled
                />

                <InputField
                  control={form.control}
                  name="designNo"
                  label="Design No."
                  type="number"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="wt"
                  label="WT"
                  type="number"
                  disabled
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
                  <Image
                    src={form.getValues("image")}
                    alt="Design Image"
                    width={100}
                    height={100}
                  />
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
                      <Fragment>
                        {designFormTableData.childrow?.map((data, index) => (
                          <TableRow key={index}>
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
                                type="number"
                                variant="bordered"
                                className="min-w-[70px]"
                                disabled={isPartyItem}
                              />
                            </TableCell>
                            <TableCell>
                              <InputField
                                control={form.control}
                                name={`item.${index}.makingRate`}
                                variant="bordered"
                                className="min-w-[70px]"
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
                        ))}
                        {(designFormTableData.childrow?.length ?? 0) > 0 && (
                          <TableRow className="border-t-2 border-black/[0.08] bg-[#F7F5F3]/90 hover:bg-[#F7F5F3]/90">
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
                          </TableRow>
                        )}
                      </Fragment>
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
            submitLabel="Add"
            submitType="button"
            onSubmitPress={handleAddDesign}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default DesignModal;
