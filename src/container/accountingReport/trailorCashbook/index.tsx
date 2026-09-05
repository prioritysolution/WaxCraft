"use client";

import TrailorCashbook from "@/components/accountingReport/trailorCashbook";
import { useTrailorCashbook } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useTrailorTransaction } from "@/container/accountVoucher/trailorTransaction/Hooks";
import { useEffect } from "react";

const TrailorCashbookContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getTrailorCashbookLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    asOnDate,
  } = useTrailorCashbook();

  const { getTrailorUserApiCall } = useTrailorTransaction();

  useEffect(() => {
    if (token && orgId) {
      getTrailorUserApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <TrailorCashbook
      getTrailorCashbookLoading={getTrailorCashbookLoading}
      form={form}
      handleSubmit={handleSubmit}
      showPrintDialog={showPrintDialog}
      setShowPrintDialog={setShowPrintDialog}
      asOnDate={asOnDate}
    />
  );
};
export default TrailorCashbookContainer;
