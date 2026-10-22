"use client";

import { tableClassNames } from "@/lib/uiStyles";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSalesVoucher } from "@/container/inventoryVoucher/salesVoucher/Hooks";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";
import { SalesVoucherTableData } from "@/types/inventoryVoucher/SalesVoucherTypes";
import { BankAccountTableData } from "@/types/master/BankAccountTypes";
import getCookieData from "@/utils/getCookieData";
import { groupStoneItemsBySize } from "@/utils/groupStoneItems";
import {
  Image,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import InvoiceModal from "./InvoiceModal";
import { OrderBookingSuccessModal } from "@/components/inventoryVoucher/orderBooking/OrderBookingSuccessModal";
import { PageHeader, PageShell } from "@/components/ui/page-shell";
import { FileSpreadsheet } from "lucide-react";

interface SalesVoucherState {
  salesVoucherProcessData: SalesVoucherTableData[];
  gstAmount: string;
  gstChoice: string;
}

interface RootState {
  salesVoucher: SalesVoucherState;
  bankAccount: BankAccountState;
}

interface BankAccountState {
  bankAccountData: BankAccountTableData[];
}

const sectionCardClassName =
  "w-full overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm";
const sectionTitleClassName =
  "px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const detailLabelClassName =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const detailValueClassName = "mt-1 text-sm font-semibold text-foreground";

const SalesVoucherProcess = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    addSalesVoucherLoading,
    form,
    totalOrderAmount,
    setTotalOrderAmount,
    value,
    setValue,
    handleSubmit,
    showInvoiceDialog,
    setShowInvoiceDialog,
    showSuccessDialog,
    setShowSuccessDialog,
    successMessage,
    successInvoiceNos,
    handleCloseSuccessDialog,
  } = useSalesVoucher();

  const { getBankAccountApiCall } = useBankAccount();

  const router = useRouter();

  const salesVoucherProcessData: SalesVoucherTableData[] = useSelector(
    (state: RootState) => state?.salesVoucher?.salesVoucherProcessData
  );

  const gstAmount: string = useSelector(
    (state: RootState) => state?.salesVoucher?.gstAmount
  );

  const gstChoice: string = useSelector(
    (state: RootState) => state?.salesVoucher?.gstChoice
  );

  const bankAccountData: BankAccountTableData[] = useSelector(
    (state: RootState) => state?.bankAccount?.bankAccountData
  );

  useEffect(() => {
    if (!(salesVoucherProcessData.length > 0)) {
      if (!showSuccessDialog) {
        router.push(`/inventoryVoucher/salesVoucher`);
      }
    } else {
      const totalAmount = salesVoucherProcessData
        .reduce((sum, item) => {
          // Ensure the 'Total_Order' is a valid number before adding
          const itemTotal = Number(item.Total_Order) || 0;
          return sum + itemTotal;
        }, 0)
        ?.toFixed(2);

      setTotalOrderAmount(parseFloat(totalAmount)); // Convert the string back to a number
      form.setValue("partyName", salesVoucherProcessData[0]?.Party_Name || "");
    }
  }, [salesVoucherProcessData, showSuccessDialog]);

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  const designGroups = salesVoucherProcessData.flatMap((data) =>
    (data.DesignRow ?? []).map((design, designIndex) => ({
      key: `${data.Id}-${design.Design_Id}-${designIndex}`,
      orderNo: data.Order_No,
      design,
      rows: [
        {
          description: "WT",
          quantity: design.Wt,
          rate: design.Wt_Rate,
          makingRate: "",
          total: design.Tot_Wt,
        },
        {
          description: "Polish",
          quantity: design.Order_Qnty,
          rate: design.Polish,
          makingRate: "",
          total: design.Tot_Polish,
        },
        ...groupStoneItemsBySize(
          design.ItemRow ?? [],
          (item) => item.Item_Name,
        ).map((item) => ({
          description: item.Item_Name,
          quantity: item.Item_Qnty,
          rate: item.Item_Rate,
          makingRate: item.Making_Rate ?? "",
          total: item.Item_Tot,
        })),
      ],
    })),
  );

  const tempData = designGroups.flatMap((group) => group.rows);

  return (
    <PageShell>
      <PageHeader
        icon={FileSpreadsheet}
        title="Invoice"
        description="Review selected orders and complete the sales invoice."
      />
      <Form {...form}>
        <form
          className="flex w-full flex-col justify-start gap-4"
          autoComplete="off"
        >
        <div className={sectionCardClassName}>
          <div className="border-b border-black/[0.05] bg-[#F7F5F3]">
            <p className={sectionTitleClassName}>Party details</p>
          </div>
          <div className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3">
            <InputField
              control={form.control}
              name="partyName"
              label="Party Name"
              disabled
            />
          </div>
        </div>

        <div className={sectionCardClassName}>
          <div className="border-b border-black/[0.05] bg-[#F7F5F3]">
            <p className={sectionTitleClassName}>Selected orders</p>
          </div>
          <div className="px-4 py-3">
            <Table
              removeWrapper
              aria-label="Selected sales orders"
              classNames={tableClassNames}
            >
              <TableHeader>
                <TableColumn>Serial No.</TableColumn>
                <TableColumn align="center">Order Date</TableColumn>
                <TableColumn align="center">Order No.</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No data found."}>
                {salesVoucherProcessData.length > 0 ? (
                  salesVoucherProcessData.map((data, index) => (
                    <TableRow key={`${index}`}>
                      <TableCell>{index + 1 || ""}</TableCell>
                      <TableCell>
                        {data.Order_Date
                          ? format(data.Order_Date, "dd-MM-yyyy")
                          : ""}
                      </TableCell>
                      <TableCell>{data.Order_No || ""}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className={sectionCardClassName}>
          <div className="border-b border-black/[0.05] bg-[#F7F5F3]">
            <p className={sectionTitleClassName}>Invoice breakdown</p>
          </div>
          <ScrollArea className="w-full max-w-[400px] px-4 py-3 sm:max-w-full">
            {designGroups.length > 0 ? (
              <div className="mb-3 space-y-3">
                {designGroups.map((group, groupIndex) => (
                  <div
                    key={group.key}
                    className="w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white"
                  >
                    <div className="flex flex-wrap items-center gap-4 border-b border-black/[0.05] bg-[#F7F5F3]/60 px-4 py-3">
                      {group.design.Image ? (
                        <Image
                          src={group.design.Image}
                          alt={group.design.Design_Name || "Design"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F7F5F3] text-xs text-muted-foreground">
                          —
                        </div>
                      )}
                      <div className="min-w-0 flex-1 text-left">
                        <p className={detailLabelClassName}>
                          Design {groupIndex + 1}
                        </p>
                        <p className="truncate text-sm font-semibold text-foreground">
                          {group.design.Design_Name || "—"} -{" "}
                          {group.design.Design_No || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={detailLabelClassName}>Order No.</p>
                        <p className="text-sm font-semibold text-foreground">
                          {group.orderNo || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={detailLabelClassName}>Quantity</p>
                        <p className="text-sm font-semibold text-foreground">
                          {group.design.Order_Qnty || "—"}
                        </p>
                      </div>
                    </div>
                    <Table
                      removeWrapper
                      aria-label={`Invoice breakdown for ${group.design.Design_Name || "design"}`}
                      classNames={tableClassNames}
                    >
                      <TableHeader>
                        <TableColumn>Serial No.</TableColumn>
                        <TableColumn align="center">Description</TableColumn>
                        <TableColumn align="center">Quantity</TableColumn>
                        <TableColumn align="center">Rate</TableColumn>
                        <TableColumn align="center">Making Rate</TableColumn>
                        <TableColumn align="center">Total</TableColumn>
                      </TableHeader>
                      <TableBody emptyContent={"No data found."}>
                        {group.rows.map((data, index) => (
                          <TableRow key={`${group.key}-${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{data.description}</TableCell>
                            <TableCell>{data.quantity}</TableCell>
                            <TableCell>{data.rate}</TableCell>
                            <TableCell>{data.makingRate}</TableCell>
                            <TableCell>{data.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : null}
            <Table
              removeWrapper
              hideHeader
              aria-label="Invoice totals"
              classNames={tableClassNames}
            >
              <TableHeader>
                <TableColumn>Serial No.</TableColumn>
                <TableColumn align="center">Description</TableColumn>
                <TableColumn align="center">Quantity</TableColumn>
                <TableColumn align="center">Rate</TableColumn>
                <TableColumn align="center">Making Rate</TableColumn>
                <TableColumn align="center">Total</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No data found."}>
                {[
                ...(tempData.length > 0
                  ? [
                      <TableRow key={`${tempData.length}-amount`}>
                        <TableCell colSpan={5} className="text-center font-medium">
                          {gstChoice === "Y" ? "Taxable " : "Total "} Amount
                        </TableCell>
                        <TableCell className="font-medium">{totalOrderAmount}</TableCell>
                      </TableRow>,
                    ]
                  : []),
                ...(tempData.length > 0 && gstChoice === "Y"
                  ? [
                      <TableRow key={`${tempData.length}-cgst`}>
                        <TableCell colSpan={5} className="text-center font-medium">
                          CGST
                        </TableCell>
                        <TableCell className="font-medium">
                          {(
                            totalOrderAmount *
                            (Number(gstAmount) / 200)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>,
                      <TableRow key={`${tempData.length}-sgst`}>
                        <TableCell colSpan={5} className="text-center font-medium">
                          SGST
                        </TableCell>
                        <TableCell className="font-medium">
                          {(
                            totalOrderAmount *
                            (Number(gstAmount) / 200)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>,
                    ]
                  : []),
                ...(tempData.length > 0
                  ? [
                      <TableRow key={`${tempData.length}-round`}>
                        <TableCell colSpan={5} className="text-center font-medium">
                          Round Off
                        </TableCell>
                        <TableCell className="font-medium">
                          {Number(
                            Math.abs(
                              (totalOrderAmount +
                                totalOrderAmount *
                                  (gstChoice === "Y"
                                    ? Number(gstAmount) / 100
                                    : 0)) %
                                1
                            ).toFixed(2)
                          ) > 0.5
                            ? (
                                1 -
                                Math.abs(
                                  (totalOrderAmount +
                                    totalOrderAmount *
                                      (gstChoice === "Y"
                                        ? Number(gstAmount) / 100
                                        : 0)) %
                                    1
                                )
                              ).toFixed(2)
                            : -Math.abs(
                                (totalOrderAmount +
                                  totalOrderAmount *
                                    (gstChoice === "Y"
                                      ? Number(gstAmount) / 100
                                      : 0)) %
                                  1
                              ).toFixed(2)}
                        </TableCell>
                      </TableRow>,
                      <TableRow key={`${tempData.length}-discount`}>
                        <TableCell colSpan={5} className="text-center font-medium">
                          Discount
                        </TableCell>
                        <TableCell>
                          <Input
                            variant="flat"
                            radius="sm"
                            type="number"
                            max={
                              totalOrderAmount +
                              totalOrderAmount *
                                (gstChoice === "Y"
                                  ? Number(gstAmount) / 100
                                  : 0)
                            }
                            placeholder="Enter amount"
                            value={value}
                            onValueChange={setValue}
                          />
                        </TableCell>
                      </TableRow>,
                      <TableRow key={`${tempData.length}-grand`}>
                        <TableCell
                          colSpan={5}
                          className="text-center text-lg font-semibold text-primary"
                        >
                          Grand Total
                        </TableCell>
                        <TableCell className="text-base font-semibold text-primary">
                          {(
                            totalOrderAmount +
                            totalOrderAmount *
                              (gstChoice === "Y"
                                ? Number(gstAmount) / 100
                                : 0) -
                            Number(value)
                          )?.toFixed(2)}
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

        <div className={sectionCardClassName}>
          <div className="border-b border-black/[0.05] bg-[#F7F5F3]">
            <p className={sectionTitleClassName}>Payment details</p>
          </div>
          <div className="flex flex-col gap-4 px-4 py-3">
            <div className="w-full grid xs:grid-cols-2 lg:grid-cols-3 items-start gap-x-5 gap-y-3">
              <div className="min-w-0">
                <p className={detailLabelClassName}>Transaction mode</p>
                <div className="mt-1">
                  <RadioField
                    control={form.control}
                    name="transMode"
                    label="Trans Mode"
                    className="border-0 bg-transparent px-0 py-0 rounded-none"
                    options={[
                      {
                        value: "C",
                        label: "Cash",
                      },
                      {
                        value: "B",
                        label: "Bank",
                      },
                      {
                        value: "Cr",
                        label: "Credit",
                      },
                    ]}
                  />
                </div>
              </div>

              {form.getValues("transMode") === "B" && (
                <DropdownField
                  control={form.control}
                  name="bankId"
                  label="Bank"
                  options={bankAccountData || []}
                  optionLabelKey="Bank_Name"
                />
              )}
            </div>

            <div className="flex w-full justify-end">
              <FormSubmitButton
                type="button"
                size="md"
                radius="md"
                className="h-9 w-auto min-w-[148px] bg-primary px-4 text-sm font-medium text-white"
                isLoading={addSalesVoucherLoading}
                isDisabled={addSalesVoucherLoading}
                onPress={handleSubmit}
              >
                Add
              </FormSubmitButton>
            </div>
          </div>
        </div>

        <InvoiceModal
          showInvoiceDialog={showInvoiceDialog}
          setShowInvoiceDialog={setShowInvoiceDialog}
        />

        <OrderBookingSuccessModal
          isOpen={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          message={successMessage}
          orderIds={successInvoiceNos}
          onClose={handleCloseSuccessDialog}
          idLabel={
            successInvoiceNos.length > 1 ? "Invoice Nos." : "Invoice No."
          }
          fallbackMessage="Invoice processed successfully"
        />
      </form>
    </Form>
    </PageShell>
  );
};
export default SalesVoucherProcess;
