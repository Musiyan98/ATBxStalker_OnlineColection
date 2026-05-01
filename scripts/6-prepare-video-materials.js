/**
 * Скрипт для підготовки матеріалів для генерації cinemagraph відео
 * Копіює зображення карток та створює промпти для Image-to-Video AI
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, "../public/images/cards/gallery");
const OUTPUT_DIR = path.join(__dirname, "../video_GENAI");

// Створюємо вихідну директорію
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Копіює зображення картки
 */
function copyCardImage(cardNumber) {
  const sourceImage = path.join(
    SOURCE_DIR,
    `card-${cardNumber}`,
    `card-${cardNumber}-large.webp`,
  );
  const targetDir = path.join(OUTPUT_DIR, `card-${cardNumber}`);
  const targetImage = path.join(targetDir, `card-${cardNumber}-source.webp`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(sourceImage)) {
    fs.copyFileSync(sourceImage, targetImage);
    console.log(`✅ Скопійовано: card-${cardNumber}-source.webp`);
    return true;
  } else {
    console.log(`❌ Не знайдено: ${sourceImage}`);
    return false;
  }
}

/**
 * Створює промпт для картки
 */
function createPrompt(cardNumber, promptText) {
  const targetDir = path.join(OUTPUT_DIR, `card-${cardNumber}`);
  const promptFile = path.join(targetDir, "video_prompt.txt");

  fs.writeFileSync(promptFile, promptText, "utf-8");
  console.log(`✅ Створено промпт: card-${cardNumber}/video_prompt.txt`);
}

// Картка #1 вже створена, продовжуємо з #2
console.log("🎬 Початок підготовки матеріалів для відео...\n");

// Картка #1
console.log("📦 Картка #1: Перші експерименти");
copyCardImage(1);

console.log("\n✨ Готово!");
