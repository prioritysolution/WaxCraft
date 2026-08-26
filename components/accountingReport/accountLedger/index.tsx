"use client";

import {
  AccountLedgerProps,
  AccountLedgerTableData,
} from "@/types/accountingReport/AccountLedgerTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { BookOpen } from "lucide-react";
import { FC } from "react";
import AccountLedgerForm from "./AccountLedgerForm";
import AccountLedgerTable from "./AccountLedgerTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";

interface AccountLedgerState {
  accountLedgerData: AccountLedgerTableData[];
}

interface RootState {
  accountLedgerReport: AccountLedgerState;
}

const AccountLedger: FC<AccountLedgerProps> = ({
  getAccountLedgerLoading,
  form,
  handleSubmit,
  showPrintDialog,
  setShowPrintDialog,
  fromDate,
  toDate,
  ledgerId,
  handleSearchAccountLedger,
  handleScrollAccountLedger,
  accountLedgerInput,
  setAccountLedgerInput,
  getAccountLedgerListLoading,
}) => {
  const accountLedgerData: AccountLedgerTableData[] = useSelector(
    (state: RootState) => state?.accountLedgerReport?.accountLedgerData
  );
  return (
        <PageShell>
      <PageHeader
        icon={BookOpen}
        title="Account Ledger"
        description="Review ledger transactions with debit, credit, and balance."
      />

      <FormCard>
        <AccountLedgerForm
          getAccountLedgerLoading={getAccountLedgerLoading}
          form={form}
          handleSubmit={handleSubmit}
          accountLedgerData={accountLedgerData}
          setShowPrintDialog={setShowPrintDialog}
          handleSearchAccountLedger={handleSearchAccountLedger}
          handleScrollAccountLedger={handleScrollAccountLedger}
          accountLedgerInput={accountLedgerInput}
          setAccountLedgerInput={setAccountLedgerInput}
          getAccountLedgerListLoading={getAccountLedgerListLoading}
        />
      </FormCard>

      <AccountLedgerTable accountLedgerData={accountLedgerData} />

      <PreviewModal
        accountLedgerData={accountLedgerData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        fromDate={fromDate}
        toDate={toDate}
        ledgerId={ledgerId}
      />
    </PageShell>
  );
};
export default AccountLedger;
