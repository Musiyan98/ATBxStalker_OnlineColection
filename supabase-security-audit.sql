-- ============================================
-- SUPABASE SECURITY AUDIT
-- ============================================
-- Цей скрипт перевіряє налаштування безпеки всіх таблиць
-- Запустіть його в Supabase Dashboard → SQL Editor
-- ============================================

-- 1. ПЕРЕВІРКА: Які таблиці мають RLS увімкнений
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Очікуваний результат: rls_enabled = true для всіх таблиць
-- Якщо false - таблиця ВІДКРИТА для всіх!


-- 2. ПЕРЕВІРКА: Які політики застосовані до кожної таблиці
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS operation,  -- SELECT, INSERT, UPDATE, DELETE
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Перевірте що кожна таблиця має політики для:
-- - SELECT (хто може читати)
-- - INSERT (хто може додавати)
-- - UPDATE (хто може оновлювати)
-- - DELETE (хто може видаляти)


-- 3. ПЕРЕВІРКА: Таблиці БЕЗ RLS політик (НЕБЕЗПЕЧНО!)
-- ============================================
SELECT 
    t.schemaname,
    t.tablename,
    t.rowsecurity AS rls_enabled,
    COUNT(p.policyname) AS policies_count
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public'
GROUP BY t.schemaname, t.tablename, t.rowsecurity
HAVING COUNT(p.policyname) = 0 OR t.rowsecurity = false
ORDER BY t.tablename;

-- Якщо тут є таблиці - вони ВІДКРИТІ для всіх!
-- Це КРИТИЧНА вразливість безпеки!


-- 4. ДЕТАЛЬНА ІНФОРМАЦІЯ: Таблиця feedback (наш проект)
-- ============================================
SELECT 
    policyname,
    cmd AS operation,
    roles,
    CASE 
        WHEN qual IS NULL THEN 'No restriction'
        ELSE qual
    END AS using_check,
    CASE 
        WHEN with_check IS NULL THEN 'No restriction'
        ELSE with_check
    END AS with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'feedback'
ORDER BY cmd;

-- Очікувані політики для feedback:
-- INSERT: WITH CHECK (true) - дозволити всім
-- SELECT: USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
-- UPDATE: USING (auth.role() = 'service_role')
-- DELETE: USING (auth.role() = 'service_role')


-- ============================================
-- РЕКОМЕНДАЦІЇ ДЛЯ ІНШИХ ТАБЛИЦЬ
-- ============================================

-- Якщо у вас є інші таблиці, застосуйте RLS:

-- Приклад 1: Таблиця доступна тільки аутентифікованим користувачам
/*
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users" ON your_table_name
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON your_table_name
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
*/

-- Приклад 2: Таблиця доступна тільки власнику запису
/*
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Додайте колонку user_id якщо її немає
-- ALTER TABLE your_table_name ADD COLUMN user_id UUID REFERENCES auth.users(id);

CREATE POLICY "Users can read own records" ON your_table_name
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON your_table_name
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON your_table_name
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON your_table_name
  FOR DELETE
  USING (auth.uid() = user_id);
*/

-- Приклад 3: Публічна таблиця (тільки читання для всіх)
/*
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON your_table_name
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for service_role only" ON your_table_name
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
*/


-- ============================================
-- ШВИДКЕ ВИПРАВЛЕННЯ: Увімкнути RLS для всіх таблиць
-- ============================================
-- УВАГА: Це заблокує доступ до таблиць без політик!
-- Використовуйте тільки якщо розумієте наслідки!

/*
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND rowsecurity = false
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);
        RAISE NOTICE 'Enabled RLS for table: %', r.tablename;
    END LOOP;
END $$;
*/


-- ============================================
-- ПЕРЕВІРКА РОЛЕЙ
-- ============================================
-- Перевірте які ролі використовуються в політиках
SELECT DISTINCT roles
FROM pg_policies
WHERE schemaname = 'public';

-- Основні ролі в Supabase:
-- - anon: Анонімні користувачі (публічний ключ)
-- - authenticated: Аутентифіковані користувачі
-- - service_role: Повний доступ (приватний ключ)


-- ============================================
-- ТЕСТУВАННЯ ДОСТУПУ
-- ============================================
-- Перевірте доступ з різними ролями:

-- Як анонімний користувач (VITE_SUPABASE_ANON_KEY):
SET ROLE anon;
SELECT * FROM feedback LIMIT 1;  -- Має бути помилка (немає SELECT політики для anon)
INSERT INTO feedback (message, category) VALUES ('test', 'feedback');  -- Має працювати
RESET ROLE;

-- Як аутентифікований користувач:
-- (потрібно створити тестового користувача через Supabase Auth)


-- ============================================
-- ВИСНОВОК
-- ============================================
-- 1. Запустіть перші 3 запити щоб побачити поточний стан
-- 2. Перевірте що всі таблиці мають rls_enabled = true
-- 3. Перевірте що кожна таблиця має відповідні політики
-- 4. Якщо є таблиці без RLS - додайте політики або увімкніть RLS
-- 5. Тестуйте доступ з різними ролями
