import '../styles/Footer.css';

function Footer() {
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
        </div>
        <div className="footer-copyright">
          <p>© 2024 Фанатський проект • Зроблено з ❤️ для сталкерів</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
