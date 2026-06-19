import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row, Typography, Select } from "antd";
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} from "../services/cryptoApi";
import { selectCurrency } from "../features/settingsSlice";
import { formatPrice, formatNumber } from "../utils/format";
import LineChart from "./LineChart";
import Converter from "./Converter";
import WatchButton from "./WatchButton";
import Loader from "./Loader";

const { Title, Text } = Typography;

const timePeriods = ["3h", "24h", "7d", "30d", "1y", "3m", "3y", "5y"];

export const CryptoDetails = () => {
  const { uuid } = useParams();
  const currency = useSelector(selectCurrency);
  const [timePeriod, setTimePeriod] = useState("7d");
  const { data, isFetching } = useGetCryptoDetailsQuery({
    uuid,
    referenceCurrencyUuid: currency.uuid,
  });
  const { data: coinHistory } = useGetCryptoHistoryQuery({
    uuid,
    timePeriod,
    referenceCurrencyUuid: currency.uuid,
  });
  const cryptoDetails = data?.data?.coin;

  if (isFetching || !cryptoDetails) return <Loader />;

  const sign = currency.sign;
  const stats = [
    { title: "Price", value: formatPrice(cryptoDetails.price, sign), icon: <DollarCircleOutlined /> },
    { title: "Rank", value: cryptoDetails.rank, icon: <NumberOutlined /> },
    { title: "24h Volume", value: `${sign}${formatNumber(cryptoDetails["24hVolume"])}`, icon: <ThunderboltOutlined /> },
    { title: "Market Cap", value: `${sign}${formatNumber(cryptoDetails.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: "All-time High", value: formatPrice(cryptoDetails.allTimeHigh?.price, sign), icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: "Number Of Markets", value: cryptoDetails.numberOfMarkets, icon: <FundOutlined /> },
    { title: "Number Of Exchanges", value: cryptoDetails.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: "Approved Supply", value: cryptoDetails.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: "Total Supply", value: `${sign}${formatNumber(cryptoDetails.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
    { title: "Circulating Supply", value: `${sign}${formatNumber(cryptoDetails.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {cryptoDetails.name} ({cryptoDetails.symbol}){" "}
          <WatchButton uuid={cryptoDetails.uuid} stop={false} className="detail-watch" />
        </Title>
        <p>
          {cryptoDetails.name} live price in {currency.symbol}. View value
          statistics, market cap and supply.
        </p>
      </Col>

      <Select
        defaultValue="7d"
        className="select-timeperiod"
        placeholder="Select Time Period"
        onChange={(value) => setTimePeriod(value)}
        options={timePeriods.map((period) => ({ label: period, value: period }))}
      />

      <LineChart
        coinHistory={coinHistory}
        currentPrice={formatPrice(cryptoDetails.price, sign)}
        coinName={cryptoDetails.name}
      />

      <Converter price={cryptoDetails.price} symbol={cryptoDetails.symbol} sign={sign} />

      <Col className="stats-container">
        <Col className="coin-value-statistic">
          <Col className="coin-value-statistic-heading">
            <Title level={3} className="coin-details-heading">
              {cryptoDetails.name} Value Statistics
            </Title>
            <p>An overview showing the stats of {cryptoDetails.name}</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>

        <Col className="other-stats-info">
          <Col className="coin-value-statistic-heading">
            <Title level={3} className="coin-details-heading">
              Other Statistics
            </Title>
            <p>An overview showing the stats of all cryptocurrencies</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>

      <Col className="coin-desc-link">
        <Col className="coin-desc">
          <Title level={3} className="coin-details-heading">
            What is {cryptoDetails.name}?
          </Title>
          <p>{cryptoDetails.description}</p>
        </Col>
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">
            {cryptoDetails.name} Links
          </Title>
          {cryptoDetails.links?.map((link) => (
            <Row className="coin-link" key={`${link.type}-${link.name}`}>
              <Title level={5} className="link-name">
                {link.type}
              </Title>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.name}
              </a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
};
