# 🌍 Локалізація — Оновлена конфігурація

Проект використовує **офіційний підхід Next.js** для локалізації (без зовнішніх бібліотек на кшталт `next-intl`).

## 📋 Структура

```
src/app/
├── [locale]/                        # Dynamic route parameter
│   ├── layout.tsx                   # Root layout (отримує dict)
│   ├── dictionaries.ts              # Dictionary loader
│   ├── dictionaries/
│   │   ├── uk.json                  # Ukrainian translations
│   │   └── en.json                  # English translations
│   ├── (site)/
│   │   ├── page.tsx
│   │   ├── services/page.tsx
│   │   ├── booking/page.tsx
│   │   └── contacts/page.tsx
│   └── (admin)/
│       └── admin/...
```

## 🔧 Як це працює

### 1. Middleware (`middleware.ts`)
- Перехоплює запити без locale
- Визначає мову на основі `Accept-Language` header
- Зберігає вибір у cookie
- Редирректує на локалізований маршрут

```typescript
// Приклад:
// / → /uk/ (якщо мова браузера українська)
// / → /en/ (якщо мова браузера англійська)
```

### 2. Dictionary Loader (`src/app/[locale]/dictionaries.ts`)

```typescript
const dictionaries = {
  uk: () => import('./dictionaries/uk.json').then(m => m.default),
  en: () => import('./dictionaries/en.json').then(m => m.default),
}

export async function getDictionary(locale) {
  return dictionaries[locale]()
}
```

**Переваги:**
- Динамічне завантаження перекладів
- Лише потрібні переклади завантажуються
- Розміри бандла не збільшуються
- TypeScript типізація

### 3. Layout отримує Dictionary

```typescript
// src/app/[locale]/layout.tsx
export default async function RootLayout({ children, params }) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} dict={dict} />
        {children}
        <Footer dict={dict} />
      </body>
    </html>
  )
}
```

### 4. Компоненти отримують Dict як Props

```typescript
// Client Components
interface HeaderProps {
  locale: string
  dict: any  // Переклади
}

export function Header({ locale, dict }: HeaderProps) {
  return (
    <nav>
      <Link href={`/${locale}/services`}>{dict.nav.services}</Link>
      <Link href={`/${locale}/booking`}>{dict.nav.booking}</Link>
    </nav>
  )
}
```

## 📚 JSON Структура

```json
// dictionaries/uk.json
{
  "nav": {
    "services": "Послуги",
    "booking": "Запис",
    "contacts": "Контакти"
  },
  "hero": {
    "title": "Ремонт батарей Tesla",
    "description": "Швидко. Надійно. Гарантовано."
  },
  "footer": {
    "copyright": "© 2024 Tesla Battery Service",
    "description": "Професійний сервіс..."
  }
}
```

## 🎯 Залежності

Замість `next-intl` використовуємо:

```json
{
  "dependencies": {
    "@formatjs/intl-localematcher": "^0.5.4",  // Матчинг мови
    "negotiator": "^0.6.4",                     // Parse Accept-Language
    "server-only": "^0.0.1"                     // Забезпечити server-only код
  }
}
```

## 🚀 Як використовувати

### Додавання нового ключа до перекладів

1. Додати в `uk.json`:
```json
{
  "mySection": {
    "title": "Мій заголовок",
    "description": "Опис"
  }
}
```

2. Додати в `en.json`:
```json
{
  "mySection": {
    "title": "My Title",
    "description": "Description"
  }
}
```

3. Використовувати в компоненті:
```tsx
<h1>{dict.mySection.title}</h1>
<p>{dict.mySection.description}</p>
```

### Вивід у форм URL

```typescript
// Посилання завжди з locale:
<Link href={`/${locale}/services`}>Послуги</Link>

// Автоматична заміна мови:
const newPath = pathname.replace(/^\/(uk|en)/, `/${newLocale}`)
router.push(newPath)
```

## ⚡ Переваги підходу

✅ Жодних додаткових бібліотек (окрім утиліт для парсингу)  
✅ Сервер-сайд рендеринг  
✅ Малий розмір бандла  
✅ TypeScript підтримка  
✅ Статична генерація (SSG) для всіх локалей  
✅ Гнучкість (легко змінити структуру)

## 📖 Офіційна документація

https://nextjs.org/docs/app/guides/internationalization

---

**Проект готовий до локалізації! 🌍**
