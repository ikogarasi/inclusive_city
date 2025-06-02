import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ElementDto } from "../app/api/externalServicesApi";

interface StructuresState {
  items: ElementDto[];
}

const initialState: StructuresState = {
  items: [],
};

const structuresSlice = createSlice({
  name: "structures",
  initialState,
  reducers: {
    setStructures(state, action: PayloadAction<ElementDto[]>) {
      state.items = action.payload;
    },
    clearStructures(state) {
      state.items = [];
    },
  },
});

export const { setStructures, clearStructures } = structuresSlice.actions;
export default structuresSlice.reducer;
