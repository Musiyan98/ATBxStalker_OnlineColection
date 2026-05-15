import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "..", "public");

const sizes = [
  { size: 192, name: "pwa-icon-192.png" },
  { size: 512, name: "pwa-icon-512.png" },
];

async function generateIcons() {
  // Спробуємо використати найбільший доступний логотип
  const possibleInputs = [
    "stalker-logo@3x.png",
    "stalker-logo@2x.png",
    "stalker-logo.png",
  ];

  let inputPath = null;
  for (const filename of possibleInputs) {
    const path = join(publicDir, filename);
    try {
      await sharp(path).metadata();
      inputPath = path;
      console.log(`📸 Використовую: ${filename}`);
      break;
    } catch {
      continue;
    }
  }

  if (!inputPath) {
    console.error("❌ Не знайдено жодного логотипу!");
    return;
  }

  console.log("🎨 Генерація PWA іконок високої якості...");

  for (const { size, name } of sizes) {
    const outputPath = join(publicDir, name);

    try {
      // Створюємо іконку з темним фоном та padding
      const padding = Math.floor(size * 0.1); // 10% padding
      const logoSize = size - padding * 2;

      await sharp(inputPath)
        .resize(logoSize, logoSize, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          kernel: sharp.kernel.lanczos3,
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 26, g: 26, b: 26, alpha: 1 }, // #1a1a1a темний фон
        })
        .png({
          quality: 100,
          compressionLevel: 6,
          adaptiveFiltering: true,
        })
        .toFile(outputPath);

      console.log(`✅ Створено: ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Помилка при створенні ${name}:`, error.message);
    }
  }

  console.log("🎉 Готово! PWA іконки високої якості створено.");
}

generateIcons();
