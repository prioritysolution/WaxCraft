"use client";

import {
  BankLedgerProps,
  BankLedgerTableData,
} from "@/types/accountingReport/BankLedgerTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Landmark } from "lucide-react";
import { FC } from "react";
import BankLedgerForm from "./BankLedgerForm";
import BankLedgerTable from "./BankLedgerTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";

interface BankLedgerState {
  bankLedgerData: BankLedgerTableData[];
}

interface RootState {
  bankLedger: BankLedgerState;
}

const BankLedger: FC<BankLedgerProps> = ({
  getBankLedgerLoading,
  form,
  handleSubmit,
  showPrintDialog,
  setShowPrintDialog,
  fromDate,
  toDate,
  getBankAccountLoading,
}) => {
  const bankLedgerData: BankLedgerTableData[] = useSelector(
    (state: RootState) => state?.bankLedger?.bankLedgerData
  );
  return (
        <PageShell>
      <PageHeader
        icon={Landmark}
        title="Bank Ledger"
        description="Track bank account movement for the selected period."
      />

      <FormCard>
        <BankLedgerForm
          getBankLedgerLoading={getBankLedgerLoading}
          form={form}
          handleSubmit={handleSubmit}
          bankLedgerData={bankLedgerData}
          setShowPrintDialog={setShowPrintDialog}
          getBankAccountLoading={getBankAccountLoading}
        />
      </FormCard>

      <BankLedgerTable bankLedgerData={bankLedgerData} />
      <PreviewModal
        bankLedgerData={bankLedgerData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        fromDate={fromDate}
        toDate={toDate}
      />
    </PageShell>
  );
};
export default BankLedger;
