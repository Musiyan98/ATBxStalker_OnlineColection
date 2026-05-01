import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryDir = path.join(__dirname, "../public/images/cards/gallery");
const detailDir = path.join(__dirname, "../public/images/cards/detail");

console.log("📊 Статус генерації зображень\n");
console.log("=".repeat(50));

// Перевіряємо галерею
const galleryFolders = fs
  .readdirSync(galleryDir)
  .filter(
    (f) =>
      f.startsWith("card-") &&
      fs.statSync(path.join(galleryDir, f)).isDirectory(),
  );

console.log(`\n🖼️  ГАЛЕРЕЯ:`);
console.log(`   Папок створено: ${galleryFolders.length} / 48`);

if (galleryFolders.length > 0) {
  const firstFolder = path.join(galleryDir, galleryFolders[0]);
  const filesInFolder = fs.readdirSync(firstFolder).length;
  console.log(`   Файлів у кожній папці: ${filesInFolder} / 8`);
  console.log(
    `   Загальна кількість файлів: ${galleryFolders.length * filesInFolder}`,
  );
}

// Перевіряємо детальні зображення
const detailFolders = fs
  .readdirSync(detailDir)
  .filter(
    (f) =>
      f.startsWith("card-") &&
      fs.statSync(path.join(detailDir, f)).isDirectory(),
  );

console.log(`\n🖼️  ДЕТАЛЬНІ ЗОБРАЖЕННЯ:`);
console.log(`   Папок створено: ${detailFolders.length} / 48`);

if (detailFolders.length > 0) {
  const firstFolder = path.join(detailDir, detailFolders[0]);
  const filesInFolder = fs.readdirSync(firstFolder).length;
  console.log(`   Файлів у кожній папці: ${filesInFolder} / 6`);
  console.log(
    `   Загальна кількість файлів: ${detailFolders.length * filesInFolder}`,
  );
}

// Загальна статистика
const totalExpected = 48 * 8 + 48 * 6; // 384 + 288 = 672
const totalGenerated = galleryFolders.length * 8 + detailFolders.length * 6;
const progress = ((totalGenerated / totalExpected) * 100).toFixed(1);

console.log(`\n📈 ЗАГАЛЬНИЙ ПРОГРЕС:`);
console.log(`   Згенеровано: ${totalGenerated} / ${totalExpected} файлів`);
console.log(`   Прогрес: ${progress}%`);

// Розмір файлів
let totalSize = 0;
const calculateSize = (dir) => {
  const folders = fs
    .readdirSync(dir)
    .filter(
      (f) =>
        f.startsWith("card-") && fs.statSync(path.join(dir, f)).isDirectory(),
    );

  folders.forEach((folder) => {
    const folderPath = path.join(dir, folder);
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      totalSize += fs.statSync(filePath).size;
    });
  });
};

calculateSize(galleryDir);
calculateSize(detailDir);

const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
console.log(`   Розмір: ${sizeMB} MB`);

console.log("\n" + "=".repeat(50));

if (totalGenerated === totalExpected) {
  console.log("✅ Генерація завершена!");
  console.log("\nНаступний крок:");
  console.log("   npm run images:update-data");
} else {
  console.log("⏳ Генерація в процесі...");
  console.log("\nЗачекайте завершення або запустіть знову:");
  console.log("   npm run images:generate");
}
