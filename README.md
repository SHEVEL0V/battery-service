# Tesla Battery Repair Service

Сайт сервісу ремонту батарей Tesla: інформація про послуги, онлайн-запис, контакти з картою та адмін-панель.

**Demo**: https://battery-service-ix7zrlpjp-shevel0vs-projects.vercel.app/en

**Стек**: Next.js (App Router) · TypeScript · MUI · Prisma · PostgreSQL · Framer Motion

## Запуск

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Docker (dev)

```bash
docker compose up --build
```

## Корисні команди

```bash
npx prisma studio       # перегляд БД
npx prisma db seed       # створення першого адміна
npm run lint
```

Детальніше про архітектуру, конвенції та деплой — у [CLAUDE.md](./CLAUDE.md).
