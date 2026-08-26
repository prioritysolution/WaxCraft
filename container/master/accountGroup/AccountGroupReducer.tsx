import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  accountGroupData: [],
  accountMainHeadData: [],
};
const AccountGroupSlice = createSlice({
  name: "accountGroup",
  initialState,
  reducers: {
    getAccountGroupData: (state, action) => {
      state.accountGroupData = action.payload;
    },
    getAccountMainHeadData: (state, action) => {
      state.accountMainHeadData = action.payload;
    },
  },
});
export const { getAccountGroupData, getAccountMainHeadData } =
  AccountGroupSlice.actions;
export default AccountGroupSlice.reducer;
