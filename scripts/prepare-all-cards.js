/**
 * Скрипт для підготовки всіх 48 папок з зображеннями карток
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, "../public/images/cards/gallery");
const OUTPUT_DIR = path.join(__dirname, "../video_GENAI");

function prepareCard(cardNumber) {
  const sourceJpg = path.join(
    SOURCE_DIR,
    `card-${cardNumber}`,
    `card-${cardNumber}-large.jpg`,
  );
  const targetDir = path.join(OUTPUT_DIR, `card-${cardNumber}`);
  const targetJpg = path.join(targetDir, `card-${cardNumber}-source.jpg`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(sourceJpg)) {
    fs.copyFileSync(sourceJpg, targetJpg);
    console.log(`✅ #${cardNumber}: OK`);
    return true;
  } else {
    console.log(`❌ #${cardNumber}: Не знайдено`);
    return false;
  }
}

console.log("🎬 Створення 48 папок та копіювання зображень...\n");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let success = 0;
for (let i = 1; i <= 48; i++) {
  if (prepareCard(i)) success++;
}

console.log(`\n✨ Готово! Успішно: ${success}/48`);
