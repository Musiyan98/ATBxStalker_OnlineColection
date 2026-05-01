import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаємо parsed_data.json
const parsedDataPath = path.join(__dirname, "../parsed_data.json");
const parsedData = JSON.parse(fs.readFileSync(parsedDataPath, "utf-8"));

// Оновлюємо дані
console.log("📝 Оновлення parsed_data.json...\n");

const updatedData = parsedData.map((card) => {
  const cardNumber = card.cardNumber;

  console.log(`✏️  Картка ${cardNumber}: ${card.cardTitle}`);

  return {
    ...card,
    // Додаємо локальні шляхи до зображень
    cardImages: [
      ...card.cardImages,
      {
        retina: "local",
        localPath: `images/cards/gallery/card-${cardNumber}`,
        description: "Local responsive images (WebP + JPG fallback)",
      },
    ],
    // Додаємо шлях до детального зображення
    cardDetailImage: `images/cards/detail/card-${cardNumber}`,
    cardDetailImageDescription: "Local high-resolution image for detail page",
  };
});

// Зберігаємо оновлений файл
const backupPath = path.join(__dirname, "../parsed_data.backup.json");
fs.writeFileSync(backupPath, JSON.stringify(parsedData, null, 2));
console.log(`\n💾 Створено backup: parsed_data.backup.json`);

fs.writeFileSync(parsedDataPath, JSON.stringify(updatedData, null, 2));
console.log(`✅ Оновлено: parsed_data.json`);

console.log("\n" + "=".repeat(50));
console.log("✅ Оновлення даних завершено!");
console.log("=".repeat(50));
