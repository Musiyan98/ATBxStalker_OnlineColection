import { useState, useEffect } from 'react';
import '../styles/OfflineWelcome.css';

function OfflineWelcome() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Перевіряємо чи це перший візит
    const hasSeenWelcome = localStorage.getItem('stalker-offline-welcome-seen');
    
    // Показуємо тільки якщо це PWA (встановлений додаток)
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!hasSeenWelcome && isPWA) {
      // Показуємо через 1 секунду після завантаження
      setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('stalker-offline-welcome-seen', 'true');
    setShowWelcome(false);
  };

  const handleOpenMenu = () => {
    localStorage.setItem('stalker-offline-welcome-seen', 'true');
    setShowWelcome(false);
    // Відкриваємо меню (можна додати логіку)
    alert('Відкрийте бургер-меню (☰) у верхньому правому куті та натисніть "Завантажити дані КПК"');
  };

  if (!showWelcome) return null;

  return (
    <div className="offline-welcome-overlay">
      <div className="offline-welcome-modal">
        <div className="offline-welcome-icon">📱</div>
        
        <h2 className="offline-welcome-title">Вітаємо в додатку!</h2>
        
        <div className="offline-welcome-content">
          <p className="offline-welcome-text">
            <strong>Офлайн режим доступний!</strong>
          </p>
          <p className="offline-welcome-text">
            Ви можете завантажити всі картки та аудіо для перегляду без інтернету.
          </p>
          
          <div className="offline-welcome-info">
            <div className="offline-welcome-info-item">
              <span className="offline-welcome-info-icon">📦</span>
              <div>
                <strong>Розмір:</strong> ~150 МБ
              </div>
            </div>
            <div className="offline-welcome-info-item">
              <span className="offline-welcome-info-icon">🎵</span>
              <div>
                <strong>Включає:</strong> 48 карток + 96 аудіо
              </div>
            </div>
            <div className="offline-welcome-info-item">
              <span className="offline-welcome-info-icon">⏱️</span>
              <div>
                <strong>Час:</strong> 2-5 хвилин
              </div>
            </div>
          </div>

          <p className="offline-welcome-hint">
            💡 Завантажте дані через меню (☰) → "Завантажити дані КПК"
          </p>
        </div>

        <div className="offline-welcome-actions">
          <button onClick={handleOpenMenu} className="offline-welcome-button primary">
            Як завантажити?
          </button>
          <button onClick={handleClose} className="offline-welcome-button secondary">
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfflineWelcome;
