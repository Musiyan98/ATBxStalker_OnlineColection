/**
 * Скрипт для збору всіх 48 зображень карток в одну папку
 * Це допоможе швидко переглянути всі картки разом
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, "../public/images/cards/gallery");
const OUTPUT_DIR = path.join(__dirname, "../video_GENAI/_all_images");

console.log("📸 Збір всіх зображень карток в одну папку...\n");

// Створюємо папку якщо не існує
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✅ Створено папку: ${OUTPUT_DIR}\n`);
}

let success = 0;
let failed = 0;

for (let i = 1; i <= 48; i++) {
  const sourceJpg = path.join(SOURCE_DIR, `card-${i}`, `card-${i}-large.jpg`);
  const targetJpg = path.join(OUTPUT_DIR, `card-${i}-large.jpg`);

  if (fs.existsSync(sourceJpg)) {
    fs.copyFileSync(sourceJpg, targetJpg);
    console.log(`✅ Card ${i.toString().padStart(2, "0")}: Скопійовано`);
    success++;
  } else {
    console.log(`❌ Card ${i.toString().padStart(2, "0")}: Не знайдено`);
    failed++;
  }
}

console.log("\n" + "=".repeat(50));
console.log(`✨ Готово!`);
console.log(`   Успішно: ${success}/48`);
console.log(`   Не знайдено: ${failed}/48`);
console.log(`\n📁 Всі зображення зібрані в:`);
console.log(`   ${OUTPUT_DIR}`);
console.log("=".repeat(50));
