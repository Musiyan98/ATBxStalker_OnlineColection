import { useState, useEffect } from 'react';
import '../styles/InstallPWA.css';

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Перевіряємо чи це мобільний пристрій
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Перевіряємо розмір екрану (додаткова перевірка)
    const isSmallScreen = window.innerWidth <= 1024;
    
    // Показуємо тільки на мобільних
    if (!isMobile && !isSmallScreen) {
      return;
    }

    // Перевіряємо чи додаток вже встановлено
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Додаток вже встановлено
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Реєструємо Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('✅ Service Worker registered'))
        .catch((err) => console.error('❌ Service Worker registration failed:', err));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div className="install-pwa-banner">
      <div className="install-pwa-content">
        <div className="install-pwa-icon">📱</div>
        <div className="install-pwa-text">
          <strong>Встановити додаток</strong>
          <p>Всі картки та аудіо будуть доступні офлайн (~150 МБ)</p>
        </div>
        <div className="install-pwa-actions">
          <button 
            onClick={handleInstallClick} 
            className="install-pwa-button"
            disabled={isInstalling}
          >
            {isInstalling ? 'Встановлення...' : 'Встановити'}
          </button>
          <button onClick={handleDismiss} className="install-pwa-dismiss">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPWA;
