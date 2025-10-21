# 📚 Методичка Министерства Здравоохранения

> Комплексная веб-платформа для управления документацией и обучением сотрудников Министерства Здравоохранения. Построена на Next.js 14 с использованием TypeScript, React 18, Tailwind CSS и Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.58.0-3ecf8e)](https://supabase.com/)

---

## 📑 Оглавление

### 🚀 Начало работы
1. [О проекте](#-о-проекте)
2. [Технологический стек](#-технологический-стек)
3. [Системные требования](#-системные-требования)
4. [Клонирование репозитория](#-клонирование-репозитория)
5. [Установка зависимостей](#-установка-зависимостей)
6. [Настройка окружения](#-настройка-окружения)
7. [Запуск проекта](#-запуск-проекта)

### 🔐 Система аутентификации
8. [Система запросов на аккаунты](#-система-запросов-на-аккаунты)
9. [Роли и права доступа](#-роли-и-права-доступа)
10. [Управление пользователями](#-управление-пользователями)

### 💻 Разработка
11. [Структура проекта](#-структура-проекта)
12. [Архитектура приложения](#-архитектура-приложения)
13. [Добавление новых разделов](#-добавление-новых-разделов)
14. [Компоненты и элементы](#-компоненты-и-элементы)
15. [Работа с API](#-работа-с-api)
16. [Работа с базой данных](#-работа-с-базой-данных)

### 🎨 Стилизация и UI
17. [Система стилей](#-система-стилей)
18. [Tailwind CSS конфигурация](#-tailwind-css-конфигурация)
19. [Темизация](#-темизация)
20. [Компоненты UI](#-компоненты-ui)

### 🔧 Инструменты и утилиты
21. [Полезные команды](#-полезные-команды)
22. [Работа с Git](#-работа-с-git)
23. [Деплой на Vercel](#-деплой-на-vercel)
24. [Миграции базы данных](#-миграции-базы-данных)

### 📖 Дополнительно
25. [Советы по разработке](#-советы-по-разработке)
26. [Решение проблем](#-решение-проблем)
27. [FAQ](#-faq)
28. [Контакты и поддержка](#-контакты-и-поддержка)

---

## 📖 О проекте

**Методичка МЗ** — это современное веб-приложение для централизованного управления обучающими материалами, документацией и процессами в рамках Министерства Здравоохранения. Платформа предоставляет:

- ✅ **Структурированную документацию** для младшего и старшего состава
- ✅ **Систему ролей и прав доступа** (root, admin, ld, user)
- ✅ **Интерактивные обучающие материалы** с возможностью копирования
- ✅ **Защищенные разделы** с парольным доступом
- ✅ **Систему управления пользователями** с запросами на создание аккаунтов
- ✅ **Журнал действий** для отслеживания активности
- ✅ **Генератор отчетов** для автоматизации рутинных задач
- ✅ **Адаптивный дизайн** для работы на всех устройствах

---

## 🛠 Технологический стек

### Frontend
- **Next.js 14.2.16** — React фреймворк с App Router
- **React 18** — библиотека для построения UI
- **TypeScript 5** — типизированный JavaScript
- **Tailwind CSS 3.4.17** — utility-first CSS фреймворк
- **Radix UI** — набор доступных компонентов
- **Lucide React** — иконки
- **React Hook Form** — управление формами
- **Zod** — валидация схем

### Backend & Database
- **Supabase** — Backend-as-a-Service (PostgreSQL)
- **bcryptjs** — хеширование паролей
- **crypto-js** — криптографические функции

### Дополнительные инструменты
- **Vercel Analytics** — аналитика
- **Vercel Speed Insights** — мониторинг производительности
- **date-fns** — работа с датами
- **recharts** — графики и диаграммы
- **sonner** — уведомления

---

## 💻 Системные требования

Перед началом работы убедитесь, что у вас установлено:

- **Node.js** версии 18.0.0 или выше ([скачать](https://nodejs.org/))
- **npm** версии 9.0.0 или выше (устанавливается с Node.js)
- **Git** версии 2.0.0 или выше ([скачать](https://git-scm.com/))
- **Редактор кода** (рекомендуется [VS Code](https://code.visualstudio.com/))

### Рекомендуемые расширения для VS Code
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

---

## 📥 Клонирование репозитория

### Шаг 1: Клонирование
Откройте терминал и выполните следующие команды:

```bash
# Клонирование репозитория
git clone https://github.com/Luckyillia/metodichka-mz.git

# Переход в директорию проекта
cd metodichka-mz
```

### Шаг 2: Проверка версий
Убедитесь, что установлены правильные версии:

```bash
# Проверка версии Node.js
node --version
# Должно быть v18.0.0 или выше

# Проверка версии npm
npm --version
# Должно быть 9.0.0 или выше

# Проверка версии Git
git --version
```

---

## 📦 Установка зависимостей

Установите все необходимые зависимости проекта:

```bash
npm install
```

Этот процесс может занять несколько минут. После завершения будут установлены все пакеты, указанные в `package.json`.

### Возможные проблемы при установке

**Проблема:** Ошибки при установке зависимостей
```bash
# Очистка кэша npm
npm cache clean --force

# Удаление node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Повторная установка
npm install
```

**Проблема:** Конфликты версий
```bash
# Использование legacy peer deps
npm install --legacy-peer-deps
```

---

## ⚙️ Настройка окружения

### Создание файла .env.local

Создайте файл `.env.local` в корне проекта и добавьте следующие переменные окружения:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Получение Supabase credentials

1. Зайдите на [supabase.com](https://supabase.com/)
2. Создайте новый проект или откройте существующий
3. Перейдите в **Settings** → **API**
4. Скопируйте **Project URL** и **anon/public key**
5. Вставьте их в `.env.local`

### Настройка базы данных

После настройки Supabase выполните миграции:

```bash
# Примените все миграции из папки migrations/
# См. раздел "Миграции базы данных"
```

---

## 🚀 Запуск проекта

### Режим разработки

Для локальной разработки с hot-reload:

```bash
npm run dev
```

Приложение будет доступно по адресу: **[http://localhost:3000](http://localhost:3000)**

### Production сборка

Для создания оптимизированной production-сборки:

```bash
# Создание сборки
npm run build

# Запуск production-сервера
npm start
```

### Проверка кода

```bash
# Линтинг кода
npm run lint

# Проверка типов TypeScript
npx tsc --noEmit
```

---

## 🔐 Система запросов на аккаунты

### Обзор

Реализована полноценная система управления пользователями с поддержкой:
- Публичных запросов на создание аккаунтов
- Двухэтапного удаления пользователей
- Системы статусов и ролей
- Журналирования всех действий

### Основные возможности

| Функция | Описание | Доступ |
|---------|----------|--------|
| **Публичная форма запроса** | Любой пользователь может отправить запрос на создание аккаунта | Все |
| **Система статусов** | `active`, `inactive`, `request` | Root, Admin |
| **Одобрение/отклонение** | Обработка запросов на создание аккаунтов | Root |
| **Двухэтапное удаление** | Деактивация → окончательное удаление | Root |
| **Статистика запросов** | Отображение статистики в админ-панели | Root, Admin |
| **Журнал действий** | Логирование всех операций с пользователями | Root, Admin |

### Быстрый старт

#### 1. Применить миграции БД

```sql
-- Выполните миграции в следующем порядке:
-- 1. migrations/001_change_active_to_status.sql
-- 2. migrations/002_drop_active_column.sql
-- 3. migrations/003_add_ip_address.sql

-- Или выполните все сразу:
-- migrations/APPLY_ALL_MIGRATIONS.sql
```

#### 2. Проверить работу системы

**Для пользователя:**
1. Откройте `/login`
2. Нажмите "Отправить запрос на создание аккаунта"
3. Заполните форму с данными:
   - Игровой ник
   - Желаемое имя пользователя
   - Пароль (минимум 6 символов)
   - Причина запроса
4. Отправьте запрос

**Для администратора (root):**
1. Войдите в систему как root
2. Перейдите в раздел "Управление пользователями"
3. Увидите список запросов со статусом "request"
4. Одобрите или отклоните запрос
5. При одобрении пользователь получит доступ к системе

### Маршруты (Routes)

| URL | Описание | Доступ |
|-----|----------|--------|
| `/login` | Страница входа с кнопкой запроса аккаунта | Публичный |
| `/account-request` | Форма запроса на создание аккаунта | Публичный |
| `/` (раздел "Управление пользователями") | Админ-панель управления пользователями | Root, Admin |

### API Endpoints

#### POST /api/account-request
Создание нового запроса на аккаунт

**Request Body:**
```json
{
  "game_nick": "Иванов И.И.",
  "username": "ivanov",
  "password": "securePassword123",
  "reason": "Новый сотрудник МЗ"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Запрос успешно отправлен"
}
```

#### PATCH /api/users
Одобрение запроса на создание аккаунта

**Request Body:**
```json
{
  "action": "approve",
  "userId": "user-id-here"
}
```

#### DELETE /api/users/permanent-delete
Окончательное удаление пользователя

**Query Parameters:**
- `userId` - ID пользователя для удаления

### Статусы пользователей

| Статус | Описание | Действия |
|--------|----------|----------|
| `request` | Запрос на создание аккаунта | Ожидает одобрения/отклонения |
| `active` | Активный пользователь | Может входить в систему |
| `inactive` | Деактивированный пользователь | Не может входить, но данные сохранены |

### Workflow создания аккаунта

```
Пользователь → Заполняет форму → Отправляет запрос
                                        ↓
                                  Статус: request
                                        ↓
                              Root рассматривает запрос
                                        ↓
                        ┌───────────────┴───────────────┐
                        ↓                               ↓
                   Одобрение                      Отклонение
                        ↓                               ↓
                 Статус: active                   Удаление записи
                        ↓
              Пользователь может войти
```

---

## 👥 Роли и права доступа

### Иерархия ролей

```
root (Суперадминистратор)
  └── admin (Администратор)
       └── ld (Руководитель направления)
            └── user (Обычный пользователь)
```

### Матрица прав доступа

| Функция | root | admin | ld | user |
|---------|------|-------|----|----- |
| **Просмотр разделов МС** | ✅ | ✅ | ✅ | ✅ |
| **Просмотр разделов СС** | ✅ | ✅ | ✅ | ❌ |
| **Управление пользователями** | ✅ | ✅ | ❌ | ❌ |
| **Одобрение запросов** | ✅ | ❌ | ❌ | ❌ |
| **Окончательное удаление** | ✅ | ❌ | ❌ | ❌ |
| **Просмотр журнала действий** | ✅ | ✅ | ❌ | ❌ |
| **Генератор отчетов** | ✅ | ✅ | ✅ | ❌ |

### Описание ролей

#### 🔴 Root (Суперадминистратор)
- Полный доступ ко всем функциям системы
- Управление пользователями и их ролями
- Одобрение/отклонение запросов на аккаунты
- Окончательное удаление пользователей
- Доступ к журналу действий
- Доступ ко всем разделам

#### 🟠 Admin (Администратор)
- Управление пользователями (кроме окончательного удаления)
- Деактивация пользователей
- Доступ к журналу действий
- Доступ ко всем разделам
- Генератор отчетов

#### 🟡 LD (Руководитель направления)
- Доступ к разделам старшего состава
- Генератор отчетов
- Просмотр обучающих материалов
- Работа с документацией

#### 🟢 User (Обычный пользователь)
- Доступ к разделам младшего состава
- Просмотр обучающих материалов
- Копирование шаблонов и фраз

---

## 🛡️ Управление пользователями

### Создание нового пользователя (через root)

1. Войдите как root
2. Перейдите в раздел "Управление пользователями"
3. Нажмите "Добавить пользователя"
4. Заполните форму:
   - Игровой ник
   - Имя пользователя (логин)
   - Пароль
   - Роль (user/ld/admin/root)
5. Сохраните

### Изменение роли пользователя

1. Найдите пользователя в списке
2. Нажмите на кнопку редактирования
3. Выберите новую роль
4. Сохраните изменения

### Деактивация пользователя

1. Найдите пользователя в списке
2. Нажмите "Деактивировать"
3. Подтвердите действие
4. Пользователь получит статус `inactive`

### Окончательное удаление (только root)

1. Деактивируйте пользователя
2. В списке неактивных пользователей нажмите "Удалить окончательно"
3. Подтвердите действие
4. Все данные пользователя будут удалены из БД

---

## 📁 Структура проекта

```
metodichka-mz/
├── app/                                    # Next.js App Router
│   ├── account-request/                    # Страница запроса аккаунта
│   │   └── page.tsx
│   ├── api/                                # API Routes
│   │   ├── account-request/                # API создания запросов
│   │   ├── action-logs/                    # API журнала действий
│   │   ├── action-logs-internal/           # Внутренний API логов
│   │   └── users/                          # API управления пользователями
│   ├── components/                         # React компоненты
│   │   └── Manual/                         # Компоненты методички
│   │       ├── sections/                   # Разделы контента
│   │       │   ├── admin/                  # Админ-разделы
│   │       │   │   ├── ActionLogSection.tsx
│   │       │   │   └── UserManagementSection.tsx
│   │       │   ├── default/                # Разделы МС (21 файл)
│   │       │   │   ├── CommandsSection.tsx
│   │       │   │   ├── InterviewSection.tsx
│   │       │   │   ├── MedicalCardSection.tsx
│   │       │   │   ├── MedicalCommissionSection.tsx
│   │       │   │   ├── MedicationsSection.tsx
│   │       │   │   ├── MSUnifiedContentSection.tsx
│   │       │   │   ├── OverviewSection.tsx
│   │       │   │   ├── VehiclesSection.tsx
│   │       │   │   └── ...
│   │       │   ├── ss/                     # Разделы СС (11 файлов)
│   │       │   │   ├── AnnouncementsSection.tsx
│   │       │   │   ├── ExamSection.tsx
│   │       │   │   ├── ForumResponsesSection.tsx
│   │       │   │   ├── GossWaveSection.tsx
│   │       │   │   ├── ReportGeneratorSection.tsx
│   │       │   │   ├── SSUnifiedContentSection.tsx
│   │       │   │   └── ...
│   │       │   └── old/                    # Устаревшие разделы
│   │       ├── DropdownMenu.tsx            # Выпадающее меню
│   │       ├── ExamplePhrase.tsx           # Компонент копирования текста
│   │       ├── Header.tsx                  # Шапка приложения
│   │       ├── ProtectedSection.tsx        # Защищенные разделы
│   │       ├── ScheduleGrid.tsx            # Сетка расписания
│   │       ├── SectionContent.tsx          # Контейнер секций
│   │       └── Sidebar.tsx                 # Боковая панель навигации
│   ├── login/                              # Страница входа
│   │   └── page.tsx
│   ├── layout.tsx                          # Корневой layout
│   └── page.tsx                            # Главная страница
├── data/                                   # Данные приложения
│   └── manualData.ts                       # Конфигурация навигации
├── lib/                                    # Библиотеки и утилиты
│   ├── auth/                               # Система аутентификации
│   │   ├── auth-context.tsx                # React Context для auth
│   │   ├── auth-service.ts                 # Сервис аутентификации
│   │   ├── constants.ts                    # Константы auth
│   │   └── types.ts                        # TypeScript типы
│   ├── supabase.ts                         # Клиент Supabase
│   └── utils.ts                            # Утилиты
├── migrations/                             # SQL миграции
│   ├── 001_change_active_to_status.sql
│   ├── 002_drop_active_column.sql
│   ├── 003_add_ip_address.sql
│   ├── APPLY_ALL_MIGRATIONS.sql
│   └── README.txt
├── public/                                 # Статические файлы
│   ├── favicon.png
│   ├── favicon_mo.ico
│   └── *.svg                               # Иконки
├── scripts/                                # Утилитарные скрипты
│   ├── hash-password.js
│   └── hash-password.ts
├── styles/                                 # Стили и темы
│   ├── THEME.md                            # Документация темы
│   └── theme.ts                            # Конфигурация темы
├── types/                                  # TypeScript типы
│   └── manualTypes.ts
├── .gitignore                              # Git ignore файл
├── components.json                         # Конфигурация компонентов
├── middleware.ts                           # Next.js middleware
├── next.config.mjs                         # Конфигурация Next.js
├── package.json                            # Зависимости проекта
├── postcss.config.mjs                      # PostCSS конфигурация
├── tailwind.config.ts                      # Tailwind конфигурация
├── tsconfig.json                           # TypeScript конфигурация
└── README.md                               # Этот файл
```

---

## 🏗️ Архитектура приложения

### Паттерны и подходы

#### 1. **App Router (Next.js 14)**
Приложение использует новый App Router с серверными и клиентскими компонентами:

```tsx
// Серверный компонент (по умолчанию)
export default function Page() {
  return <div>Server Component</div>
}

// Клиентский компонент
"use client"
export default function ClientComponent() {
  const [state, setState] = useState()
  return <div>Client Component</div>
}
```

#### 2. **Модульная архитектура**
Каждый раздел — это отдельный модуль с собственной логикой:

```
sections/
  ├── default/      # Разделы для младшего состава
  ├── ss/           # Разделы для старшего состава
  └── admin/        # Административные разделы
```

#### 3. **Context API для аутентификации**
Глобальное состояние пользователя через React Context:

```tsx
// lib/auth/auth-context.tsx
<AuthProvider>
  <App />
</AuthProvider>
```

#### 4. **API Routes**
RESTful API через Next.js Route Handlers:

```
api/
  ├── account-request/route.ts    # POST - создание запроса
  ├── users/route.ts              # PATCH - обновление пользователя
  └── action-logs/route.ts        # GET - получение логов
```

### Поток данных

```
User Action → Component → API Route → Supabase → Response → UI Update
```

### Система навигации

Навигация настраивается через `data/manualData.ts`:

```typescript
export const sidebarItems: SidebarItem[] = [
  {
    id: "ms-group",
    title: "Младший состав",
    items: [
      { id: "overview", title: "Содержание", icon: "📋" },
      { id: "commands", title: "Команды", icon: "💬" },
      // ...
    ]
  },
  // ...
]
```

---

## ➕ Добавление новых разделов

### Шаг 1: Создайте файл компонента

Выберите правильную директорию в зависимости от типа раздела:

```bash
# Для разделов младшего состава
touch app/components/Manual/sections/default/NewSection.tsx

# Для разделов старшего состава
touch app/components/Manual/sections/ss/NewSection.tsx

# Для административных разделов
touch app/components/Manual/sections/admin/NewSection.tsx
```

### Шаг 2: Создайте компонент

```tsx
// app/components/Manual/sections/default/NewSection.tsx
"use client"

import React from 'react'
import ExamplePhrase from '../../ExamplePhrase'

const NewSection = () => {
  return (
    <div className="space-y-6">
      {/* Заголовок раздела */}
      <div className="subsection">
        <h3 className="text-2xl font-bold mb-4">Заголовок раздела</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Описание раздела и его назначение
        </p>
      </div>

      {/* Подраздел с примером */}
      <div className="subsection">
        <h4 className="text-xl font-semibold mb-3">Подраздел 1</h4>
        
        {/* Пример фразы для копирования */}
        <ExamplePhrase text="Текст для копирования" />
        
        {/* Примечание */}
        <div className="note mt-4">
          <strong>📌 Примечание:</strong> Важная информация
        </div>
      </div>

      {/* Подраздел с предупреждением */}
      <div className="subsection">
        <h4 className="text-xl font-semibold mb-3">Подраздел 2</h4>
        
        <div className="warning">
          <strong>⚠️ Внимание:</strong> Критическое предупреждение
        </div>
      </div>
    </div>
  )
}

export default NewSection
```

### Шаг 3: Добавьте в навигацию

Откройте `data/manualData.ts` и добавьте новый раздел:

```typescript
export const sidebarItems: SidebarItem[] = [
  {
    id: "ms-group",
    title: "Младший состав",
    items: [
      { id: "overview", title: "Содержание", icon: "📋" },
      // ... существующие разделы
      { id: "new-section", title: "Новый раздел", icon: "🆕" }, // ← Добавьте здесь
    ]
  },
  // ...
]
```

### Шаг 4: Зарегистрируйте компонент

Откройте `app/page.tsx` и добавьте импорт:

```typescript
// Ленивая загрузка компонентов
const OverviewSection = lazy(() => import('./components/Manual/sections/default/OverviewSection'))
const NewSection = lazy(() => import('./components/Manual/sections/default/NewSection')) // ← Добавьте

// Маппинг ID секций на компоненты
const sectionComponents: Record<string, React.ComponentType> = {
  'overview': OverviewSection,
  'new-section': NewSection, // ← Добавьте
  // ... остальные компоненты
}
```

### Шаг 5: Проверьте результат

1. Перезапустите dev-сервер (если необходимо)
2. Откройте приложение в браузере
3. Новый раздел должен появиться в боковой панели
4. Кликните на него для просмотра

---

## 🧩 Компоненты и элементы

### ExamplePhrase - Копируемая фраза

Компонент для отображения текста с возможностью копирования в буфер обмена.

```tsx
import ExamplePhrase from '../ExamplePhrase'

<ExamplePhrase text="Текст для копирования" />
```

**Возможности:**
- Автоматическое копирование при клике
- Визуальная обратная связь (уведомление)
- Адаптивный дизайн

### DropdownMenu - Выпадающее меню

Компонент для создания выпадающих списков с поиском.

```tsx
import DropdownMenu from '../DropdownMenu'

<DropdownMenu
  title="Название меню"
  items={[
    "Пункт 1",
    "Пункт 2",
    "Пункт 3"
  ]}
  icon="📚"
  searchable={true}
/>
```

**Параметры:**
- `title` (string) - Заголовок меню
- `items` (string[]) - Массив элементов для отображения
- `icon` (string, optional) - Иконка перед заголовком (по умолчанию 📚)
- `searchable` (boolean, optional) - Включить поиск (по умолчанию false)

**Пример с поиском:**
```tsx
<DropdownMenu
  title="Список лекций"
  items={lectureTitles}
  icon="📖"
  searchable={true}
/>
```

### ProtectedSection - Защищенный раздел

Компонент для создания разделов с парольным доступом.

```tsx
import ProtectedSection from '../ProtectedSection'

<ProtectedSection 
  password="secret123" 
  hint="Подсказка для пароля"
>
  <div className="subsection">
    <h3>Секретный контент</h3>
    <p>Этот контент виден только после ввода пароля</p>
  </div>
</ProtectedSection>
```

**Параметры:**
- `password` (string) - Пароль для доступа
- `hint` (string, optional) - Подсказка для пользователя
- `icon` (ReactNode, optional) - Кастомная иконка
- `children` (ReactNode) - Защищенный контент

**Особенности:**
- Доступ сохраняется в localStorage
- 3 попытки ввода пароля
- Блокировка на 30 секунд после исчерпания попыток
- Визуальная индикация состояния

**Полный пример:**
```tsx
import React from 'react'
import ProtectedSection from '../ProtectedSection'

const SecretDocuments = () => {
  return (
    <ProtectedSection 
      password="mz2025" 
      hint="Пароль: аббревиатура МЗ + текущий год"
      icon="🛡️"
    >
      <div className="subsection">
        <h3>Конфиденциальные документы</h3>
        
        <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg">
          <h4 className="font-bold mb-2">Секретная информация:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Документ 1: Стратегические планы</li>
            <li>Документ 2: Список ответственных</li>
            <li>Документ 3: Коды доступа</li>
          </ul>
        </div>
      </div>
    </ProtectedSection>
  )
}

export default SecretDocuments
```

### ScheduleGrid - Сетка расписания

Компонент для отображения расписания в виде сетки.

```tsx
import ScheduleGrid from '../ScheduleGrid'

<ScheduleGrid>
  <div className="schedule-item">
    <strong>09:00 - 10:00</strong>
    <p>Лекция по медицине</p>
  </div>
  <div className="schedule-item">
    <strong>10:00 - 11:00</strong>
    <p>Практическое занятие</p>
  </div>
</ScheduleGrid>
```

### Специальные блоки

#### Блок примечания
```tsx
<div className="note">
  <strong>📌 Примечание:</strong> Важная информация для пользователя
</div>
```

#### Блок предупреждения
```tsx
<div className="warning">
  <strong>⚠️ Внимание:</strong> Критическое предупреждение
</div>
```

#### Подсветка текста
```tsx
<span className="highlight">Важный текст</span>
```

#### Ссылка на документ
```tsx
<a href="/path/to/document" className="document-link" target="_blank">
  Открыть документ
</a>
```

---

## 🔌 Работа с API

### Структура API Routes

Все API endpoints находятся в директории `app/api/`:

```
app/api/
├── account-request/
│   └── route.ts          # POST - создание запроса на аккаунт
├── action-logs/
│   └── route.ts          # GET - получение журнала действий
├── action-logs-internal/
│   └── route.ts          # POST - внутреннее логирование
└── users/
    ├── route.ts          # PATCH - обновление пользователя
    └── permanent-delete/
        └── route.ts      # DELETE - окончательное удаление
```

### Примеры использования API

#### Создание запроса на аккаунт

```typescript
// POST /api/account-request
const response = await fetch('/api/account-request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    game_nick: 'Иванов И.И.',
    username: 'ivanov',
    password: 'securePassword123',
    reason: 'Новый сотрудник МЗ'
  })
})

const data = await response.json()
```

#### Одобрение запроса (только root)

```typescript
// PATCH /api/users
const response = await fetch('/api/users', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'approve',
    userId: 'user-id-here'
  })
})
```

#### Получение журнала действий

```typescript
// GET /api/action-logs
const response = await fetch('/api/action-logs')
const logs = await response.json()
```

### Создание нового API endpoint

#### Шаг 1: Создайте файл route.ts

```bash
mkdir app/api/my-endpoint
touch app/api/my-endpoint/route.ts
```

#### Шаг 2: Реализуйте handler

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Ваша логика
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error message' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Ваша логика
    const { data, error } = await supabase
      .from('table_name')
      .insert(body)
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error message' },
      { status: 500 }
    )
  }
}
```

---

## 🗄️ Работа с базой данных

### Supabase клиент

Клиент Supabase настроен в `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Основные операции

#### SELECT - Получение данных

```typescript
// Получить всех пользователей
const { data, error } = await supabase
  .from('users')
  .select('*')

// Получить с фильтром
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('status', 'active')

// Получить с сортировкой
const { data, error } = await supabase
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })
```

#### INSERT - Добавление данных

```typescript
const { data, error } = await supabase
  .from('users')
  .insert({
    username: 'newuser',
    game_nick: 'Новый пользователь',
    password_hash: hashedPassword,
    role: 'user',
    status: 'active'
  })
```

#### UPDATE - Обновление данных

```typescript
const { data, error } = await supabase
  .from('users')
  .update({ status: 'active' })
  .eq('id', userId)
```

#### DELETE - Удаление данных

```typescript
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId)
```

### Схема базы данных

#### Таблица users

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID | Первичный ключ |
| `username` | VARCHAR | Имя пользователя (логин) |
| `game_nick` | VARCHAR | Игровой ник |
| `password_hash` | VARCHAR | Хеш пароля |
| `role` | VARCHAR | Роль (user/ld/admin/root) |
| `status` | VARCHAR | Статус (active/inactive/request) |
| `created_at` | TIMESTAMP | Дата создания |
| `reason` | TEXT | Причина запроса (для status=request) |

#### Таблица action_logs

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID | Первичный ключ |
| `user_id` | UUID | ID пользователя |
| `game_nick` | VARCHAR | Игровой ник |
| `action` | TEXT | Описание действия |
| `action_type` | VARCHAR | Тип действия |
| `target_type` | VARCHAR | Тип цели |
| `ip_address` | VARCHAR | IP адрес |
| `created_at` | TIMESTAMP | Дата и время |

---

## 🎨 Система стилей

### Tailwind CSS

Проект использует Tailwind CSS для стилизации. Конфигурация находится в `tailwind.config.ts`.

### Основные CSS классы

| Класс | Описание | Применение |
|-------|----------|------------|
| `.subsection` | Контейнер подраздела | Обертка для секций контента |
| `.section-title` | Заголовок раздела | Главные заголовки |
| `.example-phrase` | Блок с примером фразы | Копируемый текст |
| `.copy-btn` | Кнопка копирования | Кнопки для копирования |
| `.schedule-grid` | Сетка расписания | Контейнер расписания |
| `.schedule-item` | Элемент расписания | Отдельный пункт |
| `.note` | Блок примечания | Информационные блоки |
| `.warning` | Блок предупреждения | Предупреждения |
| `.highlight` | Подсветка текста | Выделение важного |
| `.document-link` | Ссылка на документ | Ссылки на файлы |
| `.nav-link` | Элемент навигации | Пункты меню |

### Примеры использования

#### Текстовые элементы
```tsx
<h1 className="section-title">Заголовок раздела</h1>
<h3 className="text-xl font-semibold">Подзаголовок</h3>
<p className="text-gray-700 dark:text-gray-300">Обычный текст</p>
```

#### Специальные блоки
```tsx
<div className="note">
  <strong>📌 Примечание:</strong> Важная информация
</div>

<div className="warning">
  <strong>⚠️ Внимание:</strong> Критическое предупреждение
</div>

<span className="highlight">Подсвеченный текст</span>
```

#### Интерактивные элементы
```tsx
<button className="copy-btn">
  📋 Копировать
</button>

<a href="#" className="document-link">
  Открыть документ
</a>
```

### Кастомные стили

Для добавления новых стилей используйте файл глобальных стилей или Tailwind классы:

```css
/* app/globals.css */
.custom-style {
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
  @apply text-white p-4 rounded-lg shadow-lg;
}
```

---

## 🎨 Tailwind CSS конфигурация

### Цветовая палитра

Проект использует кастомную цветовую схему, определенную в `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        // ... остальные оттенки
      },
      // Дополнительные цвета
    }
  }
}
```

### Темная тема

Поддержка темной темы через `next-themes`:

```tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

Использование в компонентах:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">Текст</p>
</div>
```

---

## 🧰 Компоненты UI

### Radix UI компоненты

Проект использует библиотеку Radix UI для доступных компонентов:

- **Dialog** - модальные окна
- **Dropdown Menu** - выпадающие меню
- **Toast** - уведомления
- **Tabs** - вкладки
- **Accordion** - аккордеоны
- **Alert Dialog** - диалоги подтверждения
- И многие другие...

### Пример использования Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Открыть</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Заголовок</DialogTitle>
      <DialogDescription>
        Описание диалога
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

## 🛠 Полезные команды

### Разработка

```bash
# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Запуск production-сервера
npm start

# Линтинг кода
npm run lint

# Проверка типов TypeScript
npx tsc --noEmit

# Очистка кэша Next.js
rm -rf .next
```

### Работа с зависимостями

```bash
# Установка всех зависимостей
npm install

# Добавление новой зависимости
npm install package-name

# Добавление dev-зависимости
npm install -D package-name

# Обновление зависимостей
npm update

# Проверка устаревших пакетов
npm outdated

# Аудит безопасности
npm audit

# Исправление уязвимостей
npm audit fix
```

### Утилиты

```bash
# Хеширование пароля
node scripts/hash-password.js "your-password"

# Или TypeScript версия
npx ts-node scripts/hash-password.ts "your-password"
```

---

## 🔀 Работа с Git

### Первоначальная настройка

```bash
# Настройка имени и email
git config --global user.name "Ваше Имя"
git config --global user.email "ваш.email@example.com"

# Проверка конфигурации
git config --list
```

### Базовый рабочий процесс

#### ⚠️ ВАЖНО: Перед началом работы

**Всегда синхронизируйтесь с удаленным репозиторием:**

```bash
# Настройка отслеживания ветки (выполнить один раз)
git branch --set-upstream-to=origin/master

# Получение последних изменений
git pull
```

#### Шаг 1: Создание ветки (опционально, для опытных пользователей)

Если вы знакомы с ветвлением в Git:

```bash
# Создание и переключение на новую ветку
git checkout -b feature/new-section

# Или отдельными командами
git branch feature/new-section
git checkout feature/new-section
```

**Если не знаете, что такое ветки - пропустите этот шаг и работайте в master.**

#### Шаг 2: Внесение изменений

Внесите необходимые изменения в файлы проекта.

#### Шаг 3: Просмотр изменений

```bash
# Посмотреть статус файлов
git status

# Посмотреть конкретные изменения
git diff
```

#### Шаг 4: Добавление файлов

```bash
# Добавить все измененные файлы
git add .

# Или добавить конкретные файлы
git add path/to/file.tsx
```

#### Шаг 5: Создание коммита

```bash
# Создать коммит с сообщением
git commit -m "Добавлен новый раздел: Транспорт МЗ"
```

**Правила хороших commit-сообщений:**
- Используйте глаголы в прошедшем времени
- Будьте конкретны
- Примеры:
  - ✅ "Добавлен раздел с медикаментами"
  - ✅ "Исправлена ошибка в форме входа"
  - ✅ "Обновлена документация API"
  - ❌ "Изменения"
  - ❌ "Фикс"

#### Шаг 6: Отправка изменений

```bash
# Если работаете в master
git push origin master

# Если создали отдельную ветку
git push origin feature/new-section
```

#### Шаг 7: Pull Request (для веток)

Если вы работали в отдельной ветке:

1. Перейдите на GitHub: https://github.com/Luckyillia/metodichka-mz
2. Нажмите "Compare & pull request"
3. Опишите изменения
4. Нажмите "Create pull request"
5. Дождитесь ревью и одобрения

### Полезные команды Git

```bash
# Посмотреть историю коммитов
git log

# Посмотреть историю кратко
git log --oneline

# Посмотреть последние 5 коммитов
git log -n 5

# Отменить последний коммит (но сохранить изменения)
git reset --soft HEAD~1

# Отменить изменения в файле
git checkout -- path/to/file.tsx

# Посмотреть удаленные репозитории
git remote -v

# Обновить информацию о удаленном репозитории
git fetch

# Переключиться на другую ветку
git checkout branch-name

# Удалить локальную ветку
git branch -d branch-name
```

### Решение конфликтов

Если при `git pull` возникли конфликты:

```bash
# 1. Посмотрите конфликтующие файлы
git status

# 2. Откройте файлы и найдите маркеры конфликтов:
# <<<<<<< HEAD
# Ваши изменения
# =======
# Изменения из удаленного репозитория
# >>>>>>> branch-name

# 3. Отредактируйте файлы, оставив нужные изменения

# 4. Добавьте разрешенные файлы
git add .

# 5. Завершите merge
git commit -m "Разрешены конфликты слияния"

# 6. Отправьте изменения
git push
```

### Лучшие практики

1. **Делайте коммиты часто** - маленькие, логические изменения
2. **Всегда делайте pull перед push** - избегайте конфликтов
3. **Пишите понятные сообщения коммитов** - для будущих разработчиков
4. **Не коммитьте чувствительные данные** - пароли, API ключи
5. **Используйте .gitignore** - для исключения ненужных файлов

---

## 🚀 Деплой на Vercel

### Метод 1: Через GitHub (Рекомендуется)

#### Шаг 1: Подготовка репозитория

Убедитесь, что ваш код находится на GitHub:

```bash
git add .
git commit -m "Подготовка к деплою"
git push origin master
```

#### Шаг 2: Подключение к Vercel

1. Перейдите на [vercel.com](https://vercel.com/)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите репозиторий `metodichka-mz`
5. Нажмите "Import"

#### Шаг 3: Настройка проекта

1. **Framework Preset:** Next.js (определится автоматически)
2. **Root Directory:** `./` (оставьте по умолчанию)
3. **Build Command:** `npm run build` (по умолчанию)
4. **Output Directory:** `.next` (по умолчанию)

#### Шаг 4: Переменные окружения

Добавьте переменные окружения:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Шаг 5: Деплой

Нажмите "Deploy" и дождитесь завершения.

### Метод 2: Через Vercel CLI

#### Установка Vercel CLI

```bash
# Глобальная установка
npm install -g vercel

# Или использование через npx (без установки)
npx vercel
```

#### Первый деплой

```bash
# Войдите в аккаунт
vercel login

# Инициализация проекта
vercel

# Следуйте инструкциям:
# - Set up and deploy? Yes
# - Which scope? Выберите свой аккаунт
# - Link to existing project? No
# - Project name? metodichka-mz
# - Directory? ./
# - Override settings? No
```

#### Обновление деплоя

```bash
# Preview деплой (для тестирования)
vercel

# Production деплой
vercel --prod
```

### Автоматический деплой

После подключения через GitHub, каждый push в master автоматически запускает деплой:

```bash
git push origin master
# → Автоматически деплоится на Vercel
```

### Управление доменом

#### Добавление кастомного домена

1. Перейдите в настройки проекта на Vercel
2. Выберите вкладку "Domains"
3. Добавьте свой домен
4. Настройте DNS записи согласно инструкциям

### Мониторинг и аналитика

Vercel автоматически предоставляет:

- **Analytics** - статистика посещений
- **Speed Insights** - метрики производительности
- **Logs** - логи деплоя и runtime
- **Deployments** - история всех деплоев

### Откат к предыдущей версии

1. Перейдите в раздел "Deployments"
2. Найдите нужную версию
3. Нажмите "..." → "Promote to Production"

---

## 🗃️ Миграции базы данных

### Обзор миграций

Проект использует SQL миграции для изменения схемы базы данных. Все миграции находятся в папке `migrations/`.

### Доступные миграции

| Файл | Описание |
|------|----------|
| `001_change_active_to_status.sql` | Изменение поля active на status с поддержкой статусов |
| `002_drop_active_column.sql` | Удаление устаревшего поля active |
| `003_add_ip_address.sql` | Добавление поля ip_address в action_logs |
| `APPLY_ALL_MIGRATIONS.sql` | Применение всех миграций одной командой |

### Применение миграций

#### Метод 1: Через Supabase Dashboard

1. Откройте [app.supabase.com](https://app.supabase.com/)
2. Выберите свой проект
3. Перейдите в **SQL Editor**
4. Откройте файл миграции локально
5. Скопируйте содержимое
6. Вставьте в SQL Editor
7. Нажмите "Run"

#### Метод 2: Применить все сразу

```sql
-- Откройте migrations/APPLY_ALL_MIGRATIONS.sql
-- Скопируйте весь код
-- Выполните в SQL Editor
```

### Создание новой миграции

#### Шаг 1: Создайте файл

```bash
touch migrations/004_your_migration_name.sql
```

#### Шаг 2: Напишите SQL

```sql
-- migrations/004_add_new_field.sql

-- Добавление нового поля
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20);

-- Создание индекса
CREATE INDEX idx_users_phone ON users(phone);

-- Комментарий
COMMENT ON COLUMN users.phone IS 'Номер телефона пользователя';
```

#### Шаг 3: Примените миграцию

Выполните SQL через Supabase Dashboard.

#### Шаг 4: Обновите APPLY_ALL_MIGRATIONS.sql

Добавьте новую миграцию в общий файл.

### Откат миграции

Для отката создайте обратную миграцию:

```sql
-- migrations/004_rollback_add_new_field.sql

-- Удаление поля
ALTER TABLE users 
DROP COLUMN IF EXISTS phone;

-- Удаление индекса
DROP INDEX IF EXISTS idx_users_phone;
```

### Лучшие практики миграций

1. **Всегда делайте бэкап** перед применением миграций
2. **Тестируйте на dev-окружении** перед production
3. **Используйте транзакции** для атомарности
4. **Документируйте изменения** в комментариях
5. **Нумеруйте миграции** последовательно
6. **Не изменяйте примененные миграции** - создавайте новые

---

## 💡 Советы по разработке

### Общие рекомендации

1. **Сохраняйте единый стиль оформления**
   - Используйте Prettier для форматирования
   - Следуйте существующим паттернам кода
   - Придерживайтесь соглашений по именованию

2. **Используйте существующие компоненты**
   - Проверьте наличие готовых компонентов перед созданием новых
   - Переиспользуйте `ExamplePhrase`, `DropdownMenu`, `ProtectedSection`
   - Следуйте принципу DRY (Don't Repeat Yourself)

3. **Тестируйте изменения локально**
   - Всегда запускайте `npm run dev` перед коммитом
   - Проверяйте на разных размерах экрана
   - Тестируйте в разных браузерах

4. **Комментируйте сложные участки кода**
   ```tsx
   // Плохо
   const x = data.filter(i => i.s === 'a').map(i => i.id)
   
   // Хорошо
   // Получаем ID всех активных пользователей
   const activeUserIds = users
     .filter(user => user.status === 'active')
     .map(user => user.id)
   ```

5. **Используйте TypeScript правильно**
   - Избегайте `any`
   - Создавайте интерфейсы для сложных объектов
   - Используйте типы из `types/manualTypes.ts`

6. **Оптимизируйте производительность**
   - Используйте `lazy()` для ленивой загрузки компонентов
   - Мемоизируйте тяжелые вычисления с `useMemo`
   - Оптимизируйте изображения

7. **Безопасность**
   - Никогда не коммитьте `.env.local`
   - Не храните пароли в коде
   - Валидируйте пользовательский ввод

---

## 🔧 Решение проблем

### Проблема: Ошибка при установке зависимостей

**Симптомы:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Решение:**
```bash
# Очистка кэша
npm cache clean --force

# Удаление node_modules
rm -rf node_modules package-lock.json

# Установка с legacy peer deps
npm install --legacy-peer-deps
```

### Проблема: Приложение не запускается

**Симптомы:**
```
Error: Cannot find module 'next'
```

**Решение:**
```bash
# Переустановка зависимостей
rm -rf node_modules
npm install

# Проверка версии Node.js
node --version  # Должно быть >= 18.0.0
```

### Проблема: Ошибка подключения к Supabase

**Симптомы:**
```
Error: Invalid Supabase URL or Key
```

**Решение:**
1. Проверьте файл `.env.local`
2. Убедитесь, что переменные правильно названы:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Перезапустите dev-сервер после изменения `.env.local`

### Проблема: Стили не применяются

**Симптомы:**
Tailwind классы не работают

**Решение:**
```bash
# Убедитесь, что PostCSS настроен
cat postcss.config.mjs

# Перезапустите dev-сервер
npm run dev
```

### Проблема: TypeScript ошибки

**Симптомы:**
```
Type 'string' is not assignable to type 'number'
```

**Решение:**
1. Проверьте типы в `types/manualTypes.ts`
2. Используйте правильные типы для props
3. Запустите проверку типов:
   ```bash
   npx tsc --noEmit
   ```

### Проблема: Конфликты при git pull

**Симптомы:**
```
CONFLICT (content): Merge conflict in file.tsx
```

**Решение:**
```bash
# 1. Посмотрите конфликтующие файлы
git status

# 2. Откройте файл и найдите маркеры:
# <<<<<<< HEAD
# Ваш код
# =======
# Код из репозитория
# >>>>>>> origin/master

# 3. Отредактируйте, оставив нужный код

# 4. Добавьте файл
git add file.tsx

# 5. Завершите merge
git commit -m "Разрешены конфликты"
```

### Проблема: Деплой на Vercel не работает

**Симптомы:**
Build fails на Vercel

**Решение:**
1. Проверьте логи деплоя на Vercel
2. Убедитесь, что все переменные окружения добавлены
3. Проверьте, что `npm run build` работает локально
4. Проверьте версию Node.js в настройках Vercel

---

## ❓ FAQ

### Как добавить нового пользователя?

**Ответ:** Есть два способа:

1. **Через запрос (для обычных пользователей):**
   - Откройте `/account-request`
   - Заполните форму
   - Дождитесь одобрения от root

2. **Напрямую (только для root):**
   - Войдите как root
   - Перейдите в "Управление пользователями"
   - Нажмите "Добавить пользователя"

### Как изменить пароль пользователя?

**Ответ:**
1. Сгенерируйте хеш нового пароля:
   ```bash
   node scripts/hash-password.js "новый-пароль"
   ```
2. Обновите `password_hash` в базе данных через Supabase Dashboard

### Как добавить новый раздел в методичку?

**Ответ:** См. раздел [Добавление новых разделов](#-добавление-новых-разделов)

### Можно ли использовать проект без Supabase?

**Ответ:** Нет, проект тесно интегрирован с Supabase для:
- Аутентификации
- Хранения пользователей
- Журнала действий

Но вы можете адаптировать код для другой БД (PostgreSQL, MySQL).

### Как настроить кастомный домен?

**Ответ:**
1. Деплойте на Vercel
2. В настройках проекта → Domains
3. Добавьте свой домен
4. Настройте DNS записи у регистратора

### Как добавить новую роль пользователя?

**Ответ:**
1. Обновите тип в `lib/auth/types.ts`:
   ```typescript
   export type UserRole = 'user' | 'ld' | 'admin' | 'root' | 'newrole'
   ```
2. Обновите проверки в `lib/auth/auth-service.ts`
3. Добавьте права доступа в `canAccessSection()`

### Как экспортировать данные из Supabase?

**Ответ:**
1. Откройте Supabase Dashboard
2. Перейдите в Table Editor
3. Выберите таблицу
4. Нажмите "..." → "Export as CSV"

### Поддерживается ли мобильная версия?

**Ответ:** Да, приложение полностью адаптивно благодаря Tailwind CSS и работает на всех устройствах.

### Как обновить зависимости проекта?

**Ответ:**
```bash
# Проверить устаревшие пакеты
npm outdated

# Обновить все minor/patch версии
npm update

# Обновить major версии (осторожно!)
npx npm-check-updates -u
npm install
```

### Где хранятся логи действий?

**Ответ:** В таблице `action_logs` в Supabase. Доступ через раздел "Журнал действий" (только для root/admin).

---

## 📞 Контакты и поддержка

### Репозиторий проекта
- **GitHub:** [https://github.com/Luckyillia/metodichka-mz](https://github.com/Luckyillia/metodichka-mz)

### Документация
- **Next.js:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Supabase:** [https://supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Radix UI:** [https://www.radix-ui.com/docs](https://www.radix-ui.com/docs)

### Полезные ресурсы
- **TypeScript Handbook:** [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **React Documentation:** [https://react.dev/](https://react.dev/)
- **Git Documentation:** [https://git-scm.com/doc](https://git-scm.com/doc)

### Сообщество
- **Next.js Discord:** [https://nextjs.org/discord](https://nextjs.org/discord)
- **Supabase Discord:** [https://discord.supabase.com/](https://discord.supabase.com/)

---

## 📄 Лицензия

Этот проект является внутренним инструментом Министерства Здравоохранения.

---

## 🙏 Благодарности

Спасибо всем разработчикам и контрибьюторам, которые работали над этим проектом!

---

**Версия документации:** 2.0  
**Последнее обновление:** 2025-10-21  
**Автор:** Методичка МЗ Team

---

<div align="center">
  <p>Сделано с ❤️ для Министерства Здравоохранения</p>
  <p>
    <a href="#-методичка-министерства-здравоохранения">⬆ Вернуться к началу</a>
  </p>
</div>