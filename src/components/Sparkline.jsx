import React from "react";

// Lightweight inline-SVG sparkline — cheap enough to render on 100 cards
// (unlike a Chart.js canvas per card).
const Sparkline = ({ data = [], positive = true, width = 140, height = 40 }) => {
  const points = data.map(Number).filter(Number.isFinite);
  if (points.length < 2) return <div className="sparkline-empty" />;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const color = positive ? "#16c784" : "#ea3943";

  const coords = points.map((p, i) => [
    i * step,
    height - ((p - min) / range) * (height - 4) - 2,
  ]);
  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gradId = `spark-${positive ? "up" : "down"}`;

  return (
    <svg
      className="sparkline"
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} stroke="none" />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Sparkline;
