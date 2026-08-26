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
        <div className="w-full grid xs:grid-cols-2 lg:grid-cols-3  items-start gap-x-5 gap-y-3">
          <InputField
            control={form.control}
            name="partyName"
            label="Party Name"
            disabled
          />
        </div>

        <div className="w-full">
          <Table
            removeWrapper
            aria-label="Example static collection table"
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

        <ScrollArea className="w-full max-w-[400px] sm:max-w-full mx-auto mt-5">
          <Table
            removeWrapper
            aria-label="Example static collection table"
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
              <>
                {tempData.length > 0 &&
                  tempData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.description}</TableCell>
                      <TableCell>{data.quantity}</TableCell>
                      <TableCell>{data.rate}</TableCell>
                      <TableCell>{data.total}</TableCell>
                    </TableRow>
                  ))}
                {tempData.length > 0 && (
                  <TableRow key={`${tempData.length}`}>
                    <TableCell colSpan={4} className="text-center">
                      {gstChoice === "Y" ? "Taxable " : "Total "} Amount
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell>{totalOrderAmount}</TableCell>
                  </TableRow>
                )}

                {tempData.length > 0 && gstChoice === "Y" && (
                  <TableRow key={`${tempData.length + 1}`}>
                    <TableCell colSpan={4} className="text-center">
                      CGST
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell>
                      {(
                        totalOrderAmount *
                        (gstChoice === "Y" ? Number(gstAmount) / 200 : 0)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {tempData.length > 0 && gstChoice === "Y" && (
                  <TableRow key={`${tempData.length + 2}`}>
                    <TableCell colSpan={4} className="text-center">
                      SGST
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell>
                      {(
                        totalOrderAmount *
                        (gstChoice === "Y" ? Number(gstAmount) / 200 : 0)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {tempData.length > 0 && (
                  <TableRow key={`${tempData.length + 3}`}>
                    <TableCell colSpan={4} className="text-center">
                      Round Off
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell>
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
                  </TableRow>
                )}
                {tempData.length > 0 && (
                  <TableRow key={`${tempData.length + 4}`}>
                    <TableCell colSpan={4} className="text-center">
                      Discount
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell>
                      <Input
                        variant="flat"
                        radius="sm"
                        type="number"
                        max={
                          totalOrderAmount +
                          totalOrderAmount *
                            (gstChoice === "Y" ? Number(gstAmount) / 100 : 0)
                        }
                        placeholder="Enter amount"
                        value={value}
                        onValueChange={setValue}
                      />
                    </TableCell>
                  </TableRow>
                )}

                {tempData.length > 0 && (
                  <TableRow key={`${tempData.length + 5}`}>
                    <TableCell
                      colSpan={4}
                      className="text-center text-lg font-medium"
                    >
                      Grand Total
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell>
                      {(
                        totalOrderAmount +
                        totalOrderAmount *
                          (gstChoice === "Y" ? Number(gstAmount) / 100 : 0) -
                        Number(value)
                      )?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="w-full grid xs:grid-cols-2 lg:grid-cols-3  items-start gap-x-5 gap-y-3 my-3">
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
