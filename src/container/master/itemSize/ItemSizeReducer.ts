import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  itemSizeData: [],
};
const ItemSizeSlice = createSlice({
  name: "itemSize",
  initialState,
  reducers: {
    getItemSizeData: (state, action) => {
      state.itemSizeData = action.payload;
    },
  },
});
export const { getItemSizeData } = ItemSizeSlice.actions;
export default ItemSizeSlice.reducer;
