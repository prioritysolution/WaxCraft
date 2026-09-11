import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  itemCategoryData: [],
};
const ItemCategorySlice = createSlice({
  name: "itemCategory",
  initialState,
  reducers: {
    getItemCategoryData: (state, action) => {
      state.itemCategoryData = action.payload;
    },
  },
});
export const { getItemCategoryData } = ItemCategorySlice.actions;
export default ItemCategorySlice.reducer;
