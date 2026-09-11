import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  paymentData: [],
};
const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    getPaymentData: (state, action) => {
      state.paymentData = action.payload;
    },
  },
});
export const { getPaymentData } = PaymentSlice.actions;
export default PaymentSlice.reducer;
