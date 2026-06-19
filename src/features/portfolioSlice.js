import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../app/storage";

// holding shape: { id, uuid, name, symbol, iconUrl, quantity, buyPrice } (buyPrice in USD)
const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: { holdings: loadState("cv-portfolio", []) },
  reducers: {
    addHolding: (state, action) => {
      state.holdings.push(action.payload);
    },
    removeHolding: (state, action) => {
      state.holdings = state.holdings.filter((h) => h.id !== action.payload);
    },
  },
});

export const { addHolding, removeHolding } = portfolioSlice.actions;
export const selectHoldings = (state) => state.portfolio.holdings;
export default portfolioSlice.reducer;
