"use client";

import {
  DayBookProps,
  DayBookTableData,
} from "@/types/accountingReport/DayBookTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { CalendarDays } from "lucide-react";
import { FC } from "react";
import DayBookForm from "./DayBookForm";
import DayBookTable from "./DayBookTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";
import calculateTotal from "@/utils/calculateTotal";

interface DayBookState {
  dayBookData: DayBookTableData[];
}

interface RootState {
  dayBook: DayBookState;
}

const DayBook: FC<DayBookProps> = ({
  getDayBookLoading,
  form,
  handleSubmit,
  showPrintDialog,
  setShowPrintDialog,
  asOnDate,
}) => {
  const dayBookData: DayBookTableData[] = useSelector(
    (state: RootState) => state?.dayBook?.dayBookData
  );

  const totalReceiptCash =
    dayBookData[0]?.Receipt_Data.length > 0
      ? calculateTotal(dayBookData[0]?.Receipt_Data, "Cash_Amt")
      : 0;
  const totalReceiptTransfer =
    dayBookData[0]?.Receipt_Data.length > 0
      ? calculateTotal(dayBookData[0]?.Receipt_Data, "Trf_Amt")
      : 0;
  const totalReceiptTotal =
    dayBookData[0]?.Receipt_Data.length > 0
      ? calculateTotal(dayBookData[0]?.Receipt_Data, "Tot_Amt")
      : 0;

  const totalPaymentCash =
    dayBookData[0]?.Payment_Data.length > 0
      ? calculateTotal(dayBookData[0]?.Payment_Data, "Cash_Amt")
      : 0;
  const totalPaymentTransfer =
    dayBookData[0]?.Payment_Data.length > 0
      ? calculateTotal(dayBookData[0]?.Payment_Data, "Trf_Amt")
      : 0;
  const totalPaymentTotal =
    dayBookData[0]?.Payment_Data.length > 0
      ? calculateTotal(dayBookData[0]?.Payment_Data, "Tot_Amt")
      : 0;

  return (
        <PageShell>
      <PageHeader
        icon={CalendarDays}
        title="Day Book"
        description="See daily receipts and payments at a glance."
      />

      <FormCard>
        <DayBookForm
          getDayBookLoading={getDayBookLoading}
          form={form}
          handleSubmit={handleSubmit}
          dayBookData={dayBookData}
          setShowPrintDialog={setShowPrintDialog}
        />
      </FormCard>

      <DayBookTable
          dayBookData={dayBookData}
          totalReceiptCash={totalReceiptCash}
          totalReceiptTransfer={totalReceiptTransfer}
          totalReceiptTotal={totalReceiptTotal}
          totalPaymentCash={totalPaymentCash}
          totalPaymentTransfer={totalPaymentTransfer}
          totalPaymentTotal={totalPaymentTotal}
        />

      <PreviewModal
        dayBookData={dayBookData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        asOnDate={asOnDate}
        totalReceiptCash={totalReceiptCash}
        totalReceiptTransfer={totalReceiptTransfer}
        totalReceiptTotal={totalReceiptTotal}
        totalPaymentCash={totalPaymentCash}
        totalPaymentTransfer={totalPaymentTransfer}
        totalPaymentTotal={totalPaymentTotal}
      />
    </PageShell>
  );
};
export default DayBook;
