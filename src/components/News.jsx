import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, Select } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchCryptoNews } from "../services/cryptoNewsApi";
import Avvvatars from "avvvatars-react";
import Loader from "./Loader";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const categoryOptions = [
  "Cryptocurrency",
  "Blockchain",
  "Finance",
  "Technology",
  "Regulation",
  "Industry Updates",
].map((value) => ({ label: value, value }));

const sortOptions = [
  { label: "Latest", value: "publishedAt" },
  { label: "Earliest", value: "-publishedAt" },
];

export const News = ({ simplified }) => {
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery] = useState("");
  const [category, setCategory] = useState("Cryptocurrency");
  const [sortBy, setSortBy] = useState("publishedAt");
  const count = simplified ? 10 : 100;

  useEffect(() => {
    const getCryptoNews = async () => {
      setLoading(true);
      try {
        const newsData = await fetchCryptoNews(category, count, searchQuery, sortBy);
        setCryptoNews(newsData.articles);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getCryptoNews();
  }, [count, category, searchQuery, sortBy]);

  if (loading) return <Loader />;
  if (error) return <p className="news-error">{error}</p>;

  return (
    <>
      {!simplified && (
        <div className="news-filters">
          <Select
            defaultValue="Cryptocurrency"
            style={{ width: 150, margin: "0 10px" }}
            onChange={(value) => setCategory(value)}
            size="middle"
            className="news-select"
            options={categoryOptions}
          />
          <Select
            defaultValue="publishedAt"
            style={{ width: 150 }}
            onChange={(value) => setSortBy(value)}
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

                  <img src={news.urlToImage} alt="news" className="img" />
                </div>
                <p>
                  {news.description && news.description.length > 200
                    ? `${news.description.substring(0, 200)}...`
                    : news.description}
                </p>
                <div className="provider-container">
                  <div>
                    <Avvvatars
                      value={news.source.name}
                      displayValue={news.source.name.slice(0, 2).toUpperCase()}
                    />
                    <Text className="provider-name">{news.source.name}</Text>
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
