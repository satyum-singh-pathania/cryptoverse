import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "favicon.svg",
        "apple-touch-icon.png",
      ],
      manifest: {
        short_name: "CryptoVerse",
        name: "CryptoVerse — Live Crypto Prices & Portfolio",
        start_url: ".",
        display: "standalone",
        theme_color: "#0b0e14",
        background_color: "#0b0e14",
        icons: [
          { src: "favicon.svg", sizes: "any", type: "image/svg+xml" },
          { src: "logo192.png", sizes: "192x192", type: "image/png" },
          { src: "logo512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
