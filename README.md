# 💰 CryptoVerse

> A real-time cryptocurrency dashboard — live prices, interactive charts, a personal portfolio with profit/loss tracking, a watchlist, market sentiment, and news. Built as an installable Progressive Web App.

## 👀 [Live Demo](https://crypto-verse-pwa.vercel.app/)

CryptoVerse lets you track hundreds of coins in real time, dig into detailed
stats and price history, manage a portfolio, and gauge the mood of the market —
all in a fast, responsive, dark/light themed interface.

---

## ✨ Features

| | Feature |
| --- | --- |
| 📈 | **Live prices** — auto-refresh every 30s with green/red flash on change |
| 📊 | **Sparklines** — a 7-day trend chart on every coin card |
| 💼 | **Portfolio** — track holdings with live profit/loss and an allocation donut |
| ⭐ | **Watchlist** — star coins to a personal, persistent list |
| 🔃 | **Sort & filter** — by market cap, price, volume, or 24h change |
| 🚀 | **Market movers** — top gainers / losers at a glance |
| 😨 | **Fear & Greed index** + accurate global stats & BTC dominance |
| 💱 | **Currency selector** — USD, EUR, GBP, BTC, ETH (re-prices the whole app) |
| 🧮 | **Converter** — coin-to-fiat calculator on each detail page |
| 🌗 | **Dark / light themes** with a gold accent and one-tap toggle |
| 📰 | **News** — filterable crypto news feed |
| 📱 | **PWA** — installable, offline-capable, app-like experience |

---

## 🚀 Getting Started

**Prerequisites:** Node.js 20.19+ or 22.12+

```bash
# 1. Install dependencies
npm install

# 2. Configure API keys
cp .env.example .env   # then fill in your own keys

# 3. Start the dev server
npm run dev

# Production build / preview
npm run build
npm run preview
```

You'll need free API keys from [RapidAPI (Coinranking)](https://rapidapi.com/Coinranking/api/coinranking1)
and [NewsAPI](https://newsapi.org/). The [CoinGecko](https://www.coingecko.com/en/api)
key is optional. Keys live in `.env`, which is git-ignored — never commit it.

> **Note:** NewsAPI's free tier only allows requests from `localhost`, so the news
> feed works in development but not on a deployed site. A small server-side proxy
> or an alternative source is needed for production.

---

## 🛠 Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 19 |
| Build tool | Vite 8 |
| UI library | Ant Design 6 |
| State / data | Redux Toolkit 2 + RTK Query |
| Routing | React Router 7 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Dates | Day.js |
| PWA | vite-plugin-pwa (Workbox) |
| Testing | Vitest |

**Data sources:** Coinranking (RapidAPI), CoinGecko, NewsAPI, and alternative.me
(Fear & Greed).

---

## 📁 Project Structure

```
src/
├─ main.jsx            React entry: Router + Redux + Theme providers
├─ App.jsx             Layout + routes
├─ App.css             Design system (themes, layout, components)
├─ app/                Redux store + localStorage persistence
├─ features/           State slices: watchlist, portfolio, settings
├─ services/           RTK Query APIs (Coinranking, CoinGecko, NewsAPI)
├─ theme/              Dark/light theme provider
├─ utils/format.js     Price / money / number formatting
└─ components/         UI components & pages
```

---

## 📚 Documentation

Full technical documentation and a project report are in [`docs/`](./docs):

- [`DOCUMENTATION.md`](./docs/DOCUMENTATION.md) — architecture, state, APIs, theming, how to extend
- [`REPORT.md`](./docs/REPORT.md) — project overview, work completed, metrics
- `CryptoVerse-Documentation.pdf` — both, as a styled PDF (`node docs/build-pdf.mjs` to rebuild)

---

## 📄 License

Released under the [MIT License](./LICENSE).
