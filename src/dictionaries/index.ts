import "server-only";

export type Dictionary = typeof import("./en.json");

export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  uk: () => import("./ua.json").then((module) => module.default as Dictionary),
  en: () => import("./en.json").then((module) => module.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
