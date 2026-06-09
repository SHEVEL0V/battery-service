# CLAUDE.md — Tesla Battery Repair Website

## Огляд проекту

Сайт для сервісу ремонту батарей Tesla. Надає інформацію про послуги, пояснення процесу ремонту, онлайн-запис на сервіс, контакти з картою та маршрутом.

**Стек**: Next.js 16.2.7 (App Router) · TypeScript · MUI v9 · Prisma V7.8 · PostgreSQL · Framer Motion · GSAP · Three.js/R3F · Jose · bcryptjs

---

## Структура проекту

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx               ← Providers: NextIntl + AppProviders (Server Component)
│   │   ├── loading.tsx
│   │   ├── error.tsx                ← 'use client'
│   │   ├── not-found.tsx
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
│   └── api/                         ← ПОРОЖНЬО. API routes не використовуються.
│                                       Всі мутації — Server Actions.
│
├── components/
│   ├── features/                    ← по фічах (не по технічних шарах)
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
│   │   │   ├── BookingSuccess.tsx   ← Framer Motion анімація
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
│   ├── ui/                          ← атомарні компоненти (Button, Card, Badge…)
│   ├── layout/                      ← Header, Footer, ThemeToggle, LanguageSwitcher
│   ├── animation/                   ← ScrollReveal, ParallaxLayer, MagneticButton
│   └── providers/
│       ├── AppProviders.tsx         ← 'use client', композиція всіх провайдерів
│       ├── MuiThemeProvider.tsx     ← 'use client' + AppRouterCacheProvider
│       └── LenisProvider.tsx        ← 'use client', smooth scroll
│
├── lib/
│   ├── auth/
│   │   ├── session.ts               ← server-only, Jose encrypt/decrypt JWT
│   │   ├── cookies.ts               ← server-only, createSession/deleteSession
│   │   └── dal.ts                   ← server-only, verifySession/getUser (React.cache)
│   ├── db/
│   │   ├── prisma.ts                ← singleton PrismaClient
│   │   ├── services.ts              ← unstable_cache, tags:['services']
│   │   ├── reviews.ts               ← unstable_cache, tags:['reviews']
│   │   └── bookings.ts              ← React.cache (no ISR, admin = завжди свіжі)
│   ├── cache-tags.ts                ← CACHE_TAGS константи
│   ├── email/
│   │   └── booking.ts               ← Resend helper
│   ├── telegram.ts                  ← Telegram Bot notify
│   └── i18n/
│       ├── routing.ts               ← defineRouting
│       ├── request.ts               ← getRequestConfig
│       └── navigation.ts            ← createNavigation (типізовані Link, redirect)
│
├── prisma/
│   └── schema.prisma
├── locales/
│   ├── uk.json
│   └── en.json
├── types/
│   └── index.ts
└── middleware.ts                    ← next-intl + optimistic auth check
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

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

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

enum Role {
  ADMIN
  SUPERADMIN
}
```

---

## API Routes

**Правило: `/api` папка порожня. Жодних Route Handlers для мутацій.**

Всі мутації даних (booking, contact, admin CRUD) реалізовані через **Server Actions** (`'use server'`). Це відповідає офіційній документації Next.js 16.2.7 — [Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data).

Route Handlers (`app/api/`) НЕ потрібні для цього проекту оскільки:

- Немає зовнішніх webhook-ів що потребують окремого endpoint
- Немає OAuth flow (NextAuth видалено)
- Немає public REST API для третіх сторін

---

## Автентифікація

Власна реалізація на основі [офіційної документації Next.js 16.2.7](https://nextjs.org/docs/app/guides/authentication). **NextAuth видалено.**

### Три шари захисту

**1. Middleware** — optimistic check (Edge Runtime, без DB):

```ts
// src/middleware.ts
// Декриптує JWT cookie → redirect якщо немає сесії
// НЕ звертається до БД — тільки перевіряє підпис
```

**2. Layout / Page (DAL)** — справжній захист:

```ts
// src/lib/auth/dal.ts  — import 'server-only'
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const token = (await cookies()).get("session")?.value;
  const session = await decrypt(token);
  if (!session?.userId) redirect("/uk/login");
  return session;
});
```

**3. Server Action** — перевірка перед кожною мутацією:

```ts
"use server";
export async function updateBookingStatus(id: string, status: BookingStatus) {
  await verifySession(); // ← завжди першим рядком
  // ...
}
```

### Session (JWT + cookie)

```ts
// src/lib/auth/session.ts — import 'server-only'
// Jose: HS256, exp: 7d
// encrypt(payload) / decrypt(token)

// src/lib/auth/cookies.ts — import 'server-only'
// createSession({ userId, role })
// deleteSession()
// updateSession()   ← продовжити при активності

// Cookie параметри (обов'язково):
// httpOnly: true, secure: true, sameSite: 'lax', expires: 7d
```

### Залежності для auth

```bash
npm install jose bcryptjs
npm install -D @types/bcryptjs
# bcrypt cost factor: 12
# SESSION_SECRET= (openssl rand -base64 32)
```

### Змінні середовища для auth

```env
SESSION_SECRET="згенерований_рядок_32_символи"
```

---

## Server Actions — конвенції

Усі мутації через Server Actions. Розташування: поруч з feature (не в окремій папці `/actions`).

```ts
// Шаблон кожного Server Action:
"use server";

export async function someAction(prevState: SomeState, formData: FormData): Promise<SomeState> {
  // 1. Перевірка сесії (якщо захищена дія)
  await verifySession();

  // 2. Валідація через Zod (safeParse, не parse)
  const validated = schema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // 3. Мутація БД
  await prisma.model.create({ data: validated.data });

  // 4. Інвалідація кешу
  revalidateTag(CACHE_TAGS.relevant);

  // 5. redirect() — поза try/catch!
  return { success: true };
}
```

**Client Component з useActionState:**

```tsx
"use client";
const [state, action, isPending] = useActionState(someAction, initialState);
// <form action={action}> — не onSubmit
// <button disabled={isPending}>
```

---

## Fetching та Кешування

Офіційна документація: [Caching and Revalidating](https://nextjs.org/docs/app/guides/caching-without-cache-components)

### Два інструменти

| Інструмент       | Коли                                      | Приклад              |
| ---------------- | ----------------------------------------- | -------------------- |
| `unstable_cache` | Між запитами, ISR, on-demand revalidation | Services, Reviews    |
| `React.cache()`  | Дедуплікація в рамках render pass         | DAL функції, getUser |

```ts
// src/lib/db/services.ts — import 'server-only'
export const getActiveServices = unstable_cache(
  async () =>
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ["active-services"],
  { tags: ["services"], revalidate: 3600 },
);
```

### Паралельне завантаження в RSC

```ts
// Завжди Promise.all — не sequential await
const [services, reviews] = await Promise.all([getActiveServices(), getVisibleReviews()]);
```

### Streaming з Suspense

```tsx
// Секції стрімляться незалежно
<Suspense fallback={<ServicesSkeleton />}>
  <ServicesSection />
</Suspense>
<Suspense fallback={<ReviewsSkeleton />}>
  <ReviewsSection />
</Suspense>
```

### Revalidation після мутацій

```ts
// src/lib/cache-tags.ts
export const CACHE_TAGS = {
  services: "services", // main + /services/**
  reviews: "reviews", // main
  bookings: "bookings", // admin/bookings
} as const;

// Після мутації:
revalidateTag(CACHE_TAGS.services); // краще за revalidatePath
```

### Admin сторінки — завжди динамічні

```ts
// Всі (admin) сторінки:
export const dynamic = "force-dynamic";
```

---

## Локалізація (next-intl)

URL структура: `/uk/...` та `/en/...`

```ts
// src/lib/i18n/routing.ts
export const routing = defineRouting({
  locales: ["uk", "en"],
  defaultLocale: "uk",
  localePrefix: "always",
});

// src/lib/i18n/navigation.ts — ВИКОРИСТОВУВАТИ ЗАМІСТЬ next/navigation
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

**Правило**: Ніколи не хардкодити текст в компонентах. Тільки через `useTranslations()` (client) або `getTranslations()` (server).

```ts
// Server Component:
const t = await getTranslations("section");

// Client Component:
const t = useTranslations("section");
```

Ключі у форматі `section.key`, наприклад: `hero.title`, `booking.submit`.

---

## Теми (MUI + next-themes)

```ts
// src/theme/index.ts
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#CC0000" }, // Tesla Red
    secondary: { main: "#1A1A1A" },
    background: { default: "#F5F5F5", paper: "#FFFFFF" },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#CC0000" },
    secondary: { main: "#E5E5E5" },
    background: { default: "#0A0A0A", paper: "#141414" },
  },
});
```

**MuiThemeProvider** обов'язково обгортати у `AppRouterCacheProvider` з `@mui/material-nextjs/v15-appRouter` — усуває Emotion flash при SSR.

Зберігання теми: `localStorage` + cookie для SSR (через `next-themes`).

---

## Providers — архітектура

```tsx
// src/components/providers/AppProviders.tsx — 'use client'
// Єдиний клієнтський кордон для всіх провайдерів
<SessionContext.Provider value={session}>
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
    <MuiThemeProvider>
      {" "}
      // AppRouterCacheProvider + ThemeProvider
      <LenisProvider>
        {" "}
        // smooth scroll з proper cleanup
        {children}
      </LenisProvider>
    </MuiThemeProvider>
  </ThemeProvider>
</SessionContext.Provider>;

// src/app/[locale]/layout.tsx — Server Component (без 'use client'!)
const messages = await getMessages();
return (
  <html lang={locale} suppressHydrationWarning>
    <body>
      <NextIntlClientProvider messages={messages}>
        <AppProviders session={session}>{children}</AppProviders>
      </NextIntlClientProvider>
    </body>
  </html>
);
```

---

## Server / Client boundaries

**Правило: "push client down"** — компонент стає Client лише якщо потребує хуків, browser APIs, обробників подій або анімаційних бібліотек.

| Server Components (RSC)   | Client Components            |
| ------------------------- | ---------------------------- |
| page.tsx, layout.tsx      | BookingForm (useActionState) |
| ServicesList, ServiceCard | HeroScene (R3F, GSAP)        |
| ReviewCard, Footer        | HeroParticles (canvas)       |
| MapSection (shell)        | MapClient (Google Maps)      |
| Stats (дані з БД)         | ReviewsCarousel (Swiper)     |
| HowItWorksSection         | Header (nav state)           |

---

## Анімація — Правила та Конвенції

- **Framer Motion** — переходи між сторінками та scroll-reveal
- **GSAP + useGSAP hook** — Hero секція та pin-анімації (НЕ useEffect!)
- **Three.js/React Three Fiber** — тільки 3D модель батареї
- **Lenis** — smooth scroll, ініціалізується в `LenisProvider` з RAF cleanup
- `prefers-reduced-motion` — завжди перевіряти

### GSAP — обов'язково useGSAP

```ts
// ❌ НЕ ПРАВИЛЬНО — memory leak в StrictMode
useEffect(() => { gsap.fromTo('.hero-text', ...) })

// ✅ ПРАВИЛЬНО
import { useGSAP } from '@gsap/react'
useGSAP(() => {
  gsap.fromTo('.hero-text', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 })
}, { scope: containerRef })
```

### 3D батарея — Suspense + placeholder

```tsx
// ❌ БЕЗ placeholder → CLS
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// ✅ З placeholder → нуль CLS
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <BatteryPlaceholder />, // точний розмір як Canvas
});
```

**Правило**: Тільки один `<Canvas>` на сторінку. Захист через `CanvasGuard` context.

### Заборонено

- Не використовувати `animate` без `initial` у Framer Motion
- Не запускати GSAP до mount — тільки `useGSAP` або `useEffect`
- Три.js сцена — тільки один `<Canvas>` на сторінку
- GSAP без cleanup → завжди через `useGSAP`

---

## Google Maps — Карта і Маршрут

```tsx
// src/components/features/map/MapClient.tsx — 'use client'
// @react-google-maps/api
// MapSection.tsx (RSC) → MapClient.tsx (client, dynamic import)
// API ключ: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
// Directions API — маршрут від поточної геолокації
```

---

## Форма запису — Stepper (3 кроки)

**Крок 1 — Автомобіль**: Модель Tesla (Model 3 / Y / S / X / Cybertruck), рік, опис проблеми
**Крок 2 — Дата і час**: Вибір дати (MUI DatePicker), вибір часового слоту
**Крок 3 — Контакти**: Ім'я, телефон, email, підтвердження та відправка

- Валідація: **Server-side через Zod** у Server Action (не react-hook-form!)
- Client: `useActionState` + `<form action={action}>`
- Після відправки: success-анімація (Framer Motion), email клієнту

---

## Сторінки та секції — Порядок на головній

1. `<Hero>` — 3D батарея + частинки + заголовок + CTA кнопка
2. `<Stats>` — Лічильники (кількість ремонтів, гарантія, досвід)
3. `<Services>` — Картки послуг з іконками та цінами
4. `<HowItWorks>` — Горизонтальний scroll (pin) — 4 кроки ремонту
5. `<WhyUs>` — Переваги сервісу
6. `<Reviews>` — Відгуки клієнтів (Swiper carousel)
7. `<BookingCTA>` — Банер із закликом до дії
8. `<Map>` — Google Map + адреса + контакти
9. `<Footer>` — Лінки, соцмережі, копірайт

---

## Конвенції коду

### TypeScript

- Strict mode увімкнений + `noUncheckedIndexedAccess: true`
- Ніяких `any` — використовувати `unknown` або точні типи
- Всі props компонентів мають інтерфейси
- `import 'server-only'` у всіх файлах що містять Prisma або secrets

### Компоненти

- Функціональні компоненти, `export default`
- Іменування: PascalCase для компонентів, camelCase для функцій
- Один компонент — один файл
- Feature-based організація: все що стосується booking в `features/booking/`

### Server Components vs Client Components

```ts
// Server Component (за замовчуванням) — читає БД, getTranslations, generateMetadata
// Client Component ('use client') — useState, useEffect, browser API, обробники подій

// Паттерн: RSC shell → передає дані → Client leaf
// page.tsx (RSC) → List (RSC) → InteractiveCard ('use client')
```

### CSS / Стилі

- Тільки MUI `sx` prop або `styled()` — не окремі CSS файли
- Брейкпоінти через MUI theme: `xs`, `sm`, `md`, `lg`, `xl`
- Не хардкодити кольори — тільки через `theme.palette`

### Git commits

- `feat:` — нова функціональність
- `fix:` — виправлення
- `style:` — стилі без логіки
- `refactor:` — рефакторинг
- `chore:` — конфіги, залежності

---

## Middleware

```ts
// src/middleware.ts — два завдання:
// 1. next-intl локалізація
// 2. Optimistic auth check для /admin routes (без DB запиту)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|glb|gltf)).*)",
  ],
};
```

---

## next.config.ts

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig = {
  output: "standalone", // обов'язково для Docker
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    typedRoutes: true, // типізовані Link href
  },
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }],
  },
};

export default withNextIntl(nextConfig);
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
# База даних
DATABASE_URL="postgresql://..."

# Auth (власна реалізація, НЕ NextAuth)
SESSION_SECRET="згенерований_рядок_32_символи"
# Генерація: openssl rand -base64 32

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."

# Email (Resend)
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"

# Telegram Bot
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_CHAT_ID="..."

# Cloudinary (фото кейсів)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## Деплой — Docker

### Dockerfile (multi-stage build)

```dockerfile
# Stage 1: deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Stage 2: dev (окремий для розробки)
FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 4: runner (prod)
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

### docker-compose.yml (розробка)

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      target: dev # ← окремий dev stage
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    environment:
      - WATCHPACK_POLLING=true # hot reload в Docker на macOS/Windows
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-tesla}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secret}
      POSTGRES_DB: ${POSTGRES_DB:-tesladb}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-tesla}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### docker-compose.prod.yml (продакшн)

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      target: runner
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - tesla_net

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - tesla_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - app
    networks:
      - tesla_net

networks:
  tesla_net:
    driver: bridge

volumes:
  postgres_data:
```

### nginx/nginx.conf

```nginx
events { worker_connections 1024; }

http {
  upstream nextjs {
    server app:3000;
  }

  server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 20M;

    location /_next/static/ {
      proxy_pass http://nextjs;
      add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
      proxy_pass http://nextjs;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

### .dockerignore

```
node_modules
.next
.git
.env*
!.env.example
npm-debug.log*
README.md
.DS_Store
```

### DATABASE_URL для Docker

У `.env.production`:

```env
DATABASE_URL="postgresql://tesla:secret@postgres:5432/tesladb"
#                                        ^^^^^^^^
#                          ім'я сервісу з docker-compose, не localhost
```

---

## Команди

```bash
# Локальна розробка
npm run dev
npm run build
npm run lint
npx prisma studio
npx prisma migrate dev --name <name>
npx prisma db seed

# Перший адмін (seed):
# bcrypt hash з cost factor 12, зберегти в User.password

# Docker розробка
docker compose up --build
docker compose exec app npx prisma migrate dev --name <name>
docker compose exec app npx prisma studio

# Docker продакшн
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec app npx prisma db seed
docker compose -f docker-compose.prod.yml logs -f app

# SSL (Let's Encrypt на сервері)
certbot certonly --standalone -d yourdomain.com
```

---

## Пакети

```bash
# Auth (замість next-auth)
npm install jose bcryptjs
npm install -D @types/bcryptjs

# MUI SSR fix
npm install @mui/material-nextjs

# GSAP хук
npm install @gsap/react

# Server-only захист
npm install server-only
```

---

## Важливі нотатки

- **SEO**: `generateMetadata` на кожній сторінці, обидві мови, `alternates.languages`
- **Core Web Vitals**: 3D сцена — `dynamic(() => import(...), { ssr: false, loading: () => <Placeholder/> })`
- **Зображення**: тільки `next/image` з явними розмірами
- **Скелетони**: `loading.tsx` для кожного route
- **server-only**: додавати до всіх файлів що містять Prisma, secrets або auth логіку
- **Cloudinary**: медіа (фото кейсів) — не потрібен volume для uploads
- **Admin seed**: `npx prisma db seed` після першого деплою для створення першого адміна
