import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  orderBookingData: [],
  orderPartyData: [],
  orderDesignData: [],
  orderDesignDetailsData: [],
};
const OrderBookingSlice = createSlice({
  name: "orderBooking",
  initialState,
  reducers: {
    getOrderBookingData: (state, action) => {
      state.orderBookingData = action.payload;
    },
    getOrderPartyData: (state, action) => {
      state.orderPartyData = action.payload;
    },
    getOrderDesignData: (state, action) => {
      state.orderDesignData = action.payload;
    },
    getOrderDesignDetailsData: (state, action) => {
      state.orderDesignDetailsData = action.payload;
    },
  },
});
export const {
  getOrderBookingData,
  getOrderPartyData,
  getOrderDesignData,
  getOrderDesignDetailsData,
} = OrderBookingSlice.actions;
export default OrderBookingSlice.reducer;
