import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import { Cryptocurrencies } from "./Cryptocurrencies";
import { News } from "./News";
import GlobalStats from "./GlobalStats";
import FearGreed from "./FearGreed";
import MarketMovers from "./MarketMovers";

const { Title } = Typography;

export const HomePage = () => {
  return (
    <div>
      <Title level={2} className="heading">
        Global Crypto Stats
      </Title>
      <p className="page-intro">
        A real-time snapshot of the cryptocurrency market.
      </p>
      <GlobalStats />

      <div className="widgets-grid">
        <FearGreed />
        <MarketMovers />
      </div>

      <div className="home-heading-container">
        <Title level={2} className="home-title">
          Top 10 Cryptocurrencies
        </Title>
        <Title level={4} className="show-more">
          <Link to="/cryptocurrencies">Show More →</Link>
        </Title>
      </div>
      <Cryptocurrencies simplified />

      <div className="home-heading-container">
        <Title level={2} className="home-title">
          Latest Crypto News
        </Title>
        <Title level={4} className="show-more">
          <Link to="/news">Show More →</Link>
        </Title>
      </div>
      <News simplified />
    </div>
  );
};
