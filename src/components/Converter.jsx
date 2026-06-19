import React, { useState } from "react";
import { InputNumber } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { formatPrice } from "../utils/format";

// Simple coin <-> fiat converter for the coin detail page.
const Converter = ({ price, symbol, sign = "$" }) => {
  const [amount, setAmount] = useState(1);
  const result = (Number(amount) || 0) * Number(price);

  return (
    <div className="converter widget-card">
      <span className="widget-label">Converter</span>
      <div className="converter-row">
        <InputNumber
          value={amount}
          onChange={setAmount}
          min={0}
          size="large"
          addonAfter={symbol}
          className="converter-input"
        />
        <SwapOutlined className="converter-icon" />
        <div className="converter-result">{formatPrice(result, sign)}</div>
      </div>
    </div>
  );
};

export default Converter;
