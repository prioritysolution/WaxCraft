import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  trailorUserData: [],
};
const TrailorTransactionSlice = createSlice({
  name: "trailorTransaction",
  initialState,
  reducers: {
    getTrailorUserData: (state, action) => {
      state.trailorUserData = action.payload;
    },
  },
});
export const { getTrailorUserData } = TrailorTransactionSlice.actions;
export default TrailorTransactionSlice.reducer;
