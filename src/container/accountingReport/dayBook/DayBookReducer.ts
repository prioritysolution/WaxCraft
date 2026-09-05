import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  dayBookData: [],
};
const DayBookSlice = createSlice({
  name: "dayBook",
  initialState,
  reducers: {
    getDayBookData: (state, action) => {
      state.dayBookData = action.payload;
    },
  },
});
export const { getDayBookData } = DayBookSlice.actions;
export default DayBookSlice.reducer;
