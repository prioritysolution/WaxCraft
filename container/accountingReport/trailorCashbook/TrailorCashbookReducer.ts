import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  trailorCashbookData: [],
};
const TrailorCashbookSlice = createSlice({
  name: "trailorCashbook",
  initialState,
  reducers: {
    getTrailorCashbookData: (state, action) => {
      state.trailorCashbookData = action.payload;
    },
  },
});
export const { getTrailorCashbookData } = TrailorCashbookSlice.actions;
export default TrailorCashbookSlice.reducer;
