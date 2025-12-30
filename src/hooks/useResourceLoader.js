// src/hooks/useResourceLoader.js
import { useState, useEffect } from 'react';
import { useFontLoader } from './useFontLoader';

export function useResourceLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stage, setStage] = useState('inicializando');
  
  const { fontsLoaded, fontProgress } = useFontLoader();

  useEffect(() => {
    console.log('useResourceLoader iniciado');
    console.log('Estado das fontes:', { fontsLoaded, fontProgress });

    const stages = [
      { name: 'fontes', weight: 30, duration: 1500 },
      { name: 'modelos 3D', weight: 40, duration: 2000 },
      { name: 'texturas', weight: 20, duration: 1000 },
      { name: 'sistema de partículas', weight: 10, duration: 500 }
    ];

    let currentProgress = 0;
    let currentStageIndex = 0;

    const updateProgress = (increment) => {
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);
      
      // Atualizar estágio baseado no progresso
      const stageProgress = currentProgress / 100;
      const stageIndex = Math.floor(stageProgress * (stages.length - 1));
      if (stageIndex !== currentStageIndex) {
        currentStageIndex = stageIndex;
        setStage(stages[stageIndex]?.name || 'finalizando');
      }
      
      console.log(`Progresso: ${currentProgress}% | Estágio: ${stage}`);
      
      if (currentProgress >= 100 && fontsLoaded) {
        console.log('Todos os recursos carregados!');
        setIsLoaded(true);
      }
    };

    // Progresso das fontes
    const fontInterval = setInterval(() => {
      if (fontsLoaded) {
        clearInterval(fontInterval);
        updateProgress(30); // Fontes completas = 30%
      } else {
        // Progresso parcial baseado no fontProgress
        const fontContribution = (fontProgress / 100) * 30;
        const currentFontProgress = Math.min(fontContribution, 30);
        setProgress(prev => Math.max(prev, currentFontProgress));
      }
    }, 100);

    // Simular outros estágios
    let simulatedProgress = 0;
    const simulationInterval = setInterval(() => {
      if (simulatedProgress >= 70) {
        clearInterval(simulationInterval);
        return;
      }
      
      simulatedProgress += Math.random() * 5 + 1;
      const totalProgress = Math.min(
        (fontProgress / 100) * 30 + simulatedProgress,
        100
      );
      setProgress(totalProgress);
      
      if (totalProgress >= 100 && fontsLoaded) {
        clearInterval(simulationInterval);
        clearInterval(fontInterval);
        console.log('Carregamento simulado completo');
        setIsLoaded(true);
      }
    }, 200);

    // Timeout de segurança
    const safetyTimeout = setTimeout(() => {
      console.log('Timeout de segurança ativado, forçando carregamento');
      clearInterval(fontInterval);
      clearInterval(simulationInterval);
      setProgress(100);
      setIsLoaded(true);
    }, 8000);

    return () => {
      clearInterval(fontInterval);
      clearInterval(simulationInterval);
      clearTimeout(safetyTimeout);
    };
  }, [fontsLoaded, fontProgress]);

  return { progress, isLoaded, stage };
}