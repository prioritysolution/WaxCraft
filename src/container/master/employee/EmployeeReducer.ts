import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  employeeData: [],
};
const EmployeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    getEmployeeData: (state, action) => {
      state.employeeData = action.payload;
    },
  },
});
export const { getEmployeeData } = EmployeeSlice.actions;
export default EmployeeSlice.reducer;
