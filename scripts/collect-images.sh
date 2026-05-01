#!/bin/bash

# Скрипт для збору всіх 48 зображень в одну папку

echo "📸 Збір всіх зображень карток..."

# Створюємо папку
mkdir -p video_GENAI/_all_images

success=0
failed=0

# Копіюємо всі зображення
for i in {1..48}; do
  source="public/images/cards/gallery/card-$i/card-$i-large.jpg"
  target="video_GENAI/_all_images/card-$i-large.jpg"
  
  if [ -f "$source" ]; then
    cp "$source" "$target"
    echo "✅ Card $i: Скопійовано"
    ((success++))
  else
    echo "❌ Card $i: Не знайдено"
    ((failed++))
  fi
done

echo ""
echo "=================================================="
echo "✨ Готово!"
echo "   Успішно: $success/48"
echo "   Не знайдено: $failed/48"
echo ""
echo "📁 Всі зображення в: video_GENAI/_all_images/"
echo "=================================================="
