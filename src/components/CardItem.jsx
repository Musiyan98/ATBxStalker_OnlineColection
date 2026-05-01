import { memo } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { getGalleryPictureProps } from '../utils/imageHelpers';
import '../styles/CardItem.css';

const CardItem = memo(function CardItem({ card, onClick, priority = false }) {
  const baseUrl = import.meta.env.BASE_URL;
  const loading = priority ? 'eager' : 'lazy';
  const pictureProps = getGalleryPictureProps(baseUrl, card.number, card.title, 'card-image', loading);
  
  return (
    <article className="card-item" onClick={onClick}>
      <div className="card-image-wrapper">
        <ResponsiveImage {...pictureProps} />
        <div className="card-number">{card.number}</div>
        <div className="card-title-overlay">{card.title}</div>
      </div>
    </article>
  );
});

export default CardItem;
