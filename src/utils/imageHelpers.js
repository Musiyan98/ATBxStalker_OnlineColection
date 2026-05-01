/**
 * Utility функції для роботи з responsive зображеннями
 */

/**
 * Генерує srcSet для зображень галереї
 * @param {string} baseUrl - Base URL від Vite (import.meta.env.BASE_URL)
 * @param {number} cardNumber - Номер картки
 * @returns {object} - Об'єкт з srcSet для WebP та JPG
 */
export function getGalleryImageSources(baseUrl, cardNumber) {
  const basePath = `${baseUrl}images/cards/gallery/card-${cardNumber}/card-${cardNumber}`;

  return {
    webp: {
      srcSet: `
        ${basePath}-small.webp 400w,
        ${basePath}-medium.webp 800w,
        ${basePath}-large.webp 1200w,
        ${basePath}-xlarge.webp 2400w
      `.trim(),
      sizes:
        "(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1920px) 1200px, 2400px",
    },
    jpg: {
      src: `${basePath}-medium.jpg`, // fallback
      srcSet: `
        ${basePath}-small.jpg 400w,
        ${basePath}-medium.jpg 800w,
        ${basePath}-large.jpg 1200w,
        ${basePath}-xlarge.jpg 2400w
      `.trim(),
      sizes:
        "(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1920px) 1200px, 2400px",
    },
  };
}

/**
 * Генерує srcSet для детальних зображень
 * @param {string} baseUrl - Base URL від Vite (import.meta.env.BASE_URL)
 * @param {number} cardNumber - Номер картки
 * @returns {object} - Об'єкт з srcSet для WebP та JPG
 */
export function getDetailImageSources(baseUrl, cardNumber) {
  const basePath = `${baseUrl}images/cards/detail/card-${cardNumber}/card-${cardNumber}`;

  return {
    webp: {
      srcSet: `
        ${basePath}-1k.webp 1280w,
        ${basePath}-2k.webp 2560w,
        ${basePath}-4k.webp 3840w
      `.trim(),
      sizes: "(max-width: 768px) 1280px, (max-width: 1920px) 2560px, 3840px",
    },
    jpg: {
      src: `${basePath}-2k.jpg`, // fallback
      srcSet: `
        ${basePath}-1k.jpg 1280w,
        ${basePath}-2k.jpg 2560w,
        ${basePath}-4k.jpg 3840w
      `.trim(),
      sizes: "(max-width: 768px) 1280px, (max-width: 1920px) 2560px, 3840px",
    },
  };
}

/**
 * Генерує JSX для <picture> елемента (галерея)
 * @param {string} baseUrl - Base URL від Vite
 * @param {number} cardNumber - Номер картки
 * @param {string} alt - Alt текст
 * @param {string} className - CSS клас
 * @param {string} loading - Loading strategy ('lazy' або 'eager')
 * @returns {object} - Props для <picture> компонента
 */
export function getGalleryPictureProps(
  baseUrl,
  cardNumber,
  alt,
  className = "",
  loading = "lazy",
) {
  const sources = getGalleryImageSources(baseUrl, cardNumber);

  return {
    sources: [
      {
        type: "image/webp",
        srcSet: sources.webp.srcSet,
        sizes: sources.webp.sizes,
      },
    ],
    img: {
      src: sources.jpg.src,
      srcSet: sources.jpg.srcSet,
      sizes: sources.jpg.sizes,
      alt,
      className,
      loading,
      decoding: "async",
    },
  };
}

/**
 * Генерує JSX для <picture> елемента (детальна сторінка)
 * @param {string} baseUrl - Base URL від Vite
 * @param {number} cardNumber - Номер картки
 * @param {string} alt - Alt текст
 * @param {string} className - CSS клас
 * @param {string} loading - Loading strategy ('lazy' або 'eager')
 * @returns {object} - Props для <picture> компонента
 */
export function getDetailPictureProps(
  baseUrl,
  cardNumber,
  alt,
  className = "",
  loading = "eager",
) {
  const sources = getDetailImageSources(baseUrl, cardNumber);

  return {
    sources: [
      {
        type: "image/webp",
        srcSet: sources.webp.srcSet,
        sizes: sources.webp.sizes,
      },
    ],
    img: {
      src: sources.jpg.src,
      srcSet: sources.jpg.srcSet,
      sizes: sources.jpg.sizes,
      alt,
      className,
      loading,
      decoding: loading === "eager" ? "sync" : "async",
      fetchpriority: loading === "eager" ? "high" : "auto",
    },
  };
}
