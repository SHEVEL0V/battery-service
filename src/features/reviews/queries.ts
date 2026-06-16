import "server-only";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/db/prisma";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import type { Locale } from "@/i18n/config";
import { toLocalizedReview } from "./types";

export const getVisibleReviews = unstable_cache(
  async (locale: Locale) => {
    const reviews = await prisma.review.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
    });

    return reviews.map((review) => toLocalizedReview(review, locale));
  },
  ["visible-reviews"],
  { tags: [CACHE_TAGS.reviews], revalidate: 3600 },
);

// Без кешу — для admin-сторінок (force-dynamic)
export const getAllReviews = () =>
  prisma.review.findMany({ orderBy: { createdAt: "desc" } });

export const countHiddenReviews = () =>
  prisma.review.count({ where: { isVisible: false } });
