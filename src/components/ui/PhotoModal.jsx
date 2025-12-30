// src/components/ui/PhotoModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

export default function PhotoModal({ photo, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative max-w-6xl max-h-[90vh] bg-[var(--color-bg-muted)] rounded-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="relative h-96 lg:h-full">
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
            
            <div className="p-8 lg:p-12 overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl hover:text-[var(--color-accent)]"
              >
                ×
              </button>
              
              <h2 className="font-cinzel text-4xl text-white mb-4">{photo.title}</h2>
              <p className="font-inter text-lg text-[var(--color-text-muted)] mb-6">
                {photo.description}
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-inter font-semibold text-white">Data</h3>
                  <p className="font-inter text-[var(--color-text-muted)]">{photo.date}</p>
                </div>
                
                <div>
                  <h3 className="font-inter font-semibold text-white">Local</h3>
                  <p className="font-inter text-[var(--color-text-muted)]">{photo.location}</p>
                </div>
                
                <div>
                  <h3 className="font-inter font-semibold text-white">Sala</h3>
                  <p className="font-inter text-[var(--color-text-muted)]">{photo.room}</p>
                </div>
                
                <div>
                  <h3 className="font-inter font-semibold text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {photo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-accent)] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
                <p className="font-inter text-[var(--color-text-muted)] text-center">
                  ❤️ Esta memória é parte da nossa história, Heitor & Livia.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}