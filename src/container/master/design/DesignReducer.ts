import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DesignTableData } from "@/types/master/DesignTypes";

interface DesignState {
  designData: DesignTableData[];
}

export const initialState: DesignState = {
  designData: [],
};

const DesignSlice = createSlice({
  name: "design",
  initialState,
  reducers: {
    getDesignData: (state, action: PayloadAction<DesignTableData[]>) => {
      state.designData = action.payload;
    },
    patchDesignRow: (state, action: PayloadAction<DesignTableData>) => {
      const index = state.designData.findIndex(
        (row) => row.Id === action.payload.Id,
      );
      if (index >= 0) {
        state.designData[index] = action.payload;
      }
    },
  },
});
export const { getDesignData, patchDesignRow } = DesignSlice.actions;
export default DesignSlice.reducer;
