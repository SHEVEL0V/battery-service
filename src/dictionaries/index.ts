import "server-only";

export type Dictionary = typeof import("./en.json");

export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

const dictionaries: Record<Locale, () => Promise<any>> = {
  uk: () => import("./ua.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

export const hasLocale = (locale: string): locale is Locale => locales.includes(locale as Locale);

export const getDictionary = async (locale: Locale) => {
  if (!hasLocale(locale)) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
};
