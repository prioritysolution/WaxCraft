import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  accountLedgerData: [],
  accountLedgerListData: [],
};
const AccountLedgerSlice = createSlice({
  name: "accountLedgerReport",
  initialState,
  reducers: {
    getAccountLedgerData: (state, action) => {
      state.accountLedgerData = action.payload;
    },
    getAccountLedgerListData: (state, action) => {
      state.accountLedgerListData = action.payload;
    },
  },
});
export const { getAccountLedgerData, getAccountLedgerListData } =
  AccountLedgerSlice.actions;
export default AccountLedgerSlice.reducer;
