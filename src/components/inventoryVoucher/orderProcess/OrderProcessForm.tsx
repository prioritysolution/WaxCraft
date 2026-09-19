"use client";

import { tableClassNames } from "@/lib/uiStyles";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import CheckboxField from "@/common/formFields/CheckboxField";
import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import {
  OrderProcessDesignRow,
  OrderProcessFormProps,
  OrderProcessTableData,
} from "@/types/inventoryVoucher/OrderProcessTypes";
import { WorkProcessTableData } from "@/types/master/WorkProcessTypes";
import { EmployeeTableData } from "@/types/master/EmployeeTypes";
import {
  getOrderStatusChipProps,
} from "@/lib/orderStatusChip";
import { cn } from "@/lib/utils";
import { formatCompactNumber, toTwoDecimalString } from "@/utils/formatDecimal";
import {
  Button,
  Chip,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { CheckCircle2, Plus, Trash2, Workflow } from "lucide-react";
import { format } from "date-fns";
import { FC, useEffect, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";

interface WorkProcessState {
  workProcessData: WorkProcessTableData[];
}

interface OrderBookingState {
  orderBookingData: OrderProcessTableData[];
}

interface EmployeeState {
  employeeData: EmployeeTableData[];
}

interface RootState {
  workProcess: WorkProcessState;
  orderBooking: OrderBookingState;
  employee: EmployeeState;
}

type OrderDetailsView = {
  orderDate: string;
  orderNo: string;
  partyName: string;
  totalOrder: string;
  orderStatus: string;
};

const detailLabelClassName =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const detailValueClassName =
  "mt-1 break-words text-sm font-semibold tabular-nums text-foreground";

const isDesignComplete = (design: OrderProcessDesignRow) =>
  Number(design.Is_Complete) === 1;

const pickFirstValue = (
  source: Record<string, unknown> | null | undefined,
  keys: string[],
): string => {
  if (!source) return "";
  for (const key of keys) {
    const value = source[key];
    if (value == null || value === "") continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return "";
};

const formatOrderDate = (value?: string | Date | null) => {
  if (!value) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) return trimmed;
    const isoDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) return `${isoDate[3]}-${isoDate[2]}-${isoDate[1]}`;
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return format(parsed, "dd-MM-yyyy");
    return trimmed;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return format(value, "dd-MM-yyyy");
  }
  return "";
};

const getOrderDetailsFromRow = (
  order: OrderProcessTableData | null | undefined,
): OrderDetailsView | null => {
  if (!order) return null;
  const record = order as unknown as Record<string, unknown>;
  return {
    orderDate: formatOrderDate(
      pickFirstValue(record, ["Order_Date", "order_date", "ord_date"]),
    ),
    orderNo: pickFirstValue(record, ["Order_No", "order_no"]),
    partyName: pickFirstValue(record, ["Party_Name", "party_name"]),
    totalOrder: pickFirstValue(record, ["Total_Order", "total_order"]),
    orderStatus: pickFirstValue(record, ["Order_Status", "order_status"]),
  };
};

const OrderDetailsBanner: FC<{ details: OrderDetailsView }> = ({ details }) => {
  const statusChip = getOrderStatusChipProps(details.orderStatus);

  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm">
      <div className="border-b border-black/[0.05] bg-[#F7F5F3] px-4 py-2.5">
        <p className={detailLabelClassName}>Order details</p>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="min-w-0">
          <p className={detailLabelClassName}>Order Date</p>
          <p className={detailValueClassName}>{details.orderDate || "—"}</p>
        </div>
        <div className="min-w-0">
          <p className={detailLabelClassName}>Order No.</p>
          <p className={detailValueClassName}>{details.orderNo || "—"}</p>
        </div>
        <div className="min-w-0">
          <p className={detailLabelClassName}>Party Name</p>
          <p className={detailValueClassName}>{details.partyName || "—"}</p>
        </div>
        <div className="min-w-0">
          <p className={detailLabelClassName}>Total Order</p>
          <p className={detailValueClassName}>
            {formatCompactNumber(details.totalOrder)}
          </p>
        </div>
        <div className="min-w-0">
          <p className={detailLabelClassName}>Order Status</p>
          <div className="mt-1">
            <Chip
              className={cn("capitalize", statusChip.className)}
              color={statusChip.color}
              size="sm"
              variant="flat"
            >
              {details.orderStatus || "—"}
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesignCard: FC<{
  design: OrderProcessDesignRow;
}> = ({ design }) => {
  const items = design.ItemRow ?? [];
  const metrics = [
    { label: "Order Qty", value: design.Order_Qnty },
    { label: "Design Rate", value: design.Design_Rate },
    { label: "WT", value: design.Wt },
    { label: "WT Rate", value: design.Wt_Rate },
    { label: "Total Wt", value: design.Tot_Wt },
    { label: "Polish", value: design.Polish },
    { label: "Total Polish", value: design.Tot_Polish },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white">
      <div className="flex flex-col gap-3 border-b border-black/[0.05] bg-[#F7F5F3]/60 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        {design.Image ? (
          <Image
            src={design.Image}
            alt={design.Design_Name || "Design"}
            width={72}
            height={72}
            className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg bg-[#F7F5F3] text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div className="min-w-0 flex-1 text-left">
          <p className={detailLabelClassName}>Design</p>
          <p className="truncate text-sm font-semibold text-foreground">
            {design.Design_Name || "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            No. {design.Design_No || "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {metrics.map((metric) => (
          <div key={metric.label} className="min-w-0">
            <p className={detailLabelClassName}>{metric.label}</p>
            <p className={detailValueClassName}>
              {formatCompactNumber(metric.value)}
            </p>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="border-t border-black/[0.05]">
          <div className="bg-[#F7F5F3] px-4 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Item details
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-center">
              <thead>
                <tr className="bg-[#F7F5F3]/50">
                  <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Item Name
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Quantity
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Item Rate
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Making Rate
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={`${design.Design_Id}-${item.Item_Id}-${index}`}>
                    <td className="px-3 py-2.5 text-left text-sm text-foreground">
                      {item.Item_Name || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm text-foreground">
                      {formatCompactNumber(item.Item_Qnty)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm text-foreground">
                      {formatCompactNumber(item.Item_Rate)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm text-foreground">
                      {formatCompactNumber(item.Making_Rate)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm text-foreground">
                      {formatCompactNumber(item.Item_Tot)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderProcessForm: FC<OrderProcessFormProps> = ({
  addOrderProcessLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  dialogType,
  handleFurtherProcess,
  showFormFields,
  processTableData,
  processDesignRows,
  selectedProcessOrder,
  handleFinalClose,
  processPostType,
  getWorkProcessLoading,
  getEmployeeLoading,
}) => {
  const workProcessData: WorkProcessTableData[] = useSelector(
    (state: RootState) => state?.workProcess?.workProcessData
  );

  const employeeData: EmployeeTableData[] = useSelector(
    (state: RootState) => state?.employee?.employeeData
  );

  const orderBookingData: OrderProcessTableData[] =
    useSelector((state: RootState) => state?.orderBooking?.orderBookingData) ??
    [];

  const {
    fields: employeeWorkFields,
    append: appendEmployeeWork,
    remove: removeEmployeeWork,
  } = useFieldArray({
    control: form.control,
    name: "employeeWorkRows",
  });

  const handleStopPropagation = (event: React.FocusEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const isBusy = addOrderProcessLoading;

  const [
    formOrderDate,
    formOrderNo,
    formPartyName,
    formTotalOrder,
    formOrderStatus,
  ] = form.watch([
    "orderDate",
    "orderNo",
    "partyName",
    "totalOrder",
    "orderStatus",
  ]);

  const orderDetails = useMemo(() => {
    const orderId =
      selectedProcessOrder?.Id ??
      (form.getValues("orderId") ? Number(form.getValues("orderId")) : null);
    const fromStore =
      orderBookingData.find((row) => Number(row?.Id) === Number(orderId)) ||
      null;
    const fromRow =
      getOrderDetailsFromRow(selectedProcessOrder) ||
      getOrderDetailsFromRow(fromStore);

    return {
      orderDate: fromRow?.orderDate || formOrderDate || "",
      orderNo: fromRow?.orderNo || formOrderNo || "",
      partyName: fromRow?.partyName || formPartyName || "",
      totalOrder: fromRow?.totalOrder || formTotalOrder || "",
      orderStatus: fromRow?.orderStatus || formOrderStatus || "",
    };
  }, [
    selectedProcessOrder,
    orderBookingData,
    form,
    formOrderDate,
    formOrderNo,
    formPartyName,
    formTotalOrder,
    formOrderStatus,
  ]);

  const designs: OrderProcessDesignRow[] = useMemo(() => {
    if (
      Array.isArray(selectedProcessOrder?.DesignRow) &&
      selectedProcessOrder.DesignRow.length > 0
    ) {
      return selectedProcessOrder.DesignRow;
    }
    return Array.isArray(processDesignRows) ? processDesignRows : [];
  }, [selectedProcessOrder, processDesignRows]);

  const selectedDesignId = form.watch("designId");
  const isFinalStep = form.watch("isFinalStep");
  const employeeWorkRows = form.watch("employeeWorkRows") || [];

  const selectedDesign = useMemo(
    () =>
      designs.find(
        (design) => String(design.Design_Id) === String(selectedDesignId),
      ) || null,
    [designs, selectedDesignId],
  );

  const orderQtyTotal = Number(selectedDesign?.Order_Qnty) || 0;
  const allocatedQty = employeeWorkRows.reduce(
    (sum, row) => sum + (Number(row?.quantity) || 0),
    0,
  );
  const isAllocationOver =
    orderQtyTotal > 0 && allocatedQty > orderQtyTotal + 0.0001;
  const allocationError =
    (typeof form.formState.errors.employeeWorkRows?.message === "string"
      ? form.formState.errors.employeeWorkRows.message
      : "") ||
    (isAllocationOver
      ? "Allocated quantity cannot exceed order qty"
      : "");

  useEffect(() => {
    if (!employeeWorkFields.length) return;
    void form.trigger("employeeWorkRows");
  }, [allocatedQty, orderQtyTotal, employeeWorkFields.length, form]);

  useEffect(() => {
    if (!selectedDesignId) return;

    const selectedDesign = designs.find(
      (design) => String(design.Design_Id) === String(selectedDesignId),
    );

    if (!selectedDesign || isDesignComplete(selectedDesign)) {
      const firstAvailableDesign = designs.find(
        (design) => !isDesignComplete(design),
      );
      form.setValue(
        "designId",
        firstAvailableDesign ? String(firstAvailableDesign.Design_Id) : "",
        { shouldValidate: true },
      );
      return;
    }

    form.setValue("orderQuantity", String(selectedDesign.Order_Qnty ?? ""), {
      shouldValidate: false,
    });
  }, [selectedDesignId, designs, form]);

  useEffect(() => {
    if (!isFinalStep) {
      form.setValue("finalWeight", "", { shouldValidate: false });
      return;
    }

    if (!selectedDesignId) return;

    const selectedDesign = designs.find(
      (design) => String(design.Design_Id) === String(selectedDesignId),
    );
    const designWt = toTwoDecimalString(selectedDesign?.Wt);

    if (designWt) {
      form.setValue("finalWeight", designWt, { shouldValidate: true });
    }
  }, [isFinalStep, selectedDesignId, designs, form]);

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="4xl"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={
              dialogType === "Process"
                ? "New Order Process"
                : "View Order Process"
            }
            description={
              dialogType === "Process"
                ? "Fill process details and continue the order."
                : "Review the order process details."
            }
            isEdit={dialogType !== "Process"}
            onClose={() => {
              setIsOpen(false);
            }}
            isBusy={isBusy}
          />
          <FormModalBody className="gap-y-5">
            <OrderDetailsBanner details={orderDetails} />
            {designs.length > 0 ? (
              <div className="space-y-3">
                <p className={detailLabelClassName}>
                  Designs ({designs.length})
                </p>
                {designs.map((design, index) => (
                  <DesignCard
                    key={`${design.Design_Id}-${index}`}
                    design={design}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-black/[0.08] px-4 py-6 text-center text-sm text-muted-foreground">
                No design details found.
              </div>
            )}

            {dialogType === "Process" &&
              showFormFields &&
              processPostType === "FurtherProcess" && (
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                  <DropdownField
                    label="Work Details"
                    name="workDetails"
                    control={form.control}
                    options={workProcessData || []}
                    optionLabelKey="Process_Name"
                    loading={getWorkProcessLoading}
                  />

                  <div onFocus={handleStopPropagation}>
                    <DatePickerField
                      control={form.control}
                      name="startDate"
                      label="Work start date"
                      startYear={2000}
                      endYear={2050}
                    />
                  </div>

                  <div onFocus={handleStopPropagation}>
                    <DatePickerField
                      control={form.control}
                      name="endDate"
                      label="Work end date"
                      startYear={2000}
                      endYear={2050}
                    />
                  </div>

                  <CheckboxField
                    control={form.control}
                    name="isFinalStep"
                    label="Is Final step"
                    description="Mark as the last process step for the selected design."
                    color="primary"
                  />

                  {isFinalStep ? (
                    <InputField
                      control={form.control}
                      name="finalWeight"
                      label="Final Weight"
                      type="number"
                      required
                    />
                  ) : null}

                  <div className="sm:col-span-2 overflow-hidden rounded-xl border border-black/[0.08] bg-white">
                    <div className="flex flex-col gap-2 border-b border-black/[0.05] bg-[#F7F5F3]/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className={detailLabelClassName}>
                          Employee-wise work
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Split large work across employees for this process
                          step.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="flat"
                        color="primary"
                        radius="md"
                        startContent={<Plus className="h-3.5 w-3.5" />}
                        className="h-8 w-fit shrink-0"
                        onPress={() =>
                          appendEmployeeWork({ employeeId: "", quantity: "" })
                        }
                      >
                        Add employee
                      </Button>
                    </div>

                    <div className="space-y-3 px-4 py-3">
                      {employeeWorkFields.length > 0 ? (
                        employeeWorkFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[1fr_140px_40px]"
                          >
                            <DropdownField
                              label="Employee"
                              name={`employeeWorkRows.${index}.employeeId`}
                              control={form.control}
                              options={employeeData || []}
                              optionLabelKey="Emp_Name"
                              loading={getEmployeeLoading}
                            />
                            <InputField
                              control={form.control}
                              name={`employeeWorkRows.${index}.quantity`}
                              label="Quantity"
                              type="number"
                            />
                            {index > 0 ? (
                              <Button
                                type="button"
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                radius="md"
                                className="mt-6 h-9 w-9"
                                aria-label="Remove employee row"
                                onPress={() => removeEmployeeWork(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : (
                              <div className="mt-6 hidden h-9 w-9 sm:block" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No employee split added. Save will keep the process
                          without employee assignment, or add employees above.
                        </p>
                      )}

                      {employeeWorkFields.length > 0 ? (
                        <div className="space-y-1.5 border-t border-black/[0.05] pt-3">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>
                              Order qty:{" "}
                              <span className="font-semibold text-foreground">
                                {formatCompactNumber(orderQtyTotal || "")}
                              </span>
                            </span>
                            <span>
                              Allocated:{" "}
                              <span
                                className={cn(
                                  "font-semibold",
                                  isAllocationOver
                                    ? "text-danger"
                                    : "text-foreground",
                                )}
                              >
                                {formatCompactNumber(allocatedQty || "")}
                              </span>
                            </span>
                          </div>
                          {allocationError ? (
                            <p className="text-xs font-medium text-danger">
                              {allocationError}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

            {dialogType === "Process" &&
              showFormFields &&
              processPostType === "FinalClose" && (
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                  <div onFocus={handleStopPropagation}>
                    <DatePickerField
                      control={form.control}
                      name="closeDate"
                      label="Close date"
                      startYear={2000}
                      endYear={2050}
                    />
                  </div>
                </div>
              )}

            {processTableData.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                <div className="border-b border-black/[0.05] bg-[#F7F5F3]/60 px-4 py-3">
                  <p className={detailLabelClassName}>Work history</p>
                </div>
                <div className="overflow-x-auto">
                  <Table
                    removeWrapper
                    aria-label="Order process work history"
                    classNames={{
                      base: "max-w-full",
                      table: "min-w-full",
                      thead: "[&>tr]:rounded-none [&_th]:!rounded-none",
                      th: "h-11 !rounded-none bg-[#F7F5F3] text-center !text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground first:!rounded-none last:!rounded-none data-[hover=true]:bg-[#F7F5F3]",
                      td: tableClassNames.td,
                      tr: tableClassNames.tr,
                      emptyWrapper: tableClassNames.emptyWrapper,
                    }}
                  >
                    <TableHeader>
                      <TableColumn>Work Details</TableColumn>
                      <TableColumn>Work Start</TableColumn>
                      <TableColumn>Work End</TableColumn>
                      <TableColumn>Work Under</TableColumn>
                      <TableColumn>Work Qty</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {processTableData.map((data, i) => (
                        <TableRow key={`${data.Work_Details}-${i}`}>
                          <TableCell>{data.Work_Details}</TableCell>
                          <TableCell>
                            {format(data.Work_Start, "dd-MM-yyyy")}
                          </TableCell>
                          <TableCell>
                            {data.Work_End
                              ? format(data.Work_End, "dd-MM-yyyy")
                              : "Processing"}
                          </TableCell>
                          <TableCell>{data.Work_Under || "—"}</TableCell>
                          <TableCell>
                            {data.Work_Qty != null && data.Work_Qty !== ""
                              ? formatCompactNumber(data.Work_Qty)
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {dialogType === "Process" && !showFormFields && (
              <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                <Button
                  color="success"
                  variant="flat"
                  onPress={handleFurtherProcess}
                  size="lg"
                  radius="sm"
                  startContent={<Workflow className="h-4 w-4" />}
                  className="w-full bg-success/15 font-medium text-success-700"
                >
                  Further Process
                </Button>

                <Button
                  color="success"
                  variant="flat"
                  onPress={handleFinalClose}
                  size="lg"
                  radius="sm"
                  startContent={<CheckCircle2 className="h-4 w-4" />}
                  className="w-full bg-emerald-200/55 font-medium text-emerald-800"
                >
                  Final Close
                </Button>
              </div>
            )}
          </FormModalBody>
          <FormModalFooter
            isBusy={isBusy}
            onCancel={() => {
              setIsOpen(false);
            }}
            cancelLabel={dialogType === "Process" ? "Cancel" : "Close"}
            submitLabel="Save"
            showSubmit={dialogType === "Process" && showFormFields}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default OrderProcessForm;
