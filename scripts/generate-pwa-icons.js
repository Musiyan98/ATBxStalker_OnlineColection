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
      await sharp(inputPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 26, g: 26, b: 26, alpha: 1 }, // #1a1a1a
          kernel: sharp.kernel.lanczos3, // Найкраща якість
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
