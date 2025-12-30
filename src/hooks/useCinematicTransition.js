// src/hooks/useCinematicTransition.js
import { useState, useEffect, useCallback } from 'react';

export default function useCinematicTransition(duration = 2000) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionType, setTransitionType] = useState('fade');

  const transitions = {
    fade: {
      enter: 'opacity-0',
      enterActive: 'opacity-100 transition-opacity duration-700',
      exit: 'opacity-100',
      exitActive: 'opacity-0 transition-opacity duration-700'
    },
    slideUp: {
      enter: 'transform translate-y-10 opacity-0',
      enterActive: 'transform translate-y-0 opacity-100 transition-all duration-700 ease-out',
      exit: 'transform translate-y-0 opacity-100',
      exitActive: 'transform translate-y-10 opacity-0 transition-all duration-700 ease-in'
    },
    scale: {
      enter: 'transform scale-95 opacity-0',
      enterActive: 'transform scale-100 opacity-100 transition-all duration-700',
      exit: 'transform scale-100 opacity-100',
      exitActive: 'transform scale-95 opacity-0 transition-all duration-700'
    },
    romantic: {
      enter: 'transform scale-90 opacity-0 blur-sm',
      enterActive: 'transform scale-100 opacity-100 blur-0 transition-all duration-1000 ease-out',
      exit: 'transform scale-100 opacity-100 blur-0',
      exitActive: 'transform scale-90 opacity-0 blur-sm transition-all duration-1000 ease-in'
    }
  };

  const startTransition = useCallback((type = 'fade', customDuration) => {
    setIsTransitioning(true);
    setTransitionType(type);
    setTransitionProgress(0);

    const transitionDuration = customDuration || duration;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / transitionDuration, 1);
      
      setTransitionProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
      }
    };

    requestAnimationFrame(animate);
  }, [duration]);

  const getTransitionClasses = useCallback((phase) => {
    const transition = transitions[transitionType];
    if (!transition) return '';

    if (phase === 'enter') {
      return isTransitioning && transitionProgress < 0.5 
        ? transition.enter 
        : transition.enterActive;
    } else if (phase === 'exit') {
      return isTransitioning && transitionProgress >= 0.5 
        ? transition.exitActive 
        : transition.exit;
    }

    return '';
  }, [isTransitioning, transitionProgress, transitionType]);

  // Efeitos de partículas para transições românticas
  const createParticles = useCallback((count = 30) => {
    if (typeof window === 'undefined') return [];

    const particles = [];
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed pointer-events-none z-50';
      particle.innerHTML = ['❤️', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.fontSize = `${Math.random() * 20 + 10}px`;
      particle.style.opacity = '0';
      particle.style.transform = 'scale(0)';
      
      document.body.appendChild(particle);
      particles.push(particle);

      // Animação
      setTimeout(() => {
        particle.style.transition = 'all 1s ease-out';
        particle.style.opacity = '0.8';
        particle.style.transform = 'scale(1)';
        
        setTimeout(() => {
          particle.style.opacity = '0';
          particle.style.transform = 'scale(0) translateY(-50px)';
          
          setTimeout(() => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }, 1000);
        }, 1000);
      }, i * 50);
    }

    return particles;
  }, []);

  return {
    isTransitioning,
    transitionProgress,
    transitionType,
    startTransition,
    getTransitionClasses,
    createParticles,
    
    // Transições pré-definidas
    transitions: {
      romanticEntrance: () => {
        createParticles(50);
        startTransition('romantic', 1500);
      },
      heartTransition: () => {
        createParticles(100);
        startTransition('scale', 1200);
      },
      cinematicFade: () => startTransition('fade', 2000),
      slideUpEntrance: () => startTransition('slideUp', 1000)
    }
  };
}