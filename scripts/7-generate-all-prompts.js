/**
 * Скрипт для генерації промптів для всіх 48 карток
 * Створює базові промпти які можна потім налаштувати індивідуально
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../video_GENAI");
const SOURCE_DIR = path.join(__dirname, "../public/images/cards/gallery");

// Базовий шаблон промпту
const basePromptTemplate = (
  cardNumber,
  cardTitle,
) => `CARD #${cardNumber} - "${cardTitle}"

VIDEO PROMPT FOR IMAGE-TO-VIDEO AI:

Cinemagraph style, subtle motion, high detail, seamless loop.

FOREGROUND (Character/Subject):
- Natural breathing movements (chest/shoulder rise and fall)
- Minimal head movements showing alertness
- Gear and equipment showing subtle movement
- Body language appropriate to character type
- Micro-movements suggesting life and awareness

BACKGROUND (Environment):
- Atmospheric fog/mist drifting slowly across scene
- Dust particles or atmospheric effects floating in air
- Subtle environmental movement (wind, smoke, haze)
- Depth created through layered atmospheric effects
- Zone ambiance with natural and anomalous elements

ANOMALOUS EFFECTS (Zone atmosphere):
- Subtle reality distortion (heat-haze style warping)
- Faint psi-field effects in the air
- Occasional brief anomaly glow or shimmer
- Electromagnetic interference visual effects
- Color temperature shifts (very subtle)

TECHNICAL REQUIREMENTS:
- Duration: 3-5 seconds for seamless loop
- Frame must remain completely static (card border unchanged)
- All motion contained within the card's image area
- Maintain original image quality and detail
- Smooth, natural motion - avoid jerky movements
- Loop point must be imperceptible
- Atmospheric and moody, not action-heavy

MOOD: S.T.A.L.K.E.R. atmosphere - tense, mysterious, dangerous, with the Zone's unique blend of post-apocalyptic reality and anomalous phenomena.

NOTES FOR AI:
- Keep the card frame/border completely still
- Focus motion inside the image content only
- Maintain the original composition and framing
- Subtle is better than dramatic
- Loop must be seamless and natural
`;

// Назви карток (з parsed_data.json)
const cardTitles = {
  1: "Перші експерименти",
  2: "Аномальна зона",
  3: "Загони евакуації",
  4: "Рейд Стрільця",
  5: "Війна угруповань",
  6: "Випалювач мізків",
  7: "С-Свідомість",
  8: 'Операція "Фарватер"',
  9: "Скарб Зони",
  10: "Друга катастрофа",
  11: "Моноліт",
  12: "Чисте Небо",
  13: "Долг",
  14: "Воля",
  15: "Найманці",
  16: "Бандити",
  17: "Одинаки",
  18: "Учені",
  19: "Військові сталкери",
  20: "Ренегати",
  21: "Кров'ян",
  22: "Плоть",
  23: "Кабан",
  24: "Пес",
  25: "Псевдопес",
  26: "Тушкан",
  27: "Кот",
  28: "Химера",
  29: "Псевдогігант",
  30: "Контролер",
  31: "Бюрер",
  32: "Полтергейст",
  33: "Снорк",
  34: "Зомбі",
  35: "Кровосос",
  36: "Електра",
  37: "Жарка",
  38: "Воронка",
  39: "Карусель",
  40: "Тремтіння",
  41: "Слимак",
  42: "Мамине намисто",
  43: "Сніжинка",
  44: "Вогник",
  45: "Кристал",
  46: "Гравіпух",
  47: "Золота рибка",
  48: "Око",
};

/**
 * Створює папку та файли для картки
 */
function prepareCard(cardNumber) {
  const cardTitle = cardTitles[cardNumber] || `Картка ${cardNumber}`;
  const cardDir = path.join(OUTPUT_DIR, `card-${cardNumber}`);
  const promptFile = path.join(cardDir, "video_prompt.txt");
  const sourceImage = path.join(
    SOURCE_DIR,
    `card-${cardNumber}`,
    `card-${cardNumber}-large.webp`,
  );
  const targetImage = path.join(cardDir, `card-${cardNumber}-source.webp`);

  // Створюємо папку
  if (!fs.existsSync(cardDir)) {
    fs.mkdirSync(cardDir, { recursive: true });
  }

  // Копіюємо зображення якщо існує
  if (fs.existsSync(sourceImage)) {
    fs.copyFileSync(sourceImage, targetImage);
    console.log(`✅ Картка #${cardNumber}: Скопійовано зображення`);
  } else {
    console.log(`⚠️  Картка #${cardNumber}: Зображення не знайдено`);
  }

  // Створюємо промпт якщо не існує
  if (!fs.existsSync(promptFile)) {
    const promptContent = basePromptTemplate(cardNumber, cardTitle);
    fs.writeFileSync(promptFile, promptContent, "utf-8");
    console.log(`✅ Картка #${cardNumber}: Створено промпт`);
  } else {
    console.log(`⏭️  Картка #${cardNumber}: Промпт вже існує, пропускаємо`);
  }
}

/**
 * Головна функція
 */
function main() {
  console.log("🎬 Підготовка матеріалів для всіх 48 карток...\n");

  // Створюємо вихідну директорію
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Обробляємо всі картки
  for (let i = 1; i <= 48; i++) {
    prepareCard(i);
  }

  console.log("\n✨ Готово! Всі матеріали підготовлені.");
  console.log(`📁 Папка: ${OUTPUT_DIR}`);
  console.log(
    "\n💡 Тепер можна переглянути кожен промпт та налаштувати його індивідуально",
  );
  console.log(
    "   на основі конкретного зображення картки для кращого результату.",
  );
}

main();
