import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  itemData: [],
  purchaseLedgerData: [],
  salesLedgerData: [],
};
const ItemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    getItemData: (state, action) => {
      state.itemData = action.payload;
    },
    getPurchaseLedgerData: (state, action) => {
      state.purchaseLedgerData = action.payload;
    },
    getSalesLedgerData: (state, action) => {
      state.salesLedgerData = action.payload;
    },
  },
});
export const { getItemData, getPurchaseLedgerData, getSalesLedgerData } =
  ItemSlice.actions;
export default ItemSlice.reducer;
