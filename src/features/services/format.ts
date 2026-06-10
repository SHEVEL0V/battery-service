import type { Locale } from "@/dictionaries";

export function formatPrice(price: number, lang: Locale): string {
  return new Intl.NumberFormat(lang === "uk" ? "uk-UA" : "en-US", {
    style: "currency",
    currency: lang === "uk" ? "UAH" : "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
