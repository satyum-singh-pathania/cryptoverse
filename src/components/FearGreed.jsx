import React, { useEffect, useState } from "react";
import { Progress } from "antd";

const colorFor = (v) => {
  if (v < 25) return "#ea3943";
  if (v < 45) return "#f7931a";
  if (v < 55) return "#f7a600";
  if (v < 75) return "#a0c43a";
  return "#16c784";
};

// Crypto Fear & Greed Index from the free, CORS-friendly alternative.me API.
const FearGreed = () => {
  const [fng, setFng] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("https://api.alternative.me/fng/?limit=1")
      .then((r) => r.json())
      .then((j) => active && setFng(j.data?.[0] || null))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const value = fng ? Number(fng.value) : 0;

  return (
    <div className="widget-card fng-card">
      <span className="widget-label">Fear &amp; Greed Index</span>
      <Progress
        type="dashboard"
        percent={value}
        strokeColor={colorFor(value)}
        size={148}
        format={() => (
          <span className="fng-inner">
            <span className="fng-value">{fng ? value : "—"}</span>
            <span className="fng-class">
              {fng?.value_classification || "Loading…"}
            </span>
          </span>
        )}
      />
    </div>
  );
};

export default FearGreed;
