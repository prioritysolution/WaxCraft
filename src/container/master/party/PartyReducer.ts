import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  partyData: [],
  partyLedgerData: [],
};
const PartySlice = createSlice({
  name: "party",
  initialState,
  reducers: {
    getPartyData: (state, action) => {
      state.partyData = action.payload;
    },
    getPartyLedgerData: (state, action) => {
      state.partyLedgerData = action.payload;
    },
  },
});
export const { getPartyData, getPartyLedgerData } = PartySlice.actions;
export default PartySlice.reducer;
