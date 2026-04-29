import { useState } from 'react';
import Header from './components/Header';
import CardGrid from './components/CardGrid';
import CardDetail from './components/CardDetail';
import Footer from './components/Footer';
import { cardsData } from './data/cardsData';
import './styles/App.css';

function App() {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBackToGrid = () => {
    setSelectedCard(null);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {selectedCard ? (
          <CardDetail card={selectedCard} onBack={handleBackToGrid} />
        ) : (
          <CardGrid cards={cardsData} onCardClick={handleCardClick} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
