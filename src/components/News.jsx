import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, Select } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchCryptoNews, NEWS_SOURCES } from "../services/cryptoNewsApi";
import Avvvatars from "avvvatars-react";
import Loader from "./Loader";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const sourceOptions = NEWS_SOURCES.map((s) => ({
  label: s.label,
  value: s.value,
}));
const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Earliest", value: "earliest" },
];

export const News = ({ simplified }) => {
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedUrl, setFeedUrl] = useState(NEWS_SOURCES[0].value);
  const [sortBy, setSortBy] = useState("latest");
  const count = simplified ? 9 : 30;

  useEffect(() => {
    let active = true;
    const getCryptoNews = async () => {
      setLoading(true);
      try {
        const articles = await fetchCryptoNews({ feedUrl, count, sortBy });
        if (!active) return;
        setCryptoNews(articles);
        setError(null);
      } catch (err) {
        console.error(err);
        if (active) setError("Failed to load news. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    };
    getCryptoNews();
    return () => {
      active = false;
    };
  }, [feedUrl, count, sortBy]);

  if (loading) return <Loader />;
  if (error) return <p className="news-error">{error}</p>;

  return (
    <>
      {!simplified && (
        <div className="news-filters">
          <Select
            value={feedUrl}
            style={{ width: 180 }}
            onChange={setFeedUrl}
            size="middle"
            className="news-select"
            options={sourceOptions}
          />
          <Select
            value={sortBy}
            style={{ width: 150 }}
            onChange={setSortBy}
            size="middle"
            className="news-select"
            options={sortOptions}
          />
        </div>
      )}
      <Row gutter={[24, 24]} className="crypto-card-container">
        {cryptoNews.map((news, i) => (
          <Col xs={24} sm={12} lg={8} key={news.url || i} className="crypto-card">
            <Card hoverable className="news-card">
              <a href={news.url} target="_blank" rel="noreferrer">
                <div className="news-image-container">
                  <Title className="news-title" level={4}>
                    {news.title && news.title.length > 60
                      ? `${news.title.substring(0, 60)}...`
                      : news.title}
                  </Title>
                  {news.image && (
                    <img src={news.image} alt="news" className="img" />
                  )}
                </div>
                <p>
                  {news.description && news.description.length > 200
                    ? `${news.description.substring(0, 200)}...`
                    : news.description}
                </p>
                <div className="provider-container">
                  <div>
                    <Avvvatars
                      value={news.source}
                      displayValue={news.source.slice(0, 2).toUpperCase()}
                    />
                    <Text className="provider-name">{news.source}</Text>
                  </div>
                  <Text>{dayjs(news.publishedAt).fromNow()}</Text>
                </div>
              </a>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};
