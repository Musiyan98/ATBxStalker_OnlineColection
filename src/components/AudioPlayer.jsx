import { useState, useRef, useEffect } from 'react';
import '../styles/AudioPlayer.css';

function AudioPlayer({ audioUrl, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      console.warn('Audio failed to load:', audioUrl);
      setError(true);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  // Скидаємо стан при зміні аудіо
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(false);
    
    const audio = audioRef.current;
    if (audio) {
      audio.load(); // Перезавантажуємо аудіо
    }
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * duration;
    audio.currentTime = newTime;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Якщо аудіо не завантажилось (blob URL недоступний), показуємо повідомлення
  if (error) {
    return (
      <div className="audio-player audio-player-error">
        <p>⚠️ Аудіо недоступне (blob URL з оригінального сайту)</p>
        <p className="audio-note">Для повного функціоналу завантажте аудіо файли локально</p>
      </div>
    );
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />
      
      <div className="audio-controls">
        <button 
          className="play-button" 
          onClick={togglePlay}
          aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="4" y="3" width="3" height="12" fill="white"/>
              <rect x="11" y="3" width="3" height="12" fill="white"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15 7.25C16.33 8.03 16.33 9.96 15 10.74L3 17.72C1.66 18.5 0 17.53 0 15.98V2.01C0 0.46 1.66 -0.5 3 0.27L15 7.25Z" fill="white"/>
            </svg>
          )}
        </button>

        <div className="progress-container">
          <div 
            className="progress-bar" 
            onClick={handleProgressClick}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
            <div 
              className="progress-handle" 
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
