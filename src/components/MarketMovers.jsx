import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCryptosQuery } from "../services/cryptoApi";
import { selectCurrency } from "../features/settingsSlice";
import { formatPrice, formatPercent, isUp } from "../utils/format";

const MoverList = ({ title, coins, sign }) => (
  <div className="widget-card mover-card">
    <span className="widget-label">{title}</span>
    {coins.length === 0 ? (
      <p className="mover-empty">Loading…</p>
    ) : (
      coins.map((coin) => (
        <Link key={coin.uuid} to={`/coin/${coin.uuid}`} className="mover-row">
          <img src={coin.iconUrl} alt={coin.name} className="mover-icon" />
          <span className="mover-name">{coin.symbol}</span>
          <span className="mover-price">{formatPrice(coin.price, sign)}</span>
          <span className={`change-chip ${isUp(coin.change) ? "up" : "down"}`}>
            {formatPercent(coin.change)}
          </span>
        </Link>
      ))
    )}
  </div>
);

const MarketMovers = () => {
  const currency = useSelector(selectCurrency);
  const base = {
    count: 5,
    orderBy: "change",
    referenceCurrencyUuid: currency.uuid,
  };
  const { data: gainersData } = useGetCryptosQuery({
    ...base,
    orderDirection: "desc",
  });
  const { data: losersData } = useGetCryptosQuery({
    ...base,
    orderDirection: "asc",
  });

  return (
    <>
      <MoverList
        title="🚀 Top Gainers (24h)"
        coins={gainersData?.data?.coins || []}
        sign={currency.sign}
      />
      <MoverList
        title="📉 Top Losers (24h)"
        coins={losersData?.data?.coins || []}
        sign={currency.sign}
      />
    </>
  );
};

export default MarketMovers;
