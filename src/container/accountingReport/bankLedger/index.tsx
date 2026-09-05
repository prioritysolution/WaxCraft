"use client";

import BankLedger from "@/components/accountingReport/bankLedger";
import { useBankLedger } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";

const BankLedgerContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getBankLedgerLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
  } = useBankLedger();

  const { getBankAccountApiCall, loading: getBankAccountLoading } =
    useBankAccount();

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <BankLedger
      getBankLedgerLoading={getBankLedgerLoading}
      form={form}
      handleSubmit={handleSubmit}
      showPrintDialog={showPrintDialog}
      setShowPrintDialog={setShowPrintDialog}
      fromDate={fromDate}
      toDate={toDate}
      getBankAccountLoading={getBankAccountLoading}
    />
  );
};
export default BankLedgerContainer;
