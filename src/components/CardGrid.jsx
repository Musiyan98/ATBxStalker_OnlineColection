import { useCallback } from 'react';
import CardItem from './CardItem';
import '../styles/CardGrid.css';

function CardGrid({ cards, onCardClick }) {
  const handleCardClick = useCallback((card) => {
    onCardClick(card);
  }, [onCardClick]);

  return (
    <div className="card-grid-container">
      <h1 className="grid-title">Колекція Карток</h1>
      <div className="card-grid">
        {cards.map((card, index) => (
          <CardItem 
            key={card.id} 
            card={card} 
            onClick={() => handleCardClick(card)}
            priority={index < 8} // Перші 8 карток з пріоритетом
          />
        ))}
      </div>
    </div>
  );
}

export default CardGrid;
