import "server-only";
import { defaultLocale, locales, type Locale } from "@/config/locales";

export type Dictionary = typeof import("./en.json");
export { defaultLocale, locales };
export type { Locale };

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  uk: () => import("./uk.json").then((module) => module.default as Dictionary),
  en: () => import("./en.json").then((module) => module.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

// Витягує локаль із прихованого поля форми (Server Actions), фолбек — defaultLocale
export const localeFromFormData = (formData: FormData, key = "lang"): Locale => {
  const value = formData.get(key);
  return typeof value === "string" && hasLocale(value) ? value : defaultLocale;
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
