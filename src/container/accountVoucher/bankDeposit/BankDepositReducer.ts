import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  depositData: [],
};
const BankDepositSlice = createSlice({
  name: "bankDeposit",
  initialState,
  reducers: {
    getBankDepositData: (state, action) => {
      state.depositData = action.payload;
    },
  },
});
export const { getBankDepositData } = BankDepositSlice.actions;
export default BankDepositSlice.reducer;
