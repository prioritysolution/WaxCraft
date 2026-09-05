import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  userListData: [],
  userRolesData: [],
};
const AddUserSlice = createSlice({
  name: "addUser",
  initialState,
  reducers: {
    getUserListData: (state, action) => {
      state.userListData = action.payload;
    },
    getUserRolesData: (state, action) => {
      state.userRolesData = action.payload;
    },
  },
});
export const { getUserListData, getUserRolesData } = AddUserSlice.actions;
export default AddUserSlice.reducer;
