import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  transferData: [],
};
const BankTransferSlice = createSlice({
  name: "bankTransfer",
  initialState,
  reducers: {
    getBankTransferData: (state, action) => {
      state.transferData = action.payload;
    },
  },
});
export const { getBankTransferData } = BankTransferSlice.actions;
export default BankTransferSlice.reducer;
