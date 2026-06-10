import "server-only";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const getActiveServices = unstable_cache(
  async () =>
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ["active-services"],
  { tags: [CACHE_TAGS.services], revalidate: 3600 },
);

export const getServiceBySlug = unstable_cache(
  async (slug: string) =>
    prisma.service.findFirst({
      where: { slug, isActive: true },
    }),
  ["service-by-slug"],
  { tags: [CACHE_TAGS.services], revalidate: 3600 },
);
