// src/components/ui/CinematicOverlay.jsx
import { useEffect, useState } from 'react';

export default function CinematicOverlay({ stage }) {
  const [effects, setEffects] = useState([]);
  
  useEffect(() => {
    if (stage === 'opening') {
      // Ativar efeitos especiais
      setEffects(['particles', 'glow', 'sound']);
      
      // Efeito de luzes
      const interval = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        createLightEffect(x, y);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [stage]);
  
  const createLightEffect = (x, y) => {
    const light = document.createElement('div');
    light.className = 'absolute w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-ping';
    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    document.body.appendChild(light);
    
    setTimeout(() => light.remove(), 1000);
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Vinheta cinematográfica */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30"></div>
      
      {/* Flare de lente */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 
                    bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent
                    rounded-full blur-3xl"></div>
      
      {/* Partículas */}
      {effects.includes('particles') && (
        <div className="particle-system">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 bg-[var(--color-accent)] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      {/* Mensagens emocionais aleatórias */}
      {stage === 'open' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <p className="font-cinzel text-white text-xl animate-pulse">
            Cada momento contigo é uma obra de arte...
          </p>
        </div>
      )}
    </div>
  );
}