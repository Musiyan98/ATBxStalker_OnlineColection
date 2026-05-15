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
  const inputPath = join(publicDir, "stalker-logo.png");

  console.log("🎨 Генерація PWA іконок...");

  for (const { size, name } of sizes) {
    const outputPath = join(publicDir, name);

    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 26, g: 26, b: 26, alpha: 1 }, // #1a1a1a
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Створено: ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Помилка при створенні ${name}:`, error.message);
    }
  }

  console.log("🎉 Готово! PWA іконки створено.");
}

generateIcons();
