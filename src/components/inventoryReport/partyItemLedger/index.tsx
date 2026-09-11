"use client";

import {
  PartyItemLedgerProps,
  PartyItemLedgerTableData,
} from "@/types/inventoryReport/PartyItemLedgerTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { ClipboardList } from "lucide-react";
import { FC } from "react";
import PartyItemLedgerForm from "./PartyItemLedgerForm";
import PartyItemLedgerTable from "./PartyItemLedgerTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";

interface PartyItemLedgerState {
  partyItemLedgerData: PartyItemLedgerTableData[];
}

interface RootState {
  partyItemLedger: PartyItemLedgerState;
}

const PartyItemLedger: FC<PartyItemLedgerProps> = ({
  getPartyItemLedgerLoading,
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
  const partyItemLedgerData: PartyItemLedgerTableData[] = useSelector(
    (state: RootState) => state?.partyItemLedger?.partyItemLedgerData
  );
  return (
        <PageShell>
      <PageHeader
        icon={ClipboardList}
        title="Party Item Ledger"
        description="Track item movement against a selected party."
      />

      <FormCard>
        <PartyItemLedgerForm
          getPartyItemLedgerLoading={getPartyItemLedgerLoading}
          form={form}
          handleSubmit={handleSubmit}
          partyItemLedgerData={partyItemLedgerData}
          setShowPrintDialog={setShowPrintDialog}
          handleSearchOrderParty={handleSearchOrderParty}
          handleScrollOrderParty={handleScrollOrderParty}
          orderPartyInput={orderPartyInput}
          setOrderPartyInput={setOrderPartyInput}
          getOrderPartyLoading={getOrderPartyLoading}
        />
      </FormCard>

      <PartyItemLedgerTable
          partyItemLedgerData={partyItemLedgerData}
          loading={getPartyItemLedgerLoading}
        />

      <PreviewModal
        partyItemLedgerData={partyItemLedgerData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        fromDate={fromDate}
        toDate={toDate}
      />
    </PageShell>
  );
};
export default PartyItemLedger;
