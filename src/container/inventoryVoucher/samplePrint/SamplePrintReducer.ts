import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  samplePrintData: [],
};
const SamplePrintSlice = createSlice({
  name: "samplePrint",
  initialState,
  reducers: {
    getSamplePrintData: (state, action) => {
      state.samplePrintData = action.payload;
    },
  },
});
export const { getSamplePrintData } = SamplePrintSlice.actions;
export default SamplePrintSlice.reducer;
