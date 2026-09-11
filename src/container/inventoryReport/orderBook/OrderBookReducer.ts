import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  orderBookData: [],
};
const OrderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    getOrderBookData: (state, action) => {
      state.orderBookData = action.payload;
    },
  },
});
export const { getOrderBookData } = OrderBookSlice.actions;
export default OrderBookSlice.reducer;
