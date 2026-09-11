import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  bankLedgerData: [],
};
const BankLedgerSlice = createSlice({
  name: "bankLedger",
  initialState,
  reducers: {
    getBankLedgerData: (state, action) => {
      state.bankLedgerData = action.payload;
    },
  },
});
export const { getBankLedgerData } = BankLedgerSlice.actions;
export default BankLedgerSlice.reducer;
