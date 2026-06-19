import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Input, Select, Segmented, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useGetCryptosQuery } from "../services/cryptoApi";
import { selectCurrency } from "../features/settingsSlice";
import { selectWatchlist } from "../features/watchlistSlice";
import { formatNumber, isUp } from "../utils/format";
import Sparkline from "./Sparkline";
import AnimatedPrice from "./AnimatedPrice";
import WatchButton from "./WatchButton";
import Loader from "./Loader";

const sortOptions = [
  { label: "Market Cap", value: "marketCap" },
  { label: "Price", value: "price" },
  { label: "24h Volume", value: "24hVolume" },
  { label: "24h Change", value: "change" },
];

export const Cryptocurrencies = ({ simplified, watchlistOnly }) => {
  const currency = useSelector(selectCurrency);
  const watchIds = useSelector(selectWatchlist);
  const count = simplified ? 10 : 100;
  const [orderBy, setOrderBy] = useState("marketCap");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isFetching } = useGetCryptosQuery(
    { count, orderBy, orderDirection, referenceCurrencyUuid: currency.uuid },
    { pollingInterval: simplified ? 0 : 30000 }
  );

  if (isFetching && !data) return <Loader />;

  let coins = data?.data?.coins || [];
  if (watchlistOnly) coins = coins.filter((c) => watchIds.includes(c.uuid));
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    coins = coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );
  }

  return (
    <>
      {watchlistOnly && (
        <div className="page-head">
          <h2 className="heading">★ My Watchlist</h2>
          <p className="page-intro">
            Coins you're keeping an eye on — prices update live.
          </p>
        </div>
      )}

      {!simplified && !watchlistOnly && (
        <div className="crypto-toolbar">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search by name or symbol..."
            allowClear
            className="crypto-search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="toolbar-controls">
            <Select
              value={orderBy}
              onChange={setOrderBy}
              options={sortOptions}
              className="sort-select"
              size="large"
            />
            <Segmented
              size="large"
              value={orderDirection}
              onChange={setOrderDirection}
              options={[
                { label: "Desc", value: "desc" },
                { label: "Asc", value: "asc" },
              ]}
            />
          </div>
        </div>
      )}

      {coins.length === 0 ? (
        <Empty
          className="empty-state"
          description={
            watchlistOnly
              ? "Your watchlist is empty — tap the ★ on any coin to add it."
              : "No coins match your search."
          }
        />
      ) : (
        <Row gutter={[24, 24]} className="crypto-card-container">
          {coins.map((coin) => (
            <Col
              xs={24}
              sm={12}
              lg={8}
              xl={6}
              className="crypto-card"
              key={coin.uuid}
            >
              <Link to={`/coin/${coin.uuid}`}>
                <Card hoverable className="coin-card">
                  <div className="coin-card-head">
                    <div className="coin-id">
                      <img
                        className="crypto-image"
                        src={coin.iconUrl}
                        alt={coin.name}
                      />
                      <div className="coin-id-text">
                        <span className="coin-name">{coin.name}</span>
                        <span className="coin-symbol">
                          #{coin.rank} · {coin.symbol}
                        </span>
                      </div>
                    </div>
                    <WatchButton uuid={coin.uuid} />
                  </div>

                  <div className="coin-card-price-row">
                    <AnimatedPrice
                      value={coin.price}
                      sign={currency.sign}
                      className="coin-card-price"
                    />
                    <span
                      className={`change-chip ${isUp(coin.change) ? "up" : "down"}`}
                    >
                      {isUp(coin.change) ? "▲" : "▼"}{" "}
                      {Math.abs(Number(coin.change)).toFixed(2)}%
                    </span>
                  </div>

                  <Sparkline data={coin.sparkline} positive={isUp(coin.change)} />

                  <div className="coin-card-meta">
                    <span>Market Cap</span>
                    <span>{formatNumber(coin.marketCap)}</span>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};
