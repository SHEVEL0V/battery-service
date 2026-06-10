import "server-only";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const getVisibleReviews = unstable_cache(
  async () =>
    prisma.review.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
    }),
  ["visible-reviews"],
  { tags: [CACHE_TAGS.reviews], revalidate: 3600 },
);
