"use client";

import {
  PurchaseReportProps,
  PurchaseReportTableData,
} from "@/types/inventoryReport/PurchaseReportTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { ShoppingBag } from "lucide-react";
import { FC } from "react";
import PurchaseReportForm from "./PurchaseReportForm";
import PurchaseReportTable from "./PurchaseReportTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";

interface PurchaseReportState {
  purchaseReportData: PurchaseReportTableData[];
}

interface RootState {
  purchaseReport: PurchaseReportState;
}

const PurchaseReport: FC<PurchaseReportProps> = ({
  getPurchaseReportLoading,
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
  const purchaseReportData: PurchaseReportTableData[] = useSelector(
    (state: RootState) => state?.purchaseReport?.purchaseReportData
  );
  return (
    <PageShell>
      <PageHeader
        icon={ShoppingBag}
        title="Purchase Report"
        description="Filter and review purchase vouchers for a selected date range."
      />

      <FormCard>
        <PurchaseReportForm
          getPurchaseReportLoading={getPurchaseReportLoading}
          form={form}
          handleSubmit={handleSubmit}
          purchaseReportData={purchaseReportData}
          setShowPrintDialog={setShowPrintDialog}
          handleSearchOrderParty={handleSearchOrderParty}
          handleScrollOrderParty={handleScrollOrderParty}
          orderPartyInput={orderPartyInput}
          setOrderPartyInput={setOrderPartyInput}
          getOrderPartyLoading={getOrderPartyLoading}
        />
      </FormCard>

      <PurchaseReportTable
          purchaseReportData={purchaseReportData}
          loading={getPurchaseReportLoading}
        />

      <PreviewModal
        purchaseReportData={purchaseReportData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        fromDate={fromDate}
        toDate={toDate}
      />
    </PageShell>
  );
};
export default PurchaseReport;
