import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  salesVoucherData: [],
  salesVoucherProcessData: [],
  invoiceListData: [],
  invoicePrintData: [],
  gstAmount: 0,
  gstChoice: "N",
  partyId: "",
  date: "",
};
const SalesVoucherSlice = createSlice({
  name: "salesVoucher",
  initialState,
  reducers: {
    getSalesVoucherData: (state, action) => {
      state.salesVoucherData = action.payload;
    },
    getSalesVoucherProcessData: (state, action) => {
      state.salesVoucherProcessData = action.payload;
    },
    getInvoiceListData: (state, action) => {
      state.invoiceListData = action.payload;
    },
    getInvoicePrintData: (state, action) => {
      state.invoicePrintData = action.payload;
    },
    getGstAmount: (state, action) => {
      state.gstAmount = action.payload;
    },
    getGstChoice: (state, action) => {
      state.gstChoice = action.payload;
    },
    getPartyId: (state, action) => {
      state.partyId = action.payload;
    },
    getDate: (state, action) => {
      state.date = action.payload;
    },
  },
});
export const {
  getSalesVoucherData,
  getSalesVoucherProcessData,
  getInvoiceListData,
  getInvoicePrintData,
  getGstAmount,
  getGstChoice,
  getPartyId,
  getDate,
} = SalesVoucherSlice.actions;
export default SalesVoucherSlice.reducer;
