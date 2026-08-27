import styles from "./FunnelBar.module.css";

interface FunnelBarProps {
  views: number;
  clicks: number;
  conversions: number;
  isUpdating?: boolean;
}

// Renders views/clicks/conversions as a single proportional stacked bar,
// so a merchant can see the shape of the funnel at a glance instead of
// cross-referencing three separate numbers.
export default function FunnelBar({
  views,
  clicks,
  conversions,
  isUpdating,
}: FunnelBarProps) {
  const total = views + clicks + conversions;

  // No engagement yet - show an empty track rather than a misleading bar.
  if (total === 0) {
    return (
      <div className={styles.track} aria-hidden="true">
        <span className={styles.empty} />
      </div>
    );
  }

  const viewPct = (views / total) * 100;
  const clickPct = (clicks / total) * 100;
  const cartPct = (conversions / total) * 100;

  return (
    <div
      className={`${styles.track} ${isUpdating ? styles.flash : ""}`}
      role="img"
      aria-label={`${views} views, ${clicks} clicks, ${conversions} add to carts`}
    >
      <span
        className={styles.segmentViews}
        style={{ width: `${viewPct}%` }}
      />
      <span
        className={styles.segmentClicks}
        style={{ width: `${clickPct}%` }}
      />
      <span className={styles.segmentCart} style={{ width: `${cartPct}%` }} />
    </div>
  );
}
