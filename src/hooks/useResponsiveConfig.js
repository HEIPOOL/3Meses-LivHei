import { useEffect, useState } from 'react';

const useResponsiveConfig = () => {
  const [config, setConfig] = useState({
    // Configurações para desktop (padrão)
    camera: {
      fov: 75,
      position: { x: 0, y: 0, z: 5 },
      near: 0.1,
      far: 1000,
    },
    controls: {
      sensitivity: 1.0,
      zoomSpeed: 1.0,
      enableZoom: true,
      enablePan: true,
      enableRotate: true,
    },
    renderer: {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
    },
    gallery: {
      itemScale: 1,
      spacing: 2,
      gridColumns: 3,
      animationSpeed: 1.0,
      enableShadows: true,
      maxItemsVisible: 12,
    }
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      
      if (width <= 768) { // Mobile
        setConfig({
          camera: {
            fov: 60,
            position: { x: 0, y: 0, z: 3 },
            near: 0.1,
            far: 500,
          },
          controls: {
            sensitivity: 0.7,
            zoomSpeed: 0.5,
            enableZoom: false,
            enablePan: false,
            enableRotate: true,
          },
          renderer: {
            pixelRatio: Math.min(window.devicePixelRatio, 1.5),
            antialias: true,
          },
          gallery: {
            itemScale: 0.7,
            spacing: 1.2,
            gridColumns: 1,
            animationSpeed: 0.8,
            enableShadows: false,
            maxItemsVisible: 6,
          }
        });
      } else if (width <= 1024) { // Tablet
        setConfig({
          camera: {
            fov: 70,
            position: { x: 0, y: 0, z: 4 },
            near: 0.1,
            far: 800,
          },
          controls: {
            sensitivity: 0.85,
            zoomSpeed: 0.75,
            enableZoom: true,
            enablePan: true,
            enableRotate: true,
          },
          renderer: {
            pixelRatio: Math.min(window.devicePixelRatio, 1.8),
            antialias: true,
          },
          gallery: {
            itemScale: 0.85,
            spacing: 1.5,
            gridColumns: 2,
            animationSpeed: 0.9,
            enableShadows: true,
            maxItemsVisible: 9,
          }
        });
      } else { // Desktop
        setConfig({
          camera: {
            fov: 75,
            position: { x: 0, y: 0, z: 5 },
            near: 0.1,
            far: 1000,
          },
          controls: {
            sensitivity: 1.0,
            zoomSpeed: 1.0,
            enableZoom: true,
            enablePan: true,
            enableRotate: true,
          },
          renderer: {
            pixelRatio: Math.min(window.devicePixelRatio, 2),
            antialias: true,
          },
          gallery: {
            itemScale: 1,
            spacing: 2,
            gridColumns: 3,
            animationSpeed: 1.0,
            enableShadows: true,
            maxItemsVisible: 12,
          }
        });
      }
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return config;
};

export default useResponsiveConfig;