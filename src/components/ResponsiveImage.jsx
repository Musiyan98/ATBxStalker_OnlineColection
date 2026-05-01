/**
 * ResponsiveImage - компонент для відображення responsive зображень
 * Автоматично використовує WebP з fallback на JPG
 */

function ResponsiveImage({ sources, img }) {
  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          type={source.type}
          srcSet={source.srcSet}
          sizes={source.sizes}
        />
      ))}
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes={img.sizes}
        alt={img.alt}
        className={img.className}
        loading={img.loading}
        decoding={img.decoding}
        fetchpriority={img.fetchpriority}
      />
    </picture>
  );
}

export default ResponsiveImage;
