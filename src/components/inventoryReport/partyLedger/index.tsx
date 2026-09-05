"use client";

import {
  PartyLedgerProps,
  PartyLedgerTableData,
} from "@/types/inventoryReport/PartyLedgerTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { BookUser } from "lucide-react";
import { FC } from "react";
import PartyLedgerForm from "./PartyLedgerForm";
import PartyLedgerTable from "./PartyLedgerTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";

interface PartyLedgerState {
  partyLedgerData: PartyLedgerTableData[];
}

interface RootState {
  partyLedger: PartyLedgerState;
}

const PartyLedger: FC<PartyLedgerProps> = ({
  getPartyLedgerLoading,
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
  const partyLedgerData: PartyLedgerTableData[] = useSelector(
    (state: RootState) => state?.partyLedger?.partyLedgerData
  );
  return (
        <PageShell>
      <PageHeader
        icon={BookUser}
        title="Party Ledger"
        description="View party-wise debit, credit, and running balance."
      />

      <FormCard>
        <PartyLedgerForm
          getPartyLedgerLoading={getPartyLedgerLoading}
          form={form}
          handleSubmit={handleSubmit}
          partyLedgerData={partyLedgerData}
          setShowPrintDialog={setShowPrintDialog}
          handleSearchOrderParty={handleSearchOrderParty}
          handleScrollOrderParty={handleScrollOrderParty}
          orderPartyInput={orderPartyInput}
          setOrderPartyInput={setOrderPartyInput}
          getOrderPartyLoading={getOrderPartyLoading}
        />
      </FormCard>

      <PartyLedgerTable
          partyLedgerData={partyLedgerData}
          loading={getPartyLedgerLoading}
        />

      <PreviewModal
        partyLedgerData={partyLedgerData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        fromDate={fromDate}
        toDate={toDate}
      />
    </PageShell>
  );
};
export default PartyLedger;
