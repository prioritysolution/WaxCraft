import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  partyItemLedgerData: [],
};
const PartyItemLedgerSlice = createSlice({
  name: "partyItemLedger",
  initialState,
  reducers: {
    getPartyItemLedgerData: (state, action) => {
      state.partyItemLedgerData = action.payload;
    },
  },
});
export const { getPartyItemLedgerData } = PartyItemLedgerSlice.actions;
export default PartyItemLedgerSlice.reducer;
