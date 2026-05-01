import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфігурація розмірів
const GALLERY_SIZES = {
  small: 400, // mobile
  medium: 800, // tablet
  large: 1200, // desktop
  xlarge: 2400, // retina
};

const DETAIL_SIZES = {
  "1k": 1280, // mobile
  "2k": 2560, // tablet/laptop
  "4k": 3840, // desktop retina
};

// Папки
const galleryOriginalDir = path.join(
  __dirname,
  "../public/images/cards/gallery/original",
);
const detailOriginalDir = path.join(
  __dirname,
  "../public/images/cards/detail/original",
);
const galleryOutputDir = path.join(__dirname, "../public/images/cards/gallery");
const detailOutputDir = path.join(__dirname, "../public/images/cards/detail");

// Функція для обробки одного зображення
async function processImage(inputPath, outputDir, sizes, cardNumber, type) {
  const cardFolder = path.join(outputDir, `card-${cardNumber}`);

  // Створюємо папку для картки
  if (!fs.existsSync(cardFolder)) {
    fs.mkdirSync(cardFolder, { recursive: true });
  }

  console.log(`  📸 Обробка ${type} зображення для картки ${cardNumber}...`);

  for (const [sizeName, sizeValue] of Object.entries(sizes)) {
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Визначаємо розмір (зберігаємо пропорції)
      const resizeOptions = {
        width: sizeValue,
        height: sizeValue,
        fit: "inside",
        withoutEnlargement: false,
      };

      // Генеруємо WebP
      const webpPath = path.join(
        cardFolder,
        `card-${cardNumber}-${sizeName}.webp`,
      );
      await image
        .clone()
        .resize(resizeOptions)
        .webp({ quality: 90, effort: 6 })
        .toFile(webpPath);
      console.log(`    ✅ ${sizeName} WebP`);

      // Генеруємо JPG (fallback)
      const jpgPath = path.join(
        cardFolder,
        `card-${cardNumber}-${sizeName}.jpg`,
      );
      await image
        .clone()
        .resize(resizeOptions)
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toFile(jpgPath);
      console.log(`    ✅ ${sizeName} JPG`);
    } catch (error) {
      console.error(`    ❌ Помилка обробки ${sizeName}:`, error.message);
    }
  }
}

// Основна функція
async function generateResponsiveImages() {
  console.log("🎨 Початок генерації responsive зображень...\n");

  // Отримуємо список файлів
  const galleryFiles = fs
    .readdirSync(galleryOriginalDir)
    .filter((f) => f.endsWith(".jpg"));
  const detailFiles = fs
    .readdirSync(detailOriginalDir)
    .filter((f) => f.endsWith(".png"));

  console.log(`📊 Знайдено ${galleryFiles.length} зображень галереї`);
  console.log(`📊 Знайдено ${detailFiles.length} детальних зображень\n`);

  // Обробляємо зображення галереї
  console.log("🖼️  ОБРОБКА ЗОБРАЖЕНЬ ГАЛЕРЕЇ\n");
  for (const file of galleryFiles) {
    const cardNumber = file.match(/card-(\d+)/)?.[1];
    if (!cardNumber) continue;

    const inputPath = path.join(galleryOriginalDir, file);
    await processImage(
      inputPath,
      galleryOutputDir,
      GALLERY_SIZES,
      cardNumber,
      "gallery",
    );
  }

  // Обробляємо детальні зображення
  console.log("\n🖼️  ОБРОБКА ДЕТАЛЬНИХ ЗОБРАЖЕНЬ\n");
  for (const file of detailFiles) {
    const cardNumber = file.match(/card-(\d+)/)?.[1];
    if (!cardNumber) continue;

    const inputPath = path.join(detailOriginalDir, file);
    await processImage(
      inputPath,
      detailOutputDir,
      DETAIL_SIZES,
      cardNumber,
      "detail",
    );
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Генерація responsive зображень завершена!");
  console.log("=".repeat(50));
}

// Запускаємо
generateResponsiveImages().catch(console.error);
