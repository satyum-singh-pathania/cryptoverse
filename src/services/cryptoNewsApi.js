// News via rss2json — bridges crypto RSS feeds to JSON with CORS enabled, so it
// works on deployed https sites (NewsAPI's free tier only allowed localhost).
// An optional VITE_RSS2JSON_KEY raises rate limits and unlocks the `count` param;
// without it we fetch the feed's default items and sort/slice on the client.
const RSS2JSON = "https://api.rss2json.com/v1/api.json";
const apiKey = import.meta.env.VITE_RSS2JSON_KEY;

export const NEWS_SOURCES = [
  { label: "Cointelegraph", value: "https://cointelegraph.com/rss" },
  { label: "CoinDesk", value: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { label: "Decrypt", value: "https://decrypt.co/feed" },
  { label: "CryptoSlate", value: "https://cryptoslate.com/feed/" },
];

const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const firstImage = (html = "") => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
};

export const fetchCryptoNews = async ({
  feedUrl,
  count = 12,
  sortBy = "latest",
}) => {
  const params = new URLSearchParams({ rss_url: feedUrl });
  if (apiKey) {
    params.set("api_key", apiKey);
    params.set("count", String(count));
  }

  const response = await fetch(`${RSS2JSON}?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch news data");

  const data = await response.json();
  if (data.status !== "ok") {
    throw new Error(data.message || "News feed unavailable");
  }

  const articles = (data.items || []).map((item) => ({
    title: item.title,
    url: item.link,
    image:
      item.thumbnail ||
      item.enclosure?.link ||
      firstImage(item.content || item.description) ||
      null,
    description: stripHtml(item.description || item.content || ""),
    source: data.feed?.title || "Crypto News",
    publishedAt: item.pubDate,
  }));

  articles.sort((a, b) => {
    const da = new Date(a.publishedAt).getTime();
    const db = new Date(b.publishedAt).getTime();
    return sortBy === "earliest" ? da - db : db - da;
  });

  return articles.slice(0, count);
};
