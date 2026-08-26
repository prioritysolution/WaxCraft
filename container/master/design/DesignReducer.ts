import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  designData: [],
};
const DesignSlice = createSlice({
  name: "design",
  initialState,
  reducers: {
    getDesignData: (state, action) => {
      state.designData = action.payload;
    },
  },
});
export const { getDesignData } = DesignSlice.actions;
export default DesignSlice.reducer;
