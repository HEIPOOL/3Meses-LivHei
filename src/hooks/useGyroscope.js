// src/hooks/useGyroscope.js
import { useState, useEffect, useCallback } from 'react';

export default function useGyroscope() {
  const [gyroAvailable, setGyroAvailable] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleDeviceOrientation = useCallback((event) => {
    if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
      setGyroData({
        alpha: event.alpha,  // Rotação ao redor do eixo z (0-360)
        beta: event.beta,    // Rotação ao redor do eixo x (-180 a 180)
        gamma: event.gamma   // Rotação ao redor do eixo y (-90 a 90)
      });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          setGyroActive(true);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
          return true;
        }
      } else {
        // Navegadores que não precisam de permissão
        setPermissionGranted(true);
        setGyroActive(true);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        return true;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão do giroscópio:', error);
      return false;
    }
  }, [handleDeviceOrientation]);

  const stopGyroscope = useCallback(() => {
    setGyroActive(false);
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, [handleDeviceOrientation]);

  useEffect(() => {
    // Verificar suporte a giroscópio
    if (typeof window !== 'undefined') {
      const hasGyro = 'DeviceOrientationEvent' in window;
      setGyroAvailable(hasGyro);

      // iOS 13+ requer permissão explícita
      if (hasGyro && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS com permissão necessária
        console.log('iOS 13+ detectado - Permissão de giroscópio necessária');
      } else if (hasGyro) {
        // Navegadores que não precisam de permissão
        console.log('Giroscópio disponível sem permissão explícita');
      }

      // Limpar evento ao desmontar
      return () => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      };
    }
  }, [handleDeviceOrientation]);

  return {
    gyroAvailable,
    gyroActive,
    gyroData,
    permissionGranted,
    requestPermission,
    stopGyroscope,
    // Função conveniente para toggle
    toggleGyroscope: async () => {
      if (gyroActive) {
        stopGyroscope();
        return false;
      } else {
        return await requestPermission();
      }
    }
  };
}