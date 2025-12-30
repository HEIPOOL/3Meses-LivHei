// src/components/ui/ControlsPanel.jsx
import { useState, useEffect } from 'react';
import { isMobile, isIOS } from 'react-device-detect';

export default function ControlsPanel({ onPresentMode, musicEnabled, onMusicToggle, gyroAvailable }) {
  const [touchMode, setTouchMode] = useState(isMobile);
  const [gyroActive, setGyroActive] = useState(false);
  
  useEffect(() => {
    if (isIOS) {
      // Otimizações específicas para iOS
      document.documentElement.style.webkitTouchCallout = 'none';
      document.documentElement.style.webkitUserSelect = 'none';
    }
    
    // Suporte a gestos de toque
    const handleTouch = (e) => {
      if (e.touches.length === 2) {
        // Pinch to zoom
        e.preventDefault();
      }
    };
    
    window.addEventListener('touchstart', handleTouch, { passive: false });
    
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);
  
  const handleGyroToggle = async () => {
    if (gyroAvailable && !gyroActive) {
      try {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            setGyroActive(true);
            window.dispatchEvent(new Event('gyro-enabled'));
          }
        } else {
          setGyroActive(true);
        }
      } catch (error) {
        console.error('Erro ao ativar giroscópio:', error);
      }
    } else {
      setGyroActive(false);
    }
  };
  
  return (
    <div className={`absolute ${isMobile ? 'bottom-4 left-4' : 'bottom-8 right-8'} 
                    flex flex-col gap-3 z-30`}>
      
      {/* Botão modo presente */}
      <button
        onClick={onPresentMode}
        className="px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]
                   text-white rounded-full shadow-lg hover:scale-105 transition-transform
                   flex items-center gap-2 font-cinzel"
      >
        <span className="text-xl">🎁</span>
        Modo Presente
      </button>
      
      {/* Controle de música */}
      <button
        onClick={() => onMusicToggle(!musicEnabled)}
        className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70"
      >
        {musicEnabled ? '🔊' : '🔇'}
      </button>
      
      {/* Controle giroscópio (iPhone) */}
      {gyroAvailable && (
        <button
          onClick={handleGyroToggle}
          className={`p-3 rounded-full ${gyroActive ? 'bg-[var(--color-secondary)]' : 'bg-black/50'}`}
        >
          📱
        </button>
      )}
      
      {/* Dicas de toque para mobile */}
      {isMobile && (
        <div className="mt-4 p-3 bg-black/30 backdrop-blur-sm rounded-lg">
          <p className="text-white text-sm">
            <strong>Toque:</strong> Arraste para navegar
            <br/>
            <strong>Toque duplo:</strong> Focar quadro
            <br/>
            <strong>Pinch:</strong> Zoom
          </p>
        </div>
      )}
    </div>
  );
}