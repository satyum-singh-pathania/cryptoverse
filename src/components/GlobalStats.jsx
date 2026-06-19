import React from "react";
import { Statistic } from "antd";
import { useGetGlobalStatsQuery } from "../services/cryptoExchange";
import { formatNumber, formatPercent } from "../utils/format";

const GlobalStats = () => {
  const { data } = useGetGlobalStatsQuery();
  const g = data?.data;

  const tiles = g
    ? [
        { title: "Total Market Cap", value: `$${formatNumber(g.total_market_cap?.usd)}` },
        { title: "24h Volume", value: `$${formatNumber(g.total_volume?.usd)}` },
        {
          title: "Market Cap 24h",
          value: formatPercent(g.market_cap_change_percentage_24h_usd),
          up: g.market_cap_change_percentage_24h_usd >= 0,
        },
        { title: "BTC Dominance", value: `${g.market_cap_percentage?.btc?.toFixed(1)}%` },
        { title: "Active Coins", value: formatNumber(g.active_cryptocurrencies) },
        { title: "Markets", value: formatNumber(g.markets) },
      ]
    : [];

  return (
    <div className="stats-grid">
      {tiles.map((tile) => (
        <div className="stat-tile" key={tile.title}>
          <Statistic
            title={tile.title}
            value={tile.value}
            valueStyle={
              tile.up === undefined
                ? undefined
                : { color: tile.up ? "var(--positive)" : "var(--negative)" }
            }
          />
        </div>
      ))}
    </div>
  );
};

export default GlobalStats;
