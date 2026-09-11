import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  userAccessData: [],
};
const UserAccessSlice = createSlice({
  name: "userAccess",
  initialState,
  reducers: {
    getUserAccessData: (state, action) => {
      state.userAccessData = action.payload;
    },
  },
});
export const { getUserAccessData } = UserAccessSlice.actions;
export default UserAccessSlice.reducer;
