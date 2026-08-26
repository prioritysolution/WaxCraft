import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  receiptData: [],
  receiptLedgerData: [],
  receiptPartyData: [],
};
const ReceiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    getReceiptData: (state, action) => {
      state.receiptData = action.payload;
    },
    getReceiptLedgerData: (state, action) => {
      state.receiptLedgerData = action.payload;
    },
    getReceiptPartyData: (state, action) => {
      state.receiptPartyData = action.payload;
    },
  },
});
export const { getReceiptData, getReceiptLedgerData, getReceiptPartyData } =
  ReceiptSlice.actions;
export default ReceiptSlice.reducer;
