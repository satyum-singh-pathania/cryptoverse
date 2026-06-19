// Coinranking reference-currency UUIDs (verified against the live API).
export const CURRENCIES = [
  { uuid: "yhjMzLPhuIDl", symbol: "USD", sign: "$" },
  { uuid: "5k-_VTxqtCEI", symbol: "EUR", sign: "€" },
  { uuid: "Hokyui45Z38f", symbol: "GBP", sign: "£" },
  { uuid: "Qwsogvtv82FCd", symbol: "BTC", sign: "₿" },
  { uuid: "razxDUgYGNAdQ", symbol: "ETH", sign: "Ξ" },
];

export const DEFAULT_CURRENCY = CURRENCIES[0];

// Portfolio P&L is always computed in USD so buy-price math stays consistent.
export const USD_UUID = "yhjMzLPhuIDl";
