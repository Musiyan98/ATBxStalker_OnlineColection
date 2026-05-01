import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаємо parsed_data.json
const parsedDataPath = path.join(__dirname, "../parsed_data.json");
const parsedData = JSON.parse(fs.readFileSync(parsedDataPath, "utf-8"));

// Папки для збереження
const galleryDir = path.join(
  __dirname,
  "../public/images/cards/gallery/original",
);
const detailDir = path.join(
  __dirname,
  "../public/images/cards/detail/original",
);

// Створюємо папки якщо не існують
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}
if (!fs.existsSync(detailDir)) {
  fs.mkdirSync(detailDir, { recursive: true });
}

// Функція для завантаження файлу
async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    fs.writeFileSync(filepath, response.data);
    console.log(`✅ Завантажено: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Помилка завантаження ${url}:`, error.message);
    return false;
  }
}

// Функція для затримки між запитами
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadAllImages() {
  console.log("🚀 Початок завантаження зображень...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const card of parsedData) {
    const cardNumber = card.cardNumber;
    console.log(`\n📦 Картка ${cardNumber}: ${card.cardTitle}`);

    // 1. Завантажуємо зображення для галереї (з parsed_data.json)
    const galleryUrl =
      card.cardImages.find((img) => img.retina === "2x")?.fullUrl ||
      card.cardImages[0]?.fullUrl;

    if (galleryUrl) {
      const galleryPath = path.join(galleryDir, `card-${cardNumber}.jpg`);
      const success = await downloadImage(galleryUrl, galleryPath);
      if (success) successCount++;
      else errorCount++;
      await delay(500); // Затримка між запитами
    }

    // 2. Завантажуємо зображення для детальної сторінки (з s2-atb.com)
    // Спробуємо різні варіанти URL
    const detailUrls = [
      `https://s2-atb.com/_next/image?url=%2Fi%2Fcards%2Fcard-${cardNumber}.png&w=640&q=75`,
      `https://s2-atb.com/i/cards/card-${cardNumber}.png`,
      `https://s2-atb.com/_next/image?url=/i/cards/card-${cardNumber}.png&w=1920&q=90`,
    ];

    let detailDownloaded = false;
    for (const detailUrl of detailUrls) {
      if (detailDownloaded) break;

      const detailPath = path.join(detailDir, `card-${cardNumber}.png`);
      const success = await downloadImage(detailUrl, detailPath);

      if (success) {
        successCount++;
        detailDownloaded = true;
      }
      await delay(500);
    }

    if (!detailDownloaded) {
      console.log(
        `⚠️  Не вдалося завантажити детальне зображення для картки ${cardNumber}`,
      );
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Успішно завантажено: ${successCount}`);
  console.log(`❌ Помилок: ${errorCount}`);
  console.log("=".repeat(50));
}

// Запускаємо завантаження
downloadAllImages().catch(console.error);
