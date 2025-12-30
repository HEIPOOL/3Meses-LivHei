// src/components/ui/RomanticBackground.jsx
import { useEffect, useState } from 'react';

export default function RomanticBackground({ enabled = true, intensity = 'medium' }) {
  const [hearts, setHearts] = useState([]);
  
  useEffect(() => {
    if (!enabled) return;
    
    const heartCounts = {
      low: 10,
      medium: 25,
      high: 50
    };
    
    const count = heartCounts[intensity] || heartCounts.medium;
    const newHearts = [];
    
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 25,
        duration: 10 + Math.random() * 15,
        delay: Math.random() * 5,
        opacity: 0.2 + Math.random() * 0.6
      });
    }
    
    setHearts(newHearts);
  }, [enabled, intensity]);

  if (!enabled) return null;

  return (
    <div className="floating-hearts fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animation: `${heart.duration}s linear ${heart.delay}s infinite float-heart`,
            top: '100vh',
            opacity: heart.opacity,
            color: 'var(--color-passion-pink)',
            filter: `drop-shadow(0 0 8px rgba(255, 107, 139, ${heart.opacity * 0.5}))`
          }}
          className="absolute text-[var(--color-passion-pink)]"
        >
          ❤️
        </div>
      ))}
      
      {/* Efeitos de brilho suave */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-[var(--color-love-red)]/20 to-[var(--color-passion-pink)]/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[var(--color-golden-glow)]/15 to-[var(--color-romantic-gold)]/15 blur-3xl" />
      </div>
      
      {/* Overlay de profundidade */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)'
        }}
      />
    </div>
  );
}