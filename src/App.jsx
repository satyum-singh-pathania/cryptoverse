import React from "react";
import "./App.css";
import { Route, Link, Routes } from "react-router-dom";
import { Layout, Typography, Space } from "antd";

import {
  Navbar,
  Exchanges,
  News,
  Cryptocurrencies,
  HomePage,
  CryptoDetails,
  Portfolio,
} from "./components";

function App() {
  return (
    <div className="app">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main">
        <Layout>
          <div className="routes">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exchanges" element={<Exchanges />} />
              <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
              <Route path="/watchlist" element={<Cryptocurrencies watchlistOnly />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/coin/:uuid" element={<CryptoDetails />} />
              <Route path="/news" element={<News />} />
            </Routes>
          </div>
        </Layout>
        <div className="footer">
          <Typography.Title
            level={5}
            style={{ color: "white", textAlign: "center" }}
          >
            Copyright © {new Date().getFullYear()}{" "}
            <Link to="/">CryptoVerse Inc.</Link> <br />
            All Rights Reserved.
          </Typography.Title>
          <Space>
            <Link to="/">Home</Link>
            <Link to="/exchanges">Exchanges</Link>
            <Link to="/news">News</Link>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default App;
