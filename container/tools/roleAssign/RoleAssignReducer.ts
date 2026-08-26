import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  moduleData: [],
};
const RoleAssignSlice = createSlice({
  name: "roleAssign",
  initialState,
  reducers: {
    getModuleData: (state, action) => {
      state.moduleData = action.payload;
    },
  },
});
export const { getModuleData } = RoleAssignSlice.actions;
export default RoleAssignSlice.reducer;
