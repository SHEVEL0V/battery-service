import "server-only";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/db/prisma";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import type { Locale } from "@/i18n/config";
import { toLocalizedService } from "./types";

export const getActiveServices = unstable_cache(
  async (locale: Locale) => {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return services.map((service) => toLocalizedService(service, locale));
  },
  ["active-services"],
  { tags: [CACHE_TAGS.services], revalidate: 3600 },
);

// Без кешу — для admin-сторінок (force-dynamic)
export const getAllServices = () =>
  prisma.service.findMany({ orderBy: { order: "asc" } });

export const countActiveServices = () =>
  prisma.service.count({ where: { isActive: true } });

export const getServiceBySlug = unstable_cache(
  async (slug: string, locale: Locale) => {
    const service = await prisma.service.findFirst({
      where: { slug, isActive: true },
    });

    return service ? toLocalizedService(service, locale) : null;
  },
  ["service-by-slug"],
  { tags: [CACHE_TAGS.services], revalidate: 3600 },
);
