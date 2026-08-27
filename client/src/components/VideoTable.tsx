import { VideoAnalytics } from "../types";
import FunnelBar from "./FunnelBar";
import styles from "./VideoTable.module.css";

interface VideoTableProps {
  videos: VideoAnalytics[];
  recentlyUpdatedId: string | null;
}

function formatConversionRate(views: number, conversions: number): string {
  if (views === 0) return "—";
  return `${((conversions / views) * 100).toFixed(1)}%`;
}

export default function VideoTable({
  videos,
  recentlyUpdatedId,
}: VideoTableProps) {
  if (videos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No videos yet</p>
        <p className={styles.emptyBody}>
          Once shoppable videos are attached to products, their performance
          will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thVideo}>Video</th>
            <th className={styles.thNum}>Views</th>
            <th className={styles.thNum}>Clicks</th>
            <th className={styles.thNum}>Add to cart</th>
            <th className={styles.thFunnel}>Funnel</th>
            <th className={styles.thNum}>Conv. rate</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className={styles.row}>
              <td className={styles.videoCell}>
                <span className={styles.videoTitle}>{video.title}</span>
                <span className={styles.productName}>
                  {video.productName}
                </span>
              </td>
              <td className={styles.numCell}>
                {video.views.toLocaleString()}
              </td>
              <td className={styles.numCell}>
                {video.clicks.toLocaleString()}
              </td>
              <td className={styles.numCell}>
                {video.conversions.toLocaleString()}
              </td>
              <td className={styles.funnelCell}>
                <FunnelBar
                  views={video.views}
                  clicks={video.clicks}
                  conversions={video.conversions}
                  isUpdating={recentlyUpdatedId === video.id}
                />
              </td>
              <td className={styles.numCell}>
                <span className={styles.rateBadge}>
                  {formatConversionRate(video.views, video.conversions)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
