import { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import '../styles/CardDetail.css';

function CardDetail({ card, onBack }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="card-detail">
      <button className="back-button" onClick={onBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#F2E8D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Назад до колекції</span>
      </button>

      <div className="detail-container">
        <div className="detail-image-section">
          <img 
            src={card.image} 
            alt={card.title} 
            className="detail-image"
            loading="eager"
            fetchpriority="high"
          />
          <div className="detail-title">
            <span className="detail-number">#{card.number}</span>
            <h1>{card.title}</h1>
          </div>
        </div>

        <div className="detail-content-section">
          <nav className="tabs-nav">
            {card.tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab-button ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <img src="pda-icon.png" alt="" className="tab-icon" loading="lazy" />
                <span className="tab-label">{tab.label}</span>
                {tab.badge && <span className="tab-badge"></span>}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {card.tabs[activeTab].audio && (
              <AudioPlayer 
                key={activeTab}
                audioUrl={card.tabs[activeTab].audio}
                title={card.tabs[activeTab].label}
              />
            )}
            
            <div className="content-text">
              <div dangerouslySetInnerHTML={{ __html: card.tabs[activeTab].content }} />
            </div>

            {card.officialLink && (
              <div className="official-link-section">
                <a 
                  href={card.officialLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="official-link"
                >
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M9.71679 3.98659C10.1172 3.48226 10.8828 3.48226 11.2832 3.98659L13.9757 7.37824C14.496 8.0336 14.0292 9 13.1925 9H7.80751C6.97075 9 6.50404 8.0336 7.0243 7.37824L9.71679 3.98659Z" fill="#ff9000"/>
                    <path d="M14.7168 10.9866C15.1172 10.4823 15.8828 10.4823 16.2832 10.9866L18.9757 14.3782C19.496 15.0336 19.0292 16 18.1925 16H12.8075C11.9708 16 11.504 15.0336 12.0243 14.3782L14.7168 10.9866Z" fill="#ff9000"/>
                    <path d="M4.71679 10.9866C5.11715 10.4823 5.88285 10.4823 6.28321 10.9866L8.9757 14.3782C9.49596 15.0336 9.02925 16 8.19249 16H2.80751C1.97075 16 1.50404 15.0336 2.0243 14.3782L4.71679 10.9866Z" fill="#ff9000"/>
                  </svg>
                  <span>Офіційна сторінка картки</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;
