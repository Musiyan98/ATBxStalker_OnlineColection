import { useState } from 'react';
import { submitFeedback } from '../utils/feedbackService';
import '../styles/FeedbackModal.css';

function FeedbackModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    message: '',
    category: 'feedback',
    needsResponse: false,
    contactInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      alert('Будь ласка, введіть повідомлення');
      return;
    }

    if (formData.needsResponse && !formData.contactInfo.trim()) {
      alert('Будь ласка, вкажіть контактну інформацію для зворотного зв\'язку');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitFeedback(formData);
      setSubmitStatus('success');
      
      // Очищаємо форму після успішної відправки
      setTimeout(() => {
        setFormData({
          message: '',
          category: 'feedback',
          needsResponse: false,
          contactInfo: ''
        });
        setSubmitStatus(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Закриваємо тільки якщо клік був саме на backdrop, а не на modal
    if (e.target.classList.contains('feedback-modal-backdrop')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-backdrop" onClick={handleBackdropClick}>
      <div className="feedback-modal">
        <div className="feedback-modal-header">
          <h2 className="feedback-modal-title">Відгуки / Пропозиції</h2>
          <button 
            className="feedback-modal-close" 
            onClick={onClose}
            aria-label="Закрити"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            </svg>
          </button>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Категорія
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="feedback">Фідбек</option>
              <option value="suggestion">Пропозиція</option>
              <option value="complaint">Скарга</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Що ви хочете сказати?
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              rows="6"
              placeholder="Введіть ваше повідомлення..."
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="needsResponse"
                checked={formData.needsResponse}
                onChange={handleChange}
                className="form-checkbox"
                disabled={isSubmitting}
              />
              <span className="form-checkbox-text">
                Потрібен зворотній зв'язок
              </span>
            </label>
          </div>

          {formData.needsResponse && (
            <div className="form-group form-group-slide-in">
              <label htmlFor="contactInfo" className="form-label">
                Як з вами зв'язатися?
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="form-input"
                placeholder="Email, телефон, Telegram..."
                disabled={isSubmitting}
                required={formData.needsResponse}
              />
            </div>
          )}

          {submitStatus === 'success' && (
            <div className="form-message form-message-success">
              ✓ Дякуємо! Ваш відгук успішно відправлено
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="form-message form-message-error">
              ✗ Помилка відправки. Спробуйте ще раз
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="form-button form-button-secondary"
              disabled={isSubmitting}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="form-button form-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Відправка...' : 'Відправити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackModal;
