import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  itemModelData: [],
};
const ItemModelSlice = createSlice({
  name: "itemModel",
  initialState,
  reducers: {
    getItemModelData: (state, action) => {
      state.itemModelData = action.payload;
    },
  },
});
export const { getItemModelData } = ItemModelSlice.actions;
export default ItemModelSlice.reducer;
