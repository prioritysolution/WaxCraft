"use client";

import {
  OrderBookProps,
  OrderBookTableData,
} from "@/types/inventoryReport/OrderBookTypes";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Notebook } from "lucide-react";
import { FC } from "react";
import OrderBookForm from "./OrderBookForm";
import OrderBookTable from "./OrderBookTable";
import { useSelector } from "react-redux";
import PreviewModal from "./PreviewModal";

interface OrderBookState {
  orderBookData: OrderBookTableData[];
}

interface RootState {
  orderBook: OrderBookState;
}

const OrderBook: FC<OrderBookProps> = ({
  getOrderBookLoading,
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
  const orderBookData: OrderBookTableData[] = useSelector(
    (state: RootState) => state?.orderBook?.orderBookData
  );
  return (
        <PageShell>
      <PageHeader
        icon={Notebook}
        title="Order Book"
        description="Review booked orders and their current status."
      />

      <FormCard>
        <OrderBookForm
          getOrderBookLoading={getOrderBookLoading}
          form={form}
          handleSubmit={handleSubmit}
          orderBookData={orderBookData}
          setShowPrintDialog={setShowPrintDialog}
          handleSearchOrderParty={handleSearchOrderParty}
          handleScrollOrderParty={handleScrollOrderParty}
          orderPartyInput={orderPartyInput}
          setOrderPartyInput={setOrderPartyInput}
          getOrderPartyLoading={getOrderPartyLoading}
        />
      </FormCard>

      <OrderBookTable
          orderBookData={orderBookData}
          loading={getOrderBookLoading}
        />

      <PreviewModal
        orderBookData={orderBookData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        fromDate={fromDate}
        toDate={toDate}
      />
    </PageShell>
  );
};
export default OrderBook;
