export type EventType = "view" | "click" | "add_to_cart";

export interface VideoAnalytics {
  id: string;
  title: string;
  videoUrl: string;
  productName: string;
  views: number;
  clicks: number;
  conversions: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AnalyticsResponse {
  data: VideoAnalytics[];
  pagination: PaginationMeta;
}
