export const CACHE_TAGS = {
  services: "services",
  reviews: "reviews",
  bookings: "bookings",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
