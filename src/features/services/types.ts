import type { Locale } from "@/i18n/config";
import type { Service } from "@/types";

// Service з уже вибраними під локаль title/description — повертається з queries.ts
export type LocalizedService = Service & {
  title: string;
  description: string;
};

export const toLocalizedService = (service: Service, locale: Locale): LocalizedService => ({
  ...service,
  title: locale === "uk" ? service.titleUk : service.titleEn,
  description: locale === "uk" ? service.descUk : service.descEn,
});
