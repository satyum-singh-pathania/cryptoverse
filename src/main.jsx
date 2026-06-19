import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import "antd/dist/reset.css";
import App from "./App";
import store from "./app/store";
import { ThemeProvider } from "./theme/ThemeProvider";
import reportWebVitals from "./reportWebVitals";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </Router>
  </React.StrictMode>
);

// Pass a function to log results, e.g. reportWebVitals(console.log). https://bit.ly/CRA-vitals
reportWebVitals();
