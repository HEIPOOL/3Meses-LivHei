// src/components/ui/CinematicIntro.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CinematicIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      () => setStep(1), // Título
      () => setStep(2), // Subtítulo
      () => setStep(3), // Nomes
      () => {
        setTimeout(() => {
          setShowIntro(false);
          document.body.style.overflow = 'auto';
        }, 2000);
      }
    ];

    sequence.forEach((action, index) => {
      setTimeout(action, index * 3000);
    });

    // Bloquear scroll durante intro
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      >
        {/* Overlay com textura de filme */}
        <div className="absolute inset-0"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238B0000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
             }}
        />
        
        {/* Conteúdo da intro */}
        <div className="relative z-10 text-center">
          {/* Passo 1: Título */}
          {step >= 1 && (
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
              className="font-cinzel text-6xl md:text-8xl text-white mb-8"
              style={{
                textShadow: '0 0 30px rgba(255, 107, 139, 0.8)'
              }}
            >
              Galeria do Amor
            </motion.h1>
          )}
          
          {/* Passo 2: Subtítulo */}
          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="font-playfair text-2xl md:text-3xl text-[var(--color-text-soft)] mb-12"
            >
              Uma jornada imersiva através de memórias eternas
            </motion.p>
          )}
          
          {/* Passo 3: Nomes */}
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, type: "spring" }}
              className="relative"
            >
              <h2 className="font-dancing text-5xl md:text-7xl bg-gradient-to-r from-[var(--color-text-soft)] to-[var(--color-text-golden)] bg-clip-text text-transparent">
                Heitor & Livia
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[var(--color-passion-pink)]/20 to-transparent blur-xl" />
            </motion.div>
          )}
          
          {/* Efeito de lente flare */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-passion-pink)]/10 to-transparent rounded-full blur-3xl" />
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 9, ease: "linear" }}
            className="h-full bg-gradient-to-r from-[var(--color-love-red)] to-[var(--color-passion-pink)]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}