-- Створення таблиці для зворотного зв'язку
CREATE TABLE IF NOT EXISTS feedback (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('feedback', 'suggestion', 'complaint')),
  needs_response BOOLEAN DEFAULT FALSE,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Створення індексу для швидкого пошуку за датою
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Створення індексу для категорій
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);

-- Додавання коментарів до таблиці та колонок
COMMENT ON TABLE feedback IS 'Таблиця для зберігання відгуків, пропозицій та скарг користувачів';
COMMENT ON COLUMN feedback.id IS 'Унікальний ідентифікатор відгуку';
COMMENT ON COLUMN feedback.message IS 'Текст повідомлення від користувача';
COMMENT ON COLUMN feedback.category IS 'Категорія: feedback (фідбек), suggestion (пропозиція), complaint (скарга)';
COMMENT ON COLUMN feedback.needs_response IS 'Чи потрібен зворотній зв''язок';
COMMENT ON COLUMN feedback.contact_info IS 'Контактна інформація для зворотного зв''язку (email, телефон, telegram)';
COMMENT ON COLUMN feedback.created_at IS 'Дата та час створення запису';
COMMENT ON COLUMN feedback.updated_at IS 'Дата та час останнього оновлення';

-- Функція для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для автоматичного оновлення updated_at
DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback;
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Налаштування Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Політика: дозволити вставку всім (анонімним користувачам)
CREATE POLICY "Allow insert for all users" ON feedback
  FOR INSERT
  WITH CHECK (true);

-- Політика: дозволити читання тільки аутентифікованим користувачам або service_role
CREATE POLICY "Allow read for authenticated users" ON feedback
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Політика: дозволити оновлення тільки service_role
CREATE POLICY "Allow update for service_role" ON feedback
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Політика: дозволити видалення тільки service_role
CREATE POLICY "Allow delete for service_role" ON feedback
  FOR DELETE
  USING (auth.role() = 'service_role');
