import "server-only";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/db/prisma";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import type { Locale } from "@/dictionaries";

export const getActiveServices = unstable_cache(
  async (locale: Locale) => {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return services.map((s) => ({
      ...s,
      title: locale === "uk" ? s.titleUk : s.titleEn,
      description: locale === "uk" ? s.descUk : s.descEn,
    }));
  },
  ["active-services"],
  { tags: [CACHE_TAGS.services], revalidate: 3600 },
);

export const getServiceBySlug = unstable_cache(
  async (slug: string, locale: Locale) => {
    const service = await prisma.service.findFirst({
      where: { slug, isActive: true },
    });

    if (!service) return null;

    return {
      ...service,
      title: locale === "uk" ? service.titleUk : service.titleEn,
      description: locale === "uk" ? service.descUk : service.descEn,
    };
  },
  ["service-by-slug"],
  { tags: [CACHE_TAGS.services], revalidate: 3600 },
);
