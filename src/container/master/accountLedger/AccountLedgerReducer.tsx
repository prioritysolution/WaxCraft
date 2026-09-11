import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  accountLedgerData: [],
};
const AccountLedgerSlice = createSlice({
  name: "accountLedger",
  initialState,
  reducers: {
    getAccountLedgerData: (state, action) => {
      state.accountLedgerData = action.payload;
    },
  },
});
export const { getAccountLedgerData } = AccountLedgerSlice.actions;
export default AccountLedgerSlice.reducer;
