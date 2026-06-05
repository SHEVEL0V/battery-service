# CLAUDE.md — Tesla Battery Repair Website

## Огляд проекту

Сайт для сервісу ремонту батарей Tesla. Надає інформацію про послуги, пояснення процесу ремонту, онлайн-запис на сервіс, контакти з картою та маршрутом.

**Стек**: Next.js 16 (App Router) · TypeScript · MUI v6 · Prisma · PostgreSQL · next-intl · Framer Motion · GSAP · Three.js/R3F

---

## Структура проекту

```
/app
  /[locale]                    ← next-intl локалізація (uk | en)
    /(site)
      /page.tsx                ← Головна: Hero + Services + HowItWorks + Reviews + CTA
      /services/page.tsx       ← Детальний опис послуг
      /booking/page.tsx        ← Форма запису на сервіс
      /contacts/page.tsx       ← Контакти + Google Map + маршрут
    /(admin)
      /admin
        /page.tsx              ← Дашборд (список заявок)
        /bookings/page.tsx
  /api
    /bookings/route.ts
    /contact/route.ts
    /services/route.ts
    /auth/[...nextauth]/route.ts

/components
  /ui/                         ← Базові UI компоненти (Button, Card, Badge...)
  /sections/                   ← Секції сторінки (Hero, Services, HowItWorks, Map, Booking, Footer)
  /animation/                  ← Обгортки анімацій (ScrollReveal, ParallaxLayer, MagneticButton)
  /layout/                     ← Header, Footer, ThemeToggle, LanguageSwitcher

/lib
  /prisma.ts                   ← Singleton Prisma Client
  /mail.ts                     ← Resend email helper
  /telegram.ts                 ← Telegram Bot notify helper
  /auth.ts                     ← NextAuth конфіг

/prisma
  /schema.prisma

/locales
  /uk.json
  /en.json

/public
  /models/                     ← .glb файли 3D моделей батареї

/types
  /index.ts                    ← Глобальні TypeScript типи
```

---

## Бази даних — Prisma Schema

```prisma
model Booking {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String
  carModel  String
  year      Int
  message   String?
  status    BookingStatus @default(PENDING)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Service {
  id          String  @id @default(cuid())
  slug        String  @unique
  titleUk     String
  titleEn     String
  descUk      String
  descEn      String
  price       Int
  duration    String
  isActive    Boolean @default(true)
  order       Int     @default(0)
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
  isVisible Boolean @default(true)
  createdAt DateTime @default(now())
}

model User {
  id       String @id @default(cuid())
  email    String @unique
  password String
  role     Role   @default(ADMIN)
}

enum Role {
  ADMIN
  SUPERADMIN
}
```

---

## API Routes — Конвенції

Всі API відповідають:
```ts
// Успіх
{ success: true, data: T }

// Помилка
{ success: false, error: string }
```

### POST /api/bookings
- Валідація через `zod`
- Зберігає в БД
- Надсилає email підтвердження клієнту (Resend)
- Надсилає Telegram повідомлення адміну

### POST /api/contact
- Зберігає в БД
- Надсилає email + Telegram

### GET /api/services
- Повертає активні послуги, відсортовані за `order`

---

## Локалізація (next-intl)

URL структура: `/uk/...` та `/en/...`

`middleware.ts` — налаштований для перехоплення та редиректу.

```ts
// lib/i18n.ts
export const locales = ['uk', 'en'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'uk'
```

Переклади в `/locales/uk.json` і `/en.json`.  
Ключі у форматі `section.key`, наприклад: `hero.title`, `booking.submit`.

**Правило**: Ніколи не хардкодити текст в компонентах. Тільки через `useTranslations()`.

---

## Теми (MUI + next-themes)

```ts
// theme/index.ts
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#CC0000' },     // Tesla Red
    secondary: { main: '#1A1A1A' },
    background: { default: '#F5F5F5', paper: '#FFFFFF' },
  }
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#CC0000' },
    secondary: { main: '#E5E5E5' },
    background: { default: '#0A0A0A', paper: '#141414' },
  }
})
```

Зберігання теми: `localStorage` + cookie для SSR (через `next-themes`).

---

## Анімація — Правила та Конвенції

### Загальні принципи
- Framer Motion — для переходів між сторінками та scroll-reveal
- GSAP + ScrollTrigger — для Hero секції та pin-анімацій
- Three.js/React Three Fiber — тільки для 3D моделі батареї
- Lenis — smooth scroll, ініціалізується в `app/[locale]/layout.tsx`
- `prefers-reduced-motion` — завжди перевіряти, вимикати анімації якщо потрібно

### ScrollReveal компонент
```tsx
// components/animation/ScrollReveal.tsx
// Обгортка для Framer Motion whileInView
// Props: delay, direction ('up'|'left'|'right'), once
```

### Hero секція — GSAP timeline
- Particle система на canvas (кастомна, без бібліотек)
- Текст — stagger reveal через GSAP
- 3D батарея — React Three Fiber, обертається при скролі
- Паралакс фон

### Заборонено
- Не використовувати `animate` без `initial` у Framer Motion
- Не запускати GSAP до mount (useEffect або useGSAP)
- Три.js сцена — тільки один `<Canvas>` на сторінку

---

## Google Maps — Карта і Маршрут

```tsx
// components/sections/Map.tsx
// Використовує @react-google-maps/api
// Props: 
//   - center: { lat, lng } — координати сервісу
//   - showDirections: boolean
// Directions API — запит маршруту від поточної геолокації
// API ключ: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

---

## Змінні середовища (.env.local)

```env
# База даних
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

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

## Форма запису — Stepper (3 кроки)

**Крок 1 — Автомобіль**: Модель Tesla (Model 3 / Y / S / X / Cybertruck), рік випуску, опис проблеми  
**Крок 2 — Дата і час**: Вибір дати (react-datepicker або MUI DatePicker), вибір часового слоту  
**Крок 3 — Контакти**: Ім'я, телефон, email, підтвердження та відправка

- Валідація: `react-hook-form` + `zod`
- Після відправки: success-анімація (Framer Motion), email клієнту

---

## Сторінки та секції — Порядок на головній

1. `<Hero>` — 3D батарея + частинки + заголовок + CTA кнопка
2. `<Stats>` — Лічильники (кількість ремонтів, гарантія, досвід)
3. `<Services>` — Картки послуг з іконками та цінами
4. `<HowItWorks>` — Горизонтальний scroll (pin) — 4 кроки ремонту
5. `<WhyUs>` — Переваги сервісу
6. `<Reviews>` — Відгуки клієнтів (swiper carousel)
7. `<BookingCTA>` — Банер із закликом до дії
8. `<Map>` — Google Map + адреса + контакти
9. `<Footer>` — Лінки, соцмережі, копірайт

---

## Конвенції коду

### TypeScript
- Strict mode увімкнений
- Ніяких `any` — використовувати `unknown` або точні типи
- Всі props компонентів мають інтерфейси

### Компоненти
- Функціональні компоненти, `export default`
- Іменування: PascalCase для компонентів, camelCase для функцій
- Один компонент — один файл
- Не змішувати логіку та презентацію у великих компонентах

### API / Server Actions
- Завжди `try/catch`
- Логувати помилки через `console.error` (у майбутньому замінити на Sentry)
- Валідація вхідних даних через `zod` перед записом у БД

### CSS / Стилі
- Тільки MUI `sx` prop або `styled()` — не використовувати окремі CSS файли
- Брейкпоінти через MUI theme: `xs`, `sm`, `md`, `lg`, `xl`
- Не хардкодити кольори — тільки через `theme.palette`

### Git commits
- `feat:` — нова функціональність
- `fix:` — виправлення
- `style:` — стилі без логіки
- `refactor:` — рефакторинг
- `chore:` — конфіги, залежності

---

## Команди

```bash
# Локальна розробка (без Docker)
npm run dev
npm run build
npm run lint
npx prisma studio
npx prisma migrate dev --name <name>
npx prisma db seed

# Docker розробка
docker compose up --build
docker compose exec app npx prisma migrate dev --name <name>
docker compose exec app npx prisma studio

# Docker продакшн
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker compose -f docker-compose.prod.yml logs -f app
```

---

## Деплой — Docker

### Файли інфраструктури

```
/
  Dockerfile
  docker-compose.yml
  docker-compose.prod.yml
  .dockerignore
  nginx/
    nginx.conf
```

---

### Dockerfile (multi-stage build)

```dockerfile
# --- Stage 1: deps ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2: builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерація Prisma Client перед білдом
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Stage 3: runner ---
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

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

> **Важливо**: у `next.config.ts` обов'язково додати `output: 'standalone'`

---

### docker-compose.yml (розробка)

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      target: deps        # тільки deps для dev
    command: npm run dev
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    env_file:
      - .env.local
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

---

### docker-compose.prod.yml (продакшн)

```yaml
version: '3.9'

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

---

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

---

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

---

### next.config.ts — обов'язкова зміна

```ts
const nextConfig = {
  output: 'standalone',   // ← потрібно для Docker runner stage
  // ... решта конфігу
}
```

---

### DATABASE_URL для Docker

У `.env.production`:
```env
DATABASE_URL="postgresql://tesla:secret@postgres:5432/tesladb"
#                                        ^^^^^^^^
#                          ім'я сервісу з docker-compose, не localhost
```

---

### Команди деплою

```bash
# Розробка
docker compose up --build

# Продакшн — перший запуск
docker compose -f docker-compose.prod.yml up --build -d

# Застосувати міграції після деплою
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# Seed даних (якщо потрібно)
docker compose -f docker-compose.prod.yml exec app npx prisma db seed

# Переглянути логи
docker compose -f docker-compose.prod.yml logs -f app

# Оновити після змін
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up --build -d

# SSL сертифікат (Let's Encrypt на сервері)
certbot certonly --standalone -d yourdomain.com
```

---

### Cloudinary

Медіа (фото кейсів) зберігаються на Cloudinary — не потрібен окремий volume для uploads.

---

## Важливі нотатки

- Сайт повинен бути SEO-оптимізований: `generateMetadata` на кожній сторінці, обидві мови
- Core Web Vitals: 3D сцена завантажується з `dynamic(() => import(...), { ssr: false })`
- Всі зображення через `next/image` з явними розмірами
- `loading.tsx` для кожного роуту (skeleton UI)
- Адмін-панель захищена NextAuth — редирект якщо не авторизований
