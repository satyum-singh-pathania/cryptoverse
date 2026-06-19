import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

const ThemeContext = createContext({ mode: "dark", toggleTheme: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

const ACCENT = "#f7a600";
const ACCENT_HOVER = "#ffb929";

const getInitialMode = () => {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("cv-theme") || "dark";
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
    localStorage.setItem("cv-theme", mode);
  }, [mode]);

  const toggleTheme = () =>
    setMode((current) => (current === "dark" ? "light" : "dark"));

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  const isDark = mode === "dark";

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: isDark
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: ACCENT,
            colorInfo: ACCENT,
            colorLink: ACCENT,
            colorLinkHover: ACCENT_HOVER,
            borderRadius: 12,
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            colorBgBase: isDark ? "#0b0e14" : "#f4f6fb",
          },
          components: {
            Card: {
              colorBgContainer: isDark
                ? "rgba(255,255,255,0.035)"
                : "#ffffff",
            },
            Menu: {
              colorBgContainer: "transparent",
              itemSelectedColor: ACCENT,
              itemSelectedBg: isDark
                ? "rgba(247,166,0,0.14)"
                : "rgba(247,166,0,0.12)",
              itemHoverColor: ACCENT,
            },
            Layout: {
              bodyBg: "transparent",
              headerBg: "transparent",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
