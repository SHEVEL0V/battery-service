# Tesla Battery Repair Service

Сайт для сервісу ремонту батарей Tesla на Next.js 16, TypeScript, MUI, і Prisma.

## 🚀 Швидкий старт

### Локальна розробка

```bash
# Встановити залежності
npm install

# Налаштувати змінні середовища
cp .env.example .env.local

# Запустити розробку
npm run dev

# Відкрити Prisma Studio
npx prisma studio
```

### Docker розробка

```bash
docker compose up --build
```

### Міграція БД

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## 📁 Структура проекту

```
src/
├── app/
│   ├── [locale]/                    # Локалізація (uk, en)
│   │   ├── layout.tsx
│   │   ├── dictionaries.ts
│   │   ├── dictionaries/
│   │   │   ├── uk.json
│   │   │   └── en.json
│   │   ├── (site)/
│   │   │   └── page.tsx             # Головна сторінка
│   │   └── (admin)/
│   │       └── admin/
│   └── api/
│       ├── bookings/route.ts
│       ├── contact/route.ts
│       └── services/route.ts
│
├── components/
│   ├── sections/                    # Основні секції
│   ├── layout/                      # Header, Footer, Theme, Language
│   ├── animation/                   # ScrollReveal, Parallax
│   └── ui/                          # Button, Card, Badge
│
├── lib/
│   ├── prisma.ts
│   ├── mail.ts
│   ├── telegram.ts
│   ├── auth.ts
│   └── i18n.ts
│
├── prisma/
│   └── schema.prisma                # БД модель
│
└── theme/
    └── index.ts                     # MUI теми
```

## 🌍 Локалізація

Проект використовує **офіційний підхід Next.js** для локалізації (без `next-intl`).

- Middleware визначає мову браузера
- Dictionary система завантажує переклади
- Компоненти отримують `dict` та `locale` як props
- Підтримуються мови: **uk** (українська), **en** (англійська)

👉 [Деталі локалізації](LOCALIZATION.md)

## 🔧 Конфіґурація

Дивись `.env.example` для всіх доступних змінних:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."
RESEND_API_KEY="..."
TELEGRAM_BOT_TOKEN="..."
```

## 📦 Стек технологій

- **Next.js 16** — React фреймворк
- **TypeScript** — Type-safe код
- **MUI v9** — UI компоненти
- **Prisma** — ORM для БД
- **PostgreSQL** — База даних
- **Framer Motion** — Анімації
- **GSAP** — Просунуті анімації
- **NextAuth** — Автентифікація
- **Resend** — Email сервіс
- **Telegram Bot** — Сповіщення

## 🚀 Деплой

### Production із Docker

```bash
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### На Vercel

```bash
git push origin main
# Автоматичний деплой через Vercel
```

## 📖 Документація

- [QUICKSTART.md](QUICKSTART.md) — Швидкий старт
- [LOCALIZATION.md](LOCALIZATION.md) — Локалізація (uk/en)
- [SETUP.md](SETUP.md) — Детальне налаштування
- [CLAUDE.md](CLAUDE.md) — Вихідна інструкція проекту

## 📋 API Routes

| Маршрут | Метод | Опис |
|---------|-------|------|
| `/api/bookings` | POST/GET | Заявки на ремонт |
| `/api/contact` | POST | Контактні повідомлення |
| `/api/services` | GET | Список послуг |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth endpoints |

## ✨ Особливості

✅ TypeScript strict mode  
✅ SEO оптимізація  
✅ Темна/світла тема  
✅ Двомовність (uk/en)  
✅ Анімації (Framer Motion + GSAP)  
✅ Email сповіщення (Resend)  
✅ Telegram bot notifications  
✅ NextAuth захист адмін-панелі  
✅ Docker ready  
✅ Production ready (nginx + SSL)  

---

**Проект розгорнений та готовий до розробки! 🎉**
