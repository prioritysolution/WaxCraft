"use client";

import {
  TrailorCashbookProps,
  TrailorCashbookTableData,
} from "@/types/accountingReport/TrailorCashbookTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Truck } from "lucide-react";
import { FC } from "react";
import TrailorCashbookForm from "./TrailorCashbookForm";
import TrailorCashbookTable from "./TrailorCashbookTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";
import calculateTotal from "@/utils/calculateTotal";

interface TrailorCashbookState {
  trailorCashbookData: TrailorCashbookTableData[];
}

interface RootState {
  trailorCashbook: TrailorCashbookState;
}

const TrailorCashbook: FC<TrailorCashbookProps> = ({
  getTrailorCashbookLoading,
  form,
  handleSubmit,
  showPrintDialog,
  setShowPrintDialog,
  asOnDate,
}) => {
  const trailorCashbookData: TrailorCashbookTableData[] = useSelector(
    (state: RootState) => state?.trailorCashbook?.trailorCashbookData
  );

  const totalReceiptAmount =
    trailorCashbookData[0]?.Receipt_Data.length > 0
      ? calculateTotal(trailorCashbookData[0]?.Receipt_Data, "Amount")
      : 0;

  const totalPaymentAmount =
    trailorCashbookData[0]?.Payment_Data.length > 0
      ? calculateTotal(trailorCashbookData[0]?.Payment_Data, "Amount")
      : 0;

  return (
        <PageShell>
      <PageHeader
        icon={Truck}
        title="Trailor Cashbook"
        description="Review trailor cash movements for the selected date."
      />

      <FormCard>
        <TrailorCashbookForm
          getTrailorCashbookLoading={getTrailorCashbookLoading}
          form={form}
          handleSubmit={handleSubmit}
          trailorCashbookData={trailorCashbookData}
          setShowPrintDialog={setShowPrintDialog}
        />
      </FormCard>

      <TrailorCashbookTable
          trailorCashbookData={trailorCashbookData}
          totalReceiptAmount={totalReceiptAmount}
          totalPaymentAmount={totalPaymentAmount}
        />

      <PreviewModal
        trailorCashbookData={trailorCashbookData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        asOnDate={asOnDate}
        totalReceiptAmount={totalReceiptAmount}
        totalPaymentAmount={totalPaymentAmount}
      />
    </PageShell>
  );
};
export default TrailorCashbook;
