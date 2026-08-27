import { useCallback, useEffect, useState } from "react";
import { fetchVideoAnalytics, postEngagementEvent } from "./api/analytics";
import { VideoAnalytics, EventType } from "./types";
import VideoTable from "./components/VideoTable";
import Pagination from "./components/Pagination";
import SimulateTrafficButton from "./components/SimulateTrafficButton";
import styles from "./App.module.css";

const PAGE_SIZE = 8;
const EVENT_TYPES: EventType[] = ["view", "click", "add_to_cart"];

export default function App() {
  const [videos, setVideos] = useState<VideoAnalytics[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | null>(
    null
  );

  const loadAnalytics = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchVideoAnalytics(targetPage, PAGE_SIZE);
      setVideos(res.data);
      setTotalPages(res.pagination.totalPages || 1);
      setTotal(res.pagination.total);
    } catch (err) {
      setError(
        "Couldn't load video analytics. Make sure the API server is running."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics(page);
  }, [page, loadAnalytics]);

  const handleSimulateTraffic = async () => {
    if (videos.length === 0) return;

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const randomEventType =
      EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

    try {
      await postEngagementEvent(randomVideo.id, randomEventType);
      setRecentlyUpdatedId(randomVideo.id);
      await loadAnalytics(page);
      setTimeout(() => setRecentlyUpdatedId(null), 1000);
    } catch (err) {
      setError("Couldn't record the simulated event. Try again.");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Videoselz</p>
          <h1 className={styles.title}>Shoppable video performance</h1>
          <p className={styles.subtitle}>
            Views, clicks, and cart adds across every shoppable video.
          </p>
        </div>
        <SimulateTrafficButton onClick={handleSimulateTraffic} />
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{ background: "var(--view-color)" }}
          />
          Views
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{ background: "var(--click-color)" }}
          />
          Clicks
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{ background: "var(--cart-color)" }}
          />
          Add to cart
        </span>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>Loading video analytics...</div>
      ) : (
        <>
          <VideoTable videos={videos} recentlyUpdatedId={recentlyUpdatedId} />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
