# Міграція для додавання колонки City

## Опис змін

Додано колонку `city` в таблицю `users` для розділення користувачів за містами:
- **CGB-N** - ЦГБ-Н
- **CGB-P** - ЦГБ-П  
- **OKB-M** - ОКБ-М

## Що було змінено

### 1. База даних
- Створено міграцію `004_add_city_column.sql`
- Додано колонку `city` з типом `text` та значенням за замовчуванням `CGB-N`
- Додано індекси для швидкого пошуку за містом
- Додано constraint для валідації міст

### 2. Типи TypeScript
- Додано тип `UserCity = "CGB-N" | "CGB-P" | "OKB-M"`
- Оновлено інтерфейс `User` з полем `city: UserCity`

### 3. API та Middleware
- Middleware передає `city` в заголовках запитів
- API `/api/users` оновлено для роботи з містами:
  - GET: Лідери бачать тільки користувачів свого міста
  - POST: Лідери можуть створювати користувачів тільки свого міста
  - PATCH/DELETE: Лідери можуть керувати тільки користувачами свого міста

### 4. UI компоненти
- **Header**: Відображає місто в ролі (наприклад: "Лідер ЦГБ-Н", "СС ОКБ-М")
- **UserManagementSection**: 
  - Додано селектор міста при створенні користувача (для root та admin)
  - Відображення міста в таблиці користувачів
  - Фільтрація користувачів за містом для лідерів

## Як застосувати міграцію

### Варіант 1: Через psql
```bash
psql -U your_username -d your_database -f migrations/004_add_city_column.sql
```

### Варіант 2: Через Supabase Dashboard
1. Відкрийте Supabase Dashboard
2. Перейдіть в SQL Editor
3. Скопіюйте вміст файлу `004_add_city_column.sql`
4. Виконайте SQL запит

### Варіант 3: Через код
```typescript
import { supabase } from '@/lib/supabase'
import fs from 'fs'

const migration = fs.readFileSync('migrations/004_add_city_column.sql', 'utf8')
await supabase.rpc('exec_sql', { sql: migration })
```

## Перевірка міграції

Після застосування міграції перевірте:

```sql
-- Перевірка структури таблиці
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'city';

-- Перевірка constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'check_valid_city';

-- Перевірка індексів
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users' AND indexname LIKE '%city%';

-- Перевірка даних
SELECT id, username, game_nick, role, city
FROM users
LIMIT 10;
```

## Важливі зміни в логіці

### Для лідерів (role = 'ld'):
- Бачать тільки користувачів свого міста
- Можуть створювати користувачів тільки свого міста
- Можуть одобрювати запити тільки зі свого міста
- Можуть редагувати/деактивувати тільки користувачів свого міста

### Для адміністраторів (role = 'admin'):
- Бачать всіх користувачів
- Можуть створювати користувачів будь-якого міста
- Можуть вибирати місто при створенні користувача

### Для root:
- Повний доступ до всіх міст
- Можуть вибирати місто при створенні користувача

## Оновлення існуючих користувачів

Всі існуючі користувачі автоматично отримають місто `CGB-N`. 
Якщо потрібно змінити місто для конкретних користувачів:

```sql
-- Оновити місто для конкретного користувача
UPDATE users 
SET city = 'CGB-P' 
WHERE username = 'example_user';

-- Оновити місто для групи користувачів
UPDATE users 
SET city = 'OKB-M' 
WHERE role = 'ld' AND username IN ('leader1', 'leader2');
```

## Rollback (якщо потрібно відкотити зміни)

```sql
-- Видалити constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS check_valid_city;

-- Видалити індекси
DROP INDEX IF EXISTS idx_users_city;
DROP INDEX IF EXISTS idx_users_role_city;

-- Видалити колонку
ALTER TABLE public.users DROP COLUMN IF EXISTS city;
```
