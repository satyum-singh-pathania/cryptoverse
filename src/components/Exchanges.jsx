import React from "react";
import { useGetCryptoExchangeQuery } from "../services/cryptoExchange";
import { Row, Col, Typography, Avatar, Collapse } from "antd";
import { millify } from "millify";
import Loader from "./Loader";

const { Text } = Typography;

const Exchanges = () => {
  const { data, isFetching } = useGetCryptoExchangeQuery();
  if (isFetching) return <Loader />;

  const items = data?.map((exchange) => ({
    key: exchange.id,
    showArrow: false,
    label: (
      <Row>
        <Col span={6}>
          <Avatar className="exchange-image" src={exchange.image} />
          <Text>{exchange.name}</Text>
        </Col>
        <Col span={6}>
          {millify(exchange.trade_volume_24h_btc_normalized || 0)}
        </Col>
        <Col span={6}>{exchange.trust_score}</Col>
        <Col span={6}>
          <a href={exchange.url} target="_blank" rel="noreferrer">
            {exchange.name}'s Official Website
          </a>
        </Col>
      </Row>
    ),
    children: exchange.description ? (
      <p>{exchange.description}</p>
    ) : (
      `Sorry, no description found, but you can check out ${exchange.name}'s official website (link above) for more info. Thanks!`
    ),
  }));

  return (
    <>
      <Row className="exchanges-head">
        <Col span={6}>Exchanges</Col>
        <Col span={6}>24h Trading Volume</Col>
        <Col span={6}>Trust Score</Col>
        <Col span={6}>Link</Col>
      </Row>

      <Collapse items={items} />
    </>
  );
};

export default Exchanges;
