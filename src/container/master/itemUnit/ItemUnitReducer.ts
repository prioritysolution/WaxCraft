import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  itemUnitData: [],
};
const ItemUnitSlice = createSlice({
  name: "itemUnit",
  initialState,
  reducers: {
    getItemUnitData: (state, action) => {
      state.itemUnitData = action.payload;
    },
  },
});
export const { getItemUnitData } = ItemUnitSlice.actions;
export default ItemUnitSlice.reducer;
