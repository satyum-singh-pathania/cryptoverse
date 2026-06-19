import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../app/storage";
import { DEFAULT_CURRENCY } from "../constants/currencies";

const settingsSlice = createSlice({
  name: "settings",
  initialState: { currency: loadState("cv-currency", DEFAULT_CURRENCY) },
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = settingsSlice.actions;
export const selectCurrency = (state) => state.settings.currency;
export default settingsSlice.reducer;
