import '../styles/Footer.css';

function Footer({ onOpenFeedback }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="disclaimer">
          <p className="disclaimer-title">Дисклеймер</p>
          <p className="disclaimer-text">
            Це авторський фанатський сайт, створений з любов'ю до неймовірного ком'юніті S.T.A.L.K.E.R.
          </p>
          <p className="disclaimer-text">
            Сайт не має відношення до GSC Game World та мережі магазинів АТБ.
          </p>
        </div>
        <div className="footer-links">
          <a 
            href="https://www.stalker2.com/uk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Офіційний сайт гри
          </a>
          <span className="footer-separator">•</span>
          <a 
            href="https://s2-atb.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Офіційна акція АТБ
          </a>
          <span className="footer-separator">•</span>
          <button 
            onClick={onOpenFeedback}
            className="footer-link footer-link-button"
          >
            Відгуки / Пропозиції
          </button>
        </div>
        <div className="footer-copyright">
          <p>
            © 2026 • 
            <span className="footer-heart">
              <svg className="radiation-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18">
                <g transform="translate(50,50)" fill="currentColor">
                  <circle r="11"/>
                  <path d="M-13,-44 A46,46 0 0,1 13,-44 L0,-15 Z" />
                  <path d="M-13,-44 A46,46 0 0,1 13,-44 L0,-15 Z" transform="rotate(120)"/>
                  <path d="M-13,-44 A46,46 0 0,1 13,-44 L0,-15 Z" transform="rotate(240)"/>
                </g>
              </svg>
              Зроблено з ❤️ для сталкерів
              <svg className="radiation-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18">
                <g transform="translate(50,50)" fill="currentColor">
                  <circle r="11"/>
                  <path d="M-13,-44 A46,46 0 0,1 13,-44 L0,-15 Z" />
                  <path d="M-13,-44 A46,46 0 0,1 13,-44 L0,-15 Z" transform="rotate(120)"/>
                  <path d="M-13,-44 A46,46 0 0,1 13,-44 L0,-15 Z" transform="rotate(240)"/>
                </g>
              </svg>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
