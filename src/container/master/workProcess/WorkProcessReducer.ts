import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  workProcessData: [],
};
const WorkProcessSlice = createSlice({
  name: "workProcess",
  initialState,
  reducers: {
    getWorkProcessData: (state, action) => {
      state.workProcessData = action.payload;
    },
  },
});
export const { getWorkProcessData } = WorkProcessSlice.actions;
export default WorkProcessSlice.reducer;
