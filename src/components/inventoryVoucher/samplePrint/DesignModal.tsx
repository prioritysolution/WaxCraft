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
  SamplePrintFormData,
} from "@/types/inventoryVoucher/SamplePrintTypes";
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
import { FC, useEffect } from "react";
import { Path, UseFormReturn, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

interface OrderBookingState {
  orderDesignDetailsData: DesignTableData;
}

interface RootState {
  orderBooking: OrderBookingState;
}

const calcRowTotal = (
  quantity: unknown,
  rate: unknown,
  makingRate: unknown
): number => {
  const qty = Number(quantity) || 0;
  const r = Number(rate) || 0;
  const m = Number(makingRate) || 0;
  const total = qty * r + qty * m;
  return Number.isFinite(total) ? total : 0;
};

/** Isolates re-renders so totals update when rate / making rate change. */
const RowTotalCell: FC<{
  form: UseFormReturn<SamplePrintFormData>;
  index: number;
}> = ({ form, index }) => {
  const quantity = useWatch({
    control: form.control,
    name: `item.${index}.itemQuantity`,
  });
  const rate = useWatch({
    control: form.control,
    name: `item.${index}.itemRate`,
  });
  const makingRate = useWatch({
    control: form.control,
    name: `item.${index}.makingRate`,
  });

  const total = calcRowTotal(quantity, rate, makingRate).toFixed(2);

  useEffect(() => {
    const current = form.getValues(`item.${index}.itemTotal`);
    if (current !== total) {
      form.setValue(`item.${index}.itemTotal`, total, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [total, form, index]);

  return (
    <span className="inline-flex min-w-[70px] items-center justify-center text-sm tabular-nums">
      {total}
    </span>
  );
};

const ItemTotalsSync: FC<{
  form: UseFormReturn<SamplePrintFormData>;
  rowCount: number;
}> = ({ form, rowCount }) => {
  const items = useWatch({ control: form.control, name: "item" }) || [];
  const wt = useWatch({ control: form.control, name: "wt" });
  const wtRate = useWatch({ control: form.control, name: "wtRate" });
  const polish = useWatch({ control: form.control, name: "polish" });

  // Fingerprint nested calc fields so grand total updates when rate/making rate change.
  const calcKey = items
    .slice(0, rowCount)
    .map(
      (row) =>
        `${row?.itemQuantity ?? ""}:${row?.itemRate ?? ""}:${row?.makingRate ?? ""}`
    )
    .join("|");

  const itemGrandTotal = items.slice(0, rowCount).reduce((acc, row) => {
    return (
      acc + calcRowTotal(row?.itemQuantity, row?.itemRate, row?.makingRate)
    );
  }, 0);

  useEffect(() => {
    items.slice(0, rowCount).forEach((row, index) => {
      const nextTotal = calcRowTotal(
        row?.itemQuantity,
        row?.itemRate,
        row?.makingRate
      ).toFixed(2);
      if (row?.itemTotal !== nextTotal) {
        form.setValue(`item.${index}.itemTotal`, nextTotal, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });

    const nextTotalRate = (
      itemGrandTotal +
      (Number(wt) || 0) * (Number(wtRate) || 0) +
      (Number(polish) || 0)
    ).toFixed(2);

    if (form.getValues("totalRate") !== nextTotalRate) {
      form.setValue("totalRate", nextTotalRate, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [calcKey, itemGrandTotal, wt, wtRate, polish, form, items, rowCount]);

  const totalRate = (
    itemGrandTotal +
    (Number(wt) || 0) * (Number(wtRate) || 0) +
    (Number(polish) || 0)
  ).toFixed(2);

  return (
    <div className="mt-1 grid gap-3 sm:grid-cols-2">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-[#F7F5F3]/90 px-4 py-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Item Grand Total
        </span>
        <span className="text-sm font-semibold tabular-nums text-primary">
          {itemGrandTotal.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-[#F7F5F3]/90 px-4 py-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Total Rate
        </span>
        <span className="text-sm font-semibold tabular-nums text-primary">
          {totalRate}
        </span>
      </div>
    </div>
  );
};

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

  const items = useWatch({ control: form.control, name: "item" });
  const itemType = useWatch({ control: form.control, name: "itemType" });
  const isPartyItem = itemType === "0";

  useEffect(() => {
    if (!isPartyItem || !showDesignDialog) return;
    (items ?? []).forEach((row, index) => {
      if (row?.itemRate !== "0.00") {
        form.setValue(`item.${index}.itemRate`, "0.00", {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });
  }, [isPartyItem, items, form, showDesignDialog]);

  const childRows = Array.isArray(designFormTableData)
    ? []
    : designFormTableData?.childrow;
  const rowCount = childRows?.length ?? 0;

  return (
    <FormModal
      isOpen={showDesignDialog}
      onOpenChange={setShowDesignDialog}
      size="3xl"
    >
      <Form {...form}>
        <form className="flex w-full flex-col" autoComplete="off">
          <FormModalHeader
            title="Add Design"
            description="Review design details and add it to the print."
            onClose={() => {
              setShowDesignDialog(false);
              form.setValue("designId", "");
              form.setValue("item", []);
              form.clearErrors("item");
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
                  type="text"
                  inputMode="decimal"
                  onInput={(e) => {
                    const input = e.currentTarget;
                    const next = sanitizeDecimalInput(input.value);
                    input.value = next;
                    form.setValue("wtRate", next, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />

                <InputField
                  control={form.control}
                  name="polish"
                  label="Polish"
                  type="text"
                  inputMode="decimal"
                  onInput={(e) => {
                    const input = e.currentTarget;
                    const next = sanitizeDecimalInput(input.value);
                    input.value = next;
                    form.setValue("polish", next, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
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
                      {childRows?.map((data, index) => (
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
                                  `item.${index}.itemRate` as Path<SamplePrintFormData>,
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
                                  `item.${index}.makingRate` as Path<SamplePrintFormData>,
                                  next,
                                  { shouldValidate: true, shouldDirty: true },
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <RowTotalCell form={form} index={index} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {rowCount > 0 ? (
                  <ItemTotalsSync form={form} rowCount={rowCount} />
                ) : null}
              </div>
          </FormModalBody>
          <FormModalFooter
            onCancel={() => {
              setShowDesignDialog(false);
              form.setValue("designId", "");
              form.setValue("item", []);
              form.clearErrors("item");
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
