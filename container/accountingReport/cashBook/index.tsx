"use client";

import CashBook from "@/components/accountingReport/cashBook";
import { useCashBook } from "./Hooks";

const CashBookContainer = () => {
  const {
    getCashBookLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    asOnDate,
  } = useCashBook();

  return (
    <CashBook
      getCashBookLoading={getCashBookLoading}
      form={form}
      handleSubmit={handleSubmit}
      showPrintDialog={showPrintDialog}
      setShowPrintDialog={setShowPrintDialog}
      asOnDate={asOnDate}
    />
  );
};
export default CashBookContainer;
