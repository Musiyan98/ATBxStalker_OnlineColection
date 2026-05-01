/**
 * Скрипт для повторного стиснення зображень з оптимальними налаштуваннями
 * Використовує більш агресивне стиснення для WebP
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GALLERY_DIR = path.join(__dirname, "../public/images/cards/gallery");
const DETAIL_DIR = path.join(__dirname, "../public/images/cards/detail");

// Оптимальні налаштування стиснення
const WEBP_QUALITY = 82; // Знижено з 90 до 82 для кращого стиснення
const JPG_QUALITY = 80; // Знижено з 85 до 80

// Розміри для галереї
const GALLERY_SIZES = [
  { name: "small", width: 400 },
  { name: "medium", width: 800 },
  { name: "large", width: 1200 },
  { name: "xlarge", width: 2400 },
];

// Розміри для детальних сторінок
const DETAIL_SIZES = [
  { name: "1k", width: 1280 },
  { name: "2k", width: 2560 },
  { name: "4k", width: 3840 },
];

/**
 * Повторно стискає зображення
 */
async function recompressImage(inputPath, outputPath, width, format, quality) {
  try {
    const sharpInstance = sharp(inputPath);

    // Отримуємо метадані
    const metadata = await sharpInstance.metadata();

    // Якщо зображення менше за цільову ширину, використовуємо оригінальну ширину
    const targetWidth = metadata.width < width ? metadata.width : width;

    // Налаштування для різних форматів
    if (format === "webp") {
      await sharpInstance
        .resize(targetWidth, null, {
          fit: "inside",
          withoutEnlargement: false,
        })
        .webp({
          quality: quality,
          effort: 6,
          smartSubsample: true, // Покращує стиснення
        })
        .toFile(outputPath);
    } else if (format === "jpg") {
      await sharpInstance
        .resize(targetWidth, null, {
          fit: "inside",
          withoutEnlargement: false,
        })
        .jpeg({
          quality: quality,
          progressive: true,
          mozjpeg: true,
          optimizeScans: true, // Додаткова оптимізація
        })
        .toFile(outputPath);
    }

    return true;
  } catch (error) {
    console.error(`❌ Помилка при стисненні ${outputPath}:`, error.message);
    return false;
  }
}

/**
 * Повторно стискає всі зображення галереї
 */
async function recompressGallery() {
  console.log("\n📦 Повторне стиснення зображень галереї...\n");

  let processed = 0;
  let errors = 0;

  for (let i = 1; i <= 48; i++) {
    const cardDir = path.join(GALLERY_DIR, `card-${i}`);
    const originalPath = path.join(GALLERY_DIR, "original", `card-${i}.jpg`);

    if (!fs.existsSync(originalPath)) {
      console.log(`⚠️  Пропущено card-${i}: оригінал не знайдено`);
      continue;
    }

    console.log(`🔄 Обробка card-${i}...`);

    for (const size of GALLERY_SIZES) {
      // WebP
      const webpPath = path.join(cardDir, `card-${i}-${size.name}.webp`);
      const webpSuccess = await recompressImage(
        originalPath,
        webpPath,
        size.width,
        "webp",
        WEBP_QUALITY,
      );

      // JPG
      const jpgPath = path.join(cardDir, `card-${i}-${size.name}.jpg`);
      const jpgSuccess = await recompressImage(
        originalPath,
        jpgPath,
        size.width,
        "jpg",
        JPG_QUALITY,
      );

      if (webpSuccess && jpgSuccess) {
        processed += 2;
      } else {
        errors += (!webpSuccess ? 1 : 0) + (!jpgSuccess ? 1 : 0);
      }
    }
  }

  console.log(
    `\n✅ Галерея: оброблено ${processed} файлів, помилок: ${errors}`,
  );
}

/**
 * Повторно стискає всі детальні зображення
 */
async function recompressDetail() {
  console.log("\n📦 Повторне стиснення детальних зображень...\n");

  let processed = 0;
  let errors = 0;

  for (let i = 1; i <= 48; i++) {
    const cardDir = path.join(DETAIL_DIR, `card-${i}`);
    const originalPath = path.join(DETAIL_DIR, "original", `card-${i}.png`);

    if (!fs.existsSync(originalPath)) {
      console.log(`⚠️  Пропущено card-${i}: оригінал не знайдено`);
      continue;
    }

    console.log(`🔄 Обробка card-${i}...`);

    for (const size of DETAIL_SIZES) {
      // WebP
      const webpPath = path.join(cardDir, `card-${i}-${size.name}.webp`);
      const webpSuccess = await recompressImage(
        originalPath,
        webpPath,
        size.width,
        "webp",
        WEBP_QUALITY,
      );

      // JPG
      const jpgPath = path.join(cardDir, `card-${i}-${size.name}.jpg`);
      const jpgSuccess = await recompressImage(
        originalPath,
        jpgPath,
        size.width,
        "jpg",
        JPG_QUALITY,
      );

      if (webpSuccess && jpgSuccess) {
        processed += 2;
      } else {
        errors += (!webpSuccess ? 1 : 0) + (!jpgSuccess ? 1 : 0);
      }
    }
  }

  console.log(`\n✅ Деталі: оброблено ${processed} файлів, помилок: ${errors}`);
}

/**
 * Головна функція
 */
async function main() {
  console.log("🚀 Початок повторного стиснення зображень...");
  console.log(`📊 WebP якість: ${WEBP_QUALITY}%, JPG якість: ${JPG_QUALITY}%`);

  const startTime = Date.now();

  await recompressGallery();
  await recompressDetail();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n🎉 Готово! Час виконання: ${duration} секунд`);
}

main().catch(console.error);
