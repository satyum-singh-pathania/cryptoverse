import React, { useEffect, useRef, useState } from "react";
import { formatPrice } from "../utils/format";

// Shows a formatted price and briefly flashes green/red when the value changes
// (used with RTK Query polling for a "live" feel).
const AnimatedPrice = ({ value, sign = "$", className = "" }) => {
  const prev = useRef(value);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    const a = Number(prev.current);
    const b = Number(value);
    prev.current = value;
    if (Number.isFinite(a) && Number.isFinite(b) && a !== b) {
      setFlash(b > a ? "up" : "down");
      const timer = setTimeout(() => setFlash(""), 900);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span className={`price-flash ${flash} ${className}`.trim()}>
      {formatPrice(value, sign)}
    </span>
  );
};

export default AnimatedPrice;
