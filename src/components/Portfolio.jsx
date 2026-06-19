import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Select, InputNumber, Button, Empty, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { useGetCryptosQuery } from "../services/cryptoApi";
import {
  addHolding,
  removeHolding,
  selectHoldings,
} from "../features/portfolioSlice";
import { USD_UUID } from "../constants/currencies";
import { formatPrice, formatMoney, formatPercent } from "../utils/format";
import { useTheme } from "../theme/ThemeProvider";
import Loader from "./Loader";

const { Title } = Typography;

const DONUT_COLORS = [
  "#f7a600", "#16c784", "#2f80ed", "#9b51e0", "#eb5757",
  "#ffce54", "#56ccf2", "#bb6bd9", "#27ae60", "#f2994a",
];

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now());

export const Portfolio = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const holdings = useSelector(selectHoldings);
  // Portfolio always values in USD so buy-price math stays consistent.
  const { data, isFetching } = useGetCryptosQuery({
    count: 100,
    referenceCurrencyUuid: USD_UUID,
  });
  const coins = data?.data?.coins || [];
  const coinMap = useMemo(
    () => Object.fromEntries(coins.map((c) => [c.uuid, c])),
    [coins]
  );

  const [selectedUuid, setSelectedUuid] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [buyPrice, setBuyPrice] = useState(null);

  if (isFetching && !data) return <Loader />;

  const handleAdd = () => {
    const coin = coinMap[selectedUuid];
    if (!coin || !quantity || quantity <= 0) return;
    dispatch(
      addHolding({
        id: newId(),
        uuid: coin.uuid,
        name: coin.name,
        symbol: coin.symbol,
        iconUrl: coin.iconUrl,
        quantity: Number(quantity),
        buyPrice: buyPrice != null ? Number(buyPrice) : Number(coin.price),
      })
    );
    setSelectedUuid(null);
    setQuantity(null);
    setBuyPrice(null);
  };

  const rows = holdings.map((h) => {
    const price = Number(coinMap[h.uuid]?.price ?? 0);
    const value = price * h.quantity;
    const cost = h.buyPrice * h.quantity;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { ...h, price, value, cost, pnl, pnlPct };
  });

  const totalValue = rows.reduce((s, r) => s + r.value, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const pnlColor = (n) => (n >= 0 ? "var(--positive)" : "var(--negative)");

  const donutData = {
    labels: rows.map((r) => r.symbol),
    datasets: [
      {
        data: rows.map((r) => r.value),
        backgroundColor: DONUT_COLORS,
        borderWidth: 0,
      },
    ],
  };
  const donutOptions = {
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: mode === "dark" ? "#98a1b3" : "#5b6473" },
      },
    },
  };

  const coinOptions = coins.map((c) => ({
    value: c.uuid,
    label: `${c.name} (${c.symbol})`,
  }));

  return (
    <div className="portfolio">
      <div className="page-head">
        <Title level={2} className="heading">
          My Portfolio
        </Title>
        <p className="page-intro">
          Track your holdings and live profit / loss (in USD). Saved locally in
          your browser.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-tile">
          <span className="stat-label">Net Worth</span>
          <span className="stat-value">{formatMoney(totalValue)}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Total Invested</span>
          <span className="stat-value">{formatMoney(totalCost)}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Total Profit / Loss</span>
          <span className="stat-value" style={{ color: pnlColor(totalPnl) }}>
            {formatMoney(totalPnl)} ({formatPercent(totalPnlPct)})
          </span>
        </div>
      </div>

      <div className="add-holding">
        <Select
          showSearch
          placeholder="Select a coin"
          value={selectedUuid}
          onChange={setSelectedUuid}
          options={coinOptions}
          optionFilterProp="label"
          className="add-coin"
          size="large"
        />
        <InputNumber
          placeholder="Quantity"
          value={quantity}
          onChange={setQuantity}
          min={0}
          size="large"
          className="add-input"
        />
        <InputNumber
          placeholder="Buy price (optional)"
          value={buyPrice}
          onChange={setBuyPrice}
          min={0}
          size="large"
          prefix="$"
          className="add-input"
        />
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>

      {rows.length === 0 ? (
        <Empty
          className="empty-state"
          description="No holdings yet — add a coin above to start tracking."
        />
      ) : (
        <div className="portfolio-body">
          <div className="holdings-list">
            <div className="holding-row holding-head">
              <span>Asset</span>
              <span>Holdings</span>
              <span>Price</span>
              <span>Value</span>
              <span>Profit / Loss</span>
              <span />
            </div>
            {rows.map((r) => (
              <div className="holding-row" key={r.id}>
                <Link to={`/coin/${r.uuid}`} className="holding-asset">
                  <img src={r.iconUrl} alt={r.name} />
                  <span>{r.symbol}</span>
                </Link>
                <span data-label="Holdings">
                  {formatMoney(r.quantity, "", 6)} {r.symbol}
                </span>
                <span data-label="Price">{formatPrice(r.price)}</span>
                <span data-label="Value">{formatMoney(r.value)}</span>
                <span data-label="P&L" style={{ color: pnlColor(r.pnl) }}>
                  {formatMoney(r.pnl)} <small>({formatPercent(r.pnlPct)})</small>
                </span>
                <button
                  className="icon-btn danger"
                  onClick={() => dispatch(removeHolding(r.id))}
                  aria-label="Remove holding"
                >
                  <DeleteOutlined />
                </button>
              </div>
            ))}
          </div>

          <div className="allocation-card widget-card">
            <span className="widget-label">Allocation</span>
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
      )}
    </div>
  );
};
