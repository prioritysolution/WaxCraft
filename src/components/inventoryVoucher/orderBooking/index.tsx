"use client";

import { OrderBookingProps } from "@/types/inventoryVoucher/OrderBookingTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { ClipboardCheck } from "lucide-react";
import { FC } from "react";
import OrderBookingForm from "./OrderBookingForm";
import OrderBookingTable from "./OrderBookingTable";
import PartyForm from "@/components/master/party/PartyForm";
import DesignModal from "./DesignModal";

const OrderBooking: FC<OrderBookingProps> = ({
  addOrderBookingLoading,
  deleteOrderBookingLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  addPartyLoading,
  isOpen,
  setIsOpen,
  partyForm,
  handlePartySubmit,
  handleShowPartyForm,
  showDesignDialog,
  setShowDesignDialog,
  handleAddDesign,
  orderTableData,
  handleDeleteOrderTableData,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteOrder,
  handleSearchOrderParty,
  handleScrollOrderParty,
  handleSearchOrderDesign,
  handleScrollOrderDesign,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  orderPartyInput,
  setOrderPartyInput,
  orderDesignInput,
  setOrderDesignInput,
  getPartyLedgerLoading,
  getOrderPartyLoading,
  getOrderDesignLoading,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={ClipboardCheck}
        title="Order Booking"
        description="Create new orders and review the active order list."
      />
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(String(key))}
        color="primary"
        size="md"
        radius="lg"
        classNames={tabsClassNames}
      >
        <Tab key="form" title="New Order">
          <FormCard>
            <OrderBookingForm
              addOrderBookingLoading={addOrderBookingLoading}
              form={form}
              handleSubmit={handleSubmit}
              handleShowPartyForm={handleShowPartyForm}
              isOpen={isOpen}
              orderTableData={orderTableData}
              handleDeleteOrderTableData={handleDeleteOrderTableData}
              handleSearchOrderParty={handleSearchOrderParty}
              handleScrollOrderParty={handleScrollOrderParty}
              handleSearchOrderDesign={handleSearchOrderDesign}
              handleScrollOrderDesign={handleScrollOrderDesign}
              orderPartyInput={orderPartyInput}
              setOrderPartyInput={setOrderPartyInput}
              orderDesignInput={orderDesignInput}
              setOrderDesignInput={setOrderDesignInput}
              getOrderPartyLoading={getOrderPartyLoading}
              getOrderDesignLoading={getOrderDesignLoading}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active Order List">
          <OrderBookingTable
              loading={loading}
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeleteOrder={handleDeleteOrder}
              deleteOrderBookingLoading={deleteOrderBookingLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              lastPage={lastPage}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
            />
        </Tab>
      </Tabs>

      <PartyForm
        addPartyLoading={addPartyLoading}
        form={partyForm}
        handleSubmit={handlePartySubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        getPartyLedgerLoading={getPartyLedgerLoading}
      />

      <DesignModal
        showDesignDialog={showDesignDialog}
        setShowDesignDialog={setShowDesignDialog}
        form={form}
        handleAddDesign={handleAddDesign}
        setDesignInput={setOrderDesignInput}
      />
    </PageShell>
  );
};
export default OrderBooking;
