"use client";

import {
  CashBookProps,
  CashBookTableData,
} from "@/types/accountingReport/CashBookTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Wallet } from "lucide-react";
import { FC } from "react";
import CashBookForm from "./CashBookForm";
import CashBookTable from "./CashBookTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";
import calculateTotal from "@/utils/calculateTotal";

interface CashBookState {
  cashBookData: CashBookTableData[];
}

interface RootState {
  cashBook: CashBookState;
}

const CashBook: FC<CashBookProps> = ({
  getCashBookLoading,
  form,
  handleSubmit,
  showPrintDialog,
  setShowPrintDialog,
  asOnDate,
}) => {
  const cashBookData: CashBookTableData[] = useSelector(
    (state: RootState) => state?.cashBook?.cashBookData
  );

  const totalReceiptAmount =
    cashBookData[0]?.Receipt_Data.length > 0
      ? calculateTotal(cashBookData[0]?.Receipt_Data, "Amount")
      : 0;

  const totalPaymentAmount =
    cashBookData[0]?.Payment_Data.length > 0
      ? calculateTotal(cashBookData[0]?.Payment_Data, "Amount")
      : 0;

  return (
    <PageShell>
      <PageHeader
        icon={Wallet}
        title="Cash Book"
        description="Review cash receipts and payments in one place."
      />

      <FormCard>
        <CashBookForm
        getCashBookLoading={getCashBookLoading}
        form={form}
        handleSubmit={handleSubmit}
        cashBookData={cashBookData}
        setShowPrintDialog={setShowPrintDialog}
      />
      </FormCard>

      <CashBookTable
          cashBookData={cashBookData}
          totalReceiptAmount={totalReceiptAmount}
          totalPaymentAmount={totalPaymentAmount}
        />

      <PreviewModal
        cashBookData={cashBookData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        asOnDate={asOnDate}
        totalReceiptAmount={totalReceiptAmount}
        totalPaymentAmount={totalPaymentAmount}
      />
    </PageShell>
  );
};
export default CashBook;
