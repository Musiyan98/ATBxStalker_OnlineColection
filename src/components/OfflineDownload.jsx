import { useState, useEffect } from 'react';
import '../styles/OfflineDownload.css';

function OfflineDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Перевіряємо чи дані вже завантажені
    checkIfDownloaded();
  }, []);

  const checkIfDownloaded = async () => {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open('stalker-offline-data-v1');
      const keys = await cache.keys();
      // Якщо є хоча б 100 файлів - вважаємо що завантажено
      setIsDownloaded(keys.length > 100);
    } catch (err) {
      console.error('Error checking cache:', err);
    }
  };

  const downloadOfflineData = async () => {
    if (!('caches' in window)) {
      setError('Ваш браузер не підтримує офлайн режим');
      return;
    }

    setIsDownloading(true);
    setError(null);
    setProgress(0);

    try {
      const cache = await caches.open('stalker-offline-data-v1');

      // Генеруємо список всіх файлів
      const audioFiles = [];
      for (let i = 1; i <= 48; i++) {
        audioFiles.push(`/audio/card${i}_audio0.mp3`);
        audioFiles.push(`/audio/card${i}_audio1.mp3`);
      }

      const imageFiles = [];
      const imageSizes = ['small', 'medium', 'large', 'xlarge'];
      const imageFormats = ['jpg', 'webp'];
      const detailSizes = ['1k', '2k', '4k'];

      // Зображення галереї
      for (let i = 1; i <= 48; i++) {
        for (const size of imageSizes) {
          for (const format of imageFormats) {
            imageFiles.push(`/images/cards/gallery/card-${i}/card-${i}-${size}.${format}`);
          }
        }
      }

      // Зображення деталей
      for (let i = 1; i <= 48; i++) {
        for (const size of detailSizes) {
          imageFiles.push(`/images/cards/detail/card-${i}/card-${i}-${size}.jpg`);
          imageFiles.push(`/images/cards/detail/card-${i}/card-${i}-${size}.webp`);
        }
      }

      const allFiles = [...audioFiles, ...imageFiles];
      const totalFiles = allFiles.length;
      let downloadedFiles = 0;

      // Завантажуємо по 10 файлів одночасно
      const chunkSize = 10;
      for (let i = 0; i < allFiles.length; i += chunkSize) {
        const chunk = allFiles.slice(i, i + chunkSize);
        
        await Promise.all(
          chunk.map(async (url) => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
                downloadedFiles++;
                setProgress(Math.round((downloadedFiles / totalFiles) * 100));
              }
            } catch (err) {
              console.warn(`Failed to cache ${url}:`, err);
            }
          })
        );
      }

      setIsDownloaded(true);
      setIsDownloading(false);
      console.log('✅ Всі дані завантажено для офлайн режиму!');
    } catch (err) {
      console.error('Error downloading offline data:', err);
      setError('Помилка завантаження. Спробуйте ще раз.');
      setIsDownloading(false);
    }
  };

  const clearOfflineData = async () => {
    if (!('caches' in window)) return;

    try {
      await caches.delete('stalker-offline-data-v1');
      setIsDownloaded(false);
      setProgress(0);
      console.log('✅ Офлайн дані видалено');
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  };

  return {
    isDownloading,
    isDownloaded,
    progress,
    error,
    downloadOfflineData,
    clearOfflineData
  };
}

export default OfflineDownload;
