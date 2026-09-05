import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  sidebarData: [],
};
const SidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    getSidebarData: (state, action) => {
      state.sidebarData = action.payload;
    },
  },
});
export const { getSidebarData } = SidebarSlice.actions;
export default SidebarSlice.reducer;
