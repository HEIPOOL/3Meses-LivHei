// src/pages/fallback.jsx
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GALLERY_PHOTOS } from '@/data/gallery-data';

export default function FallbackGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-cinzel text-3xl md:text-5xl text-white mb-4"
        >
          ❤️ Heitor & Livia
        </motion.h1>
        <p className="font-inter text-[var(--color-text-muted)]">
          Galeria de Memórias (Modo 2D)
        </p>
        <p className="font-inter text-sm text-[var(--color-text-muted)] mt-2 max-w-2xl mx-auto">
          Seu dispositivo não suporta a experiência 3D completa, mas você ainda pode apreciar nossas fotos em alta qualidade.
        </p>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-full 
                     hover:bg-[var(--color-accent)] transition-colors font-inter"
        >
          ← Voltar à entrada
        </motion.button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {GALLERY_PHOTOS.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl 
                       cursor-pointer group"
            onClick={() => setSelectedImage(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-playfair text-white text-lg md:text-xl">{photo.title}</h3>
                <p className="font-inter text-sm text-gray-300">{photo.date}</p>
                <p className="font-inter text-xs text-gray-400 mt-1">{photo.room}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[3/4] md:aspect-auto md:h-[80vh]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
              />
            </div>
            <div className="mt-4 text-white text-center">
              <h2 className="font-cinzel text-2xl md:text-3xl">{selectedImage.title}</h2>
              <p className="font-inter text-lg mt-2">{selectedImage.description}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {selectedImage.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-[var(--color-primary)]/30 
                             rounded-full text-sm font-inter">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="font-inter text-sm text-gray-400 mt-4">
                {selectedImage.date} • {selectedImage.location} • {selectedImage.room}
              </p>
            </div>
            <button
              className="absolute -top-12 right-0 md:-top-4 md:-right-12 text-white text-3xl md:text-4xl
                         hover:text-[var(--color-accent)] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}