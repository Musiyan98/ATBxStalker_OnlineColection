import { useState } from 'react';
import '../styles/Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img 
            src="/public/stalker-logo.png" 
            alt="S.T.A.L.K.E.R. 2: Heart of Chornobyl" 
            className="logo-image"
            loading="eager"
            fetchpriority="high"
            width="200"
            height="60"
          />
        </div>
        
        <h1 className="header-title">Онлайн колекція S.T.A.L.K.E.R x ATB</h1>
        
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Меню"
        >
          <svg className="menu-toggle-bg" width="52" height="30" viewBox="0 0 52 30" fill="none">
            <path d="M8.34375 0V1.66699H2.10938V28.333H8.34375V30H0V0H8.34375ZM52 30H42.7725V28.333H50.1094V1.66699H42.7725V0H52V30Z" fill="#F2E8D9"/>
          </svg>
          <svg className="menu-toggle-icon" width="52" height="30" viewBox="0 0 52 30" fill="none">
            <path d="M27.166 14H34.166V16H27.166V23H25.166V16H18.166V14H25.166V7H27.166V14Z" fill="#F2E8D9"/>
          </svg>
        </button>

        {menuOpen && (
          <nav className="dropdown-menu">
            <ul className="menu-list">
              <li className="menu-item">
                <a 
                  href="https://s2-atb.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="menu-link"
                >
                  <svg width="9" height="30" viewBox="0 0 9 30" fill="none">
                    <path d="M8.34375 1.66699H2.10938V28.333H8.34375V30H0V0H8.34375V1.66699Z" fill="#F2E8D9"/>
                  </svg>
                  <div className="menu-link-content">
                    <span className="menu-link-title">Офіційна акція</span>
                    <span className="menu-link-subtitle">s2-atb.com</span>
                  </div>
                  <svg width="9" height="30" viewBox="0 0 9 30" fill="none">
                    <path d="M0 1.66699H6.23438V28.333H0V30H8.34375V0H0V1.66699Z" fill="#F2E8D9"/>
                  </svg>
                </a>
              </li>
              <li className="menu-item">
                <a 
                  href="https://s2-atb-checklist.web.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="menu-link"
                >
                  <svg width="9" height="30" viewBox="0 0 9 30" fill="none">
                    <path d="M8.34375 1.66699H2.10938V28.333H8.34375V30H0V0H8.34375V1.66699Z" fill="#F2E8D9"/>
                  </svg>
                  <div className="menu-link-content">
                    <span className="menu-link-title">Чеклист карток</span>
                    <span className="menu-link-subtitle">Облік та обмін</span>
                  </div>
                  <svg width="9" height="30" viewBox="0 0 9 30" fill="none">
                    <path d="M0 1.66699H6.23438V28.333H0V30H8.34375V0H0V1.66699Z" fill="#F2E8D9"/>
                  </svg>
                </a>
              </li>
              <li className="menu-item">
                <a 
                  href="https://www.stalker2.com/uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="menu-link"
                >
                  <svg width="9" height="30" viewBox="0 0 9 30" fill="none">
                    <path d="M8.34375 1.66699H2.10938V28.333H8.34375V30H0V0H8.34375V1.66699Z" fill="#F2E8D9"/>
                  </svg>
                  <div className="menu-link-content">
                    <span className="menu-link-title">Офіційний сайт гри</span>
                    <span className="menu-link-subtitle">stalker2.com</span>
                  </div>
                  <svg width="9" height="30" viewBox="0 0 9 30" fill="none">
                    <path d="M0 1.66699H6.23438V28.333H0V30H8.34375V0H0V1.66699Z" fill="#F2E8D9"/>
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
