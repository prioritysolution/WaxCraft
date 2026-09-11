import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  purchaseVoucherData: [],
  purchasePartyData: [],
  itemRequisitionData: [],
};
const PurchaseVoucherSlice = createSlice({
  name: "purchaseVoucher",
  initialState,
  reducers: {
    getPurchaseVoucherData: (state, action) => {
      state.purchaseVoucherData = action.payload;
    },
    getPurchasePartyData: (state, action) => {
      state.purchasePartyData = action.payload;
    },
    getItemRequisitionData: (state, action) => {
      state.itemRequisitionData = action.payload;
    },
  },
});
export const {
  getPurchaseVoucherData,
  getPurchasePartyData,
  getItemRequisitionData,
} = PurchaseVoucherSlice.actions;
export default PurchaseVoucherSlice.reducer;
