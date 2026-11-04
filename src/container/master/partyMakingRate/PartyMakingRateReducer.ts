import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  partyMakingRateData: [],
};

const PartyMakingRateSlice = createSlice({
  name: "partyMakingRate",
  initialState,
  reducers: {
    getPartyMakingRateData: (state, action) => {
      state.partyMakingRateData = action.payload;
    },
  },
});

export const { getPartyMakingRateData } = PartyMakingRateSlice.actions;
export default PartyMakingRateSlice.reducer;
