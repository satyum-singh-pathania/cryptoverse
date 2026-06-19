import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoApiHeaders = {
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
  "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
};

const baseUrl = "https://coinranking1.p.rapidapi.com";

const createRequest = (url) => ({ url, headers: cryptoApiHeaders });

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: ({
        count = 50,
        orderBy = "marketCap",
        orderDirection = "desc",
        referenceCurrencyUuid,
      } = {}) => {
        const params = new URLSearchParams({
          limit: String(count),
          orderBy,
          orderDirection,
        });
        if (referenceCurrencyUuid)
          params.set("referenceCurrencyUuid", referenceCurrencyUuid);
        return createRequest(`/coins?${params.toString()}`);
      },
    }),
    getCryptoDetails: builder.query({
      query: ({ uuid, referenceCurrencyUuid }) => {
        const params = new URLSearchParams();
        if (referenceCurrencyUuid)
          params.set("referenceCurrencyUuid", referenceCurrencyUuid);
        const qs = params.toString();
        return createRequest(`/coin/${uuid}${qs ? `?${qs}` : ""}`);
      },
    }),
    getCryptoHistory: builder.query({
      query: ({ uuid, timePeriod, referenceCurrencyUuid }) => {
        const params = new URLSearchParams({ timePeriod });
        if (referenceCurrencyUuid)
          params.set("referenceCurrencyUuid", referenceCurrencyUuid);
        return createRequest(`/coin/${uuid}/history?${params.toString()}`);
      },
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} = cryptoApi;
