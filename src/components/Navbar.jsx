import React, { useState, useEffect } from "react";
import { Menu, Select } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HomeOutlined,
  FundOutlined,
  MoneyCollectOutlined,
  BulbOutlined,
  WalletOutlined,
  StarOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useTheme } from "../theme/ThemeProvider";
import { CURRENCIES } from "../constants/currencies";
import { selectCurrency, setCurrency } from "../features/settingsSlice";

const navItems = [
  { key: "/", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
  {
    key: "/cryptocurrencies",
    icon: <FundOutlined />,
    label: <Link to="/cryptocurrencies">Cryptocurrencies</Link>,
  },
  {
    key: "/portfolio",
    icon: <WalletOutlined />,
    label: <Link to="/portfolio">Portfolio</Link>,
  },
  {
    key: "/watchlist",
    icon: <StarOutlined />,
    label: <Link to="/watchlist">Watchlist</Link>,
  },
  {
    key: "/exchanges",
    icon: <MoneyCollectOutlined />,
    label: <Link to="/exchanges">Exchanges</Link>,
  },
  { key: "/news", icon: <BulbOutlined />, label: <Link to="/news">News</Link> },
];

const currencyOptions = CURRENCIES.map((c) => ({
  value: c.uuid,
  label: `${c.sign} ${c.symbol}`,
}));

const isMobileWidth = () =>
  typeof window !== "undefined" && window.innerWidth <= 992;

export const Navbar = () => {
  const { mode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(isMobileWidth);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobileWidth();
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedKey = pathname.startsWith("/coin")
    ? "/cryptocurrencies"
    : navItems.find((item) => item.key === pathname)?.key || "/";

  const closeOnMobile = () => isMobile && setMenuOpen(false);
  const showBody = !isMobile || menuOpen;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand" onClick={closeOnMobile}>
          <span className="brand-logo">₿</span>
          <span className="brand-name">
            Crypto<span className="accent">Verse</span>
          </span>
        </Link>
        <button
          className="icon-btn menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <MenuOutlined />
        </button>
      </div>

      {showBody && (
        <div className="sidebar-body">
          <Menu
            className="sidebar-nav"
            mode="inline"
            theme={mode}
            selectedKeys={[selectedKey]}
            items={navItems}
            onClick={closeOnMobile}
          />

          <div className="sidebar-footer">
            <div className="footer-row">
              <span className="footer-label">Currency</span>
              <Select
                className="currency-select"
                size="small"
                value={currency.uuid}
                onChange={(uuid) =>
                  dispatch(
                    setCurrency(CURRENCIES.find((c) => c.uuid === uuid))
                  )
                }
                options={currencyOptions}
                popupMatchSelectWidth={false}
                aria-label="Select display currency"
              />
            </div>
            <div className="footer-row">
              <span className="footer-label">Theme</span>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle color theme"
              >
                <span className="theme-toggle-icon">
                  {mode === "dark" ? "☀️" : "🌙"}
                </span>
                <span className="theme-toggle-text">
                  {mode === "dark" ? "Light" : "Dark"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
