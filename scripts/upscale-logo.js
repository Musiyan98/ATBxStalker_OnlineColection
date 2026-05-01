import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const logoPath = join(rootDir, "public", "stalker-logo.png");
const outputDir = join(rootDir, "public");

async function upscaleLogo() {
  console.log("🚀 Збільшення роздільної здатності логотипу...\n");

  try {
    // Перевіряємо чи існує файл
    if (!fs.existsSync(logoPath)) {
      console.error("❌ Файл stalker-logo.png не знайдено!");
      return;
    }

    // Отримуємо метадані оригінального зображення
    const metadata = await sharp(logoPath).metadata();
    console.log(`📊 Поточний розмір: ${metadata.width}x${metadata.height}px`);

    // Створюємо резервну копію
    const backupPath = join(outputDir, "stalker-logo-original.png");
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(logoPath, backupPath);
      console.log("💾 Створено резервну копію: stalker-logo-original.png");
    }

    // Використовуємо резервну копію як джерело
    const sourcePath = backupPath;

    // Базовий розмір (1x) - збільшуємо в 2 рази від поточного
    const baseWidth = metadata.width * 2;
    const baseHeight = metadata.height * 2;

    console.log(`\n🎨 Генерація версій логотипу:\n`);

    // 1x - базовий розмір (збільшений)
    await sharp(sourcePath)
      .resize(baseWidth, baseHeight, {
        kernel: sharp.kernel.lanczos3,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(join(outputDir, "stalker-logo.png"));
    console.log(`✅ stalker-logo.png (${baseWidth}x${baseHeight}px) - базовий`);

    // 2x - для Retina дисплеїв
    await sharp(sourcePath)
      .resize(baseWidth * 2, baseHeight * 2, {
        kernel: sharp.kernel.lanczos3,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(join(outputDir, "stalker-logo@2x.png"));
    console.log(
      `✅ stalker-logo@2x.png (${baseWidth * 2}x${baseHeight * 2}px) - Retina`,
    );

    // 3x - для високороздільних дисплеїв
    await sharp(sourcePath)
      .resize(baseWidth * 3, baseHeight * 3, {
        kernel: sharp.kernel.lanczos3,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(join(outputDir, "stalker-logo@3x.png"));
    console.log(
      `✅ stalker-logo@3x.png (${baseWidth * 3}x${baseHeight * 3}px) - 3x Retina`,
    );

    console.log("\n🎉 Готово! Логотип оновлено з підтримкою Retina дисплеїв");
    console.log("\n📝 Створені файли:");
    console.log("   - stalker-logo.png (базовий, збільшений)");
    console.log("   - stalker-logo@2x.png (для Retina)");
    console.log("   - stalker-logo@3x.png (для 3x Retina)");
    console.log("   - stalker-logo-original.png (резервна копія)\n");
  } catch (error) {
    console.error("❌ Помилка:", error.message);
    process.exit(1);
  }
}

upscaleLogo();
