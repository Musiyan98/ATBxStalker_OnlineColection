import { memo } from 'react';
import '../styles/CardItem.css';

const CardItem = memo(function CardItem({ card, onClick }) {
  return (
    <article className="card-item" onClick={onClick}>
      <div className="card-image-wrapper">
        <img 
          src={card.image} 
          alt={card.title} 
          className="card-image"
          loading="lazy"
          decoding="async"
        />
        <div className="card-number">{card.number}</div>
        <div className="card-title-overlay">{card.title}</div>
      </div>
    </article>
  );
});

export default CardItem;
