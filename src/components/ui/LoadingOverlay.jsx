// src/components/ui/LoadingOverlay.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hook personalizado para detectar carregamento de recursos
function useAssetLoader() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [stages, setStages] = useState([]);

  useEffect(() => {
    // Simulação de estágios de carregamento
    const loadingStages = [
      { label: 'Inicializando...', duration: 500 },
      { label: 'Carregando modelos 3D...', duration: 1500 },
      { label: 'Processando texturas...', duration: 1000 },
      { label: 'Compilando shaders...', duration: 800 },
      { label: 'Otimizando cena...', duration: 700 },
      { label: 'Pronto!', duration: 300 }
    ];

    setStages(loadingStages);
    
    let totalDuration = loadingStages.reduce((sum, stage) => sum + stage.duration, 0);
    let elapsed = 0;
    let currentStageIndex = 0;

    const interval = setInterval(() => {
      elapsed += 100; // Atualiza a cada 100ms
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Atualizar estágio atual
      if (currentStageIndex < loadingStages.length - 1) {
        const stageEndTime = loadingStages
          .slice(0, currentStageIndex + 1)
          .reduce((sum, stage) => sum + stage.duration, 0);
        
        if (elapsed >= stageEndTime) {
          currentStageIndex++;
        }
      }

      if (newProgress >= 100) {
        clearInterval(interval);
        setLoaded(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return { progress, loaded, stages };
}

// Componente principal
export default function LoadingOverlay({ 
  onLoaded, 
  onSkip,
  variant = 'cinematic',
  manualProgress = null
}) {
  const [stage, setStage] = useState('loading');
  const [manualSkip, setManualSkip] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  
  // Usar carregador automático OU progresso manual
  const assetLoader = useAssetLoader();
  const progress = manualProgress !== null ? manualProgress : assetLoader.progress;
  const loaded = manualProgress !== null ? manualProgress >= 100 : assetLoader.loaded;
  
  const loadingStages = [
    'Inicializando experiência romântica...',
    'Carregando modelos 3D...',
    'Aplicando texturas e materiais...',
    'Preparando sistema de partículas...',
    'Otimizando iluminação...',
    'Sintonizando atmosfera...',
    'Preparando para a magia...',
    'Quase lá...'
  ];

  // Progresso animado suave
  const [displayProgress, setDisplayProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayProgress < progress) {
        setDisplayProgress(prev => Math.min(prev + 1, progress));
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [displayProgress, progress]);

  // Atualizar estágio atual
  useEffect(() => {
    const stageIndex = Math.floor((displayProgress / 100) * (loadingStages.length - 1));
    setCurrentStageIndex(stageIndex);
  }, [displayProgress]);

  // Lógica de transição
  useEffect(() => {
    if (manualSkip) {
      setStage('skipped');
      setTimeout(() => onLoaded?.(), 300);
      return;
    }

    if (loaded && displayProgress >= 95 && stage === 'loading') {
      setStage('transitioning');
      setTimeout(() => {
        setStage('complete');
        setTimeout(() => onLoaded?.(), 800);
      }, 1200);
    }
  }, [loaded, displayProgress, manualSkip, stage, onLoaded]);

  // Fallback se WebGL não disponível
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebGLAvailable(!!gl);
  }, []);

  if (!webGLAvailable) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a0b0e] to-[#0d0714] 
                     flex items-center justify-center z-50"
           role="status"
           aria-live="polite">
        <div className="text-center max-w-md p-8">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="283"
                strokeDashoffset={283 - (displayProgress / 100) * 283}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B8B" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-playfair text-white">
                {Math.round(displayProgress)}%
              </span>
            </div>
          </div>
          <p className="text-white font-inter mb-2">{loadingStages[currentStageIndex]}</p>
          <p className="text-gray-400 text-sm mb-6">
            WebGL não disponível. Carregando experiência simplificada...
          </p>
          <button
            onClick={() => setManualSkip(true)}
            className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] 
                     rounded-full hover:bg-[#D4AF37] hover:text-black 
                     transition-colors"
          >
            Entrar agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Carregando: ${Math.round(displayProgress)}% — ${loadingStages[currentStageIndex]}`}
      </div>

      <AnimatePresence>
        {(stage === 'loading' || stage === 'transitioning') && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-gradient-to-br from-[#1a0b0e]/95 via-black/90 to-[#0d0714]/95 
                       backdrop-blur-sm flex flex-col items-center justify-center z-50"
            role="dialog"
            aria-label="Tela de carregamento"
          >
            {/* Efeitos visuais de fundo */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Partículas CSS simples */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#FF6B8B] rounded-full"
                  initial={{ 
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0
                  }}
                  animate={{ 
                    opacity: [0, 0.7, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center max-w-lg px-4">
              {/* Logo ou Título */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-playfair text-white mb-2">
                  Heitor & Livia
                </h1>
                <p className="text-gray-300 font-inter">
                  Galeria Imersiva 3D
                </p>
              </motion.div>

              {/* Anel de progresso */}
              <div className="relative w-48 h-48 mx-auto mb-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (displayProgress / 100) * 283}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(255, 107, 139, 0.5))'
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B8B" />
                        <stop offset="100%" stopColor="#D4AF37" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                {/* Percentual */}
                <motion.div
                  key={Math.floor(displayProgress)}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-5xl font-playfair text-white">
                    {Math.round(displayProgress)}%
                  </span>
                </motion.div>

                {/* Anel interno pulsante */}
                {displayProgress < 100 && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-6 rounded-full border-2 border-[#D4AF37]/30"
                  />
                )}
              </div>

              {/* Label atual */}
              <motion.div
                key={currentStageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <p className="text-xl font-inter text-white mb-2">
                  {loadingStages[currentStageIndex]}
                </p>
                <p className="text-gray-400 font-inter text-sm">
                  {displayProgress < 30 && "✨ Preparando a magia do amor..."}
                  {displayProgress >= 30 && displayProgress < 60 && "💖 Criando momentos especiais..."}
                  {displayProgress >= 60 && displayProgress < 90 && "🌟 Quase tudo pronto..."}
                  {displayProgress >= 90 && "🎉 Abrindo as portas do romance..."}
                </p>
              </motion.div>

              {/* Barra de progresso linear */}
              <div className="max-w-md mx-auto mb-8">
                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-[#FF6B8B] via-[#D4AF37] to-[#FF6B8B] bg-[length:200%_100%] animate-shimmer"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Botão de skip */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: displayProgress > 10 ? 1 : 0 }}
                onClick={() => setManualSkip(true)}
                className="px-8 py-3 border-2 border-[#D4AF37]/50 text-[#D4AF37] 
                         rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-50
                         backdrop-blur-sm"
                style={{
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                }}
              >
                <span className="flex items-center gap-2">
                  <span>Entrar manualmente</span>
                  <span>→</span>
                </span>
              </motion.button>
            </div>

            {/* Rodapé */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 text-center"
            >
              <p className="text-gray-500 text-sm font-inter">
                Carregando experiência romântica imersiva
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transição de abertura */}
      <AnimatePresence>
        {stage === 'transitioning' && (
          <>
            <motion.div
              initial={{ scaleX: 1, scaleY: 1 }}
              animate={{ scaleX: 0, scaleY: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.87, 0, 0.13, 1] 
              }}
              style={{ 
                originX: 0.5,
                originY: 0.5,
                background: 'radial-gradient(circle, #FF6B8B 0%, #D4AF37 100%)'
              }}
              className="fixed inset-0 z-40 pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-playfair text-white text-center"
              >
                Bem-vindo ao Romance
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}