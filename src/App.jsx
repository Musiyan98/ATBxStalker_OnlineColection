import { useState, useEffect } from 'react';
import Header from './components/Header';
import CardGrid from './components/CardGrid';
import CardDetail from './components/CardDetail';
import Footer from './components/Footer';
import FeedbackModal from './components/FeedbackModal';
import { cardsData } from './data/cardsData';
import './styles/App.css';

function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Scroll to top при зміні сторінки
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCard]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBackToGrid = () => {
    setSelectedCard(null);
  };

  const openFeedbackModal = () => {
    setFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
  };

  return (
    <div className="app">
      <Header onOpenFeedback={openFeedbackModal} />
      <main className="main-content">
        {selectedCard ? (
          <CardDetail card={selectedCard} onBack={handleBackToGrid} />
        ) : (
          <CardGrid cards={cardsData} onCardClick={handleCardClick} />
        )}
      </main>
      <Footer onOpenFeedback={openFeedbackModal} />
      <FeedbackModal 
        isOpen={feedbackModalOpen} 
        onClose={closeFeedbackModal} 
      />
    </div>
  );
}

export default App;
