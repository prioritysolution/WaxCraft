import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  withdrawnData: [],
};
const BankWithdrawnSlice = createSlice({
  name: "bankWithdrawn",
  initialState,
  reducers: {
    getBankWithdrawnData: (state, action) => {
      state.withdrawnData = action.payload;
    },
  },
});
export const { getBankWithdrawnData } = BankWithdrawnSlice.actions;
export default BankWithdrawnSlice.reducer;
