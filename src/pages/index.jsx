// src/pages/index.jsx - VERSÃO FINAL CORRIGIDA
import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import DoorEntrance from '@/components/3d/DoorEntrance';
import ParticleSystem from '@/components/3d/ParticleSystem';

// Hook de carregamento
function useResourceLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('🔧 Iniciando carregamento...');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15 + 5, 100);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            console.log('✅ Carregamento completo!');
            setIsLoaded(true);
          }, 500);
        }
        
        return newProgress;
      });
    }, 300);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsLoaded(true);
      console.log('⚠️ Timeout de segurança');
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return { progress, isLoaded };
}

// Hook seguro para dimensões
function useSafeDimensions() {
  const [dimensions, setDimensions] = useState({ 
    width: 0, 
    height: 0, 
    dpr: 1 
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
    };

    updateDimensions();
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return dimensions;
}

// Componente Canvas 100% seguro
function SafeCanvas({ children, onError }) {
  const canvasRef = useRef(null);
  const dimensions = useSafeDimensions();
  const [canvasReady, setCanvasReady] = useState(false);

  const handleCanvasCreated = useCallback((state) => {
    console.log('🔄 Canvas criado, configurando...');
    
    try {
      const { gl, canvas } = state;
      
      // VERIFICAÇÃO CRÍTICA
      if (!gl || !canvas) {
        console.warn('⚠️ Canvas ou contexto não disponíveis ainda');
        return;
      }

      // Configuração SEGURA
      gl.setPixelRatio(dimensions.dpr);
      
      console.log('✅ Canvas configurado:', {
        hasGL: !!gl,
        hasCanvas: !!canvas,
        width: dimensions.width,
        height: dimensions.height,
        dpr: dimensions.dpr
      });

      // Configurar tamanho do canvas APENAS se existir
      if (canvas) {
        // Usar requestAnimationFrame para garantir timing seguro
        requestAnimationFrame(() => {
          try {
            canvas.width = Math.floor(dimensions.width * dimensions.dpr);
            canvas.height = Math.floor(dimensions.height * dimensions.dpr);
            
            if (canvas.style) {
              canvas.style.width = `${dimensions.width}px`;
              canvas.style.height = `${dimensions.height}px`;
              canvas.style.position = 'fixed';
              canvas.style.top = '0';
              canvas.style.left = '0';
              canvas.style.zIndex = '10';
            }
            
            console.log('📏 Canvas dimensionado com segurança');
          } catch (err) {
            console.warn('⚠️ Erro ao dimensionar canvas:', err);
          }
        });
      }
      
      setCanvasReady(true);
      
    } catch (error) {
      console.error('❌ Erro na configuração do canvas:', error);
      onError?.(error);
    }
  }, [dimensions, onError]);

  // Se ainda não temos dimensões válidas, mostrar loader
  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#FF6B8B] border-t-transparent 
                        rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-white text-sm">Preparando ambiente...</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 1.5, 5], fov: 50 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        zIndex: 10,
      }}
      dpr={dimensions.dpr}
      onCreated={handleCanvasCreated}
      onError={(error) => {
        console.error('❌ Erro no Canvas:', error);
        onError?.(error);
      }}
      frameloop="always"
      linear
    >
      <color attach="background" args={['#000000']} />
      {canvasReady && children}
    </Canvas>
  );
}

// Componente de fallback minimalista
function MinimalFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 
                   flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Heitor & Livia
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Galeria Imersiva
        </p>
        
        <button
          onClick={() => window.location.href = '/gallery'}
          className="px-8 py-4 bg-gradient-to-r from-[#FF6B8B] to-[#D4AF37]
                   text-white font-bold text-lg rounded-full
                   hover:opacity-90 transition-opacity duration-300
                   shadow-lg"
        >
          Entrar na Galeria
        </button>
      </div>
    </div>
  );
}

// Componente principal - VERSÃO SIMPLIFICADA E SEGURA
export default function HomePage() {
  const [doorState, setDoorState] = useState('closed');
  const [sceneReady, setSceneReady] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { progress } = useResourceLoader();

  // Controle de montagem
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    if (!mounted) return;
    
    console.log('✅ Carregamento concluído');
    setSceneReady(true);
    
    setTimeout(() => {
      if (mounted) {
        setShowContent(true);
      }
    }, 300);
  }, [mounted]);

  const handleDoorClick = () => {
    if (doorState === 'closed') {
      setDoorState('opening');
      setTimeout(() => {
        setDoorState('open');
        setTimeout(() => {
          window.location.href = '/gallery';
        }, 800);
      }, 1500);
    }
  };

  const handleWebGLError = useCallback((error) => {
    console.warn('⚠️ Fallback ativado:', error.message);
    if (mounted) {
      setUseFallback(true);
    }
  }, [mounted]);

  // Verificação simples de WebGL
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.log('🎯 Usando fallback (WebGL não suportado)');
        setUseFallback(true);
      }
    } catch {
      console.log('🎯 Usando fallback (erro na verificação)');
      setUseFallback(true);
    }
  }, [mounted]);

  // Timeout de segurança
  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      if (!sceneReady && progress > 30) {
        console.log('⏰ Forçando carregamento por timeout');
        handleLoadingComplete();
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [sceneReady, progress, handleLoadingComplete, mounted]);

  // Script de proteção contra erros
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Proteger canvas operations
    const originalCreateElement = document.createElement;
    let canvasInstance = null;

    document.createElement = function(tagName) {
      const element = originalCreateElement.call(this, tagName);
      
      if (tagName.toLowerCase() === 'canvas') {
        canvasInstance = element;
        
        // Sobrescrever getContext para ser mais tolerante
        const originalGetContext = element.getContext;
        element.getContext = function(contextType) {
          try {
            return originalGetContext.call(this, contextType);
          } catch {
            return null;
          }
        };
        
        // Sobrescrever propriedades width/height
        Object.defineProperty(element, 'width', {
          get() {
            return this._width || 0;
          },
          set(value) {
            try {
              this._width = value;
            } catch {
              this._width = 0;
            }
          }
        });
        
        Object.defineProperty(element, 'height', {
          get() {
            return this._height || 0;
          },
          set(value) {
            try {
              this._height = value;
            } catch {
              this._height = 0;
            }
          }
        });
      }
      
      return element;
    };

    return () => {
      document.createElement = originalCreateElement;
    };
  }, []);

  // Estado inicial
  if (!mounted) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Loading */}
      {!sceneReady && (
        <LoadingOverlay
          manualProgress={progress}
          onLoaded={handleLoadingComplete}
          variant="simple"
        />
      )}

      {/* Conteúdo principal */}
      {sceneReady && (
        <AnimatePresence mode="wait">
          {!useFallback ? (
            <motion.div
              key="webgl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <SafeCanvas onError={handleWebGLError}>
                <Suspense fallback={
                  <Html center>
                    <div className="text-white text-sm">Carregando 3D...</div>
                  </Html>
                }>
                  {showContent && (
                    <>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[2, 3, 4]} intensity={0.8} color="#FF6B8B" />
                      <pointLight position={[-2, 3, 4]} intensity={0.4} color="#D4AF37" />
                      
                      <DoorEntrance
                        state={doorState}
                        onClick={handleDoorClick}
                        position={[0, 0, 0]}
                      />
                      
                      <Float speed={1}>
                        <Text
                          position={[0, 3, 0]}
                          fontSize={0.4}
                          color="#FFFFFF"
                          anchorX="center"
                          anchorY="middle"
                        >
                          Heitor & Livia
                        </Text>
                      </Float>
                      
                      <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.05}
                      />
                    </>
                  )}
                </Suspense>
              </SafeCanvas>
            </motion.div>
          ) : (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <MinimalFallback />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Botão de entrada */}
      {showContent && !useFallback && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40">
          <button
            onClick={handleDoorClick}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6B8B] to-[#D4AF37]
                     text-white font-bold rounded-full
                     hover:opacity-90 transition-opacity duration-300
                     shadow-lg"
          >
            {doorState === 'closed' ? 'Entrar' : 'Abrindo...'}
          </button>
        </div>
      )}

      {/* Overlay de gradiente */}
      {showContent && (
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-30" />
      )}
    </div>
  );
}

// Adicionar tipo de módulo para prevenir erros de importação
if (typeof window !== 'undefined') {
  // Verificação final de segurança
  window.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DOM completamente carregado');
    
    // Monitorar canvas
    const observer = new MutationObserver(() => {
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach((canvas, i) => {
        try {
          if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
        } catch {
          // Silenciar erros
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Limpar após 10s
    setTimeout(() => observer.disconnect(), 10000);
  });
}