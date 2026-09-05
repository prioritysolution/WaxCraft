import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  partyLedgerData: [],
};
const PartyLedgerSlice = createSlice({
  name: "partyLedger",
  initialState,
  reducers: {
    getPartyLedgerData: (state, action) => {
      state.partyLedgerData = action.payload;
    },
  },
});
export const { getPartyLedgerData } = PartyLedgerSlice.actions;
export default PartyLedgerSlice.reducer;
