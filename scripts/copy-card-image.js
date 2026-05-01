import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardNumber = process.argv[2] || 1;

const source = path.join(
  __dirname,
  `../public/images/cards/gallery/card-${cardNumber}/card-${cardNumber}-large.webp`,
);
const targetDir = path.join(__dirname, `../video_GENAI/card-${cardNumber}`);
const target = path.join(targetDir, `card-${cardNumber}-source.webp`);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(source)) {
  fs.copyFileSync(source, target);
  console.log(`✅ Скопійовано: card-${cardNumber}-source.webp`);
} else {
  console.log(`❌ Не знайдено: ${source}`);
}
