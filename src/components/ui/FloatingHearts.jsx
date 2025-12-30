// src/components/ui/FloatingHearts.jsx
import { useEffect, useState } from 'react';

export function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const createHeart = () => {
      const heart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      };
      return heart;
    };

    // Criar hearts iniciais
    const initialHearts = Array.from({ length: 15 }, createHeart);
    setHearts(initialHearts);

    // Adicionar novos hearts periodicamente
    const interval = setInterval(() => {
      setHearts(prev => {
        const newHearts = [...prev.slice(-20)]; // Manter apenas últimos 20
        newHearts.push(createHeart());
        return newHearts;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-hearts fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-[var(--color-passion-pink)] opacity-0"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animation: `float-heart ${heart.duration}s linear ${heart.delay}s infinite`,
            top: '100vh',
          }}
        >
          ❤️
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float-heart {
          0% {
            opacity: 0;
            transform: translateY(100vh) rotate(0deg) scale(0.5);
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) rotate(360deg) scale(1);
          }
        }
        
        .floating-hearts {
          filter: drop-shadow(0 0 5px rgba(255, 107, 139, 0.5));
        }
      `}</style>
    </div>
  );
}