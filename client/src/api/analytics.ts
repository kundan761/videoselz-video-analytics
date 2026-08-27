import { AnalyticsResponse, EventType } from "../types";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL", API_URL);

export async function fetchVideoAnalytics(
  page: number,
  limit: number
): Promise<AnalyticsResponse> {
  const res = await fetch(
    `${API_URL}/api/analytics/videos?page=${page}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error(`Failed to load analytics (status ${res.status})`);
  }
  return res.json();
}

export async function postEngagementEvent(
  videoId: string,
  eventType: EventType
): Promise<void> {
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, eventType }),
  });
  if (!res.ok) {
    throw new Error(`Failed to record event (status ${res.status})`);
  }
}
