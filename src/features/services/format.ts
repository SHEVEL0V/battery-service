import type { Locale } from "@/i18n/config";

// Ціни зберігаються в UAH — локаль впливає лише на формат числа, не на валюту
export function formatPrice(price: number, lang: Locale): string {
  return new Intl.NumberFormat(lang === "uk" ? "uk-UA" : "en-US", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(price);
}
