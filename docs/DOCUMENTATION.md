# CryptoVerse — Technical Documentation

Developer reference for the CryptoVerse codebase: setup, structure, architecture,
state, APIs, theming, and how to extend the project.

---

## 1. Getting Started

**Prerequisites:** Node.js 20.19+ or 22.12+ and npm.

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

You need free API keys from RapidAPI (Coinranking) and NewsAPI. The CoinGecko key
is optional. All keys live in `.env`, which is git-ignored.

**npm scripts:**

| Script | Action |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run Vitest |

---

## 2. Project Structure

```
cryptoverse/
├─ index.html               App entry HTML (Vite)
├─ vite.config.js           Vite + PWA + Vitest config
├─ .env / .env.example      API keys
├─ public/                  Static assets (icons, robots.txt)
└─ src/
   ├─ main.jsx              React entry: Router + Redux + Theme providers
   ├─ App.jsx               Layout + routes
   ├─ App.css               Full design system (themes, layout, components)
   ├─ app/
   │  ├─ store.js           Redux store + persistence subscriber
   │  └─ storage.js         localStorage load/save helpers
   ├─ features/             Redux state slices
   │  ├─ watchlistSlice.js
   │  ├─ portfolioSlice.js
   │  └─ settingsSlice.js
   ├─ services/             RTK Query API definitions
   │  ├─ cryptoApi.js       Coinranking (coins, details, history)
   │  ├─ cryptoExchange.js  CoinGecko (exchanges, global stats)
   │  └─ cryptoNewsApi.js   NewsAPI (news fetch)
   ├─ theme/ThemeProvider.jsx   Dark/light theme + Ant Design config
   ├─ constants/currencies.js   Currency UUIDs
   ├─ utils/format.js           Price/number/percent formatting
   └─ components/               UI components (see section 7)
```

---

## 3. Architecture & Data Flow

CryptoVerse is a client-only SPA. The data flow is:

```
External APIs  ->  RTK Query / fetch  ->  Redux store  ->  React components
```

The core mental model:

> A user action dispatches to a Redux slice; components re-read state with
> `useSelector`; data queries re-run when their arguments change; the UI updates.
> State that must survive a refresh is mirrored to `localStorage`; all visual
> theming is driven by CSS variables and Ant Design's theme engine.

Provider nesting (in `main.jsx`):

```
Router > Redux Provider > ThemeProvider > App
```

---

## 4. State Management

State lives in Redux Toolkit slices under `src/features/`.

| Slice | State | Actions |
| --- | --- | --- |
| `watchlistSlice` | `ids: []` | `toggleWatch(uuid)` |
| `portfolioSlice` | `holdings: []` | `addHolding`, `removeHolding` |
| `settingsSlice` | `currency` | `setCurrency` |

**Persistence.** `src/app/store.js` subscribes to the store and writes the three
user slices to `localStorage` on every change. Each slice reads its initial value
back on startup via `loadState`.

```js
store.subscribe(() => {
  const state = store.getState();
  saveState("cv-watchlist", state.watchlist.ids);
  saveState("cv-portfolio", state.portfolio.holdings);
  saveState("cv-currency", state.settings.currency);
});
```

**localStorage keys:** `cv-theme`, `cv-watchlist`, `cv-portfolio`, `cv-currency`.

A holding object has the shape:

```
{ id, uuid, name, symbol, iconUrl, quantity, buyPrice }
```

`buyPrice` is always stored in USD so profit/loss math stays consistent
regardless of the selected display currency.

---

## 5. API Layer

Three data sources, each defined with RTK Query (or a plain `fetch`).

### Coinranking — `services/cryptoApi.js`

| Hook | Returns |
| --- | --- |
| `useGetCryptosQuery(args)` | List of coins (+ sparklines) |
| `useGetCryptoDetailsQuery(args)` | Full detail for one coin |
| `useGetCryptoHistoryQuery(args)` | Price history for the chart |

`getCryptos` accepts `{ count, orderBy, orderDirection, referenceCurrencyUuid }`:

- `orderBy` / `orderDirection` drive **sorting** (`marketCap`, `price`,
  `24hVolume`, `change`). Top Gainers = `change` + `desc`; Top Losers = `asc`.
- `referenceCurrencyUuid` makes the API return prices in the chosen currency.

**Live prices** use RTK Query polling:

```js
useGetCryptosQuery(args, { pollingInterval: 30000 }); // refetch every 30s
```

### CoinGecko — `services/cryptoExchange.js`

| Hook | Returns |
| --- | --- |
| `useGetCryptoExchangeQuery()` | Ranked exchanges |
| `useGetGlobalStatsQuery()` | Global market cap, BTC dominance, 24h change |

Global stats come from CoinGecko because the Coinranking demo key returns a
truncated total market cap.

### NewsAPI — `services/cryptoNewsApi.js`

`fetchCryptoNews(category, count, searchQuery, sortBy)` calls NewsAPI directly.
Note: the free tier only works from `localhost`.

### alternative.me

The Fear & Greed index is fetched directly inside `components/FearGreed.jsx`.

---

## 6. Theming System

`src/theme/ThemeProvider.jsx` controls both layers of the theme:

1. **Ant Design components** — a `ConfigProvider` swaps `darkAlgorithm` /
   `defaultAlgorithm` and sets `colorPrimary` to the gold accent `#f7a600`.
2. **Custom CSS** — a `data-theme="dark" | "light"` attribute on the `<html>`
   element flips CSS variables defined in `App.css` (`--bg`, `--text`,
   `--card-bg`, and so on).

Usage:

```jsx
import { useTheme } from "../theme/ThemeProvider";
const { mode, toggleTheme } = useTheme();
```

The chosen mode persists to `localStorage` under `cv-theme`.

---

## 7. Components Reference

| Component | Purpose |
| --- | --- |
| `Navbar` | Sidebar: brand, navigation, currency + theme controls |
| `HomePage` | Composes global stats, widgets, top coins, news |
| `Cryptocurrencies` | Coin grid with search/sort; also serves watchlist mode |
| `CryptoDetails` | Single coin: stats, chart, converter, links |
| `Portfolio` | Holdings, live P&L, allocation donut |
| `Exchanges` | Ranked exchange list |
| `News` | Filterable news feed |
| `LineChart` | Price-history chart (theme-aware) |
| `Sparkline` | Inline-SVG mini trend chart |
| `AnimatedPrice` | Price that flashes green/red on change |
| `WatchButton` | Star toggle for the watchlist |
| `Converter` | Coin-to-fiat calculator |
| `GlobalStats` | Global market stat tiles |
| `FearGreed` | Fear & Greed gauge |
| `MarketMovers` | Top gainers / losers lists |
| `Loader` | Loading spinner |

---

## 8. Key Feature Logic

**Sparkline** (`Sparkline.jsx`) — draws a hand-built SVG `<path>` from the 24
price points the API returns, normalised with `(price - min) / range`. Using SVG
instead of a Chart.js canvas keeps 100 cards fast.

**AnimatedPrice** (`AnimatedPrice.jsx`) — a `useRef` stores the previous price; a
`useEffect` compares old vs new on each render and flashes green (up) or red
(down) for ~900 ms.

**WatchButton** (`WatchButton.jsx`) — cards are wrapped in a `<Link>`, so the
star calls `preventDefault()` and `stopPropagation()` to avoid navigating when
toggled.

**Portfolio P&L** (`Portfolio.jsx`) — for each holding:

```
value = currentPrice * quantity
cost  = buyPrice * quantity
pnl   = value - cost
pnl%  = pnl / cost * 100
```

The portfolio always values in USD (`USD_UUID`) so buy-price math is unaffected
by the display currency.

**Currency threading** — the navbar dispatches `setCurrency`; every data-driven
component reads `useSelector(selectCurrency)` and passes `currency.uuid` into its
query. RTK Query treats the new argument as a new request and refetches, so one
dropdown re-prices the whole app.

---

## 9. Routing

Defined in `App.jsx` with React Router 7:

| Path | Component |
| --- | --- |
| `/` | HomePage |
| `/cryptocurrencies` | Cryptocurrencies |
| `/watchlist` | Cryptocurrencies (watchlist mode) |
| `/portfolio` | Portfolio |
| `/coin/:uuid` | CryptoDetails |
| `/exchanges` | Exchanges |
| `/news` | News |

---

## 10. Environment Variables

All client variables must be prefixed with `VITE_` to be exposed to the app.

| Variable | Purpose |
| --- | --- |
| `VITE_RAPIDAPI_KEY` | Coinranking key (RapidAPI) |
| `VITE_RAPIDAPI_HOST` | Coinranking host |
| `VITE_NEWS_API_KEY` | NewsAPI key |
| `VITE_COINGECKO_API_KEY` | CoinGecko key (optional) |

Note: in a pure client app, these values ship in the built JavaScript and are not
truly secret. To keep keys private, proxy the requests through a backend.

---

## 11. How to Extend

**Add a new page:**

1. Create a component in `src/components/` and export it from
   `src/components/index.js`.
2. Add a `<Route>` in `App.jsx`.
3. Add an entry to `navItems` in `Navbar.jsx`.

**Add a new piece of persistent state:**

1. Create a slice in `src/features/`.
2. Register its reducer in `src/app/store.js` and persist it in the subscriber.
3. Read it anywhere with `useSelector`.

**Add a new API endpoint:**

1. Add an `endpoints` entry to the relevant file in `src/services/`.
2. Export the generated hook and use it in a component.

---

## 12. Build & Deploy

- `npm run build` outputs a static site to `dist/`.
- Any static host (Vercel, Netlify, GitHub Pages) can serve it.
- Set the `VITE_*` environment variables in the host's dashboard.
- The app is an installable PWA; the service worker is generated at build time by
  `vite-plugin-pwa`.
