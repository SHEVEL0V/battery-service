# ⚡ Швидкий старт (Quick Start)

## 1️⃣ Встановлення залежностей

```bash
npm install
```

## 2️⃣ Налаштування змінних середовища

```bash
cp .env.example .env.local
```

Заповніть необхідні значення в `.env.local`:
- `DATABASE_URL` — адреса PostgreSQL
- `NEXTAUTH_SECRET` — довільна строка для шифрування
- `RESEND_API_KEY` — для email (опціонально)
- `TELEGRAM_BOT_TOKEN` — для повідомлень (опціонально)

## 3️⃣ Підготовка БД

```bash
# Генерувати Prisma Client
npx prisma generate

# Запустити міграції
npx prisma migrate dev --name init

# Seed (наповнити БД прикладами)
npx prisma db seed
```

## 4️⃣ Запуск розробки

```bash
npm run dev
```

Сайт буде доступний на **`http://localhost:3000`**

Middleware автоматично редирректує на:
- **`http://localhost:3000/uk`** — українська (за замовчуванням)
- **`http://localhost:3000/en`** — англійська

## 🐳 Docker Quick Start

```bash
# Запустити все в Docker
docker compose up --build

# У другому терміналі:
docker compose exec app npx prisma migrate dev --name init
docker compose exec app npx prisma db seed
```

Сайт: http://localhost:3000/

## 📚 Корисні команди

```bash
# Prisma Studio (управління БД)
npm run prisma:studio

# Build для production
npm run build

# Перевірка типів
npx tsc --noEmit

# Linting
npm run lint
```

## 🎯 Структура компонентів

- **`src/app/[locale]/`** — Динамічна локалізація (uk, en)
- **`src/app/[locale]/dictionaries/`** — Переклади (uk.json, en.json)
- **`src/components/sections/`** — Основні секції сторінки
- **`src/components/layout/`** — Header, Footer, Theme Switcher
- **`src/components/animation/`** — Анімації (ScrollReveal, Parallax)
- **`src/components/ui/`** — Базові UI компоненти (Button, Card, Badge)
- **`src/app/[locale]/(site)/`** — Публічні сторінки
- **`src/app/[locale]/(admin)/`** — Адмін-панель (захищена)
- **`src/app/api/`** — API endpoints

## 🌍 Локалізація

Проект використовує офіційний підхід Next.js для локалізації:

- **Middleware** (`middleware.ts`) — Визначає мову та редирректує
- **Dictionary Loader** (`src/app/[locale]/dictionaries.ts`) — Завантажує переклади
- **JSON файли** (`src/app/[locale]/dictionaries/*.json`) — Переклади
- **Props передача** — Компоненти отримують `dict` та `locale` як props

👉 Детальна інформація: дивись `LOCALIZATION.md`

## 🔧 Налаштування GitHub Actions

Для автоматичного деплою на Vercel створіть файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

Готово! Проект розгорнений і готовий до розробки. 🚀
