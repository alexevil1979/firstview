# LinkWalker

SaaS для визуализации последовательного прохода по списку URL в реальном времени.

Проход выполняется **только на клиенте**. Бэкенд нужен для авторизации, подписок, аналитики и админки.

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS + компоненты в стиле shadcn/ui
- Zustand (состояние прохода и auth)
- Framer Motion
- Recharts
- Prisma + PostgreSQL (схема готова)
- Демо-авторизация (готово к замене на Clerk / NextAuth)
- Stripe-ready UI (демо без реальных ключей)

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Разделы

| Путь | Описание |
|------|----------|
| `/` | Лендинг |
| `/login`, `/register` | Вход / регистрация (демо) |
| `/dashboard` | Личный кабинет и проход ссылок |
| `/dashboard/history` | История |
| `/dashboard/stats` | Статистика |
| `/dashboard/billing` | Подписка |
| `/admin` | Админ-панель |

### Быстрый вход

- Пользователь: любой email на `/login` (пресет `maria.seo@agency.ru`)
- Админ: кнопка «Войти как админ» или email `alex@linkwalker.app`

## Prisma

```bash
cp .env.example .env
npx prisma generate
npx prisma db push
```

Без базы приложение работает на mock-данных.

## Структура

```
src/
  app/                 # маршруты
  components/
    landing/           # лендинг
    dashboard/         # кабинет
    admin/             # админка
    walker/            # мини-браузер
    ui/                # UI-kit
  stores/              # zustand
  lib/                 # utils, plans, mock-data
prisma/schema.prisma
```
