import { millify } from "millify";

// Compact price with a currency sign, e.g. "$63.1K" or "$0.5841".
// Sign-aware and never exponential (used on coin cards / details).
export const formatPrice = (value, sign = "$") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const neg = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs === 0) return `${sign}0`;
  if (abs >= 1) return `${neg}${sign}${millify(abs, { precision: 2 })}`;
  return `${neg}${sign}${abs.toLocaleString("en-US", { maximumFractionDigits: 8 })}`;
};

// Exact monetary value with thousands separators and up to `maxDecimals`
// fraction digits — never compact or exponential. Used for portfolio totals.
export const formatMoney = (value, sign = "$", maxDecimals = 3) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const neg = n < 0 ? "-" : "";
  const formatted = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
  return `${neg}${sign}${formatted}`;
};

// Compact number (market cap, volume), e.g. "1.17T".
export const formatNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? millify(n, { precision: 2 }) : "—";
};

// Signed percentage, e.g. "+2.31%" / "-1.79%".
export const formatPercent = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
};

export const isUp = (change) => Number(change) >= 0;
