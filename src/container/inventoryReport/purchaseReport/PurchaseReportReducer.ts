import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  purchaseReportData: [],
};
const PurchaseReportSlice = createSlice({
  name: "purchaseReport",
  initialState,
  reducers: {
    getPurchaseReportData: (state, action) => {
      state.purchaseReportData = action.payload;
    },
  },
});
export const { getPurchaseReportData } = PurchaseReportSlice.actions;
export default PurchaseReportSlice.reducer;
