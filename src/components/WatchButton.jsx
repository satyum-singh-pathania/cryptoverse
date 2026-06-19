import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { toggleWatch, selectWatchlist } from "../features/watchlistSlice";

// Star toggle for the watchlist. `stop` prevents the click from bubbling to a
// parent <Link> (so starring a card doesn't navigate to the coin page).
const WatchButton = ({ uuid, stop = true, className = "" }) => {
  const dispatch = useDispatch();
  const ids = useSelector(selectWatchlist);
  const active = ids.includes(uuid);

  const handleClick = (e) => {
    if (stop) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch(toggleWatch(uuid));
  };

  return (
    <button
      type="button"
      className={`watch-btn ${active ? "active" : ""} ${className}`.trim()}
      aria-pressed={active}
      aria-label={active ? "Remove from watchlist" : "Add to watchlist"}
      title={active ? "Remove from watchlist" : "Add to watchlist"}
      onClick={handleClick}
    >
      {active ? <StarFilled /> : <StarOutlined />}
    </button>
  );
};

export default WatchButton;
