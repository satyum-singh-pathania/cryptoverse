const apiKey = import.meta.env.VITE_NEWS_API_KEY;

export const fetchCryptoNews = async (
  newsCategory,
  count,
  searchQuery,
  sortBy
) => {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${
      newsCategory || searchQuery
    }&pageSize=${count}&sortBy=${sortBy}&apiKey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news data");
  }

  return response.json();
};
