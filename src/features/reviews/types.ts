import type { Locale } from "@/i18n/config";
import type { Review } from "@/types";

// Review з уже вибраним під локаль text — повертається з queries.ts
export type LocalizedReview = Review & {
  text: string;
};

export const toLocalizedReview = (review: Review, locale: Locale): LocalizedReview => ({
  ...review,
  text: locale === "uk" ? review.textUk : review.textEn,
});
