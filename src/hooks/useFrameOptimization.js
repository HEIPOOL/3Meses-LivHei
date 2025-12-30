// src/hooks/useFrameOptimization.js
import { useEffect, useState } from 'react';

export function useFrameOptimization() {
  const [quality, setQuality] = useState('high');
  
  useEffect(() => {
    const updateQuality = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const memory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      if (isMobile || memory > 50000000) {
        setQuality('medium');
      } else {
        setQuality('high');
      }
    };
    
    updateQuality();
    window.addEventListener('resize', updateQuality);
    
    return () => window.removeEventListener('resize', updateQuality);
  }, []);
  
  return {
    quality,
    // Configurações baseadas na qualidade
    settings: {
      high: {
        shadows: true,
        antialias: true,
        textureResolution: 2048,
        particleCount: 100,
        ornamentDetails: true
      },
      medium: {
        shadows: false,
        antialias: false,
        textureResolution: 1024,
        particleCount: 30,
        ornamentDetails: false
      },
      low: {
        shadows: false,
        antialias: false,
        textureResolution: 512,
        particleCount: 10,
        ornamentDetails: false
      }
    }[quality]
  };
}