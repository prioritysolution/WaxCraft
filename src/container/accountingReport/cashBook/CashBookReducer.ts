import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  cashBookData: [],
};
const CashBookSlice = createSlice({
  name: "cashBook",
  initialState,
  reducers: {
    getCashBookData: (state, action) => {
      state.cashBookData = action.payload;
    },
  },
});
export const { getCashBookData } = CashBookSlice.actions;
export default CashBookSlice.reducer;
