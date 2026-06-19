import { configureStore } from "@reduxjs/toolkit";
import { cryptoApi } from "../services/cryptoApi";
import { cryptoExchange } from "../services/cryptoExchange";
import watchlistReducer from "../features/watchlistSlice";
import portfolioReducer from "../features/portfolioSlice";
import settingsReducer from "../features/settingsSlice";
import { saveState } from "./storage";

const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [cryptoExchange.reducerPath]: cryptoExchange.reducer,
    watchlist: watchlistReducer,
    portfolio: portfolioReducer,
    settings: settingsReducer,
  },
  middleware: (mid) =>
    mid().concat(cryptoApi.middleware, cryptoExchange.middleware),
});

// Persist user state (watchlist / portfolio / currency) to localStorage.
store.subscribe(() => {
  const state = store.getState();
  saveState("cv-watchlist", state.watchlist.ids);
  saveState("cv-portfolio", state.portfolio.holdings);
  saveState("cv-currency", state.settings.currency);
});

export default store;
