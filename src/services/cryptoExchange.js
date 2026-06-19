import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://api.coingecko.com/api/v3";
const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;

const withKey = (path) =>
  apiKey
    ? `${path}${path.includes("?") ? "&" : "?"}x_cg_api_key=${apiKey}`
    : path;

export const cryptoExchange = createApi({
  reducerPath: "cryptoExchange",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoExchange: builder.query({
      query: () => withKey("/exchanges"),
    }),
    // Accurate global market data (the Coinranking demo key truncates totals).
    getGlobalStats: builder.query({
      query: () => withKey("/global"),
    }),
  }),
});

export const { useGetCryptoExchangeQuery, useGetGlobalStatsQuery } =
  cryptoExchange;
