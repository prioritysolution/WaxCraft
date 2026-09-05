"use client";

import { tableClassNames } from "@/lib/uiStyles";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSalesVoucher } from "@/container/inventoryVoucher/salesVoucher/Hooks";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";
import { SalesVoucherTableData } from "@/types/inventoryVoucher/SalesVoucherTypes";
import { BankAccountTableData } from "@/types/master/BankAccountTypes";
import getCookieData from "@/utils/getCookieData";
import {
  Button,
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
      router.push(`/inventoryVoucher/salesVoucher`);
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
  }, [salesVoucherProcessData]);

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  const tempData = salesVoucherProcessData.flatMap((data) => [
    {
      description: `${data.DesignRow[0].Design_Name} - ${data.DesignRow[0].Design_Id}`,
      quantity: data.DesignRow[0].Order_Qnty,
      rate: "",
      total: "",
    },
    {
      description: "WT",
      quantity: data.DesignRow[0].Wt,
      rate: data.DesignRow[0].Wt_Rate,
      total: data.DesignRow[0].Tot_Wt,
    },
    {
      description: "Polish",
      quantity: data.DesignRow[0].Order_Qnty,
      rate: data.DesignRow[0].Polish,
      total: data.DesignRow[0].Tot_Polish,
    },
    ...data.DesignRow[0].ItemRow.map((item) => ({
      description: item.Item_Name,
      quantity: item.Item_Qnty,
      rate: item.Item_Rate,
      total: item.Item_Tot,
    })),
  ]);

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
            <Table
              removeWrapper
              aria-label="Invoice breakdown table"
              classNames={tableClassNames}
            >
              <TableHeader>
                <TableColumn>Serial No.</TableColumn>
                <TableColumn align="center">Description</TableColumn>
                <TableColumn align="center">Quantity</TableColumn>
                <TableColumn align="center">Rate</TableColumn>
                <TableColumn align="center">Total</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No data found."}>
                {[
                ...(tempData.length > 0
                  ? tempData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{data.description}</TableCell>
                        <TableCell>{data.quantity}</TableCell>
                        <TableCell>{data.rate}</TableCell>
                        <TableCell>{data.total}</TableCell>
                      </TableRow>
                    ))
                  : []),
                ...(tempData.length > 0
                  ? [
                      <TableRow key={`${tempData.length}-amount`}>
                        <TableCell colSpan={4} className="text-center font-medium">
                          {gstChoice === "Y" ? "Taxable " : "Total "} Amount
                        </TableCell>
                        <TableCell className="font-medium">{totalOrderAmount}</TableCell>
                      </TableRow>,
                    ]
                  : []),
                ...(tempData.length > 0 && gstChoice === "Y"
                  ? [
                      <TableRow key={`${tempData.length}-cgst`}>
                        <TableCell colSpan={4} className="text-center font-medium">
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
                        <TableCell colSpan={4} className="text-center font-medium">
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
                        <TableCell colSpan={4} className="text-center font-medium">
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
                        <TableCell colSpan={4} className="text-center font-medium">
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
                          colSpan={4}
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
              <Button
                color="primary"
                size="md"
                radius="md"
                className="h-9 w-auto min-w-[148px] bg-primary px-4 text-sm font-medium text-white"
                isLoading={addSalesVoucherLoading}
                isDisabled={addSalesVoucherLoading}
                onPress={handleSubmit}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <InvoiceModal
          showInvoiceDialog={showInvoiceDialog}
          setShowInvoiceDialog={setShowInvoiceDialog}
        />
      </form>
    </Form>
    </PageShell>
  );
};
export default SalesVoucherProcess;
