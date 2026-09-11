"use client";

import { tableClassNames } from "@/lib/uiStyles";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
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
import { EmployeeTableData } from "@/types/master/EmployeeTypes";
import { WorkProcessTableData } from "@/types/master/WorkProcessTypes";
import { getOrderStatusChipProps } from "@/lib/orderStatusChip";
import { cn } from "@/lib/utils";
import { formatTwoDecimals } from "@/utils/formatDecimal";
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
import { CheckCircle2, Workflow } from "lucide-react";
import { format } from "date-fns";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";

interface EmployeeState {
  employeeData: EmployeeTableData[];
}

interface WorkProcessState {
  workProcessData: WorkProcessTableData[];
}

interface OrderBookingState {
  orderBookingData: OrderProcessTableData[];
}

interface RootState {
  employee: EmployeeState;
  workProcess: WorkProcessState;
  orderBooking: OrderBookingState;
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
            {formatTwoDecimals(details.totalOrder)}
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

const DesignCard: FC<{ design: OrderProcessDesignRow }> = ({ design }) => {
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
              {formatTwoDecimals(metric.value)}
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
                      {formatTwoDecimals(item.Item_Qnty)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm text-foreground">
                      {formatTwoDecimals(item.Item_Rate)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm text-foreground">
                      {formatTwoDecimals(item.Making_Rate)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm text-foreground">
                      {formatTwoDecimals(item.Item_Tot)}
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
  handleSearchEmployee,
  handleScrollEmployee,
  employeeInput,
  setEmployeeInput,
  getEmployeeLoading,
  getWorkProcessLoading,
}) => {
  const employeeData: EmployeeTableData[] = useSelector(
    (state: RootState) => state?.employee?.employeeData
  );

  const workProcessData: WorkProcessTableData[] = useSelector(
    (state: RootState) => state?.workProcess?.workProcessData
  );

  const orderBookingData: OrderProcessTableData[] =
    useSelector((state: RootState) => state?.orderBooking?.orderBookingData) ??
    [];

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
                  <div onFocus={handleStopPropagation}>
                    <DatePickerField
                      control={form.control}
                      name="startDate"
                      label="Work start date"
                      startYear={2000}
                      endYear={2050}
                    />
                  </div>

                  <SearchDropdownField
                    label="Employee"
                    name="employeeId"
                    control={form.control}
                    options={employeeData || []}
                    optionLabelKey="Emp_Name"
                    handleSearch={handleSearchEmployee}
                    loadMore={handleScrollEmployee}
                    input={employeeInput}
                    setInput={setEmployeeInput}
                    loading={getEmployeeLoading}
                  />

                  <DropdownField
                    label="Work Details"
                    name="workDetails"
                    control={form.control}
                    options={workProcessData || []}
                    optionLabelKey="Process_Name"
                    loading={getWorkProcessLoading}
                  />
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
                    classNames={tableClassNames}
                  >
                    <TableHeader>
                      <TableColumn>Work Details</TableColumn>
                      <TableColumn>Work Start</TableColumn>
                      <TableColumn>Work End</TableColumn>
                      <TableColumn>Work Under</TableColumn>
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
                          <TableCell>{data.Work_Under}</TableCell>
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
