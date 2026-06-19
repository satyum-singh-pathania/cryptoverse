import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../app/storage";

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: { ids: loadState("cv-watchlist", []) },
  reducers: {
    toggleWatch: (state, action) => {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id];
    },
  },
});

export const { toggleWatch } = watchlistSlice.actions;
export const selectWatchlist = (state) => state.watchlist.ids;
export default watchlistSlice.reducer;
