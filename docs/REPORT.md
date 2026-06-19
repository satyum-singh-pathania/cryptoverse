# CryptoVerse — Project Report

A high-level overview of what the project is, the work carried out, the
technology behind it, and where it stands today.

---

## 1. Executive Summary

**CryptoVerse** is a real-time cryptocurrency dashboard built with React. It lets
users track live prices and charts for hundreds of coins, read market news,
browse exchanges, manage a personal portfolio with live profit/loss, keep a
watchlist, and gauge overall market sentiment.

The project began as an ageing Create React App demo with security issues and
deprecated dependencies. It has since been **modernised, secured, redesigned, and
significantly expanded** into a feature-rich, installable Progressive Web App.

Headline outcomes:

- Security vulnerabilities reduced from **68 to 0**.
- Build tooling migrated from the deprecated Create React App to **Vite**.
- Dependency count cut from roughly **1,500 to 524** packages.
- A complete **dark/light themed UI** with a gold accent identity.
- Eight major **new user features** (portfolio, watchlist, live prices, and more).

---

## 2. What the Project Is

CryptoVerse is a single-page application (SPA) that talks directly to public
crypto data APIs from the browser. There is no custom backend; user data
(portfolio, watchlist, preferences) is stored locally in the browser.

Core sections:

- **Home** — global market stats, Fear & Greed index, top gainers/losers, a
  preview of the top coins and latest news.
- **Cryptocurrencies** — searchable, sortable list of coins with live prices
  and trend sparklines.
- **Coin details** — full statistics, an interactive price-history chart, a
  currency converter, and links.
- **Portfolio** — track holdings and live profit/loss with an allocation chart.
- **Watchlist** — a personal shortlist of starred coins.
- **Exchanges** — a ranked list of crypto exchanges.
- **News** — filterable crypto news feed.

---

## 3. Work Completed

The project was delivered in four phases.

### Phase 1 — Audit & Modernisation

- Performed a deep audit: hardcoded API keys, 68 npm vulnerabilities, and many
  deprecated/dead dependencies were identified.
- Migrated the build system from **Create React App to Vite 8**.
- Upgraded all major libraries: **React 19, Ant Design 6, React Router 7**,
  Redux Toolkit 2, and replaced `moment` with `dayjs`.
- Removed unused dependencies (`axios`, `newsapi`, `html-react-parser`) and the
  obsolete service-worker tooling.
- Moved all API keys into a git-ignored `.env` file.

### Phase 2 — UI Redesign

- Built a **modern dark-dashboard design system** with a gold/amber accent.
- Added a full **dark/light theme** with a toggle, driven by Ant Design's theme
  engine and CSS variables.
- Replaced brittle responsive hacks with proper grid/flex layouts that adapt
  cleanly from desktop to mobile.

### Phase 3 — Feature Expansion

- **Portfolio** with live profit/loss and an allocation donut chart.
- **Watchlist** of starred coins.
- **Live prices** that auto-refresh and flash green/red on change.
- **Sparklines** (mini trend charts) on every coin card.
- **Sort & filter** controls and a **Top Gainers / Top Losers** section.
- **Fear & Greed index** and accurate **global market stats** widgets.
- A global **currency selector** (USD, EUR, GBP, BTC, ETH).
- A **price converter** on each coin detail page.

### Phase 4 — Navigation Redesign

- Restructured the sidebar: brand on top, navigation in the middle, and the
  **theme toggle + currency selector pinned to the bottom**.
- Added gradient backgrounds, an active-item highlight, and a polished mobile
  drop-down menu.

---

## 4. Technology Stack

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
| Testing | Vitest (configured) |

Data sources: **Coinranking** (via RapidAPI), **CoinGecko**, **NewsAPI**, and
**alternative.me** (Fear & Greed).

---

## 5. Key Metrics — Before vs After

| Metric | Before | After |
| --- | --- | --- |
| Security vulnerabilities | 68 (2 critical, 32 high) | 0 |
| Build tool | Create React App (deprecated) | Vite 8 |
| Installed packages | ~1,500 | 524 |
| Theme support | Light only | Dark + Light toggle |
| User features | Read-only browsing | Portfolio, watchlist, live data, widgets |
| API key handling | Hardcoded in source | Environment variables |

---

## 6. Known Limitations

- **News in production** — NewsAPI's free tier only allows requests from
  `localhost`, so the news feed will not load on a deployed site. It fails
  gracefully with a message. A small server-side proxy or alternative source is
  required to fix this in production.
- **API key rotation pending** — the original keys were moved to `.env` but not
  yet revoked; they remain in git history and should be rotated.
- **Demo data key** — the Coinranking demo key returns a truncated global market
  cap, so global statistics are sourced from CoinGecko instead.
- **Bundle size** — the initial JavaScript bundle is ~1.1 MB; route-level code
  splitting would reduce it.
- **Automated tests** — Vitest is configured but no test suites have been written
  yet.

---

## 7. Future Roadmap

- Server-side proxy (e.g. a serverless function) to fix news and fully hide keys.
- Route-level code splitting to cut initial load time.
- Price alerts via the existing PWA service worker (push notifications).
- A broader visual pass: bento-grid dashboard, richer cards, and motion.
- A test suite covering state logic and key components.

---

## 8. Conclusion

CryptoVerse has evolved from an insecure, outdated demo into a modern, secure,
and feature-rich crypto dashboard. The foundations — current tooling, a clean
theming system, persistent local state, and a flexible API layer — make it
straightforward to extend further. The remaining items are well understood and
documented, providing a clear path forward.
