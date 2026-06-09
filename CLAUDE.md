# CLAUDE.md — Tesla Battery Repair Website

## Огляд проекту

Сайт для сервісу ремонту батарей Tesla. Надає інформацію про послуги, пояснення процесу ремонту, онлайн-запис на сервіс, контакти з картою та маршрутом.

**Стек**: Next.js 16.2.7 (App Router) · TypeScript · MUI v9.1 · Prisma · PostgreSQL · Framer Motion · GSAP · Three.js/R3F · Jose · bcryptjs

---

## Структура проекту

```
src/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx               ← generateStaticParams + AppProviders (RSC)
│   │   ├── loading.tsx
│   │   ├── error.tsx                ← 'use client'
│   │   ├── not-found.tsx
│   │   ├── dictionaries.ts          ← getDictionary(), hasLocale(), Locale type
│   │   ├── (site)/
│   │   │   ├── layout.tsx           ← Header + Footer wrapper (RSC)
│   │   │   ├── page.tsx             ← Головна: Suspense секції
│   │   │   ├── services/
│   │   │   │   ├── page.tsx         ← RSC + unstable_cache
│   │   │   │   ├── loading.tsx      ← ServicesSkeleton
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx     ← ISR revalidate:3600
│   │   │   │       └── opengraph-image.tsx
│   │   │   ├── booking/
│   │   │   │   ├── page.tsx         ← RSC shell
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   └── contacts/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       ├── page.tsx
│   │   │       ├── _actions.ts      ← login() Server Action ('use server')
│   │   │       └── _components/
│   │   │           └── LoginForm.tsx ← 'use client' + useActionState
│   │   └── (admin)/
│   │       ├── layout.tsx           ← verifySession() auth guard
│   │       └── admin/
│   │           ├── page.tsx         ← dynamic = 'force-dynamic'
│   │           └── bookings/
│   │               └── page.tsx     ← dynamic = 'force-dynamic'
│   └── api/                         ← ПОРОЖНЬО. Всі мутації — Server Actions.
│
├── components/
│   ├── features/
│   │   ├── hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroText.tsx         ← GSAP stagger (client)
│   │   │   ├── HeroParticles.tsx    ← canvas API (client)
│   │   │   └── HeroScene.tsx        ← R3F (dynamic import, client)
│   │   ├── booking/
│   │   │   ├── BookingForm.tsx      ← useActionState (client)
│   │   │   ├── BookingStepCar.tsx
│   │   │   ├── BookingStepDate.tsx
│   │   │   ├── BookingStepContact.tsx
│   │   │   ├── BookingSuccess.tsx
│   │   │   ├── actions.ts           ← createBooking() 'use server'
│   │   │   ├── schema.ts            ← Zod схеми
│   │   │   └── types.ts
│   │   ├── services/
│   │   │   ├── ServiceCard.tsx      ← RSC
│   │   │   ├── ServicesList.tsx     ← RSC
│   │   │   └── queries.ts           ← server-only, unstable_cache
│   │   ├── reviews/
│   │   │   ├── ReviewsCarousel.tsx  ← Swiper (client)
│   │   │   └── queries.ts
│   │   ├── map/
│   │   │   ├── MapSection.tsx       ← RSC shell
│   │   │   └── MapClient.tsx        ← Google Maps (client)
│   │   └── admin/
│   │       ├── BookingsTable.tsx    ← client
│   │       └── actions.ts           ← updateBookingStatus() 'use server'
│   ├── ui/
│   ├── layout/
│   ├── animation/
│   └── providers/
│       ├── AppProviders.tsx         ← 'use client', всі провайдери
│       └── MuiThemeProvider.tsx     ← 'use client', MUI v9 CSS vars
│
├── lib/
│   ├── auth/
│   │   ├── session.ts               ← server-only, Jose JWT
│   │   ├── cookies.ts               ← server-only, createSession/deleteSession
│   │   └── dal.ts                   ← server-only, verifySession (React.cache)
│   ├── db/
│   │   ├── prisma.ts                ← singleton PrismaClient
│   │   ├── services.ts              ← unstable_cache, tags:['services']
│   │   ├── reviews.ts               ← unstable_cache, tags:['reviews']
│   │   └── bookings.ts              ← React.cache (no ISR)
│   ├── cache-tags.ts
│   ├── email/booking.ts
│   └── telegram.ts
│
├── dictionaries/
│   ├── uk.json                      ← всі переклади UK
│   └── en.json                      ← всі переклади EN
│
├── theme/
│   └── index.ts                     ← 'use client', MUI v9 CSS Variables theme
│
├── prisma/schema.prisma
├── types/index.ts
└── middleware.ts                    ← locale redirect + optimistic auth check
```

---

## Локалізація

**Підхід**: вбудований Next.js без зовнішніх бібліотек — [офіційна документація](https://nextjs.org/docs/app/guides/internationalization).

Структура: `app/[lang]/` — Next.js передає `lang` у кожен layout і page через `params`.

### dictionaries.ts

```ts
// src/app/[lang]/dictionaries.ts
import 'server-only'

const dictionaries = {
  uk: () => import('@/dictionaries/uk.json').then((m) => m.default),
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]()
```

### Root layout — generateStaticParams

```tsx
// src/app/[lang]/layout.tsx
import { hasLocale, getDictionary } from './dictionaries'
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
import { getDictionary, hasLocale } from '../dictionaries'
import { notFound } from 'next/navigation'

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return (
    <>
      <HeroSection dict={dict.hero} />
      <ServicesSection dict={dict.services} />
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
interface Props {
  dict: Awaited<ReturnType<typeof getDictionary>>['booking']
}
export function BookingForm({ dict }: Props) {
  return <button>{dict.submit}</button>
}
```

### Структура словника (uk.json / en.json)

```json
{
  "meta": {
    "home": { "title": "...", "description": "..." },
    "services": { "title": "...", "description": "..." }
  },
  "nav": { "services": "Послуги", "booking": "Записатись", "contacts": "Контакти" },
  "hero": { "title": "...", "subtitle": "...", "cta": "Записатись на діагностику" },
  "services": { "title": "Наші послуги", "cta": "Детальніше" },
  "howItWorks": { "title": "...", "step1": { "title": "...", "desc": "..." } },
  "stats": { "repairs": "ремонтів", "warranty": "гарантія", "experience": "років досвіду" },
  "reviews": { "title": "Відгуки клієнтів" },
  "booking": {
    "title": "Записатись на сервіс",
    "step1": "Автомобіль", "step2": "Дата", "step3": "Контакти",
    "submit": "Підтвердити запис", "submitting": "Відправляємо...",
    "success": "Дякуємо! Ми зв'яжемось з вами."
  },
  "contacts": { "title": "Контакти", "address": "...", "phone": "..." },
  "footer": { "rights": "Всі права захищені" },
  "auth": { "login": "Увійти", "logout": "Вийти", "email": "Email", "password": "Пароль" },
  "errors": { "required": "Обов'язкове поле", "invalidEmail": "Невірний email" }
}
```

### Middleware — locale redirect

```ts
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { decrypt } from '@/lib/auth/session'

const locales = ['uk', 'en']
const defaultLocale = 'uk'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const headers = { 'accept-language': acceptLanguage }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, locales, defaultLocale)
  } catch {
    return defaultLocale
  }
}

export async function middleware(request: NextRequest) {
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

  // 2. Optimistic auth check для /admin
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
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|glb|gltf)).*)',
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

### LanguageSwitcher

```tsx
// src/components/layout/LanguageSwitcher.tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
import type { Locale } from '@/app/[lang]/dictionaries'

const locales: Locale[] = ['uk', 'en']

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  const router   = useRouter()

  function switchLocale(newLang: Locale) {
    // Замінити перший сегмент шляху
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  return (
    <nav>
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          aria-current={locale === currentLang ? 'true' : undefined}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </nav>
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

### theme/index.ts

```ts
// src/theme/index.ts
'use client'
import { createTheme } from '@mui/material/styles'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

// cssVariables: true — MUI v9 CSS Variables (усуває SSR flickering без next-themes)
const baseTheme = {
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-inter)',
  },
}

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary:    { main: '#CC0000' },   // Tesla Red
    secondary:  { main: '#1A1A1A' },
    background: { default: '#F5F5F5', paper: '#FFFFFF' },
  },
})

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary:    { main: '#CC0000' },
    secondary:  { main: '#E5E5E5' },
    background: { default: '#0A0A0A', paper: '#141414' },
  },
})

export { inter }
```

### MuiThemeProvider

```tsx
// src/components/providers/MuiThemeProvider.tsx
'use client'
import { useMemo, useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { lightTheme, darkTheme } from '@/theme'

type ColorMode = 'light' | 'dark'

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>('dark')

  useEffect(() => {
    // Читаємо збережений вибір або system preference
    const stored = localStorage.getItem('color-mode') as ColorMode | null
    if (stored) {
      setMode(stored)
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setMode('light')
    }
  }, [])

  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode]
  )

  return (
    // AppRouterCacheProvider: збирає CSS на сервері, вставляє в <head>
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
import { LenisProvider }    from './LenisProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider>
      <LenisProvider>
        {children}
      </LenisProvider>
    </MuiThemeProvider>
  )
}
```

### Root layout з MUI v9

```tsx
// src/app/[lang]/layout.tsx
import { inter } from '@/theme'
import { AppProviders } from '@/components/providers/AppProviders'
import { hasLocale } from './dictionaries'
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
    // inter.variable — передає CSS custom property --font-inter
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
```

### Next.js v16 — Link wrapper (обов'язково для MUI component prop)

```tsx
// src/components/ui/NextLink.tsx
'use client'
import Link, { type LinkProps } from 'next/link'
export default Link

// Використання:
// import NextLink from '@/components/ui/NextLink'
// <Button component={NextLink} href="/uk/booking">Записатись</Button>
```

### ThemeToggle

```tsx
// src/components/layout/ThemeToggle.tsx
'use client'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'

// Простий toggle через localStorage + re-render провайдера
// Для глобального стейту — Context або zustand
export function ThemeToggle() {
  function toggle() {
    const current = localStorage.getItem('color-mode') ?? 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('color-mode', next)
    window.location.reload() // або через Context setMode
  }
  return <IconButton onClick={toggle}>🌓</IconButton>
}
```

---

## Автентифікація

Власна реалізація без NextAuth — [офіційна документація Next.js 16.2.7](https://nextjs.org/docs/app/guides/authentication).

### Три шари захисту

**1. Middleware** — optimistic check (Edge Runtime, без DB):
```ts
// Декриптує JWT cookie → redirect якщо немає сесії
// НЕ звертається до БД
```

**2. DAL у Layout/Page** — справжній захист:
```ts
// src/lib/auth/dal.ts — import 'server-only'
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const token   = (await cookies()).get('session')?.value
  const session = await decrypt(token)
  if (!session?.userId) redirect('/uk/login')
  return session
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
// unstable_cache — між запитами (ISR для Prisma)
export const getActiveServices = unstable_cache(
  async () => prisma.service.findMany({ where: { isActive: true } }),
  ['active-services'],
  { tags: ['services'], revalidate: 3600 }
)

// React.cache() — дедуплікація в render pass (DAL функції)
export const verifySession = cache(async () => { ... })

// Паралельне завантаження — завжди Promise.all
const [services, reviews] = await Promise.all([
  getActiveServices(),
  getVisibleReviews(),
])
```

```ts
// src/lib/cache-tags.ts
export const CACHE_TAGS = {
  services: 'services',
  reviews:  'reviews',
  bookings: 'bookings',
} as const
```

Admin сторінки: `export const dynamic = 'force-dynamic'`

---

## Анімація

- **Framer Motion** — scroll-reveal, page transitions
- **GSAP + `useGSAP`** (НЕ useEffect!) — Hero, pin-анімації
- **React Three Fiber** — 3D модель батареї, один `<Canvas>` на сторінку
- **Lenis** — smooth scroll з RAF cleanup в `LenisProvider`
- **`prefers-reduced-motion`** — завжди перевіряти

```ts
// GSAP:
import { useGSAP } from '@gsap/react'
useGSAP(() => {
  gsap.fromTo(ref.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 })
}, { scope: containerRef })

// 3D Canvas — з Suspense + placeholder (запобігає CLS):
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <BatteryPlaceholder />,
})
```

---

## База даних — Prisma Schema

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

model User {
  id       String @id @default(cuid())
  email    String @unique
  password String  // bcrypt hash, cost factor 12
  role     Role   @default(ADMIN)
}

enum Role { ADMIN SUPERADMIN }
```

---

## next.config.ts

```ts
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client'],
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [{ hostname: 'res.cloudinary.com' }],
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
    "paths": { "@/*": ["./src/*"] },
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Змінні середовища (.env.local)

```env
DATABASE_URL="postgresql://..."
SESSION_SECRET="згенерований_рядок_32_символи"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_CHAT_ID="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## Конвенції коду

- `import 'server-only'` у всіх файлах з Prisma, auth або secrets
- Ніяких `any` — `unknown` або точні типи
- Feature-based компоненти: `features/booking/`, `features/services/` тощо
- Стилі: тільки MUI `sx` prop або `styled()`, кольори тільки через `theme.palette`
- `getDictionary` — тільки в RSC, Client Components отримують `dict` через props
- Git: `feat:` / `fix:` / `style:` / `refactor:` / `chore:`

---

## Деплой — Docker

### Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

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
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
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
    environment: [WATCHPACK_POLLING=true]
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
npm install @mui/material @mui/material-nextjs @emotion/react @emotion/styled @emotion/cache

# Auth
npm install jose bcryptjs
npm install -D @types/bcryptjs

# GSAP
npm install @gsap/react

# Server-only guard
npm install server-only
```

---

## Важливі нотатки

- **SEO**: `generateMetadata` на кожній сторінці, `alternates.languages` для uk/en
- **CWV**: 3D сцена — `dynamic(..., { ssr: false, loading: () => <Placeholder/> })`
- **Зображення**: тільки `next/image` з явними розмірами
- **Loading**: `loading.tsx` для кожного route (Skeleton UI)
- **MUI Link**: завжди через `NextLink` wrapper (`'use client'`) при використанні з `component` prop
- **Cloudinary**: медіа — не потрібен volume для uploads
- **Перший адмін**: `npx prisma db seed` після першого деплою
