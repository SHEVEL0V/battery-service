import { createNavigation } from 'next-intl/navigation'

export const locales = ['uk', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'uk'

export const navigation = createNavigation({
  locales,
  defaultLocale,
})
