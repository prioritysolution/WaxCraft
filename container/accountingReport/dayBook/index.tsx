"use client";

import DayBook from "@/components/accountingReport/dayBook";
import { useDayBook } from "./Hooks";

const DayBookContainer = () => {
  const {
    getDayBookLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    asOnDate,
  } = useDayBook();

  return (
    <DayBook
      getDayBookLoading={getDayBookLoading}
      form={form}
      handleSubmit={handleSubmit}
      showPrintDialog={showPrintDialog}
      setShowPrintDialog={setShowPrintDialog}
      asOnDate={asOnDate}
    />
  );
};
export default DayBookContainer;
