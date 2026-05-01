import { memo } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { getGalleryPictureProps } from '../utils/imageHelpers';
import '../styles/CardItem.css';

const CardItem = memo(function CardItem({ card, onClick }) {
  const baseUrl = import.meta.env.BASE_URL;
  const pictureProps = getGalleryPictureProps(baseUrl, card.number, card.title, 'card-image', 'lazy');
  
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
