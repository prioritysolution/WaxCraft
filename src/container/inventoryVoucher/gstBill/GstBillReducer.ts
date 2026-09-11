import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  gstBillData: [],
};
const GstBillSlice = createSlice({
  name: "gstBill",
  initialState,
  reducers: {
    getGstBillData: (state, action) => {
      state.gstBillData = action.payload;
    },
  },
});
export const { getGstBillData } = GstBillSlice.actions;
export default GstBillSlice.reducer;
