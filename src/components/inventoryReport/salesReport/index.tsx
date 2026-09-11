"use client";

import {
  SalesReportProps,
  SalesReportTableData,
} from "@/types/inventoryReport/SalesReportTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { ShoppingCart } from "lucide-react";
import { FC } from "react";
import SalesReportForm from "./SalesReportForm";
import SalesReportTable from "./SalesReportTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";

interface SalesReportState {
  salesReportData: SalesReportTableData[];
}

interface RootState {
  salesReport: SalesReportState;
}

const SalesReport: FC<SalesReportProps> = ({
  getSalesReportLoading,
  form,
  handleSubmit,
  showPrintDialog,
  setShowPrintDialog,
  fromDate,
  toDate,
  handleSearchOrderParty,
  handleScrollOrderParty,
  orderPartyInput,
  setOrderPartyInput,
  getOrderPartyLoading,
}) => {
  const salesReportData: SalesReportTableData[] = useSelector(
    (state: RootState) => state?.salesReport?.salesReportData,
  );
  return (
    <PageShell>
      <PageHeader
        icon={ShoppingCart}
        title="Sales Report"
        description="Filter and review sales invoices for a selected date range."
      />

      <FormCard>
        <SalesReportForm
          getSalesReportLoading={getSalesReportLoading}
          form={form}
          handleSubmit={handleSubmit}
          salesReportData={salesReportData}
          setShowPrintDialog={setShowPrintDialog}
          handleSearchOrderParty={handleSearchOrderParty}
          handleScrollOrderParty={handleScrollOrderParty}
          orderPartyInput={orderPartyInput}
          setOrderPartyInput={setOrderPartyInput}
          getOrderPartyLoading={getOrderPartyLoading}
        />
      </FormCard>

      <SalesReportTable
          salesReportData={salesReportData}
          loading={getSalesReportLoading}
        />

      <PreviewModal
        salesReportData={salesReportData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        fromDate={fromDate}
        toDate={toDate}
      />
    </PageShell>
  );
};
export default SalesReport;
