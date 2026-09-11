import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  itemColourData: [],
};

const ItemColourSlice = createSlice({
  name: "itemColour",
  initialState,
  reducers: {
    getItemColourData: (state, action) => {
      state.itemColourData = action.payload;
    },
  },
});

export const { getItemColourData } = ItemColourSlice.actions;
export default ItemColourSlice.reducer;
