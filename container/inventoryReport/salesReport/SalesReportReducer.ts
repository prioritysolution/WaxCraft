import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  salesReportData: [],
};
const SalesReportSlice = createSlice({
  name: "salesReport",
  initialState,
  reducers: {
    getSalesReportData: (state, action) => {
      state.salesReportData = action.payload;
    },
  },
});
export const { getSalesReportData } = SalesReportSlice.actions;
export default SalesReportSlice.reducer;
