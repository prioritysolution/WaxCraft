import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  bankAccountData: [],
  bankLedgerData: [],
};
const BankAccountSlice = createSlice({
  name: "bankAccount",
  initialState,
  reducers: {
    getBankAccountData: (state, action) => {
      state.bankAccountData = action.payload;
    },
    getBankLedgerData: (state, action) => {
      state.bankLedgerData = action.payload;
    },
  },
});
export const { getBankAccountData, getBankLedgerData } =
  BankAccountSlice.actions;
export default BankAccountSlice.reducer;
