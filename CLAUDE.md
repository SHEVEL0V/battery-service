# CLAUDE.md — Tesla Battery Repair Website

## Огляд проекту

Сайт для сервісу ремонту батарей Tesla. Надає інформацію про послуги, пояснення процесу ремонту, онлайн-запис на сервіс, контакти з картою та маршрутом.

**Стек**: Next.js 16.2.7 (App Router) · TypeScript · MUI v9.1 · Prisma (adapter-pg) · PostgreSQL · Framer Motion · Jose · bcryptjs · Resend · Telegram Bot API (fetch)

---

## Структура проекту

```
src/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx               ← generateStaticParams + AppProviders (RSC)
│   │   ├── error.tsx                ← 'use client'
│   │   ├── not-found.tsx
│   │   ├── (site)/
│   │   │   ├── layout.tsx           ← Header + Footer wrapper (RSC)
│   │   │   ├── page.tsx             ← Головна: секції фіч
│   │   │   ├── services/
│   │   │   │   ├── page.tsx         ← RSC + unstable_cache
│   │   │   │   ├── loading.tsx      ← ServicesSkeleton
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     ← ISR revalidate:3600
│   │   │   ├── booking/
│   │   │   │   └── page.tsx         ← RSC shell
│   │   │   └── contacts/
│   │   │       └── page.tsx
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx         ← RSC shell, рендерить LoginForm
│   │   └── (admin)/
│   │       ├── layout.tsx           ← verifySession() auth guard + AdminHeader
│   │       └── admin/
│   │           ├── page.tsx         ← dynamic = 'force-dynamic'
│   │           ├── bookings/
│   │           │   └── page.tsx     ← dynamic = 'force-dynamic'
│   │           ├── services/
│   │           │   └── page.tsx     ← dynamic = 'force-dynamic'
│   │           └── contacts/
│   │               └── page.tsx     ← dynamic = 'force-dynamic'
│   ├── global-error.tsx
│   └── api/                         ← ПОРОЖНЬО. Всі мутації — Server Actions.
│
├── components/
│   ├── ui/                          ← Button, Card, Badge, NextLink, ThemeToggle, LocaleSwitcher
│   ├── layout/                      ← Header (з посиланням "Admin" для залогінених), AdminHeader, Footer
│   ├── animation/                   ← ScrollReveal (Framer Motion)
│   └── providers/
│       ├── AppProviders.tsx         ← 'use client', всі провайдери
│       └── MuiThemeProvider.tsx     ← 'use client', MUI v9 CSS vars
│
├── features/
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── HeroText.tsx
│   │   ├── HeroParticles.tsx        ← canvas API (client)
│   │   └── HeroScene.tsx            ← анімована батарея, SVG + Framer Motion (client)
│   ├── stats/Stats.tsx
│   ├── how-it-works/HowItWorks.tsx
│   ├── why-us/WhyUs.tsx
│   ├── booking/
│   │   ├── components/
│   │   │   ├── BookingCTA.tsx
│   │   │   ├── BookingForm.tsx      ← useActionState (client)
│   │   │   ├── BookingStepCar.tsx
│   │   │   ├── BookingStepDate.tsx
│   │   │   ├── BookingStepContact.tsx
│   │   │   └── BookingSuccess.tsx
│   │   ├── actions.ts               ← createBooking() 'use server'
│   │   ├── schema.ts                ← Zod схеми
│   │   └── types.ts
│   ├── services/
│   │   ├── components/
│   │   │   ├── ServiceCard.tsx      ← RSC
│   │   │   ├── ServiceListCard.tsx  ← RSC
│   │   │   └── ServicesList.tsx     ← RSC
│   │   ├── format.ts
│   │   └── queries.ts               ← server-only, unstable_cache
│   ├── reviews/
│   │   ├── ReviewsCarousel.tsx
│   │   └── queries.ts               ← server-only, unstable_cache
│   ├── map/
│   │   ├── MapSection.tsx           ← RSC shell
│   │   └── MapClient.tsx            ← client, @vis.gl/react-google-maps
│   ├── contact/
│   │   ├── ContactForm.tsx          ← useActionState (client)
│   │   ├── actions.ts               ← submitContact() 'use server'
│   │   └── schema.ts                ← Zod схема
│   ├── auth/
│   │   ├── LoginForm.tsx            ← useActionState (client)
│   │   ├── actions.ts               ← login() 'use server'
│   │   └── schema.ts                ← Zod схема
│   └── admin/
│       ├── BookingsTable.tsx        ← client
│       └── actions.ts               ← updateBookingStatus() 'use server'
│
├── lib/
│   ├── auth/
│   │   ├── session.ts               ← server-only, Jose JWT
│   │   ├── cookies.ts               ← server-only, createSession/deleteSession
│   │   └── dal.ts                   ← server-only, verifySession (React.cache)
│   ├── db/
│   │   └── prisma.ts                ← singleton PrismaClient (PrismaPg adapter)
│   ├── cache/
│   │   └── cache-tags.ts
│   └── integrations/
│       ├── mail.ts                  ← Resend
│       └── telegram.ts              ← Telegram Bot API через fetch (без SDK)
│
├── i18n/
│   ├── config.ts                    ← getDictionary(), hasLocale(), Dictionary type
│   ├── uk.json                      ← всі переклади UK
│   └── en.json                      ← всі переклади EN
│
├── config/
│   ├── locales.ts                   ← locales, defaultLocale, Locale type
│   ├── theme.ts                     ← 'use client', MUI v9 CSS Variables theme + Manrope font
│   └── maps.ts                      ← MAP_CONFIG (center, zoom)
│
├── types/index.ts
└── proxy.ts                         ← locale redirect + optimistic auth check

prisma/
├── schema.prisma                    ← generator + datasource (multi-file schema)
├── models/
│   ├── booking.prisma
│   ├── service.prisma               ← Service, Contact, Review
│   └── user.prisma
├── migrations/
└── seed.ts

generated/prisma/                    ← Prisma Client output (alias @g/prisma/client)
```

---

## Локалізація

**Підхід**: вбудований Next.js без зовнішніх бібліотек — [офіційна документація](https://nextjs.org/docs/app/guides/internationalization).

Структура: `app/[lang]/` — Next.js передає `lang` у кожен layout і page через `params`.

### config/locales.ts

```ts
// src/config/locales.ts
export const locales = ['uk', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'uk'
```

### i18n/config.ts

```ts
// src/i18n/config.ts
import 'server-only'
import { defaultLocale, locales, type Locale } from '@/config/locales'

export type Dictionary = typeof import('./en.json')
export { defaultLocale, locales }
export type { Locale }

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  uk: () => import('./uk.json').then((m) => m.default as Dictionary),
  en: () => import('./en.json').then((m) => m.default),
}

export const hasLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale)

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]()
```

### Root layout — generateStaticParams

```tsx
// src/app/[lang]/layout.tsx
import { hasLocale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { AppProviders } from '@/components/providers/AppProviders'

export async function generateStaticParams() {
  return [{ lang: 'uk' }, { lang: 'en' }]
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
```

### Використання в Server Component

```tsx
// src/app/[lang]/(site)/page.tsx
import { getDictionary, hasLocale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const { hero, services } = await getDictionary(lang)
  return (
    <>
      <Hero dict={hero} />
      <ServicesList dict={services} />
    </>
  )
}
```

### Передача dict у Client Component

```tsx
// Словник передається як prop — клієнт не завантажує зайвих перекладів
// Client Component НІКОЛИ не імпортує getDictionary напряму

// RSC:
const dict = await getDictionary(lang)
return <BookingForm dict={dict.booking} />

// Client Component:
'use client'
import type { Dictionary } from '@/i18n/config'

interface Props {
  dict: Dictionary['booking']
}
export function BookingForm({ dict }: Props) {
  return <button>{dict.submit}</button>
}
```

### Структура словника (uk.json / en.json)

Топрівневі ключі: `nav`, `footer`, `hero`, `stats`, `services`, `howItWorks`, `whyUs`, `reviews`, `bookingCTA`, `booking`, `auth`, `admin`, `servicesPage`, `contacts`, `errors`, `notFoundPage`, `errorPage`, `map`, `common`.

```json
{
  "nav": { "home": "Головна", "services": "Послуги", "booking": "Запис", "contacts": "Контакти", "admin": "Адмін" },
  "hero": { "title": "...", "subtitle": "...", "cta": "Записатись на діагностику" },
  "services": { "title": "Наші послуги", "cta": "Детальніше" },
  "booking": {
    "title": "Записатись на сервіс",
    "step1": "Автомобіль", "step2": "Дата", "step3": "Контакти",
    "submit": "Підтвердити запис", "submitting": "Відправляємо...",
    "success": "Дякуємо! Ми зв'яжемось з вами."
  },
  "contacts": { "title": "Контакти", "address": "...", "phone": "..." },
  "footer": { "rights": "Всі права захищені" },
  "auth": { "login": "Увійти", "logout": "Вийти", "email": "Email", "password": "Пароль" },
  "admin": {
    "dashboard": "Дашборд", "bookings": "Записи", "services": "Послуги",
    "contacts": "Звернення", "logout": "Вийти", "viewSite": "На сайт"
  },
  "errors": { "required": "Обов'язкове поле", "invalidEmail": "Невірний email" }
}
```

`uk.json` і `en.json` повинні мати ідентичну форму — `Dictionary` виводиться з `en.json`.

### Proxy — locale redirect + auth

> **Next.js 16**: Middleware перейменовано в **Proxy**. Файл: `src/proxy.ts`, функція: `export async function proxy(...)`.

```ts
// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { decrypt } from '@/lib/auth/session'
import { defaultLocale, locales } from '@/config/locales'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const headers = { 'accept-language': acceptLanguage }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, [...locales], defaultLocale)
  } catch {
    return defaultLocale
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Locale redirect
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // 2. Optimistic auth check для /admin (без DB)
  const isAdminRoute = pathname.includes('/admin')
  const isAuthRoute  = pathname.includes('/login')

  if (isAdminRoute || isAuthRoute) {
    const cookie  = request.cookies.get('session')?.value
    const session = await decrypt(cookie)

    if (isAdminRoute && !session?.userId) {
      return NextResponse.redirect(new URL('/uk/login', request.url))
    }
    if (isAuthRoute && session?.userId) {
      return NextResponse.redirect(new URL('/uk/admin', request.url))
    }
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|avif|gif|webp|ico|glb|gltf)).*)',
  ],
}
```

### generateMetadata з локалізацією

```tsx
// src/app/[lang]/(site)/services/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}

  const [dict, service] = await Promise.all([
    getDictionary(lang),
    getServiceBySlug(slug),
  ])
  if (!service) return {}

  const title = lang === 'uk' ? service.titleUk : service.titleEn
  const desc  = lang === 'uk' ? service.descUk  : service.descEn

  return {
    title,
    description: desc,
    alternates: {
      canonical:  `/${lang}/services/${slug}`,
      languages: {
        uk: `/uk/services/${slug}`,
        en: `/en/services/${slug}`,
      },
    },
  }
}
```

### LocaleSwitcher

```tsx
// src/components/ui/LocaleSwitcher.tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

const locales = [
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' },
]

export default function LocaleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = pathname?.split('/')[1] || 'uk'

  const handleLocaleChange = (_e: React.MouseEvent<HTMLElement>, newLocale: string | null) => {
    if (!newLocale || !pathname || newLocale === currentLocale) return
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <ToggleButtonGroup value={currentLocale} exclusive onChange={handleLocaleChange} size="small">
      {locales.map((locale) => (
        <ToggleButton key={locale.code} value={locale.code} aria-label={locale.label}>
          {locale.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
```

### Залежності для локалізації

```bash
npm install negotiator @formatjs/intl-localematcher
npm install -D @types/negotiator
```

**Правило**: `getDictionary` — тільки в Server Components. Client Components отримують переклади через props.

---

## MUI v9.1

**Офіційна документація**: [MUI + Next.js integration](https://mui.com/material-ui/integrations/nextjs/)

### Пакети

```bash
npm install @mui/material @mui/material-nextjs @emotion/react @emotion/styled @emotion/cache
```

### config/fonts.ts

> **Важливо**: `next/font/google` має жити у файлі **без** `'use client'`, інакше клас `manrope.variable` не потрапляє на `<html>` у `layout.tsx` (Server Component не може взяти className з клієнтського модуля), і CSS-змінна `--font-manrope` лишається невизначеною — весь `font-family` стає невалідним і браузер падає на дефолтний serif.

```ts
// src/config/fonts.ts
import { Manrope } from 'next/font/google'

export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})
```

### config/theme.ts

> **Патерн**: `extendTheme` генерує CSS-змінні для кольорів під атрибут `data-mui-color-scheme`. `InitColorSchemeScript` встановлює цей атрибут **до першого рендеру** (inline script у `<head>`), усуваючи flash.

```ts
// src/config/theme.ts
'use client'
import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  colorSchemeSelector: 'data-mui-color-scheme',
  defaultColorScheme: 'dark',

  colorSchemes: {
    light: {
      palette: {
        primary:    { main: '#CC0000' },
        secondary:  { main: '#171A20' },
        background: { default: '#FFFFFF', paper: '#F4F4F4' },
        text:       { primary: '#171A20', secondary: '#5C5E62' },
      },
    },
    dark: {
      palette: {
        primary:    { main: '#CC0000' },
        secondary:  { main: '#F5F5F5' },
        background: { default: '#000000', paper: '#171A20' },
        text:       { primary: '#F5F5F5', secondary: '#8E8E93' },
      },
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: 'var(--font-manrope), system-ui, sans-serif',
    h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2 },
    h3: { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.7 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
    button: { fontWeight: 600, fontSize: '0.9375rem', letterSpacing: 'normal', textTransform: 'none' as const },
  },

  components: {
    // Pill-shaped buttons, flat surfaces, pill toggle groups — Tesla-style minimalism
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          paddingInline: '24px',
          paddingBlock: '12px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        sizeLarge: { paddingInline: '32px', paddingBlock: '16px', fontSize: '1rem' },
        sizeSmall: { paddingInline: '16px', paddingBlock: '8px', fontSize: '0.8125rem' },
        outlined: { borderWidth: '1px' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', boxShadow: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: '999px' },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { borderRadius: '999px' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { borderRadius: '999px', border: 0 },
      },
    },
  },
})

export default theme
```

### MuiThemeProvider

```tsx
// src/components/providers/MuiThemeProvider.tsx
'use client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import theme from '@/config/theme'

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
```

### AppProviders

```tsx
// src/components/providers/AppProviders.tsx
'use client'
import { MuiThemeProvider } from './MuiThemeProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <MuiThemeProvider>{children}</MuiThemeProvider>
}
```

### Root layout з MUI v9

```tsx
// src/app/[lang]/layout.tsx
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { manrope } from '@/config/fonts'
import { AppProviders } from '@/components/providers/AppProviders'
import { hasLocale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return [{ lang: 'uk' }, { lang: 'en' }]
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <html lang={lang} className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Inline script — встановлює data-mui-color-scheme до першого paint */}
        <InitColorSchemeScript attribute="data-mui-color-scheme" defaultMode="dark" />
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
```

### Напівпрозорий фон (sticky header) з CSS Variables

> **Пастка**: `alpha(theme.palette.background.paper, 0.72)` у `sx` обчислюється на SSR
> у статичний `rgba(...)` зі значень **default-схеми** (dark) і не реагує на зміну
> color scheme — фон лишається темним навіть коли весь інший текст/кольори
> переключились на light через CSS-змінні. Результат: темний текст на темному фоні.
>
> **Рішення** — `color-mix()` з нативною CSS-змінною (`--mui-palette-<token>`),
> яка сама змінюється разом із `data-mui-color-scheme`:

```tsx
// src/components/layout/Header.tsx, AdminHeader.tsx
sx={{
  bgcolor: 'color-mix(in srgb, var(--mui-palette-background-paper) 72%, transparent)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
}}
```

Не використовувати `alpha(theme.palette.*, …)` для кольорів, що залежать від color scheme.

### Next.js v16 — Link wrapper (обов'язково для MUI component prop)

```tsx
// src/components/ui/NextLink.tsx
'use client'
import Link from 'next/link'
export default Link

// Використання:
// import NextLink from '@/components/ui/NextLink'
// <Button component={NextLink} href="/uk/booking">Записатись</Button>
```

### ThemeToggle

```tsx
// src/components/ui/ThemeToggle.tsx
'use client'
import { useColorScheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

// useColorScheme — MUI hook, синхронізує localStorage + data-mui-color-scheme атрибут
export function ThemeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} size="small" color="inherit">
      {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
    </IconButton>
  )
}
```

---

## Автентифікація

Власна реалізація без NextAuth — [офіційна документація Next.js 16.2.7](https://nextjs.org/docs/app/guides/authentication).

### Три шари захисту

**1. Proxy** — optimistic check (Node.js Runtime, без DB):
```ts
// Декриптує JWT cookie → redirect якщо немає сесії
// НЕ звертається до БД
```

**2. DAL у Layout/Page** — справжній захист:
```ts
// src/lib/auth/dal.ts — import 'server-only'
export interface VerifiedSession {
  isAuth: true
  userId: string
  role: 'ADMIN' | 'SUPERADMIN'
}

export const verifySession = cache(async (): Promise<VerifiedSession> => {
  const cookie  = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session?.userId) redirect('/uk/login')
  return { isAuth: true, userId: session.userId, role: session.role }
})
```

**3. Server Action** — перевірка перед кожною мутацією:
```ts
'use server'
export async function updateBookingStatus(id: string, status: BookingStatus) {
  await verifySession()  // ← завжди першим рядком
  // ...
}
```

### Навігація для залогіненого користувача

`(site)/layout.tsx` — некритичний (без redirect) перевірка сесії через `decrypt(cookie)` напряму
(не `verifySession`, бо публічні сторінки не повинні редіректити неавторизованих):

```tsx
// src/app/[lang]/(site)/layout.tsx
const sessionCookie = (await cookies()).get('session')?.value
const session = await decrypt(sessionCookie)
const isAuthenticated = Boolean(session?.userId)

<Header dict={nav} lang={lang} isAuthenticated={isAuthenticated} />
```

`Header` (`src/components/layout/Header.tsx`) показує посилання `dict.nav.admin` → `/${lang}/admin`,
тільки якщо `isAuthenticated === true`.

### AdminHeader

`(admin)/layout.tsx` рендерить `AdminHeader` (`src/components/layout/AdminHeader.tsx`, `'use client'`)
поверх `verifySession()`: навігація Dashboard / Bookings / Services / Contacts (`dict.admin.*`,
підсвітка активного пункту через `usePathname`), посилання "На сайт" (`r.home`),
`ThemeToggle` + `LocaleSwitcher`, та форма виходу:

```tsx
<Box component="form" action={logout}>
  <input type="hidden" name="lang" value={lang} />
  <Button type="submit">{dict.admin.logout}</Button>
</Box>
```

`logout` — Server Action у `src/features/auth/actions.ts`, викликає `deleteSession()` і `redirect('/${locale}/login')`.

### Session (Jose + cookie)

```ts
// src/lib/auth/session.ts — import 'server-only'
// Jose HS256, exp: 7d

// src/lib/auth/cookies.ts — import 'server-only'
// httpOnly: true, secure: true, sameSite: 'lax', expires: 7d
```

```env
SESSION_SECRET="згенерований_рядок_32_символи"
# openssl rand -base64 32
```

---

## API Routes

**`/api` папка порожня.** Всі мутації — Server Actions.
Обгрунтування: [Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data).

---

## Server Actions — конвенції

```ts
'use server'
export async function someAction(
  prevState: SomeState,
  formData: FormData
): Promise<SomeState> {
  await verifySession()                          // 1. auth (якщо потрібно)
  const validated = schema.safeParse(...)        // 2. Zod валідація
  if (!validated.success) return { errors: ... }
  await prisma.model.create(...)                 // 3. БД
  revalidateTag(CACHE_TAGS.relevant)             // 4. інвалідація кешу
  return { success: true }                       // 5. redirect() поза try/catch
}
```

Client Component:
```tsx
'use client'
const [state, action, isPending] = useActionState(someAction, initialState)
// <form action={action}> — не onSubmit
```

---

## Fetching та Кешування

```ts
// unstable_cache — між запитами (ISR для Prisma), колокований у features/<feature>/queries.ts
export const getActiveServices = unstable_cache(
  async (locale: Locale) => prisma.service.findMany({ where: { isActive: true } }),
  ['active-services'],
  { tags: [CACHE_TAGS.services], revalidate: 3600 }
)

// React.cache() — дедуплікація в render pass (DAL функції)
export const verifySession = cache(async () => { ... })

// Паралельне завантаження — завжди Promise.all
const [services, reviews] = await Promise.all([
  getActiveServices(lang),
  getVisibleReviews(),
])
```

```ts
// src/lib/cache/cache-tags.ts
export const CACHE_TAGS = {
  services: 'services',
  reviews:  'reviews',
  bookings: 'bookings',
} as const
```

Admin сторінки: `export const dynamic = 'force-dynamic'`

---

## Анімація

- **Framer Motion** — scroll-reveal через `<ScrollReveal>` (`src/components/animation/ScrollReveal.tsx`), page transitions
- **HeroParticles** — canvas API (client), без зовнішніх бібліотек
- **HeroScene** — анімована візуалізація батареї (client, Framer Motion):
  - заряд батареї — `motion.rect` із градієнтною заливкою, цикл "заряджається ↔ розряджається"
  - енергетична блискавка — пульсація opacity/scale + SVG `<filter>` (glow через `feGaussianBlur` + `feMerge`)
  - іскри — `motion.circle`, що спливають вгору і згасають з затримкою (stagger)
  - інтерактив — 3D-нахил сцени та амбієнтне світіння за курсором (`useMotionValue` + `useSpring` + `useTransform`)
  - усі цикли та інтерактив вимикаються через `useReducedMotion()`
- **BookingForm** — переходи між кроками через `AnimatePresence` (slide+fade, напрямок залежить від кроку вперед/назад)
- **BookingSuccess** — checkmark намальований через `pathLength`-анімацію (`motion.circle` + `motion.path`) з іскрами навколо
- **`prefers-reduced-motion`** — завжди перевіряти

```tsx
// ScrollReveal:
import { ScrollReveal } from '@/components/animation/ScrollReveal'

<ScrollReveal direction="up">
  <Typography variant="h2">{dict.title}</Typography>
</ScrollReveal>
```

---

## Карти

`@vis.gl/react-google-maps` — офіційна React-обгортка над Google Maps JavaScript API.

```ts
// src/config/maps.ts
export const MAP_CONFIG = {
  center: { lat: 50.4501, lng: 30.5234 },
  zoom: 15,
} as const
```

```tsx
// src/features/map/MapClient.tsx — 'use client'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { MAP_CONFIG } from '@/config/maps'

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Без ключа — fallback-плейсхолдер (dict.description)
<APIProvider apiKey={apiKey}>
  <Map
    defaultCenter={MAP_CONFIG.center}
    defaultZoom={MAP_CONFIG.zoom}
    colorScheme={mode === 'light' ? 'LIGHT' : 'DARK'}
    disableDefaultUI
    gestureHandling="cooperative"
  >
    <Marker position={MAP_CONFIG.center} />
  </Map>
</APIProvider>
```

`colorScheme` синхронізується з `useColorScheme()` (MUI), щоб карта відповідала темній/світлій темі сайту.

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."
```

**Налаштування Google Cloud**: увімкнути **Maps JavaScript API**, обмежити ключ за HTTP-referrer (домен сайту).

---

## База даних — Prisma

Схема розбита на файли (`prisma/schema.prisma` — лише `generator`/`datasource`, моделі — у `prisma/models/*.prisma`). Клієнт генерується у `generated/prisma` і доступний через alias `@g/prisma/client`. Підключення — через `@prisma/adapter-pg` (`PrismaPg`).

```ts
// src/lib/db/prisma.ts
import 'server-only'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@g/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prismaClientSingleton = () => new PrismaClient({ adapter })

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()
export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### prisma/schema.prisma

```prisma
generator client {
  provider      = "prisma-client"
  output        = "../generated/prisma"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
}
```

### prisma/models/booking.prisma

```prisma
model Booking {
  id        String        @id @default(cuid())
  name      String
  phone     String
  email     String
  carModel  String
  year      Int
  message   String?
  status    BookingStatus @default(PENDING)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

enum BookingStatus { PENDING CONFIRMED IN_PROGRESS COMPLETED CANCELLED }
```

### prisma/models/service.prisma

```prisma
model Service {
  id       String  @id @default(cuid())
  slug     String  @unique
  titleUk  String
  titleEn  String
  descUk   String
  descEn   String
  price    Int
  duration String
  isActive Boolean @default(true)
  order    Int     @default(0)
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String?
  message   String
  createdAt DateTime @default(now())
}

model Review {
  id        String   @id @default(cuid())
  author    String
  rating    Int
  textUk    String
  textEn    String
  carModel  String
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

### prisma/models/user.prisma

```prisma
model User {
  id       String @id @default(cuid())
  email    String @unique
  password String // bcrypt hash, cost factor 12
  role     Role   @default(ADMIN)
}

enum Role { ADMIN SUPERADMIN }
```

---

## next.config.ts

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@g/*": ["./generated/*"]
    },
    "strict": true
  }
}
```

`@g/*` — alias на згенерований Prisma Client (`generated/prisma`).

---

## Змінні середовища (.env.local)

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SESSION_SECRET="згенерований_рядок_32_символи"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="пароль_для_першого_адміна" # тільки для prisma db seed
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_CHAT_ID="..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."
```

---

## Конвенції коду

- `import 'server-only'` у всіх файлах з Prisma, auth або secrets
- Ніяких `any` — `unknown` або точні типи
- Feature-based код: `src/features/booking/`, `src/features/services/` тощо (не під `components/`)
- Стилі: тільки MUI `sx` prop або `styled()`, кольори тільки через `theme.palette`
- `getDictionary` — тільки в RSC, Client Components отримують `dict` через props
- Не створювати файли-реекспорти/aliases (наприклад, `export { X as Y } from './X'`) — імпортувати напряму з оригінального файлу
- Git: `feat:` / `fix:` / `style:` / `refactor:` / `chore:`

---

## Деплой — Docker

### Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### docker-compose.yml (dev)

```yaml
services:
  app:
    build: { context: ., target: dev }
    volumes: ['.:/app', '/app/node_modules', '/app/.next']
    ports: ['3000:3000']
    env_file: [.env.local]
    environment:
      - WATCHPACK_POLLING=true
      - DATABASE_URL=postgresql://${POSTGRES_USER:-tesla}:${POSTGRES_PASSWORD:-secret}@postgres:5432/${POSTGRES_DB:-tesladb}
      - DIRECT_URL=postgresql://${POSTGRES_USER:-tesla}:${POSTGRES_PASSWORD:-secret}@postgres:5432/${POSTGRES_DB:-tesladb}
    depends_on: { postgres: { condition: service_healthy } }
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-tesla}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secret}
      POSTGRES_DB: ${POSTGRES_DB:-tesladb}
    volumes: [postgres_data:/var/lib/postgresql/data]
    ports: ['5432:5432']
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER:-tesla}']
      interval: 5s
      timeout: 5s
      retries: 5
volumes:
  postgres_data:
```

### Команди

```bash
# Dev
npm run dev
npx prisma studio
npx prisma migrate dev --name <name>

# Docker dev
docker compose up --build

# Docker prod
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# SSL
certbot certonly --standalone -d yourdomain.com
```

---

## Пакети

```bash
# Локалізація
npm install negotiator @formatjs/intl-localematcher
npm install -D @types/negotiator

# MUI v9
npm install @mui/material @mui/material-nextjs @mui/icons-material @emotion/react @emotion/styled @emotion/cache

# Auth
npm install jose bcryptjs
npm install -D @types/bcryptjs

# Prisma
npm install @prisma/client @prisma/adapter-pg pg
npm install -D @types/pg prisma

# Інтеграції
npm install resend
# Telegram — без SDK, прямі виклики Telegram Bot API через fetch

# Карти
npm install @vis.gl/react-google-maps

# Server-only guard
npm install server-only
```

---

## Важливі нотатки

- **SEO**: `generateMetadata` на кожній сторінці, `alternates.languages` для uk/en
- **Зображення**: тільки `next/image` з явними розмірами
- **Loading**: `loading.tsx` для route'ів, де є асинхронне завантаження даних (наразі — `services/loading.tsx`)
- **MUI Link**: завжди через `NextLink` wrapper (`'use client'`) при використанні з `component` prop
- **Перший адмін**: `npx prisma db seed` після першого деплою
