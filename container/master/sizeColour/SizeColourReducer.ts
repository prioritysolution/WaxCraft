import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  sizeColourData: [],
};
const SizeColourSlice = createSlice({
  name: "sizeColour",
  initialState,
  reducers: {
    getSizeColourData: (state, action) => {
      state.sizeColourData = action.payload;
    },
  },
});
export const { getSizeColourData } = SizeColourSlice.actions;
export default SizeColourSlice.reducer;
